'use client';
import React, { useCallback, useEffect, useState } from 'react';

import { Steps } from 'primereact/steps';

import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { Demo } from '@/types';

const Invoice = ({ children }: any) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [items, setItems] = useState<Demo.Purchase[]>([{}]);

    const router = useRouter();
    const pathname = usePathname();

    const checkActiveIndex = useCallback(() => {
        const paths = pathname.split('/');
        const currentPath = paths[paths.length - 1];

        switch (currentPath) {
            case 'invoice':
                setActiveIndex(0);
                router.push('invoice/invoiceInfo');
                break;
            case 'vendorInfo':
                setActiveIndex(1);
                break;
            case 'items':
                setActiveIndex(2);
                break;
            case 'payment':
                setActiveIndex(3);
                break;
            default:
                break;
        }
    }, [pathname]);

    useEffect(() => {
        checkActiveIndex();
    }, [checkActiveIndex]);

    const wizardItems = [
        { label: 'Basic Infomation'},
        { label: 'Vendor Information'},
        { label: 'Purchase Goods'}
    ];

    const handleAddItem = () => {
        setItems([...items, {}])
    }

    return (
        <div className="grid p-fluid">
            <div className="col-12 md:col-12">
                <div className="card">
                    <h5>Invoice Registeration</h5>
                    <Steps model={wizardItems} activeIndex={activeIndex} />
                    <>{children}</>
                </div>
            </div>                
        </div>
    );
};

export default Invoice;
