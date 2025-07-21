import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

function Layout() {
    const location = useLocation();

    // This effect simply scrolls the user to the top of the page
    // whenever they navigate to a new route.
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <>
            <Navbar />
            <main>
                <Outlet /> {/* This is where the page content will be rendered */}
            </main>
            <Footer />
        </>
    );
}

export default Layout;