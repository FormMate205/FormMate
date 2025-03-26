import { Footer, Header } from '@/widgets';
import AccountInfo from './ui/AccountInfo';
import Schedule from './ui/Schedule';
import TodaySettlement from './ui/TodaySettlement';

interface HomeProps {
    userName: string;
}

const Home = ({ userName }: HomeProps) => {
    userName = '오은지';

    return (
        <div className='flex h-screen flex-col overflow-hidden'>
            <div className='bg-line-50 scrollbar-none w-full flex-1 overflow-y-auto px-4 py-2'>
                <Header title='FormMate' isHome={true} />
                <div className='flex flex-col gap-7'>
                    <div className='relative mt-2'>
                        <p className='text-2xl font-semibold'>
                            {userName}님
                            <br />
                            부~자 되세요
                        </p>
                        <img
                            src='/assets/images/cones.png'
                            alt='축하 이미지'
                            className='absolute top-0 right-0 h-16 w-16'
                        />
                    </div>

                    <AccountInfo />
                    <TodaySettlement
                        hasTodayTransaction={true}
                        isSend={true}
                        targetName='강지은'
                        amount={33500}
                        principal={600000}
                    />
                    <Schedule />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Home;
