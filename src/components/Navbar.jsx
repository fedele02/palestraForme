import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from './Logo';

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('Home');

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Offerte', href: '#offerte' },
    { name: 'Corsi', href: '#corsi' },
    { name: 'Chi Siamo', href: '#about' },
    { name: 'Contatti', href: '#contatti' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Scroll Spy Logic
      const sections = ['offerte', 'corsi', 'about', 'contatti'];
      let current = 'Home';
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 200) {
            current = navLinks.find(link => link.href === `#${section}`)?.name || 'Home';
          }
        }
      }
      if (window.scrollY < 100) current = 'Home';
      setActiveSection(current);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-[999] transition-all duration-300 ${scrolled ? 'py-4' : 'py-6 md:py-8'}`}
      >
        <div className="container mx-auto px-4 flex justify-center">
          <div className={`
            relative flex items-center justify-between px-6 py-2.5 md:py-3 rounded-full transition-all duration-500
            ${scrolled || mobileMenuOpen 
              ? 'bg-[#161D36]/80 backdrop-blur-xl border border-[#F7E842]/20 shadow-[0_10px_30px_rgba(0,0,0,0.5)] w-full max-w-5xl' 
              : 'bg-transparent border border-transparent w-full max-w-6xl'}
          `}>
            {/* Logo */}
            <a href="#" className="flex items-center z-50 group transition-transform duration-300 hover:scale-105" onClick={() => setMobileMenuOpen(false)}>
              <Logo className={`transition-all duration-500 ${scrolled || mobileMenuOpen ? 'w-20 md:w-24' : 'w-24 md:w-32'} h-auto`} />
            </a>

            {/* Desktop Nav in pillola centrale */}
            <div className="hidden md:flex items-center gap-1 p-1.5 rounded-full transition-colors duration-500">
              {navLinks.map((link, idx) => {
                const isActive = activeSection === link.name;
                return (
                  <a
                    key={idx}
                    href={link.href}
                    onClick={() => setActiveSection(link.name)}
                    className={`relative px-5 py-2 rounded-full text-xs lg:text-sm font-bold uppercase tracking-widest transition-colors ${
                      isActive ? 'text-[#161D36]' : 'text-white/80 hover:text-white'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute inset-0 bg-[#F7E842] shadow-[0_0_15px_rgba(247,232,66,0.3)] rounded-full"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10">{link.name}</span>
                  </a>
                );
              })}
            </div>

            {/* Mobile Toggle Button */}
            <div className="flex items-center gap-4 z-50 md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-10 h-10 flex flex-col justify-center items-center gap-1.5 focus:outline-none"
              >
                <motion.span
                  animate={mobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                  className={`w-6 h-[2px] origin-center rounded-full transition-colors ${mobileMenuOpen ? 'bg-[#F7E842]' : 'bg-white'}`}
                />
                <motion.span
                  animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                  className={`w-6 h-[2px] rounded-full transition-colors ${mobileMenuOpen ? 'bg-[#F7E842]' : 'bg-white'}`}
                />
                <motion.span
                  animate={mobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                  className={`w-6 h-[2px] origin-center rounded-full transition-colors ${mobileMenuOpen ? 'bg-[#F7E842]' : 'bg-white'}`}
                />
              </button>
            </div>
            
            {/* Invisibile elemento desktop per forzare lo space-between identico su tre colonne */}
            <div className="hidden md:block w-24"></div>
          </div>
        </div>
      </motion.nav>

      {/* Contenitore Menu Mobile Separato */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            className="fixed inset-0 z-[40] bg-[#161D36]/95 flex items-center justify-center p-4 md:hidden"
          >
            <div className="flex flex-col items-center gap-8 w-full max-w-sm mt-12">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * idx }}
                  className="w-full text-center"
                >
                  <a
                    href={link.href}
                    className="block w-full py-2 text-3xl font-black uppercase tracking-widest text-white hover:text-[#F7E842] transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};