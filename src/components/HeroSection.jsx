import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export const HeroSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <section ref={ref} className="relative w-full min-h-[100dvh] flex items-center justify-center overflow-hidden bg-[#161D36] pt-24 pb-10 xl:pt-32 xl:pb-16">
      {/* Immagine Background Intera Parallasse */}
      <motion.div 
        style={{ y: backgroundY }}
        className="absolute inset-0 w-full h-[150%] -top-[10%] z-0"
      >
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2000&auto=format&fit=crop')" }}
        />
        {/* Overlay che fonde l'immagine nel colore del sito e aggiunge gradiente per staccare dal menu e far scomparire l'immagine in fondo*/}
        <div className="absolute inset-0 bg-[#161D36]/80 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#161D36]/40 via-[#161D36]/70 to-[#101529]"></div>
      </motion.div>

      {/* Hero Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
        
        {/* Left Side: Text */}
        <div className="w-full md:w-1/2 flex flex-col items-start justify-center text-left">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center space-x-4 mb-3 sm:mb-4"
          >
            <div className="w-12 h-1 bg-[#F7E842]"></div>
            <p className="text-[#F7E842] font-bold tracking-[0.3em] uppercase text-[11px] sm:text-sm">Laterza, Italia</p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-[32px] sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-[1.05] sm:leading-[1.1] uppercase tracking-wide sm:tracking-tighter"
          >
            <span className="block">Non aspettare</span>
            <span className="block whitespace-nowrap">il cambiamento.</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F7E842] to-[#FFF] italic block mt-0 sm:mt-1">
              Crealo.
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-4 sm:mt-6 max-w-lg"
          >
            <p className="text-[#F7E842] font-bold text-lg sm:text-xl md:text-2xl tracking-[0.2em] mb-2 sm:mb-3">
              <span className="uppercase">#4ME</span>dable
            </p>
            <div className="flex flex-col space-y-1 sm:space-y-1.5 border-l-2 border-[#F7E842]/50 pl-3 sm:pl-4 py-1">
              <p className="text-gray-300 text-sm sm:text-base md:text-lg font-light leading-snug">Allenamenti personalizzati</p>
              <p className="text-gray-300 text-sm sm:text-base md:text-lg font-light leading-snug">Personale qualificato</p>
              <p className="text-gray-300 text-sm sm:text-base md:text-lg font-light leading-snug">Ambiente motivante</p>
              <p className="text-gray-300 text-sm sm:text-base md:text-lg font-light leading-snug">Risultati visibili</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-6 sm:mt-8 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-6 w-full sm:w-auto"
          >
            <a href="#corsi" className="relative uppercase font-bold tracking-widest bg-[#F7E842] text-[#161D36] px-6 py-3.5 sm:px-8 sm:py-4 rounded hover:bg-white transition-colors duration-300 shadow-[0_0_20px_rgba(247,232,66,0.3)] hover:shadow-[0_0_30px_rgba(247,232,66,0.6)] text-center w-full sm:w-auto text-[13px] sm:text-sm md:text-base">
              Scopri i Corsi
            </a>
            <a href="#contatti" className="relative uppercase font-bold tracking-widest text-[#F7E842] border-2 border-[#F7E842] px-6 py-3.5 sm:px-8 sm:py-4 rounded hover:bg-[#F7E842] hover:text-[#161D36] transition-all duration-300 text-center w-full sm:w-auto text-[13px] sm:text-sm md:text-base">
              Contattaci
            </a>
          </motion.div>
        </div>

        {/* Right Side: Abstract Geometry deleted and only text + lines visible on background image */}
        <motion.div
          className="hidden w-full md:w-1/2 md:flex justify-end mt-16 md:mt-0 relative"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          {/* Sotto-cerchio pulsante per accentuare l'atmosfera */}
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{ duration: 4, ease: 'easeInOut', repeat: Infinity }}
            className="absolute top-1/2 right-20 transform -translate-y-1/2 w-64 h-64 bg-[#F7E842] rounded-full mix-blend-screen filter blur-[100px] pointer-events-none"
          ></motion.div>
        </motion.div>

      </div>
    </section>
  );
};