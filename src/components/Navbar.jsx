import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from './Logo';

export const Navbar = ({ hasOffers = false }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('Home');
  const isScrollingRef = useRef(false);
  const scrollTimerRef = useRef(null);

  const navLinks = [
    { name: 'Home',     sectionId: null,       path: '/' },
    { name: 'Corsi',    sectionId: 'corsi',    path: '/classes' },
    ...(hasOffers ? [{ name: 'Offerte', sectionId: 'offerte', path: '/offers' }] : []),
    { name: 'Contatti', sectionId: 'contatti', path: '/contacts' },
  ];

  // Al refresh, resetta sempre URL, scroll e sezione attiva a Home
  useEffect(() => {
    history.replaceState(null, '', '/');
    window.scrollTo(0, 0);
    setActiveSection('Home');
  }, []);

  // Scroll background
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Scroll spy basato sulla posizione scroll (più affidabile di IntersectionObserver)
  useEffect(() => {
    const getActiveFromScroll = () => {
      if (isScrollingRef.current) return;

      const scrollY = window.scrollY;
      const pageBottom = document.documentElement.scrollHeight - window.innerHeight;

      if (scrollY < 80) { setActiveSection('Home'); return; }
      if (scrollY >= pageBottom - 80) { setActiveSection('Contatti'); return; }

      const sections = ['contatti', 'offerte', 'corsi'];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + scrollY;
        if (scrollY >= top - window.innerHeight * 0.4) {
          const map = { corsi: 'Corsi', offerte: 'Offerte', contatti: 'Contatti' };
          setActiveSection(map[id]);
          return;
        }
      }
      setActiveSection('Home');
    };

    window.addEventListener('scroll', getActiveFromScroll, { passive: true });
    return () => window.removeEventListener('scroll', getActiveFromScroll);
  }, [hasOffers]);

  const scrollTo = (sectionId, name, path) => {
    setMobileMenuOpen(false);
    history.pushState(null, '', path);
    setActiveSection(name);

    // Blocca subito lo spy — sincrono, prima di qualsiasi scroll event
    isScrollingRef.current = true;
    clearTimeout(scrollTimerRef.current);

    const unlock = () => { isScrollingRef.current = false; };

    if (!sectionId) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }

    // Usa scrollend se disponibile, altrimenti fallback timer generoso
    if ('onscrollend' in window) {
      window.addEventListener('scrollend', unlock, { once: true });
      // Fallback di sicurezza nel caso scrollend non scatti (es. scroll già a destinazione)
      scrollTimerRef.current = setTimeout(unlock, 2000);
    } else {
      scrollTimerRef.current = setTimeout(unlock, 1500);
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-[999] transition-all duration-300 ${scrolled ? 'py-4' : 'py-6 md:py-8'}`}
      >
        <div className="container mx-auto px-4 flex justify-center">
          <div className={`relative flex items-center justify-between px-6 py-2.5 md:py-3 rounded-full transition-all duration-500
            ${scrolled || mobileMenuOpen
              ? 'bg-[#161D36]/80 backdrop-blur-xl border border-[#F7E842]/20 shadow-[0_10px_30px_rgba(0,0,0,0.5)] w-full max-w-5xl'
              : 'bg-transparent border border-transparent w-full max-w-6xl'}`}>

            <button onClick={() => scrollTo(null, 'Home', '/')} className="flex items-center z-50 group transition-transform duration-300 hover:scale-105">
              <Logo className={`transition-all duration-500 ${scrolled || mobileMenuOpen ? 'w-20 md:w-24' : 'w-24 md:w-32'} h-auto`} />
            </button>

            <div className="hidden md:flex items-center gap-1 p-1.5 rounded-full">
              {navLinks.map((link, idx) => {
                const isActive = activeSection === link.name;
                return (
                  <button key={idx} onClick={() => scrollTo(link.sectionId, link.name, link.path)}
                    className={`relative px-5 py-2 rounded-full text-xs lg:text-sm font-bold uppercase tracking-widest transition-colors ${isActive ? 'text-[#161D36]' : 'text-white/80 hover:text-white'}`}>
                    {isActive && (
                      <motion.div layoutId="navbar-indicator"
                        className="absolute inset-0 bg-[#F7E842] shadow-[0_0_15px_rgba(247,232,66,0.3)] rounded-full"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }} />
                    )}
                    <span className="relative z-10">{link.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-4 z-50 md:hidden">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-10 h-10 flex flex-col justify-center items-center gap-1.5 focus:outline-none">
                <motion.span animate={mobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }} className={`w-6 h-[2px] origin-center rounded-full transition-colors ${mobileMenuOpen ? 'bg-[#F7E842]' : 'bg-white'}`} />
                <motion.span animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }} className={`w-6 h-[2px] rounded-full transition-colors ${mobileMenuOpen ? 'bg-[#F7E842]' : 'bg-white'}`} />
                <motion.span animate={mobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }} className={`w-6 h-[2px] origin-center rounded-full transition-colors ${mobileMenuOpen ? 'bg-[#F7E842]' : 'bg-white'}`} />
              </button>
            </div>

            <div className="hidden md:block w-24" />
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            className="fixed inset-0 z-[40] bg-[#161D36]/95 flex items-center justify-center p-4 md:hidden">
            <div className="flex flex-col items-center gap-8 w-full max-w-sm mt-12">
              {navLinks.map((link, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * idx }} className="w-full text-center">
                  <button onClick={() => scrollTo(link.sectionId, link.name, link.path)}
                    className="block w-full py-2 text-3xl font-black uppercase tracking-widest text-white hover:text-[#F7E842] transition-colors">
                    {link.name}
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
