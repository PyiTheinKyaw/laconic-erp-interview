'use client';

import { Demo } from '@/types';
import { DataTable } from 'primereact/datatable';
import { useContext, useState } from 'react';

import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';

import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Message } from 'primereact/message';

import { InvoiceContext } from '../../(main)/InvoiceContext';
import { useRouter } from 'next/navigation';
import { Divider } from 'primereact/divider';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Editor } from 'primereact/editor';
import { Tag } from 'primereact/tag';

interface JournalEntryProps {
    review: Demo.PaymentReview
}

export const JournalEntryReview = (props: JournalEntryProps) => {

    const context = useContext(InvoiceContext);
    const router = useRouter();

    const [netAmount, setNetAmount] = useState<number>();
    const [selectedStatus, setSelectedStatus] = useState();

    const [isExecutePayment, setExecutePayment] = useState(false);
    const [note, setNote] = useState<string>();

    const status = [
        { name: 'Paid', code: 'PAID' },
        { name: 'Reject', code: 'REJECT' },
    ];

    const formatCurrency = (value: number) => {
        return value?.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        });
    };

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

    const onHide = () => {
        setExecutePayment(false);
    }

    const renderFooter = () => {
        return (
            <div>
                <Button label="Cancle" icon="pi pi-times" onClick={() => onHide()} className="p-button-text" />
                <Button label="Confirm" icon="pi pi-check" onClick={() => onHide()} autoFocus />
            </div>
        );
    }

    return (
        <>

            <Dialog 
                header="Confirm Payment Process" 
                visible={isExecutePayment} 
                style={{ width: '50vw' }} 
                footer={renderFooter()} 
                onHide={() => onHide()}>

                <div className="grid">
                    <div className="col-12">
                        <Message severity="warn" text="You are going to process the payment transaction for following Journal Entry. Please check them carefully." />
                    </div>

                    <div className="col-12">
                        <div className="grid">
                            <div className="col-12">
                                
                                {/* ---------------------------------- */}

                                <div className="p-fluid formgrid grid">
                                    <div className="field col-12 md:col-4">
                                        <label htmlFor="invoiceID">Invoice ID</label>
                                        <InputText
                                            type="text"
                                            id="invoiceID"
                                            value={props.review.invoice.id}
                                            disabled
                                        />
                                    </div>

                                    <div className="field col-12 md:col-4">
                                        <label htmlFor="invoiceIssuedDate">Invoice Issued Date</label>
                                        <InputText
                                            id="invoiceIssuedDate"
                                            value={formatUnixDate(props.review.invoice.issue_date)}
                                            disabled
                                        />
                                    </div>

                                    <div className="field col-12 md:col-4">
                                        <label htmlFor="InvoiceDueDate">Invoice Due Date</label>
                                        <InputText
                                            value={formatUnixDate(props.review.invoice.due_date)} 
                                            id='InvoiceDueDate'
                                            disabled
                                        />
                                    </div>
                                </div>

                                {/* ---------------------------------- */}
                                <div className="p-fluid formgrid grid">
                                    <div className="field col-12 md:col-6">
                                        <label htmlFor="JEID">Journal Entry ID</label>
                                        <InputText
                                            value={props.review.journal_entry.entry_id} 
                                            disabled
                                            id='JEID'
                                        />
                                    </div>

                                    <div className="field col-12 md:col-6">
                                        <label htmlFor="jIssuedDate">Journal Entry Issue Date</label>
                                        <InputText
                                            type="text"
                                            id="jIssuedDate"
                                            value={formatUnixDate(props.review.journal_entry.issued_date)}
                                            disabled
                                        />
                                    </div>
                                </div>

                                {/* ---------------------------------- */}
                                <div className="p-fluid formgrid grid">
                                    <div className="field col-12 md:col-6">
                                        <label htmlFor="vName">Vendor Name</label>
                                        <InputText
                                            value={props.review.invoice.vendor?.name} 
                                            id='vName'
                                            disabled
                                        />
                                    </div>

                                    <div className="field col-12 md:col-6">
                                        <label htmlFor="netAmount">Net Amount</label>
                                        <InputText
                                            type="text"
                                            id="netAmount"
                                            value={formatCurrency(props.review.invoice.net_amount ?? 0)}
                                            disabled
                                        />
                                    </div>
                                </div>
                                {/* ---------------------------- */}

                            </div>
                        </div>
                    </div>
                </div>
            </Dialog>

            <div className="grid" style={{paddingTop: "10px"}}>
                <div className="col-12">
                    <div className="card">
                        <h5>Payment Process for Journal Entry: {props.review.journal_entry.entry_id}</h5>

                        <div className="formgrid grid mt-2">
                            <div className="field col-12">
                                <DataTable value={props.review.invoice.purchase} responsiveLayout="scroll">
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
                        </div>

                        <div className="grid">
                            <div className="col-12">

                                <div className="p-fluid formgrid grid">
                                    <div className="field col-12 md:col-4">
                                        <label htmlFor="djen">Journal Entry Number</label>
                                        <InputText
                                            type="text"
                                            id="djen"
                                            value={props.review.journal_entry.entry_id}
                                            disabled
                                        />
                                    </div>

                                    <div className="field col-12 md:col-4">
                                        <label htmlFor="jidate">Journal Issued Date</label>
                                        <InputText
                                            id="jidate"
                                            value={formatUnixDate(props.review.journal_entry.issued_date)}
                                            disabled
                                        />
                                    </div>

                                    <div className="field col-12 md:col-4">
                                        <label htmlFor="tnxType">Transaction Type</label>
                                        <InputText
                                            value={props.review.journal_entry.transaction_type} 
                                            id='tnxType'
                                            disabled
                                        />
                                    </div>
                                </div>

                                <div className="p-fluid formgrid grid">
                                    <div className="field col-12 md:col-6">
                                        <label htmlFor="creditAccountType">Credit Account Type</label>
                                        <InputText
                                            value={props.review.journal_entry.credit_account.account_type} 
                                            disabled
                                            id='creditAccountType'
                                        />
                                    </div>

                                    <div className="field col-12 md:col-6">
                                        <label htmlFor="creditAccount">Credit Account No.</label>
                                        <InputText
                                            type="text"
                                            id="creditAccount"
                                            value={props.review.journal_entry.credit_account.account_number} 
                                            disabled
                                        />
                                    </div>
                                </div>

                                <div className="p-fluid formgrid grid">
                                    <div className="field col-12 md:col-6">
                                        <label htmlFor="debitAccountType">Debit Account Type</label>
                                        <InputText
                                            value={props.review.journal_entry.debit_account.account_type} 
                                            id='debitAccountType'
                                            disabled
                                        />
                                    </div>

                                    <div className="field col-12 md:col-6">
                                        <label htmlFor="debitAccount">Debit Account No.</label>
                                        <InputText
                                            type="text"
                                            id="debitAccount"
                                            value={props.review.journal_entry.debit_account.account_number} 
                                            disabled
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Divider />

                        <div className="p-fluid formgrid grid">
                            <div className='field col-12'>
                                <Message severity="warn" text="Please Confirm amount to transfer" />
                            </div>

                            <div className="field col-12 md:col-6" style={{paddingTop: "15px"}}>
                                <span className="p-float-label">
                                    <InputNumber
                                        type="text"
                                        id="confirmNetAmount"
                                        value={netAmount}
                                        showButtons 
                                        mode="currency" currency="USD" locale="en-US"
                                        onValueChange={(e) => {setNetAmount(e.value as number)}}
                                    />
                                    <label htmlFor="confirmNetAmount">Confirm Net Amount</label>
                                </span>
                            </div>

                            <div className="field col-12 md:col-6" style={{paddingTop: "15px"}}>
                                <span className="p-float-label">
                                    <Dropdown
                                        value={selectedStatus} 
                                        options={status} 
                                        onChange={(e: { value: any}) => {setSelectedStatus(e.value)}} 
                                        optionLabel="name"
                                        placeholder="Select Payment Status" 
                                        inputId='status'
                                    />
                                    <label htmlFor="status">Payment Status</label>
                                </span>
                            </div>
                        </div>

                        <div className="formgrid grid mt-3">
                            <div className="field col-12">
                                <label htmlFor="note">Note</label>
                                <Editor 
                                    style={{ height: '320px' }} 
                                    value={note}
                                    id='note'
                                    onTextChange={(e) => setNote(e.htmlValue ?? "")} />
                            </div>
                        </div>

                        <div className="formgrid grid mt-3">
                            <div className="field col-12">
                                <FileUpload 
                                    name="demo[]" 
                                    url="https://primefaces.org/primereact/showcase/upload.php"
                                    multiple 
                                    maxFileSize={100000000}
                                    emptyTemplate={<p className="m-0">Drag and drop your Supporting Documents to here to upload.</p>} />
                            </div>
                        </div>

                        <div className="formgrid grid mt-3">
                            <div className="field col-12">
                                <Button label="Confirm Payment" icon="pi pi-check" onClick={() => setExecutePayment(true)}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

