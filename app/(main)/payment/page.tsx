'use client';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { APService } from '@/demo/service/AcountingPayableService';
import { Demo } from '@/types';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { JournalEntry } from '@/app/components/journalEntry/JournalEntry';
import { JournalEntryReview } from '@/app/components/journalEntry/JournalEntryReview';

const Payment = () => {
    const [reviews, setReviews] = useState<Demo.PaymentReview[]>([]);
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

    const formatCurrency = (value: number) => {
        return value?.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        });
    };

    const statusBodyTemplate = (rowData: Demo.PaymentReview) => {
        return (
            <>
                <Tag className="mr-2" value={rowData.invoice.status}></Tag>
            </>            
        );
    }

    const rowExpansionTemplate = (data: Demo.PaymentReview) => {
        return (
            <div className="orders-subtable">
                <JournalEntryReview review={data}></JournalEntryReview>
            </div>
        );
    }

    const handleRowToggle = (event: any) => {
        setExpandedRows(event.data)
    }

    useEffect(() => {
        APService.getPaymentReview().then(data => setReviews(data));
    },[]);

    return (
        <>
            <div className="grid p-fluid">
                <div className="col-12 md:col-12">
                    <div className="card">
                        <h5>
                            Payment Processing
                        </h5>

                        <div className="flex flex-column">
                            <DataTable
                                value={reviews} 
                                dataKey="id" 
                                responsiveLayout="scroll"
                                expandedRows={expandedRows}
                                onRowToggle={(e) => handleRowToggle(e)}
                                rowExpansionTemplate={rowExpansionTemplate} 
                            >
                                    <Column expander={true} style={{ width: '3em' }} />

                                    <Column field="invoice_id" header="Invoice ID" sortable body={(data) => data.invoice.id}></Column>
                                    <Column field="invoice_issued_date" header="Invoice Issued Date" sortable body={(data) => formatUnixDate(data.invoice.issue_date)}></Column>
                                    <Column field="invoice_due_date" header="Invoice Due Date" sortable body={(data) => formatUnixDate(data.invoice.due_date)}></Column>

                                    <Column field="j_id" header="Journal Entry ID" sortable body={(data) => data.journal_entry.entry_id}></Column>
                                    <Column field="j_issued_date" header="Journal Entry Issued Date" sortable body={(data) => formatUnixDate(data.journal_entry.issued_date)}></Column>

                                    <Column field="vendor_name" header="Vendor's Name" sortable body={(data) => data.invoice.vendor.name}></Column>
                                    <Column field="net_amount" header="Net Amount" sortable body={(data) => formatCurrency(data.invoice.net_amount)}></Column>

                                    <Column field="status" header="Status" body={statusBodyTemplate}></Column>
                            </DataTable>
                        </div>  
                    </div>
                </div>                
            </div>
        </>
        
    );
};

export default Payment;
