import { lazy } from 'react';
import { ChatRooms } from '@/pages';
import LayoutProvider from '../provider/LayoutProvider';

const Chat = lazy(() => import('@/pages/chat/Chat'));
const Signature = lazy(() => import('@/pages/signature/Signature'));

export const chatRoutes = [
    {
        path: 'chat',
        element: <LayoutProvider />,
        children: [
            {
                index: true,
                element: <ChatRooms />,
            },
            {
                paht: ':roomId',
                element: <Chat />,
            },
            {
                path: ':roomId/signature',
                element: <Signature />,
            },
        ],
    },
];
