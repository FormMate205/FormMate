import { debounce } from 'lodash';
import { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/input';
import ArrowListItem from '../../shared/ui/ArrowListItem';
import Header from '../../shared/ui/Header';
import SearchListItem from './ui/SearchListItem';

const FormMatch = () => {
    const navigate = useNavigate();

    // 더미데이터
    const itemsData = [
        { id: 1, name: '강지은', phone: '010-1234-5678' },
        { id: 2, name: '윤이영', phone: '010-1234-5678' },
        { id: 3, name: '오은지', phone: '010-1234-5678' },
    ];

    const [searchValue, setSearchValue] = useState('');
    const [searchResults, setSearchResults] = useState<
        Array<(typeof itemsData)[0]>
    >([]);

    const handleSearch = debounce((searchValue: string) => {
        if (searchValue.trim().length > 0) {
            const filtered = itemsData.filter(
                (item) =>
                    item.name.includes(searchValue) ||
                    item.phone.includes(searchValue),
            );

            setSearchResults(filtered);
        } else {
            setSearchResults([]);
        }
    }, 300);

    const onInputValueChange = (e: ChangeEvent<HTMLInputElement>) => {
        const searchValue = e.target.value;
        setSearchValue(searchValue);
        handleSearch(searchValue);
    };

    const handleItemClick = (item: (typeof itemsData)[0]) => {
        console.log('선택된 항목:', item);
        navigate('/form/create');
    };

    return (
        <div className='flex flex-col gap-8'>
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
                    {searchResults.length > 0 && (
                        <div className='flex flex-col gap-2'>
                            {searchResults.map((item) => (
                                <SearchListItem
                                    key={item.id}
                                    name={item.name}
                                    phonenumber={item.phone}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleItemClick(item);
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className='flex flex-1 flex-col'>
                <div className='text-lg font-medium'>최근 계약 상대</div>
                {itemsData.length > 0 &&
                    itemsData.map((item) => (
                        <ArrowListItem
                            key={item.id}
                            title={item.name}
                            subString={item.phone}
                            onClick={() => handleItemClick(item)}
                        />
                    ))}
            </div>
        </div>
    );
};

export default FormMatch;
