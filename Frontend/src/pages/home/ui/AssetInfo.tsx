const AssetInfo = () => {
    return (
        <div>
            <p className='mb-4 text-lg font-semibold'>나의 자산</p>
            <div className='rounded-lg bg-white p-4 shadow-sm'>
                <div className='flex justify-between text-center'>
                    <div className='border-line-300 flex-1 border-r'>
                        <p className='text-line-500 text-xs'>상환 예정 총액</p>
                        <p className='text-subPink-700 font-medium'>
                            500,000원
                        </p>
                    </div>
                    <div className='flex-1'>
                        <p className='text-line-500 text-xs'>회수 예정 총액</p>
                        <p className='text-primary-500 font-medium'>
                            120,000원
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssetInfo;
