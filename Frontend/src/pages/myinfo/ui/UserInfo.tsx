interface UserInfoProps {
    isOAuth: boolean;
    userName: string;
    phoneNumber: string;
    email: string;
}

const UserInfo = ({ isOAuth, userName, phoneNumber, email }: UserInfoProps) => (
    <section>
        <div className='mb-2 flex items-center justify-between'>
            <h2 className='font-semibold'>기본 정보</h2>
            <button className='text-primary-500 text-sm'>수정하기</button>
        </div>
        <div className='text-line-950 rounded-lg bg-white p-4 text-sm shadow-sm'>
            <p className='pb-2'>이름: {userName}</p>
            <p className='pb-2'>전화번호: {phoneNumber}</p>
            <p className='pb-2'>이메일: {email}</p>

            {!isOAuth && (
                <div className='mt-1 flex items-center justify-between'>
                    <p>비밀번호</p>
                    <button className='text-primary-500 text-sm underline'>
                        비밀번호 변경
                    </button>
                </div>
            )}
        </div>
    </section>
);

export default UserInfo;
