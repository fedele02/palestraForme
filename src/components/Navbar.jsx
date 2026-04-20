import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Logo } from './Logo';

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Corsi', href: '#corsi' },
    { name: 'Chi Siamo', href: '#about' },
    { name: 'Contatti', href: '#contatti' },
  ];

  return (
    <>
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ 
        y: scrolled ? 16 : 24,
        borderRadius: 64,
        backgroundColor: scrolled ? 'rgba(22, 29, 54, 0.95)' : 'rgba(22, 29, 54, 0)',
        borderColor: scrolled ? 'rgba(247, 232, 66, 0.2)' : 'rgba(247, 232, 66, 0)',
        boxShadow: scrolled ? '0 10px 30px rgba(0,0,0,0.5)' : '0 0 0 rgba(0,0,0,0)'
      }}
      transition={{ type: 'spring', stiffness: 260, damping: 25 }}
      style={{ borderWidth: '1px', borderStyle: 'solid', backdropFilter: scrolled ? 'blur(16px)' : 'none' }}
      className="fixed z-50 flex items-center justify-between w-[95%] md:w-[85%] max-w-6xl py-4 px-6 md:px-8 left-1/2 -translate-x-1/2"
    >
      {/* LOGO: Componente SVG personalizzato */}
      <a href="#" className="flex items-center z-50">
        <Logo className={`transition-all duration-500 ${scrolled ? 'w-20 md:w-24' : 'w-28 md:w-32'} h-auto hover:scale-105`} />
      </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link, idx) => (
            <a 
              key={idx} 
              href={link.href}
              className="text-white text-sm font-bold uppercase tracking-widest hover:text-[#F7E842] transition-colors relative group"
            >
              {link.name}
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-[#F7E842] transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </div>

        {/* Mobile menu button */}
        <button 
          className="md:hidden text-white z-50 focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
    </motion.nav>
    
    {/* Contenitore Menu Mobile Separato */}
    <AnimatePresence>
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-0 left-0 w-full h-screen z-40 bg-[#161D36] flex flex-col items-center justify-center space-y-8 md:hidden"
        >
          {navLinks.map((link, idx) => (
            <motion.a 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
              key={idx} 
              href={link.href}
              className="text-white text-3xl font-bold uppercase tracking-widest hover:text-[#F7E842]"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </motion.a>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
};