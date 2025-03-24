import { Footer, Header } from '@/widgets';
import AccountInfo from './ui/AccountInfo';
import AssetInfo from './ui/AssetInfo';
import Schedule from './ui/Schedule';

const Home = () => {
    return (
        <div>
            <div className='bg-line-50 flex min-h-screen flex-col gap-6 p-6'>
                <Header title='FormMate' isHome={true} />
                <AccountInfo />
                <AssetInfo />
                <Schedule />
            </div>
            <div className='fixed bottom-0 w-full'>
                <Footer />
            </div>
        </div>
    );
};

export default Home;
