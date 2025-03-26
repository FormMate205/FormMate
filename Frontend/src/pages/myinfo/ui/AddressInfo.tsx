interface AddressInfoProps {
    zipCode: string;
    address: string;
    detailAddress: string;
}

const AddressInfo = ({ zipCode, address, detailAddress }: AddressInfoProps) => (
    <section className='mt-8'>
        <div className='mb-2 flex items-center justify-between'>
            <h2 className='font-semibold'>주소</h2>
            <button className='text-primary-500 text-sm'>수정하기</button>
        </div>
        <div className='text-line-950 rounded-lg bg-white p-4 text-sm shadow-sm'>
            <p className='pb-2'>
                [{zipCode}] {address}
            </p>
            <p>{detailAddress}</p>
        </div>
    </section>
);

export default AddressInfo;
