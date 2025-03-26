interface AddressInfoProps {
    zipCode: string;
    address: string;
    detailAddress: string;
}
// zipCode는 다음api로 확인 가능한지 체크 후 적용하기 (DB에 없음)
// 수정하기 클릭 시 다음api 주소 검색 모달창 띄우기

const AddressInfo = ({ zipCode, address, detailAddress }: AddressInfoProps) => (
    <section className='mt-8'>
        <div className='mb-2 flex items-center justify-between'>
            <h2 className='font-semibold'>주소</h2>
            <button className='text-primary-500 text-sm' onClick={() => {}}>
                수정하기
            </button>
        </div>
        <div className='text-line-950 rounded-lg bg-white p-4 text-sm shadow-sm'>
            <div className='mt-1 flex items-center justify-between pb-2'>
                <p>도로명 주소</p>
                <p className='pb-2'>
                    [{zipCode}] {address}
                </p>
            </div>
            <div className='mt-1 flex items-center justify-between pb-2'>
                <p>상세 주소</p>
                <p>{detailAddress}</p>
            </div>
        </div>
    </section>
);

export default AddressInfo;
