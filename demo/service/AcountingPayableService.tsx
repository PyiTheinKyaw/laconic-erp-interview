import { Demo } from '@/types';

export const APService = {
    getInvoices() {
        return fetch('/demo/data/invoices.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data as Demo.Invoice[]);
    },

    getApprovedInvoices() {
        return fetch('/demo/data/invoices_approved.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data as Demo.Invoice[]);
    },

    getPaymentReview() {
        return fetch('/demo/data/journal_entry_payment.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data as Demo.PaymentReview[]);
    }
};
