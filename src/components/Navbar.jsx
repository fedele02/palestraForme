import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Menu, Phone, X } from 'lucide-react';
import { Logo } from './Logo';

const EASE_OUT = [0.23, 1, 0.32, 1];

// Barra grande e tipografica: trasparente sopra la foto, blu piena scorrendo, sempre visibile
export const Navbar = ({ hasOffers = false, info }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const menuButtonRef = useRef(null);
  const lockSpyRef = useRef(false);
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();

  const navLinks = [
    ...(hasOffers ? [{ name: 'Offerte', sectionId: 'offerte', path: '/offers' }] : []),
    { name: 'Corsi', sectionId: 'corsi', path: '/classes' },
    { name: 'Contatti', sectionId: 'contatti', path: '/contacts' },
  ];

  // Al refresh, resetta sempre URL e scroll alla Home
  useEffect(() => {
    history.replaceState(null, '', '/');
    window.scrollTo(0, 0);
  }, []);

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 40));

  // Scroll spy: la sezione che occupa la fascia centrale dello schermo è quella attiva
  useEffect(() => {
    const ids = ['offerte', 'corsi', 'contatti'];
    const visible = new Map();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => visible.set(e.target.id, e.isIntersecting));
        if (lockSpyRef.current) return;
        setActiveSection(ids.find((id) => visible.get(id)) ?? null);
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [hasOffers]);

  // Menu mobile: blocca lo scroll della pagina e chiudi con Esc
  useEffect(() => {
    if (!menuOpen) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const goTo = useCallback((sectionId, path) => {
    setMenuOpen(false);
    history.pushState(null, '', path);
    setActiveSection(sectionId);

    // Durante lo scroll programmato lo spy resta fermo
    lockSpyRef.current = true;
    const unlock = () => { lockSpyRef.current = false; };
    if ('onscrollend' in window) window.addEventListener('scrollend', unlock, { once: true });
    setTimeout(unlock, 1200);

    const behavior = reduceMotion ? 'auto' : 'smooth';
    if (!sectionId) window.scrollTo({ top: 0, behavior });
    else document.getElementById(sectionId)?.scrollIntoView({ behavior });
  }, [reduceMotion]);

  const solid = scrolled || menuOpen;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)] transition-[background-color,box-shadow] duration-300 ${
          solid ? 'bg-ink shadow-[0_1px_0_var(--color-line)]' : 'bg-transparent'
        }`}
      >
        <nav
          aria-label="Principale"
          className={`mx-auto flex max-w-7xl items-center justify-between px-5 transition-[height] duration-300 ease-[var(--ease-out-strong)] sm:px-8 ${
            solid ? 'h-16 md:h-20' : 'h-20 md:h-24'
          }`}
        >
          <a
            href="/"
            onClick={(e) => { e.preventDefault(); goTo(null, '/'); }}
            className="-ml-1 flex items-center rounded-[4px] p-1"
            aria-label="ForMe, torna all'inizio"
          >
            <Logo
              className={`w-auto transition-[height] duration-300 ease-[var(--ease-out-strong)] ${
                solid ? 'h-11 md:h-14' : 'h-14 md:h-16'
              }`}
            />
          </a>

          {/* PC: voci grandi nel carattere dei titoli */}
          <ul className="hidden items-center gap-7 md:flex">
            {navLinks.map((link) => {
              const isActive = activeSection === link.sectionId;
              return (
                <li key={link.sectionId}>
                  <a
                    href={link.path}
                    onClick={(e) => { e.preventDefault(); goTo(link.sectionId, link.path); }}
                    aria-current={isActive ? 'true' : undefined}
                    className={`display block py-2 text-[1.75rem] transition-colors duration-200 ${
                      isActive ? 'text-sun' : 'text-paper hover:text-sun'
                    }`}
                  >
                    {link.name}
                  </a>
                </li>
              );
            })}
            <li>
              <a href={info.phoneHref} className="btn btn-sun min-h-11 px-4 text-sm">
                <Phone size={16} strokeWidth={2} aria-hidden="true" />
                <span className="tabular">{info.phone}</span>
              </a>
            </li>
          </ul>

          {/* Telefono */}
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="menu-mobile"
            className="display -mr-2 flex min-h-11 items-center gap-2 rounded-[4px] px-2 text-[1.5rem] text-paper active:bg-white/10 md:hidden"
          >
            {menuOpen ? 'Chiudi' : 'Menu'}
            {menuOpen
              ? <X size={24} strokeWidth={2} className="text-sun" aria-hidden="true" />
              : <Menu size={24} strokeWidth={2} className="text-sun" aria-hidden="true" />}
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="menu-mobile"
            key="menu"
            initial={reduceMotion ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }}
            animate={reduceMotion ? { opacity: 1 } : { clipPath: 'inset(0 0 0% 0)' }}
            exit={reduceMotion ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.45, ease: [0.77, 0, 0.175, 1] }}
            className="fixed inset-0 z-40 flex flex-col bg-ink px-5 pt-[calc(5.5rem+env(safe-area-inset-top))] pb-[calc(1.5rem+env(safe-area-inset-bottom))] md:hidden"
          >
            <ul className="flex-1 overflow-y-auto overscroll-contain">
              {navLinks.map((link, idx) => {
                const isActive = activeSection === link.sectionId;
                return (
                  <motion.li
                    key={link.sectionId}
                    initial={reduceMotion ? false : { opacity: 0, transform: 'translateY(16px)' }}
                    animate={{ opacity: 1, transform: 'translateY(0px)' }}
                    transition={{ duration: 0.5, delay: 0.15 + idx * 0.05, ease: EASE_OUT }}
                  >
                    <a
                      href={link.path}
                      onClick={(e) => { e.preventDefault(); goTo(link.sectionId, link.path); }}
                      className={`display block py-3 text-[clamp(3rem,16vw,4rem)] active:text-sun ${
                        isActive ? 'text-sun' : 'text-paper'
                      }`}
                    >
                      {link.name}
                    </a>
                  </motion.li>
                );
              })}
            </ul>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="space-y-4"
            >
              <p className="text-sm leading-relaxed text-mute">{info.addressLines.join(', ')}</p>
              <a href={info.phoneHref} className="btn btn-sun w-full">
                <Phone size={18} strokeWidth={2} aria-hidden="true" />
                Chiama <span className="tabular">{info.phone}</span>
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
