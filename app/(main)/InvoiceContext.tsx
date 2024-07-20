// InvoiceContext.js
import { Demo } from '@/types';
import { Toast } from 'primereact/toast';
import React, { ReactNode, createContext, useContext, useRef, useState } from 'react';

interface InvoiceContextValue {
    invoice: Demo.Invoice;
    journalEntry: Demo.JournalEntry | null | undefined;

    updateInvoice: (id: string, issue_date: number, due_date: number) => void;
    updateVendor: (name: string, address: string, ph_no: string, email: string) => void;
    savePurchase: (
        purchase_order_number: string, 
        description: string, 
        quantity: number,
        uint_price: number,
        total_amount: number,
        tax: number,
        additional_charges: number,
        discount: number,
        grand_total: number
    ) => void;
    approve: () => void;

    createJournalEntry: (
        entry_id: string,
        issued_date: number,
        credit_account_number: string,
        credit_account_type: string,
        debit_account_number: string,
        debit_account_type: string,
        transaction_type: string,
    ) => void;

    notify: (severity: string, title: string, body: string) => void;
}

export const InvoiceContext = createContext<InvoiceContextValue | null>(null);

export const InvoiceProvider : React.FC<{ children: ReactNode }>  = ({ children }: any) => {
    const [invoice, setInvoice] = useState<Demo.Invoice>({
        id: "",
        issue_date: 0,
        due_date: 0,
        status: "PENDING"
    });

    const [journalEntry, setJournalEntry] = useState<Demo.JournalEntry | null | undefined>();

    const toastBR = useRef(null);

    const updateInvoice = (id: string, issue_date: number, due_date: number) => {
        const _invoice: Demo.Invoice = {
            id,
            issue_date,
            due_date
        };

        setInvoice(_invoice);
    };

    const updateVendor = (name: string, address: string, ph_no: string, email: string) => {
        let _invoice = invoice;

        const _vendor: Demo.Vendor = { name, address, ph_no, email };
        _invoice.vendor = _vendor;

        setInvoice(_invoice);
    }

    const savePurchase = (
        purchase_order_number: string, 
        description: string, 
        quantity: number,
        uint_price: number,
        total_amount: number,
        tax: number,
        additional_charges: number,
        discount: number,
        grand_total: number
    ) => {
        const _items = invoice.purchase ?? [];
        let _invoice = invoice;

        const updateItem = [..._items, {
            purchase_order_number,
            description,
            quantity,
            uint_price,
            total_amount,
            tax,
            additional_charges,
            discount,
            grand_total
        }]

        _invoice.purchase = updateItem;
        _invoice.status = "PENDING";

        setInvoice(_invoice);
    }

    const approve = () => {
        let _invoice = invoice;
        _invoice.status = "APPROVED";

        setInvoice(_invoice);
    }

    const getAccountType = (accountType: string) => {
        let _account_type: Demo.AccountType;

        switch (accountType) {
            case 'AR':
                _account_type = "AccountsReceivable"
                break;
            case 'INV':
                _account_type = "Inventory"
                break;
            case 'CASH':
                _account_type = "Cash"
                break;
            case 'BANK':
                _account_type = "Bank"
                break;
            case 'PE':
                _account_type = "PrepaidExpenses"
                break;
            case 'FA':
                _account_type = "FixedAssets"
                break;
            default:
                _account_type = "AccountsReceivable"
        }

        return _account_type
    }

    const getTnxType = (tnxType: string) => {
        let _tnx_type: Demo.TransactionType;

        switch (tnxType) {
            case "PURCHASE": 
                _tnx_type = "PURCHASE"
                break;
            case "SALES": 
                _tnx_type = "SALES"
                break;
            case "EXPENSE": 
                _tnx_type = "EXPENSE"
                break;
            case "REVENUE": 
                _tnx_type = "REVENUE"
                break;
            case "PAYMENT": 
                _tnx_type = "PAYMENT"
                break;
            case "RECEIPT": 
                _tnx_type = "RECEIPT"
                break;
            default:
                _tnx_type = "PURCHASE"
        }

        return _tnx_type
    }

    const createJournalEntry = (
        entry_id: string,
        issued_date: number,
        credit_account_number: string,
        credit_account_type: string,
        debit_account_number: string,
        debit_account_type: string,
        transaction_type: string,
    ) => {
        let journalEntry: Demo.JournalEntry = {
            entry_id,
            issued_date,
            credit_account: {
                account_number: credit_account_number,
                account_type: getAccountType(credit_account_type)
            },
            debit_account: {
                account_number: debit_account_number,
                account_type: getAccountType(debit_account_type)
            },
            transaction_type: getTnxType(transaction_type)
        }

        setJournalEntry(journalEntry);
    }

    const notify = (
        severity: string, title: string, body: string
    ) => {
        (toastBR.current as any).show({
            severity, 
            summary: title, 
            detail: body, 
            life: 3000
        });
    }

    return (
        <InvoiceContext.Provider value={{ 
                invoice, 
                journalEntry,
                updateInvoice,
                updateVendor,
                savePurchase, 
                approve, 
                createJournalEntry,
                notify
        }}>
            <Toast ref={toastBR} position="bottom-right" />
            {children}
        </InvoiceContext.Provider>
    );
};