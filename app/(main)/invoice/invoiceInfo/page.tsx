'use client';

import React, { useContext, useState } from 'react';
import Invoice from '../page';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

import { Calendar } from 'primereact/calendar';
import { useRouter } from 'next/navigation';
import { InvoiceContext } from '../../InvoiceContext';

const InvoiceInfo = () => {

    const [invoiceNumber, setInvoiceNumber] = useState("");
    const [invoiceDate, setInvoiceDate] =  useState<any>(null);
    const [dueDate, setDueDate] =  useState<any>(null);

    const [isLoading, setLoading] = useState(false);

    const router = useRouter();
    const context = useContext(InvoiceContext);

    const onNextHandler = () => {

        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            const iTimestamp = invoiceDate !== null ? Math.floor(invoiceDate.getTime() / 1000) : 0;
            const dTimestamp = dueDate !== null ? Math.floor(dueDate.getTime() / 1000) : 0;

            context?.updateInvoice(invoiceNumber, iTimestamp, dTimestamp);
            router.push('vendorInfo');
        }, 2000);
    }

    return (
        <Invoice>
            <div className="grid" style={{paddingTop: "10px"}}>
                <div className="col-12">
                    <div className="card">
                        <div className="formgrid grid mt-3">
    
                            <div className="field col">
                                    <span className="p-float-label">
                                        <InputText
                                            type="text"
                                            id="invoiceId"
                                            value={invoiceNumber}
                                            onChange={(e) => setInvoiceNumber(e.target.value)}
                                        />
                                        <label htmlFor="invoiceId">Invoice Number</label>
                                    </span>
                            </div>
    
                            <div className="field col">
                                <span className="p-float-label">
                                    <Calendar
                                        inputId="invoiceDate"
                                        value={invoiceDate}
                                        onChange={(e) => setInvoiceDate(e.value)}
                                    ></Calendar>
                                    <label htmlFor="invoiceDate">Issued Date</label>
                                </span>
                            </div>
    
                            <div className="field col">
                                <span className="p-float-label">
                                    <Calendar
                                        inputId="dueDate"
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.value)}
                                    ></Calendar>
                                    <label htmlFor="dueDate">Due Date</label>
                                </span>
                            </div>
                        </div>
                        
                        <div className="md:col-2">
                            <Button label="Next" icon="pi pi-angle-right" loading={isLoading} onClick={onNextHandler} />
                        </div>
                    </div>
                </div>
            </div>
        </Invoice>
    );
}

export default InvoiceInfo;
