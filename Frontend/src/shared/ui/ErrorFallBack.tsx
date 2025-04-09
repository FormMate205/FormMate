export function ErrorFallBack() {
    return (
        <div className='bg-line-50 flex h-screen w-full items-center justify-center'>
            <div className='flex flex-col items-center'>
                <div className='rounded-full bg-blue-500 px-5'>
                    <p className='text-lg font-bold text-white'>Oops!</p>
                </div>

                <img
                    className='mt-3 mb-1 w-24'
                    src='/assets/images/sad-formform.png'
                    alt='오류 발생 이미지'
                />
                <p className='text-sm font-semibold'>
                    페이지를 찾을 수 없습니다.
                </p>
            </div>
        </div>
    );
}
