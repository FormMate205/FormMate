import { lazy, Suspense } from 'react';
import ListLoading from '@/shared/ui/ListLoading';
import { Footer, Header } from '@/widgets';

const ChatRooms = () => {
    const ChatRoomList = lazy(() => import('@/features/chat/ui/ChatRoomList'));

    return (
        <div className='flex flex-col w-full h-screen'>
            <div className='flex flex-col w-full h-screen px-4 py-2 overflow-hidden'>
                <div className='flex-none'>
                    <Header title='채팅 목록' />
                </div>

                <div className='flex-grow py-3 overflow-y-auto scrollbar-none'>
                    <Suspense fallback={<ListLoading />}>
                        <ChatRoomList />
                    </Suspense>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ChatRooms;
