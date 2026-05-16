import { Outlet } from 'react-router-dom';
import MobileStickyBar from './MobileStickyBar';
import Navbar from './Navbar';
import SiteFooter from './SiteFooter';
import WhatsAppFloat from './WhatsAppFloat';

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <SiteFooter />
      <WhatsAppFloat />
      <MobileStickyBar />
    </>
  );
}
