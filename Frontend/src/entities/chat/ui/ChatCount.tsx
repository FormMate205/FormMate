interface ChatCountProps {
    count: string;
}

const ChatCount = ({ count }: ChatCountProps) => {
    return (
        <div className='bg-primary-100 text-primary-500 flex items-center justify-center rounded-lg px-2 py-[2px] text-sm font-medium'>
            {count}
        </div>
    );
};

export default ChatCount;
