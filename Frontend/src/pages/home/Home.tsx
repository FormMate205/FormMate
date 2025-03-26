import { Footer, Header } from '@/widgets';
import AccountInfo from './ui/AccountInfo';
import Schedule from './ui/Schedule';
import TodaySettlement from './ui/TodaySettlement';

const Home = () => {
    return (
        <div className='flex h-screen flex-col overflow-hidden'>
            <div className='bg-line-50 scrollbar-none w-full flex-1 overflow-y-auto'>
                <div className='flex flex-col gap-6 p-6'>
                    <Header title='FormMate' isHome={true} />
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
