'use client';

import React, { useContext, useState } from 'react';
import Invoice from '../page';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { InvoiceContext } from '../../InvoiceContext';
import { useRouter } from 'next/navigation';


const VendorInfo = () => {

    const [vendorName, setVendorName] = useState("");
    const [vAddress, setVAddress] = useState("");
    const [vPhNo, setVPhNo] = useState("");
    const [vEmail, setVEmail] = useState("");

    const [isLoading, setLoading] = useState(false);

    const router = useRouter();
    const context = useContext(InvoiceContext);

    const onNextHandler = () => {

        setLoading(true);

        setTimeout(() => {
            setLoading(false);
        
            context?.updateVendor(vendorName, vAddress, vPhNo, vEmail);
            router.push('items');
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
                                        id="vname"
                                        value={vendorName}
                                        onChange={(e) => setVendorName(e.target.value)}
                                    />
                                    <label htmlFor="vname">Vendor's Name</label>
                                </span>
                            </div>

                            <div className="field col">
                                <span className="p-float-label">
                                    <InputText
                                        type="text"
                                        id="vphno"
                                        value={vPhNo}
                                        onChange={(e) => setVPhNo(e.target.value)}
                                    />
                                    <label htmlFor="vphno">Vendor's Phone</label>
                                </span>
                            </div>

                            <div className="field col">
                                <span className="p-float-label">
                                    <InputText
                                        type="text"
                                        id="vemail"
                                        value={vEmail}
                                        onChange={(e) => setVEmail(e.target.value)}
                                    />
                                    <label htmlFor="vemail">Vendor's Email</label>
                                </span>
                            </div>

                            <div className="field col-12">
                                <label htmlFor="address">Address</label>
                                <InputTextarea id="address" rows={4} onChange={(e) => setVAddress(e.target.value)}/>
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

export default VendorInfo;
