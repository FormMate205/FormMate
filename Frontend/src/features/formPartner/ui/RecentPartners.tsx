import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormPartner } from '@/entities/formDraft/model/types';
import { useGetRecentFormPartner } from '@/features/formPartner/api/formPartnerAPI';
import ArrowListItem from '@/shared/ui/ArrowListItem';

interface RecentPartnersProps {
    searchValue: string;
    title: string;
}

const RecentPartners = ({ searchValue, title }: RecentPartnersProps) => {
    const navigate = useNavigate();

    // 최근 계약 상대 리스트
    const [recentList, setRecentList] = useState<FormPartner[] | null>();

    const { partners, error, refetch, lastItemRef } = useGetRecentFormPartner({
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

    const handleItemClick = (result: FormPartner) => {
        console.log('선택된 항목:', result);
        navigate('/form/check');
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
        <div className='flex flex-1 flex-col'>
            <div className='text-lg font-medium'>{title}</div>

            {/* 에러 표시 */}
            {error && (
                <div className='py-4 text-red-500'>
                    데이터를 불러오는데 실패했습니다.
                </div>
            )}

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
                <div className='py-4 text-center'>계약 상대가 없습니다.</div>
            )}
        </div>
    );
};

export default RecentPartners;
