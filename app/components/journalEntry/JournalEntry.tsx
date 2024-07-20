'use client';

import { Demo } from '@/types';
import { DataTable } from 'primereact/datatable';
import { useContext, useState } from 'react';

import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Fieldset } from 'primereact/fieldset';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Message } from 'primereact/message';

import { InvoiceContext } from '../../(main)/InvoiceContext';
import { useRouter } from 'next/navigation';

interface JournalEntryProps {
    invoice: Demo.Invoice
}

export const JournalEntry = (props: JournalEntryProps) => {

    const [selectedCrdAccType, setSelectedCrdAccType] = useState<{name: string, code: string} | null | undefined>();
    const [crdAccNo, setCrdAccNo] = useState<string>();

    const [selectedDebtAccType, setSelectedDebtAccType] = useState<{name: string, code: string} | null | undefined>();
    const [debitAccNo, setDebitAccNo] = useState<string>();

    const [isCreate, setCreate] = useState<boolean>(false);

    const [journalEntryNumber, setJournalEntryNumber] = useState("");
    const [journalIssuedDate, setJournalIssuedDate] = useState<Date>();
    const [selectedTnxType, setSelectedTnxType] = useState<{name: string, code: string} | null | undefined>(null);

    const context = useContext(InvoiceContext);
    const router = useRouter();

    const accountType = [
        { name: 'Accounts Receivable', code: 'AR' },
        { name: 'Inventory', code: 'INV' },
        { name: 'Cash', code: 'CASH' },
        { name: 'Bank', code: 'BANK' },
        { name: 'PrepaidExpenses', code: 'PE' },
        { name: 'Fixed Assets', code: 'FA' },
    ];

    const transactionType = [
        { name: 'Purchase', code: "PURCHASE" },
        { name: 'Sales', code: "SALES" },
        { name: 'Expense', code: "EXPENSE" },
        { name: 'Revenue', code: "REVENUE" },
        { name: 'Payment', code: "PAYMENT" },
        { name: 'Receipt', code: "RECEIPT" }
    ]

    const onTnxTypeSelect = (e: { value: any}) => {
        console.log(e.value)
        setSelectedTnxType(e.value);
    }

    const onCrdAccTypeSelect = (e: {value: any}) => {
        setSelectedCrdAccType(e.value)
    }

    const onDebtAccTypeSelect = (e: {value: any}) => {
        setSelectedDebtAccType(e.value)
    }

    const getChoicedName = (data: {name: string, code: string} | null | undefined) => {
        if (data !== null && data !== undefined) {
            return data.name;
        }

        return ""
    }

    function formatJSDateToString(
        date: Date | undefined,
        formatString: string = "YYYY-MM-DD"
    ): string {

        const _date = date ?? new Date();
      
        const year: number = _date.getFullYear();
        const month: string = String(_date.getMonth() + 1).padStart(2, '0'); // Add leading zero for single-digit months
        const day: string = String(_date.getDate()).padStart(2, '0');

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

    const formatJSDateToUnix = (
        jsDate: Date | undefined
    ) => {
        const _jsDate = jsDate ?? new Date();
        const _ut = Math.floor(_jsDate.getTime() / 1000);

        return _ut;
    }

    const onHide = () => {
        createJournalEntry();
        setCreate(false);
        context?.notify(
            "success",
            "Create Journal Entry",
            `You have been created new journal entry for invoice id ${props.invoice.id}`
        )
        router.push('/');
    }

    const createJournalEntry = () => {
        context?.createJournalEntry(
            journalEntryNumber,
            formatJSDateToUnix(journalIssuedDate),
            crdAccNo ?? "",
            selectedCrdAccType?.code ?? "",
            debitAccNo ?? "",
            selectedDebtAccType?.code ?? "",
            selectedTnxType?.code ?? ""
        );

    }

    const renderFooter = () => {
        return (
            <div>
                <Button label="Cancle" icon="pi pi-times" onClick={() => onHide()} className="p-button-text" />
                <Button label="Confirm" icon="pi pi-check" onClick={() => onHide()} autoFocus />
            </div>
        );
    }

    const onCreateJournalClick = () => {
        setCreate(true);
    }

    return (
        <>
            <Dialog 
                header="Journal Entry Creation Confirm" 
                visible={isCreate} 
                style={{ width: '50vw' }} 
                footer={renderFooter()} 
                onHide={() => onHide()}>

                <div className="grid">
                    <div className="col-12">
                        
                        {/* ---------------------------------- */}

                        <div className="p-fluid formgrid grid">
                            <div className="field col-12 md:col-4">
                                <label htmlFor="djen">Journal Entry Number</label>
                                <InputText
                                    type="text"
                                    id="djen"
                                    value={journalEntryNumber}
                                    disabled
                                />
                            </div>

                            <div className="field col-12 md:col-4">
                                <label htmlFor="jidate">Journal Issued Date</label>
                                <InputText
                                    id="jidate"
                                    value={formatJSDateToString(journalIssuedDate)}
                                    disabled
                                />
                            </div>

                            <div className="field col-12 md:col-4">
                                <label htmlFor="tnxType">Transaction Type</label>
                                <InputText
                                    value={getChoicedName(selectedTnxType)} 
                                    id='tnxType'
                                    disabled
                                />
                            </div>
                        </div>

                        {/* ---------------------------------- */}
                        <div className="p-fluid formgrid grid">
                            <div className="field col-12 md:col-6">
                                <label htmlFor="creditAccountType">Credit Account Type</label>
                                <InputText
                                    value={getChoicedName(selectedCrdAccType)} 
                                    disabled
                                    id='creditAccountType'
                                />
                            </div>

                            <div className="field col-12 md:col-6">
                                <label htmlFor="creditAccount">Credit Account No.</label>
                                <InputText
                                    type="text"
                                    id="creditAccount"
                                    value={crdAccNo}
                                    disabled
                                />
                            </div>
                        </div>

                        {/* ---------------------------------- */}
                        <div className="p-fluid formgrid grid">
                            <div className="field col-12 md:col-6">
                                <label htmlFor="debitAccountType">Debit Account Type</label>
                                <InputText
                                    value={getChoicedName(selectedDebtAccType)} 
                                    id='debitAccountType'
                                    disabled
                                />
                            </div>

                            <div className="field col-12 md:col-6">
                                <label htmlFor="debitAccount">Debit Account No.</label>
                                <InputText
                                    type="text"
                                    id="debitAccount"
                                    value={debitAccNo}
                                    disabled
                                />
                            </div>
                        </div>
                        {/* ---------------------------- */}

                    </div>
                </div>
            </Dialog>

            <div className="grid" style={{paddingTop: "10px"}}>
                <div className="col-12">
                    <div className="card">
                        <h5>Create Journal Entry for invoice id: {props.invoice.id}</h5>

                        {/* ---------------------------------- */}

                        <div className="formgrid grid mt-2">
                            <div className="field col-12">
                                <DataTable value={props.invoice.purchase} responsiveLayout="scroll">
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

                        {/* ---------------------------------- */}

                        <div className="formgrid grid mt-3">
                            <div className="field col-12 md:col-4">
                                <span className="p-float-label">
                                    <InputText
                                        type="text"
                                        id="jen"
                                        value={journalEntryNumber}
                                        onChange={(e) => setJournalEntryNumber(e.target.value)}
                                    />
                                    <label htmlFor="jen">Journal Entry Number</label>
                                </span>
                            </div>

                            <div className="field col-12 md:col-4">
                                <span className="p-float-label">
                                    <Calendar
                                        inputId="jidate"
                                        value={journalIssuedDate}
                                        onChange={(e) => setJournalIssuedDate(e.value as any)}
                                    ></Calendar>
                                    <label htmlFor="jidate">Journal Issued Date</label>
                                </span>
                            </div>

                            <div className="field col-12 md:col-4">
                                <span className="p-float-label">
                                    
                                    <Dropdown
                                        value={selectedTnxType} 
                                        options={transactionType} 
                                        onChange={onTnxTypeSelect} 
                                        optionLabel="name"
                                        placeholder="Select Transaction Type" 
                                        inputId='tnxType'
                                    />
                                    <label htmlFor="tnxType">Transaction Type</label>
                                </span>
                            </div>
                        </div>
                        {/* ---------------------------------- */}

                        <div className="formgrid grid">

                            <div className="field col">
                                <Fieldset legend="Credit Account Information" className='col-12'>
                                    <div className="field" style={{paddingTop: "15px"}}>
                                        <span className="p-float-label">
                                            <Dropdown
                                                value={selectedCrdAccType} 
                                                options={accountType} 
                                                onChange={onCrdAccTypeSelect} 

                                                optionLabel="name"
                                                placeholder="Select Account Type" 
                                                inputId='creditAccountType'
                                            />
                                            <label htmlFor="creditAccountType">Credit Account Type</label>
                                        </span>
                                    </div>

                                    <div className="field" style={{paddingTop: "15px"}}>
                                        <span className="p-float-label">
                                            <InputText
                                                type="text"
                                                id="creditAccount"
                                                value={crdAccNo}
                                                onChange={(e) => setCrdAccNo(e.target.value)}
                                            />
                                            <label htmlFor="creditAccount">Credit Account No.</label>
                                        </span>
                                    </div>
                                </Fieldset>
                            </div>
                            
                            <div className="field col">
                                <Fieldset legend="Debit Account Information" className='col-12'>
                                    <div className="field" style={{paddingTop: "15px"}}>
                                        <span className="p-float-label">
                                            <Dropdown
                                                value={selectedDebtAccType} 
                                                options={accountType} 
                                                onChange={onDebtAccTypeSelect} 

                                                optionLabel="name"
                                                placeholder="Select Account Type" 
                                                inputId='debitAccountType'
                                            />
                                            <label htmlFor="debitAccountType">Debit Account Type</label>
                                        </span>
                                    </div>

                                    <div className="field" style={{paddingTop: "15px"}}>
                                        <span className="p-float-label">
                                            <InputText
                                                type="text"
                                                id="debitAccount"
                                                value={debitAccNo}
                                                onChange={(e) => setDebitAccNo(e.target.value)}
                                            />
                                            <label htmlFor="debitAccount">Debit Account No.</label>
                                        </span>
                                    </div>
                                </Fieldset>
                            </div>
                        </div>

                        {/* ---------------------------- */}

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
                                <Button label="Create Journal Entry" icon="pi pi-check" onClick={onCreateJournalClick}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

