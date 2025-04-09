export function ErrorFallBack() {
    return (
        <div className='flex h-full w-full items-center justify-center'>
            <div className='flex flex-col gap-4'>
                <img
                    src='/assets/images/sad-formform.png'
                    alt='오류 발생 이미지'
                />
                <p className='text-2xl font-bold'>오류가 발생했습니다.</p>
            </div>
        </div>
    );
}
