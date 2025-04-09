// placeholder.tsx
const PlaceholderStep = ({ name }: { name: string }) => {
    return (
        <div className='flex h-screen items-center justify-center text-gray-400'>
            🚧 {name} 스텝은 현재 준비 중입니다
        </div>
    );
};

export default PlaceholderStep;
