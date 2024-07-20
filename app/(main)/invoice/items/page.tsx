'use client';

import React, { useContext, useRef, useState } from 'react';
import Invoice from '../page';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { InvoiceContext } from '../../InvoiceContext';

import { InputNumber } from 'primereact/inputnumber';
import { Editor } from 'primereact/editor';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { Demo } from '@/types';
import { Card } from 'primereact/card';
import { useRouter } from 'next/navigation';

import { Toast } from 'primereact/toast';


const Items = () => {
    const [PO, setPO] = useState("");
    const [quantity, setQuantity] = useState<number | null | undefined>(null);
    const [uintPrice, setUintPrice] = useState<number | null| undefined>(null);

    const [tax, setTax] = useState<number | null | undefined>(null);
    const [aCharge, setACharge] = useState<number | null | undefined>(null);
    const [discount, setDiscount] = useState<number | null | undefined>(null);

    const [totalAmount, setTotalAmount] = useState<number | null | undefined>();
    const [grandTotal, setGrandTotal] = useState(0);
    const [description, setDescription] = useState<string>("");

    const [isSaved, setSaved] = useState<boolean>(false);
    const context = useContext(InvoiceContext);

    const router = useRouter();

    const calculateTotalAmount = () => {
        if (uintPrice == null || quantity == null) {
            setTotalAmount(0);
        }

        const _uintPrice = uintPrice ?? 0;
        const _quantity = quantity ?? 0;

        setTotalAmount(_uintPrice * _quantity);
    }

    const calculateGrandTotal = () => {
        const _uintPrice = uintPrice ?? 0;
        const _quantity = quantity ?? 0;
        const _tax = tax ?? 0;
        const _aCharge = aCharge ?? 0;
        const _discount = discount ?? 0;

        const netAmount = _uintPrice * _quantity;
        const taxed = (netAmount * (1 + _tax / 100));
        const aCharged = taxed + _aCharge;

        const discounted = aCharged - (aCharged * (_discount / 100))

        setGrandTotal(discounted);
    }

    const handleSaveState = () => {
        context?.savePurchase(
            PO,
            description,
            quantity ?? 0,
            uintPrice ?? 0,
            totalAmount ?? 0,
            tax ?? 0,
            aCharge ?? 0,
            discount ?? 0,
            grandTotal ?? 0
        );

        setDisplayBasic(true);
    }

    const [displayBasic, setDisplayBasic] = useState(false);

    const onHide = () => {
        setDisplayBasic(false);
        context?.notify(
            "success",
            "Created Invoice/Bill",
            `You successfully created invoice with id ${context.invoice.id}`
        );
        router.push("/");
    }

    const renderFooter = () => {
        return (
            <div>
                <Button label="Cancle" icon="pi pi-times" onClick={() => onHide()} className="p-button-text" />
                <Button label="Confirm" icon="pi pi-check" onClick={() => onHide()} autoFocus />
            </div>
        );
    }

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

    const getPurchase = (goods: Demo.Purchase[] | undefined) => {
        const defaultIndex = 0;

        const _goods = goods ?? [{
            purchase_order_number: "",
            description: "",
            quantity: 0,
            uint_price: 0,
            total_amount: 0,
            tax: 0,
            additional_charges: 0,
            discount: 0,
            grand_total: 0
        }];


        return _goods[defaultIndex];
    }

    const renderDesc = (desc: string | undefined | null) => {
        const _desc = desc ?? '<div><h1>No Note</h1><p>Please check your entry carefully.</p></div>'
        return _desc;
    }


    return (
        <Invoice>
            <Dialog header="Confirm Invoice" visible={displayBasic} style={{ width: '50vw' }} footer={renderFooter()} onHide={() => onHide()}>
                {/* Invoice Info */}
                <div className="p-fluid formgrid grid">
                    <div className="field col-12 md:col-4">
                        <label htmlFor="invoiceId">Invoice ID</label>
                        <InputText id="invoiceId" value={context?.invoice.id} readOnly={true}></InputText>
                    </div>

                    <div className="field col-12 md:col-4">
                        <label htmlFor="issueDate">Issue Date</label>
                        <InputText id="issueDate" value={formatUnixDate(context?.invoice.issue_date)} readOnly={true}></InputText>
                    </div>

                    <div className="field col-12 md:col-4">
                        <label htmlFor="dueDate">Issue Date</label>
                        <InputText id="dueDate" value={formatUnixDate(context?.invoice.due_date)} readOnly={true}></InputText>
                    </div>
                </div>

                {/* Vendor Info */}
                <div className="p-fluid formgrid grid">
                    <div className="field col-12 md:col-4">
                        <label htmlFor="vendorName">Vendor's Name</label>
                        <InputText id="vendorName" value={context?.invoice.vendor?.name} readOnly={true}></InputText>
                    </div>

                    <div className="field col-12 md:col-4">
                        <label htmlFor="vendorPhno">Vendor's Phone No</label>
                        <InputText id="vendorPhno" value={context?.invoice.vendor?.ph_no} readOnly={true}></InputText>
                    </div>

                    <div className="field col-12 md:col-4">
                        <label htmlFor="vendorEmail">Vendor's Phone No</label>
                        <InputText id="vendorEmail" value={context?.invoice.vendor?.email} readOnly={true}></InputText>
                    </div>

                    <div className="field col-12">
                        <label htmlFor="vendorAddr">Vendor's Address</label>
                        <InputTextarea id="vendorAddr" value={context?.invoice.vendor?.address} readOnly={true}></InputTextarea>
                    </div>                    
                </div>

                {/* Goods Info - 1*/}
                <div className="p-fluid formgrid grid">
                    <div className="field col-12 md:col-4">
                        <label htmlFor="pon">Purchase Order Number</label>
                        <InputText 
                            id="pon" 
                            value={getPurchase(context?.invoice.purchase).purchase_order_number} 
                            readOnly={true}>
                        </InputText>
                    </div>


                    <div className="field col-12 md:col-4">
                        <label htmlFor="quantity">Quantity</label>
                        <InputNumber
                            id="quantity" 
                            value={getPurchase(context?.invoice.purchase).quantity} 
                            mode="currency" currency="USD" locale="en-US"
                            readOnly={true}>
                        </InputNumber>
                    </div>

                    <div className="field col-12 md:col-4">
                        <label htmlFor="uintPrice">Uint Price</label>
                        <InputNumber
                            id="uintPrice" 
                            value={getPurchase(context?.invoice.purchase).uint_price} 
                            mode="currency" currency="USD" locale="en-US"
                            readOnly={true}>
                        </InputNumber>
                    </div>

                    <div className="field col-12 md:col-4">
                        <label htmlFor="totalAmount">Total Amount</label>
                        <InputNumber
                            id="totalAmount" 
                            value={getPurchase(context?.invoice.purchase).total_amount} 
                            mode="currency" currency="USD" locale="en-US"
                            readOnly={true}>
                        </InputNumber>
                    </div>

                    <div className="field col-12 md:col-4">
                        <label htmlFor="aCharge">Additional Charge</label>
                        <InputNumber
                            id="aCharge" 
                            value={getPurchase(context?.invoice.purchase).additional_charges} 
                            mode="currency" currency="USD" locale="en-US"
                            readOnly={true}>
                        </InputNumber>
                    </div>
                </div>

                {/* Goods Info - 2*/}
                <div className="p-fluid formgrid grid">
                    <div className="field col-12 md:col-4">
                        {/* <i className="pi pi-percentage" /> */}
                        <label htmlFor="tax">Tax</label>
                        <InputNumber
                            id="tax" 
                            value={getPurchase(context?.invoice.purchase).tax} 
                            readOnly={true}>
                        </InputNumber>
                    </div>


                    <div className="field col-12 md:col-4">
                        {/* <i className="pi pi-percentage" /> */}
                        <label htmlFor="discount">Discount</label>
                        <InputNumber
                            id="discount" 
                            value={getPurchase(context?.invoice.purchase).discount} 
                            readOnly={true}>
                        </InputNumber>
                    </div>

                    <div className="field col-12 md:col-4">
                        <label htmlFor="gTotal">Grand Total</label>
                        <InputNumber
                            id="gTotal" 
                            value={getPurchase(context?.invoice.purchase).grand_total} 
                            mode="currency" currency="USD" locale="en-US"
                            readOnly={true}>
                        </InputNumber>
                    </div>
                </div>

                <div className="p-fluid formgrid grid">
                    <div className="field col-12">
                        {/* <label htmlFor="description">Description</label>
                        <InputTextarea
                            id="description" 
                            value={getPurchase(context?.invoice.purchase).description} 
                            readOnly={true}>
                        </InputTextarea> */}

                        <Card title="Description" id="desc">
                            <div dangerouslySetInnerHTML={{ __html: renderDesc(getPurchase(context?.invoice.purchase).description) }} />
                        </Card>
                    </div>
                </div>
            </Dialog>
            
            <div className='card' style={{marginTop: "30px"}}>
                <div className="formgrid grid mt-3">

                    <div className="field col-12 grid">
                        {/* PO */}
                        <div className="field col">
                            <span className="p-float-label">
                                <InputText
                                    type="text"
                                    id="PO"
                                    value={PO}
                                    onChange={(e) => setPO(e.target.value)}
                                    readOnly={isSaved}
                                />
                                <label htmlFor="PO">Purchase Order Number</label>
                            </span>
                        </div>

                        {/* quantity */}
                        <div className="field col">
                            <span className="p-float-label">
                                <InputNumber 
                                    inputId="quantity" 
                                    value={quantity} 
                                    onValueChange={(e) => setQuantity(e.value)}
                                    showButtons 
                                    readOnly={isSaved}
                                />
                                <label htmlFor="quantity">Quantity</label>
                            </span>        
                        </div>

                        {/* uint prices */}
                        <div className="field col">
                            <span className="p-float-label">
                                <InputNumber 
                                    inputId="uintPrices" 
                                    value={uintPrice} 
                                    onValueChange={(e) => setUintPrice(e.value)}
                                    showButtons 
                                    mode="currency" currency="USD" locale="en-US"
                                    readOnly={isSaved}
                                />
                                <label htmlFor="uintPrices">Uint prices</label>
                            </span>
                        </div>
                    </div>

                    {/* ------------------ */}
                    <div className="field col-12 grid">

                        {/* Tax Percentage */}
                        <div className="field col">
                            <span className="p-input-icon-right p-float-label">
                                <i className="pi pi-percentage" />

                                <InputNumber 
                                    inputId="taxPercentage" 
                                    value={tax} 
                                    onValueChange={(e) => setTax(e.value)}
                                    readOnly={isSaved}
                                />
                                <label htmlFor="taxPercentage">Tax</label>
                            </span>
                        </div>

                        {/* Additional Charge */}
                        <div className="field col">
                            <span className="p-float-label">
                                <InputNumber 
                                    inputId="aCharge" 
                                    value={aCharge} 
                                    onValueChange={(e) => setACharge(e.value)}
                                    showButtons 
                                    mode="currency" currency="USD" locale="en-US"
                                    readOnly={isSaved}
                                />
                                <label htmlFor="aCharge">Additional Charge</label>
                            </span>
                        </div>

                        {/* Discount */}
                        <div className="field col">
                            <span className="p-input-icon-right p-float-label">
                                <i className="pi pi-percentage" />

                                <InputNumber 
                                    inputId="discount" 
                                    value={discount} 
                                    onValueChange={(e) => setDiscount(e.value)}
                                    readOnly={isSaved}
                                />
                                <label htmlFor="discount">Discount</label>
                            </span>
                        </div>
                    </div>

                    {/* ------------------ */}
                    <div className="field col-12 grid">

                        {/* Total */}
                        <div className="field col">
                            <span className="p-input-icon-right p-float-label">
                                <i className="pi pi-hashtag" />

                                <InputNumber 
                                    inputId="totalAmount" 
                                    value={totalAmount} 
                                    onFocus={calculateTotalAmount}
                                    readOnly={isSaved}
                                    mode="currency" currency="USD" locale="en-US"
                                />
                                <label htmlFor="totalAmount">Total Amount</label>
                            </span>
                        </div>

                        {/* Grand Total */}
                        <div className="field col">
                            <span className="p-input-icon-right p-float-label">
                                <i className="pi pi-hashtag" />

                                <InputNumber 
                                    inputId="grandTotal" 
                                    value={grandTotal} 
                                    onFocus={calculateGrandTotal}
                                    readOnly-={true}
                                    mode="currency" currency="USD" locale="en-US"
                                />
                                <label htmlFor="grandTotal">Grand Total</label>
                            </span>
                        </div>
                    </div>

                    {/* ------------------ */}
                    <div className="field col-12 grid">
                        {/* Description */}
                        <div className="field col">
                            <Editor 
                                style={{ height: '320px' }} 
                                value={description} 
                                onTextChange={(e) => setDescription(e.htmlValue ?? "")}
                            />
                        </div>
                    </div>

                    {/* ------------------ */}
                    <div className='field col-12 grid'>
                        <div className="md:col-1">
                            <Button label="Save" icon="pi pi-save" onClick={handleSaveState} />
                        </div>
                    </div>

                </div>
            </div>                    
        </Invoice>
    );
}

export default Items;
