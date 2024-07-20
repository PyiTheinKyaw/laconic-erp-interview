/* FullCalendar Types */
import { EventApi, EventInput } from '@fullcalendar/core';

/* Chart.js Types */
import { ChartData, ChartOptions } from 'chart.js';

type InventoryStatus = 'INSTOCK' | 'LOWSTOCK' | 'OUTOFSTOCK';

type Status = 'DELIVERED' | 'PENDING' | 'RETURNED' | 'CANCELLED';

export type LayoutType = 'list' | 'grid';
export type SortOrderType = 1 | 0 | -1;

export interface CustomEvent {
    name?: string;
    status?: 'Ordered' | 'Processing' | 'Shipped' | 'Delivered';
    date?: string;
    color?: string;
    icon?: string;
    image?: string;
}

interface ShowOptions {
    severity?: string;
    content?: string;
    summary?: string;
    detail?: string;
    life?: number;
}

export interface ChartDataState {
    barData?: ChartData;
    pieData?: ChartData;
    lineData?: ChartData;
    polarData?: ChartData;
    radarData?: ChartData;
}
export interface ChartOptionsState {
    barOptions?: ChartOptions;
    pieOptions?: ChartOptions;
    lineOptions?: ChartOptions;
    polarOptions?: ChartOptions;
    radarOptions?: ChartOptions;
}

export interface AppMailProps {
    mails: Demo.Mail[];
}

export interface AppMailSidebarItem {
    label: string;
    icon: string;
    to?: string;
    badge?: number;
    badgeValue?: number;
}

export interface AppMailReplyProps {
    content: Demo.Mail | null;
    hide: () => void;
}

declare namespace Demo {
    // InvoiceService
    type Invoice = {
        id: string;
        issue_date: number;
        due_date: number;
        vendor?: Vendor;
        purchase?: Purchase[];
        status?: InvoiceStatus;
        net_amount?: number;
    }

    type InvoiceStatus = 'PENDING' | 'APPROVED' | 'PAID';

    type Vendor = {
        name: string;
        address: string;
        ph_no: string;
        email: string;
    }

    type Purchase = {
        purchase_order_number?: string;
        description?: string;
        quantity?: number;
        uint_price?: number;
        total_amount?: number;
        tax?: number;
        additional_charges?: number;
        discount?: number;
        grand_total?: number;
    }

    type JournalEntry = {
        entry_id: string;
        issued_date: number;
        credit_account: Account;
        debit_account: Account;
        transaction_type: TransactionType;
    }

    type Account = {
        account_number: string;
        account_type: AccountType;
    }

    type PaymentReview = {
        invoice: Invoice,
        journal_entry: JournalEntry
    }

    type AccountType = 'AccountsReceivable' | 'Inventory' | 'Cash' | 'Bank' | 'PrepaidExpenses' | 'FixedAssets';

    type TransactionType =  'PURCHASE' | 'SALES' | 'EXPENSE' | 'REVENUE' | 'PAYMENT' | 'RECEIPT';
}
