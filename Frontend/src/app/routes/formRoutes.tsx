import { lazy } from 'react';
import { FormMatch } from '@/pages';
import LayoutProvider from '../provider/LayoutProvider';

const FormCheck = lazy(() => import('@/pages/formPartner/FormCheck'));

export const formRoutes = [
    {
        path: 'form',
        element: <LayoutProvider />,
        children: [
            {
                index: true,
                element: <FormMatch />,
            },
            {
                path: 'check',
                element: <FormCheck />,
            },
        ],
    },
];
