import { lazy, Suspense } from 'react';
import ListLoading from '@/shared/ui/ListLoading';
import { Footer, Header } from '@/widgets';

const ChatRooms = () => {
    const ChatRoomList = lazy(() => import('@/features/chat/ui/ChatRoomList'));

    return (
        <div className='flex h-screen w-full flex-col pb-[60px]'>
            <div className='flex h-screen w-full flex-col overflow-hidden px-4 py-2'>
                <div className='flex-none'>
                    <Header title='채팅 목록' />
                </div>

                <div className='scrollbar-none flex-grow overflow-y-auto py-3'>
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
