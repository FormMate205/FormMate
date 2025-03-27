import { debounce } from 'lodash';
import { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { FormPartner } from '@/entities/formDraft/model/types';
import { useGetRecentFormPartner } from '@/features/formDraft/api/formPartnerAPI';
import ArrowListItem from '@/shared/ui/ArrowListItem';
import { Header } from '@/widgets';
import SearchListItem from '../../entities/formPartner/ui/SearchListItem';

const FormMatch = () => {
    const navigate = useNavigate();

    // 더미데이터
    const dummy = {
        content: [
            { userId: '2', userName: '이동욱', phoneNumber: '010-1234-9999' },
            { userId: '3', userName: '윤이영', phoneNumber: '010-1234-5678' },
            { userId: '4', userName: '오은지', phoneNumber: '010-1234-8888' },
        ],
        totalElements: '0',
        totalPages: '0',
        pageable: {
            page: '0',
            size: '10',
        },
    };

    // 최근 계약 상대 리스트
    const [recentList, setRecentList] = useState<FormPartner[]>(dummy.content);
    // 검색 리스트
    const [searchValue, setSearchValue] = useState('');
    const [searchResults, setSearchResults] = useState<FormPartner[] | null>();

    const {
        partners,
        isFetching,
        isFetchingNextPage,
        error,
        refetch,
        lastItemRef,
    } = useGetRecentFormPartner({
        pageable: dummy.pageable,
        input: searchValue,
    });

    useEffect(() => {
        if (partners && partners.length > 0) {
            setRecentList(partners);
        }
    }, [partners]);

    const handleSearch = debounce((searchValue: string) => {
        if (searchValue.trim().length > 0) {
            const filtered = searchResults?.filter(
                (result) =>
                    result.userName.includes(searchValue) ||
                    result.phoneNumber.includes(searchValue),
            );
            setSearchResults(filtered);
        } else {
            setSearchResults(null);
        }
    }, 300);

    const onInputValueChange = (e: ChangeEvent<HTMLInputElement>) => {
        const searchValue = e.target.value;
        setSearchValue(searchValue);
        handleSearch(searchValue);
    };

    const handleItemClick = (result: FormPartner) => {
        console.log('선택된 항목:', result);
        navigate('/form/check');
    };

    // 검색어가 변경되면 데이터를 다시 가져옴
    useEffect(() => {
        if (searchValue.trim() !== '') {
            refetch();
        }
    }, [searchValue, refetch]);

    return (
        <div className='flex flex-col gap-8 px-4 py-2'>
            <Header title='계약 상대 등록' />

            <div className='text-xl font-semibold'>
                누구와 계약을 원하시나요?
            </div>

            <div>
                <Input
                    variant='search'
                    placeholder='이름 또는 전화번호 입력'
                    value={searchValue}
                    onChange={onInputValueChange}
                />

                <div className='mt-4'>
                    {searchResults && (
                        <div className='flex flex-col gap-2'>
                            {searchResults!.map((result) => (
                                <SearchListItem
                                    key={result.userId}
                                    name={result.userName}
                                    phonenumber={result.phoneNumber}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleItemClick(result);
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className='flex flex-1 flex-col'>
                <div className='text-lg font-medium'>최근 계약 상대</div>

                {/* 데이터 로딩 중 표시 */}
                {isFetching && !isFetchingNextPage && (
                    <div className='py-4 text-center'>
                        데이터를 불러오는 중...
                    </div>
                )}

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
                                ref={
                                    index === recentList.length - 1
                                        ? lastItemRef
                                        : null
                                }
                            >
                                <ArrowListItem
                                    key={item.userId}
                                    title={item.userName}
                                    subString={item.phoneNumber}
                                    onClick={() => handleItemClick(item)}
                                />
                            </div>
                        ))}

                        {/* 추가 데이터 로딩 중 표시 */}
                        {isFetchingNextPage && (
                            <div className='py-2 text-center'>
                                추가 데이터를 불러오는 중...
                            </div>
                        )}
                    </div>
                ) : (
                    <div className='py-4 text-center'>
                        계약 상대가 없습니다.
                    </div>
                )}
            </div>
        </div>
    );
};

export default FormMatch;
