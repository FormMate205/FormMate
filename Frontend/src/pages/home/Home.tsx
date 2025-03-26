import { Footer, Header } from '@/widgets';
import AccountInfo from './ui/AccountInfo';
import AssetInfo from './ui/AssetInfo';
import Schedule from './ui/Schedule';

const Home = () => {
    return (
        <div className='flex h-screen flex-col overflow-hidden'>
            <div className='bg-line-50 scrollbar-none w-full flex-1 overflow-y-auto'>
                <div className='flex flex-col gap-6 p-6'>
                    <Header title='FormMate' isHome={true} />
                    <AccountInfo />
                    <AssetInfo />
                    <Schedule />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Home;
