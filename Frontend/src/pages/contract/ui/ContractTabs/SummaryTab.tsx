import { Icons } from '@/shared';

const SummaryTab = () => {
    return (
        <div className='flex flex-col gap-8'>
            <div className='flex flex-col'>
                <div className='flex justify-end'>
                    <Icons name='export' />
                </div>
                <div className='flex justify-center text-xl font-medium'>
                    차용증
                </div>
            </div>

            <article className='text-line-900 flex flex-col gap-4'>
                <div className='flex flex-col gap-1'>
                    <div className='flex justify-between'>
                        <span>채권자</span>
                        <div>
                            <span>윤이영</span>
                            <span> / </span>
                            <span>010-1234-5678</span>
                        </div>
                    </div>
                    <div className='flex justify-between'>
                        <span>채무자</span>
                        <div>
                            <span>강지은</span>
                            <span> / </span>
                            <span>010-1234-5678</span>
                        </div>
                    </div>
                    <div className='flex items-center justify-between'>
                        <span>입금계좌</span>
                        <div className='flex flex-col items-end'>
                            <span>카카오뱅크</span>
                            <span>111-1111-111111</span>
                        </div>
                    </div>
                    <div className='flex justify-between'>
                        <span>계약 체결</span>
                        <span>2025.02.12</span>
                    </div>
                    <div className='flex justify-between'>
                        <span>계약 만기</span>
                        <span>2025.05.12</span>
                    </div>
                    <div className='flex items-center justify-between'>
                        <span>상환 방식</span>
                        <div className='flex flex-col items-end'>
                            <span>원금 균등 상환</span>
                            <span>매달 29일 / 10,000원</span>
                        </div>
                    </div>
                    <div className='flex justify-between'>
                        <span>이자율</span>
                        <span>0.15%</span>
                    </div>
                    <div className='flex justify-between'>
                        <span>중도상환 수수료</span>
                        <span>0.15%</span>
                    </div>
                    <div className='flex justify-between'>
                        <span>특약</span>
                        <span>연체 3회 초과 시 즉시 원금 상환</span>
                    </div>
                </div>
                <div className='flex justify-center'>2025.03.17</div>
                <div className='flex flex-col items-end'>
                    <span>윤이영 (인)</span>
                    <span>강지은 (인)</span>
                </div>
            </article>
        </div>
    );
};

export default SummaryTab;
