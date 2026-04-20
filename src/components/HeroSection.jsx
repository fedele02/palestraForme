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
    <section ref={ref} className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-[#161D36] pt-20">
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
            className="flex items-center space-x-4 mb-4"
          >
            <div className="w-12 h-1 bg-[#F7E842]"></div>
            <p className="text-[#F7E842] font-bold tracking-[0.3em] uppercase text-sm">Laterza, Italia</p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-6xl md:text-8xl font-black text-white leading-[0.9] uppercase tracking-tighter"
          >
            Power <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F7E842] to-white italic">
              Fitness
            </span> <br/>
            Experience
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-6 text-gray-300 text-lg md:text-xl font-light max-w-md leading-relaxed"
          >
            Non una semplice palestra. Un'esperienza viscerale progettata per spingere i tuoi limiti e trasformare il tuo corpo con i corsi più esclusivi.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-10 flex space-x-6"
          >
            <a href="#corsi" className="relative uppercase font-bold tracking-widest bg-[#F7E842] text-[#161D36] px-8 py-4 rounded hover:bg-white transition-colors duration-300 shadow-[0_0_20px_rgba(247,232,66,0.3)] hover:shadow-[0_0_30px_rgba(247,232,66,0.6)]">
              Scopri i Corsi
            </a>
            <a href="#contatti" className="relative uppercase font-bold tracking-widest text-[#F7E842] border-2 border-[#F7E842] px-8 py-4 rounded hover:bg-[#F7E842] hover:text-[#161D36] transition-all duration-300">
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
      
      {/* Scroll indicator Bottom */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
      >
        <span className="text-xs text-white uppercase tracking-[0.2em] font-bold mb-2">Scroll</span>
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-[2px] h-12 bg-gradient-to-b from-[#F7E842] to-transparent"
        />
      </motion.div>
    </section>
  );
};