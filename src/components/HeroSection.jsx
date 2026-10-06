import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, Check, Phone } from 'lucide-react';

// Foto stock segnaposto (Unsplash): da sostituire con una foto reale della palestra.
// Stessa foto su telefono e desktop, cambia solo l'inquadratura.
const HERO_IMAGE = 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=70';

const POINTS = ['Allenamenti personalizzati', 'Personale qualificato', 'Ambiente motivante', 'Risultati visibili'];

const EASE_OUT = [0.23, 1, 0.32, 1];

const lines = [
  { text: 'Non aspettare', accent: false },
  { text: 'il cambiamento.', accent: false },
  { text: 'Crealo.', accent: true },
];

export const HeroSection = ({ info }) => {
  const reduceMotion = useReducedMotion();

  const rise = (delay) => ({
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, transform: 'translateY(12px)' },
    animate: { opacity: 1, transform: 'translateY(0px)' },
    transition: { duration: 0.7, delay, ease: EASE_OUT },
  });

  const scrollToCourses = (e) => {
    e.preventDefault();
    history.pushState(null, '', '/classes');
    document.getElementById('corsi')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-ink"
    >
      <img
        src={`${HERO_IMAGE}&w=1600`}
        srcSet={`${HERO_IMAGE}&w=900 900w, ${HERO_IMAGE}&w=1200 1200w, ${HERO_IMAGE}&w=1600 1600w, ${HERO_IMAGE}&w=2400 2400w`}
        sizes="100vw"
        alt=""
        fetchPriority="high"
        decoding="async"
        className="absolute inset-x-0 top-0 -z-20 h-[82%] w-full object-cover object-[60%_30%] [filter:grayscale(1)_contrast(1.05)] [mask-image:linear-gradient(to_bottom,black_72%,transparent)] md:inset-0 md:h-full md:object-[center_35%] md:[mask-image:none]"
      />
      {/* Velo per la leggibilità: dal basso su telefono, da sinistra su schermi larghi */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,#161D36_8%,rgb(22_29_54/0.82)_45%,rgb(22_29_54/0.35)_100%)] md:bg-[linear-gradient(to_right,#161D36_0%,rgb(22_29_54/0.86)_38%,rgb(22_29_54/0.25)_75%),linear-gradient(to_top,#161D36_0%,transparent_30%)]" />

      <div className="mx-auto w-full max-w-7xl px-5 pb-[calc(2.75rem+env(safe-area-inset-bottom))] pt-32 sm:px-8 md:pb-20 lg:pb-24">
        <h1
          id="hero-title"
          className="display text-[clamp(2.25rem,12.6vw,4.75rem)] text-paper [font-stretch:62%] md:text-[5.25rem] lg:text-[6rem]"
        >
          {lines.map((line, idx) => (
            <span key={line.text} className="block overflow-hidden pb-[0.04em]">
              <motion.span
                className={`block ${line.accent ? 'text-sun' : ''}`}
                initial={reduceMotion ? { opacity: 0 } : { transform: 'translateY(105%)' }}
                animate={reduceMotion ? { opacity: 1 } : { transform: 'translateY(0%)' }}
                transition={{ duration: 0.9, delay: 0.1 + idx * 0.08, ease: EASE_OUT }}
              >
                {line.text}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.div {...rise(0.45)} className="mt-5 md:mt-7">
          <p className="text-xl font-bold tracking-[0.02em] text-sun md:text-2xl">#4MEdable</p>
          <ul className="mt-4 grid max-w-md grid-cols-2 gap-x-5 gap-y-2.5 md:mt-5">
            {POINTS.map((point) => (
              <li key={point} className="flex items-start gap-2 text-[0.9375rem] font-medium leading-snug text-paper/90 md:text-base">
                <Check size={16} strokeWidth={2.5} className="mt-[0.2em] shrink-0 text-sun" aria-hidden="true" />
                {point}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div {...rise(0.55)} className="mt-7 flex flex-wrap gap-3 md:mt-9">
          <a href="/classes" onClick={scrollToCourses} className="btn btn-sun flex-1 sm:flex-none">
            Scopri i corsi
            <ArrowDown size={18} strokeWidth={2} aria-hidden="true" />
          </a>
          <a href={info.phoneHref} className="btn btn-ghost flex-1 sm:flex-none">
            <Phone size={18} strokeWidth={1.75} aria-hidden="true" />
            Chiama
          </a>
        </motion.div>
      </div>
    </section>
  );
};
