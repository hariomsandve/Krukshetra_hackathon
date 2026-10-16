import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import HowItWorks from '../components/landing/HowItWorks';
import Testimonials from '../components/landing/Testimonials';
import CTA from '../components/landing/CTA';
import Footer from '../components/landing/Footer';
import { useEffect } from 'react';

const Home = () => {

    // Smooth scroll setup (optional)
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-slate-900 text-slate-100 min-h-screen font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden">
            <Hero />
            <Features />
            <HowItWorks />
            <Testimonials />
            <CTA />
            <Footer />
        </div>
    );
};

export default Home;
