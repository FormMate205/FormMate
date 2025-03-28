import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormPartner } from '@/entities/formDraft/model/types';
import useFormPartnerStore from '@/entities/formPartner/model/formPartnerStore';
import { useGetRecentFormPartner } from '@/features/formPartner/api/formPartnerAPI';
import ArrowListItem from '@/shared/ui/ArrowListItem';

interface RecentPartnersProps {
    searchValue: string;
}

const RecentPartners = ({ searchValue }: RecentPartnersProps) => {
    const navigate = useNavigate();
    const { setPartner } = useFormPartnerStore();

    // 최근 계약 상대 리스트
    const [recentList, setRecentList] = useState<FormPartner[] | null>();

    const { partners, refetch, lastItemRef } = useGetRecentFormPartner({
        pageable: {
            page: '0',
            size: '10',
        },
        input: searchValue,
    });

    useEffect(() => {
        if (partners && partners.length > 0) {
            setRecentList(partners);
        }
    }, [partners]);

    const handleItemClick = (partner: FormPartner) => {
        setPartner(partner);
        navigate('/form/check');
        return;
    };

    // 검색어가 변경되면 데이터를 다시 가져옴
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchValue.trim() !== '') {
                refetch();
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchValue, refetch]);

    return (
        <div>
            {/* 데이터 목록 표시 */}
            {recentList && recentList.length > 0 ? (
                <div className='flex flex-col'>
                    {recentList.map((item, index) => (
                        <div
                            key={item.userId}
                            ref={
                                index === recentList.length - 1
                                    ? lastItemRef
                                    : null
                            }
                        >
                            <ArrowListItem
                                title={item.userName}
                                subString={item.phoneNumber}
                                onClick={() => handleItemClick(item)}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className='py-4 text-center'>
                    최근 계약 상대에 {searchValue}님은 없습니다.
                </div>
            )}
        </div>
    );
};

export default RecentPartners;
