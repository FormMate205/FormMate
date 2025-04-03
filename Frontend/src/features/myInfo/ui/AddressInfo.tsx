import { useState, useEffect } from 'react';
import { updateAddress as updateAddressAPI } from '@/entities/user/api/updateAddress';
import { ToastModal } from '@/widgets';
import { AddressInfoProps } from '../model/types';

const AddressInfo = ({ address }: AddressInfoProps) => {
    const [currentAddress, setCurrentAddress] = useState('');
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        if (address) setCurrentAddress(address);
    }, [address]);

    const runPostcode = () => {
        new window.daum.Postcode({
            oncomplete: async (data: PostcodeData) => {
                const fullAddress = data.roadAddress;
                try {
                    await updateAddressAPI(fullAddress);
                    setCurrentAddress(fullAddress);
                    setShowToast(true);
                    setTimeout(() => setShowToast(false), 2000);
                } catch (err) {
                    console.error('주소 업데이트 실패:', err);
                    alert('주소 저장에 실패했습니다. 다시 시도해주세요.');
                }
            },
        }).open();
    };

    const handleOpenPostcode = () => {
        if (window.daum?.Postcode) {
            runPostcode();
        } else {
            const script = document.createElement('script');
            script.src =
                '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
            script.onload = () => runPostcode();
            document.body.appendChild(script);
        }
    };

    return (
        <section className='mt-8'>
            <div className='mb-2 flex items-center justify-between'>
                <h2 className='font-semibold'>주소</h2>
                <button
                    className='text-primary-500 text-sm'
                    onClick={handleOpenPostcode}
                >
                    수정하기
                </button>
            </div>

            <div className='text-line-950 rounded-lg bg-white p-4 text-sm shadow-sm'>
                <div className='mt-1 flex items-center justify-between pb-2'>
                    <p>도로명 주소</p>
                    <p className='max-w-[60%] text-right'>{currentAddress}</p>
                </div>
            </div>

            <ToastModal isOpen={showToast} title='주소가 수정되었습니다.' />
        </section>
    );
};

export default AddressInfo;
