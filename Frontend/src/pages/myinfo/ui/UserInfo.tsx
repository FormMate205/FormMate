import { useNavigate } from 'react-router-dom';

interface UserInfoProps {
    isOAuth: boolean;
    userName: string;
    phoneNumber: string;
    email: string;
}

const UserInfo = ({ isOAuth, userName, phoneNumber, email }: UserInfoProps) => {
    const navigate = useNavigate();

    return (
        <section>
            <div className='mb-2 flex items-center justify-between'>
                <h2 className='font-semibold'>기본 정보</h2>
            </div>
            <div className='text-line-950 rounded-lg bg-white p-4 text-sm shadow-sm'>
                <div className='mt-1 flex items-center justify-between pb-2'>
                    <p>이름</p>
                    <p>{userName}</p>
                </div>
                <div className='mt-1 flex items-center justify-between pb-2'>
                    <p>전화번호</p>
                    <p>{phoneNumber}</p>
                </div>
                <div className='mt-1 flex items-center justify-between pb-2'>
                    <p>이메일</p>
                    <p>{email}</p>
                </div>

                {!isOAuth && (
                    <div className='mt-1 flex items-center justify-between'>
                        <p>비밀번호</p>
                        <button
                            className='text-line-500 text-sm underline'
                            onClick={() => navigate('/myinfo/password')}
                        >
                            비밀번호 변경
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default UserInfo;
