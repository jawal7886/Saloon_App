import './bootstrap';
import '../css/app.css';

import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Services from './components/services';
import Contact from './components/contact';
import AboutUs from './components/AboutUs';
import Gallery from './components/gallery';
import Pricing from './components/pricing';
import Booking from './components/booking/booking';
import LoginModal from './components/Auth/login';
import SignupModal from './components/Auth/signup';
import Admin from './components/Admin/Admin';
import Notification from './components/Notification';

function App() {
    const [loginOpen, setLoginOpen] = useState(false);
    const [signupOpen, setSignupOpen] = useState(false);
    const [bookingOpen, setBookingOpen] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    const [currentView, setCurrentView] = useState('home');
    const [notification, setNotification] = useState({ message: '', type: 'success', isVisible: false });
    const [salon, setSalon] = useState(null);
    const pendingBookingRef = useRef(null);

    useEffect(() => {
        // Fetch salon details from API
        fetch('/salons')
            .then(res => res.json())
            .then(data => {
                if (data && data.length > 0) {
                    const s = data[0];
                    setSalon({
                        name: s.name,
                        tagLine: s.tag_line,
                        logo: s.logo,
                        phone1: s.phone1,
                        phone2: s.phone2,
                        email1: s.email1,
                        email2: s.email2,
                        address: s.address,
                    });
                }
            });
    }, []);

    const handleLoginOpen = () => setLoginOpen(true);
    const handleLoginClose = () => setLoginOpen(false);
    const handleSignupOpen = () => setSignupOpen(true);
    const handleSignupClose = () => setSignupOpen(false);
    const handleBookingOpen = () => setBookingOpen(true);
    const handleBookingClose = () => setBookingOpen(false);

    // Show notification
    const showNotification = (message, type = 'success') => {
        setNotification({ message, type, isVisible: true });
    };

    // Hide notification
    const hideNotification = () => {
        setNotification(prev => ({ ...prev, isVisible: false }));
    };

    // Called when login form is submitted
    const handleLoginSubmit = () => {
        setLoggedIn(true);
        setLoginOpen(false);
        showNotification('Welcome back! You have successfully logged in.', 'success');
        // If there is a pending booking action, run it
        if (pendingBookingRef.current) {
            pendingBookingRef.current();
            pendingBookingRef.current = null;
        }
    };

    // Called when signup form is submitted
    const handleSignupSubmit = () => {
        setSignupOpen(false);
        showNotification('Account created successfully! You are now logged in.', 'success');
    };

    // Called when a service or protected action is clicked
    const handleRequireLogin = (action) => {
        if (!loggedIn) {
            setLoginOpen(true);
            if (typeof action === 'function') {
                pendingBookingRef.current = action;
            }
        } else if (typeof action === 'function') {
            action();
        }
    };

    // For Booking: allow it to request login and then run booking after login
    const handleLoginAndBook = (bookingAction) => {
        setLoginOpen(true);
        pendingBookingRef.current = bookingAction;
    };

    // Switch from login to signup modal
    const handleShowSignup = () => {
        setLoginOpen(false);
        setSignupOpen(true);
    };
    // Switch from signup to login modal
    const handleShowLogin = () => {
        setSignupOpen(false);
        setLoginOpen(true);
    };

    // Handle admin navigation
    const handleAdminClick = () => {
        setCurrentView('admin');
    };

    // Handle back to home
    const handleBackToHome = () => {
        setCurrentView('home');
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {currentView === 'home' ? (
                <>
                    <Header salon={salon} onLoginClick={handleLoginOpen} onSignupClick={handleSignupOpen} onBookingClick={handleBookingOpen} onAdminClick={handleAdminClick} />
                    <Hero salon={salon} onBookingClick={handleBookingOpen} />
                    <Services onRequireLogin={handleRequireLogin} isLoggedIn={loggedIn} />
                    <Pricing onRequireLogin={handleRequireLogin} isLoggedIn={loggedIn} />
                    <AboutUs />
                    <Gallery />
                    <Contact />
                    <Footer onAdminClick={handleAdminClick} />
                    <LoginModal isOpen={loginOpen} onClose={handleLoginClose} onSubmit={handleLoginSubmit} onShowSignup={handleShowSignup} />
                    <SignupModal isOpen={signupOpen} onClose={handleSignupClose} onSubmit={handleSignupSubmit} onShowLogin={handleShowLogin} />
                    <Booking isOpen={bookingOpen} onClose={handleBookingClose} onRequireLogin={handleRequireLogin} isLoggedIn={loggedIn} onLoginAndBook={handleLoginAndBook} />
                    <Notification 
                        message={notification.message}
                        type={notification.type}
                        isVisible={notification.isVisible}
                        onClose={hideNotification}
                    />
                </>
            ) : (
                <Admin onBack={handleBackToHome} />
            )}
        </div>
    );
}

export default App;

const domNode = document.getElementById('app');
if (domNode) {
    const root = createRoot(domNode);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}