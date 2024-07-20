/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import { AppMenuItem } from '@/types';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);

    const model: AppMenuItem[] = [
        {
            label: 'Dashboard',
            items: [
                { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }
            ]
        },
        {
            label: 'Receipt of Invoice/Bill',
            items: [
                { label: 'Entry Invoice', icon: 'pi pi-fw pi-book', to: '/invoice' },
            ]
        },
        {
            label: 'Accounts Payable',
            items: [
                { label: 'Approve', icon: 'pi pi-fw pi-verified', to: '/approve' },
                { label: 'Record Payment', icon: 'pi pi-fw pi-file', to: '/record' },
                { label: 'Payment', icon: 'pi pi-fw pi-wallet', to: '/payment' }
            ]
        }
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
