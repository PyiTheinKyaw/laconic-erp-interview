'use client';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { APService } from '@/demo/service/AcountingPayableService';
import { Demo } from '@/types';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { JournalEntry } from '@/app/components/journalEntry/JournalEntry';

const Record = () => {
    const [invoices, setInvoices] = useState<Demo.Invoice[]>([]);
    const [expandedRows, setExpandedRows] = useState<any[]>([]);

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

    const statusBodyTemplate = (rowData: Demo.Invoice) => {
        return (
            <>
                <Tag className="mr-2" severity="info" value={rowData.status}></Tag>
            </>            
        );
    }

    const rowExpansionTemplate = (data: Demo.Invoice) => {
        return (
            <div className="orders-subtable">
                <JournalEntry invoice={data}></JournalEntry>                
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
        APService.getApprovedInvoices().then(data => setInvoices(data));
    },[]);

    return (
        <>
            <div className="grid p-fluid">
                <div className="col-12 md:col-12">
                    <div className="card">
                        <h5>
                            Journal Entry Creation
                        </h5>

                        <div className="flex flex-column">
                            <DataTable
                                value={invoices} 
                                dataKey="id" 
                                responsiveLayout="scroll"
                                expandedRows={expandedRows}
                                onRowToggle={(e) => handleRowToggle(e)}
                                rowExpansionTemplate={rowExpansionTemplate} 
                            >
                                    <Column expander={allowExpansion} style={{ width: '3em' }} />

                                    <Column field="id" header="Invoice ID" sortable></Column>
                                    <Column field="issue_date" header="Issued Date" sortable body={(data) => formatUnixDate(data.issue_date)}></Column>
                                    <Column field="due_date" header="Due Date" sortable body={(data) => formatUnixDate(data.due_date)}></Column>
                                    <Column field="vName" header="Vendor's Name" body={(data) => data.vendor.name}></Column>
                                    <Column field="vPhNo" header="Vendor's Ph No" body={(data) => data.vendor.ph_no}></Column>
                                    <Column field="status" header="Status" body={statusBodyTemplate}></Column>
                            </DataTable>

                            <div className="col-2" style={{paddingTop: "30px"}}>
                            </div>
                        </div>  
                    </div>
                </div>                
            </div>
        </>
        
    );
};

export default Record;
