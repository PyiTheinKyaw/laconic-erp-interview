'use client';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { APService } from '@/demo/service/AcountingPayableService';
import { Demo } from '@/types';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Badge } from 'primereact/badge';
import { Dialog } from 'primereact/dialog';
import { Message } from 'primereact/message';
import { InvoiceContext } from '../InvoiceContext';
import { useRouter } from 'next/navigation';

const Approve = () => {

    const [invoices, setInvoices] = useState<any[]>([]);
    const [selectedInvoices, setSelectedInvoices] = useState<Demo.Invoice[]>([]);
    const [expandedRows, setExpandedRows] = useState<any[]>([]);

    const [isSelected, setSelected] = useState<boolean>(true);
    const [isApproved, setApproved] = useState<boolean>(false);

    const context = useContext(InvoiceContext);
    const router = useRouter();

    function formatUnixDate(
        unixTimestamp: number | undefined,
        formatString: string = "YYYY-MM-DD"
    ): string {

        const _ut = unixTimestamp ?? 0;

        // Multiply by 1000 to convert seconds to milliseconds
        const date = new Date(_ut * 1000);

        const year: number = date.getFullYear();
        const month: string = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero for single-digit months
        const day: string = String(date.getDate()).padStart(2, '0');

        // Replace placeholders in format string with corresponding date parts
        return formatString
            .replace('YYYY', year.toString())
            .replace('MM', month)
            .replace('DD', day);
    }

    const handleSelection = (event: Demo.Invoice[]) => {
        setSelectedInvoices(event)
    }

    const statusBodyTemplate = (rowData: Demo.Invoice) => {
        return (
            <>
                <Tag className="mr-2" severity="warning" value={rowData.status}></Tag>
            </>            
        );
    }

    const formatCurrency = (value: number) => {
        return value?.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        });
    };

    const onHide = () => {
         // context?.approve();
         context?.notify(
            "success",
            "Approve Invoices/Bill",
            `You successfully approved total of ${selectedInvoices.length} invoices`
        );
        setApproved(false);
        router.push('/');
    }

    const renderFooter = () => {
        return (
            <div>
                <Button label="Cancle" icon="pi pi-times" onClick={() => onHide()} className="p-button-text" />
                <Button label="Confirm" icon="pi pi-check" onClick={() => onHide()} autoFocus />
            </div>
        );
    }

    const rowExpansionTemplate = (data: Demo.Invoice) => {
        return (
            <div className="orders-subtable">

                <DataTable value={data.purchase} responsiveLayout="scroll">
                    <Column field="purchase_order_number" header="Purchase Order Number" sortable></Column>
                    <Column field="quantity" header="Quantity" sortable></Column>
                    <Column field="uint_price" header="Uint Price" sortable body={(pdata) => formatCurrency(pdata.uint_price)}></Column>
                    <Column field="additional_charges" header="Additional Charge" body={(pdata) => formatCurrency(pdata.additional_charges)} sortable></Column>

                    <Column field="tax" header="Tax" sortable></Column>
                    <Column field="discount" header="Discount" sortable></Column>

                    <Column field="total_amount" header="Total Amount" sortable body={(pdata) => formatCurrency(pdata.total_amount)}></Column>
                    <Column field="grand_total" header="Grand Total" sortable body={(pdata) => formatCurrency(pdata.grand_total)}></Column>
                </DataTable>
            </div>
        );
    }

    const handleRowToggle = (event: any) => {
        setExpandedRows(event.data)
    }

    const allowExpansion = (rowData: Demo.Invoice) => {
        let _purchases = rowData.purchase ?? [];
        return _purchases.length > 0;
    };

    useEffect(() => {
        APService.getInvoices().then(data => setInvoices(data));
    },[]);

    const checkSelectedInvoice = useCallback(() => {
        if (selectedInvoices.length > 0) {
            setSelected(false);
        } else { setSelected(true); }
    }, [selectedInvoices]);

    useEffect(() => {
        checkSelectedInvoice();
    }, [checkSelectedInvoice]);

    const handleApprovalOnClick = () => {
        setApproved(true);
    }

    return (
        <>
            <Dialog 
                header="Confirm Approval" 
                visible={isApproved} 
                style={{ width: '50vw' }} 
                footer={renderFooter()} 
                onHide={() => onHide()}>

                <div className="grid">
                    <div className="col-12">
                        <Message severity="warn" text="You are going to approve following invoices/bill. Please check them carefully." />
                    </div>
                    <div className="col-12">
                        <DataTable
                            value={selectedInvoices} 
                            dataKey="id" 
                            responsiveLayout="scroll">
                                <Column field="id" header="Invoice ID" sortable></Column>
                                <Column field="issue_date" header="Issued Date" sortable body={(data) => formatUnixDate(data.issue_date)}></Column>
                                <Column field="due_date" header="Due Date" sortable body={(data) => formatUnixDate(data.due_date)}></Column>
                                <Column field="vName" header="Vendor's Name" body={(data) => data.vendor.name}></Column>
                                <Column field="vPhNo" header="Vendor's Ph No" body={(data) => data.vendor.ph_no}></Column>
                                <Column field="status" header="Status" body={statusBodyTemplate}></Column>
                        </DataTable>
                    </div>
                </div>
            </Dialog>

            <div className="grid p-fluid">
                <div className="col-12 md:col-12">
                    <div className="card">
                        <h5>
                            Validate & Approve requested Invoices/Bill
                        </h5>

                        <div className="flex flex-column">
                            <DataTable
                                value={invoices} 
                                selectionMode="multiple" 
                                selection={selectedInvoices}
                                onSelectionChange={e => handleSelection(e.value)}
                                dataKey="id" 
                                responsiveLayout="scroll"
                                expandedRows={expandedRows}
                                onRowToggle={(e) => handleRowToggle(e)}
                                rowExpansionTemplate={rowExpansionTemplate} 
                            >
                                    <Column expander={allowExpansion} style={{ width: '3em' }} />
                                    <Column selectionMode="multiple" headerStyle={{width: '3em'}}></Column>

                                    <Column field="id" header="Invoice ID" sortable></Column>
                                    <Column field="issue_date" header="Issued Date" sortable body={(data) => formatUnixDate(data.issue_date)}></Column>
                                    <Column field="due_date" header="Due Date" sortable body={(data) => formatUnixDate(data.due_date)}></Column>
                                    <Column field="vName" header="Vendor's Name" body={(data) => data.vendor.name}></Column>
                                    <Column field="vPhNo" header="Vendor's Ph No" body={(data) => data.vendor.ph_no}></Column>
                                    <Column field="status" header="Status" body={statusBodyTemplate}></Column>
                            </DataTable>

                            <div className="col-2" style={{paddingTop: "30px"}}>
                                <Button label="Approve" icon="pi pi-check" disabled={isSelected} onClick={handleApprovalOnClick}>
                                    {!isSelected && 
                                        <Badge value={selectedInvoices.length} ></Badge>
                                    }
                                </Button>
                            </div>
                        </div>  
                    </div>
                </div>                
            </div>
        </>
        
    );
};

export default Approve;
