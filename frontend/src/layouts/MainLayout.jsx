import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import NovaChat from '../components/NovaChat/NovaChat';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-base-black text-white">
      <Navbar />
      <main className="flex-1 pt-[70px]">
        <Outlet />
      </main>
      <Footer />
      <NovaChat />
    </div>
  );
};

export default MainLayout;
