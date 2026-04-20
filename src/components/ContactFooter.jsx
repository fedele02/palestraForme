import { motion } from 'framer-motion';
import { MapPin, Phone, Mail } from 'lucide-react';

export const ContactFooter = () => {
  return (
    <>
      <section id="contatti" className="py-32 bg-[#161D36] relative w-full border-t border-[#101529]">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-16 justify-between">    

            {/* Info Box */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2"
            >
              <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-8 cursor-default">
                Join The <br/> <span className="text-[#F7E842]">Movement</span> 
              </h2>
              <p className="text-gray-400 font-light text-lg mb-12 max-w-md">   
                Pronto a scoprire la pazzesca esperienza ForMe? Passa a trovarci o contattaci per prenotare il tuo primo allenamento.
              </p>

              <div className="space-y-8">
                <div className="flex items-start text-white space-x-6 group">
                  <div className="w-14 h-14 shrink-0 bg-[#101529] text-[#F7E842] flex items-center justify-center rounded-full group-hover:bg-[#F7E842] group-hover:text-[#161D36] transition-colors duration-300">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold uppercase tracking-widest text-[#F7E842] text-sm">Dove Siamo</h4>
                    <p className="text-gray-300 font-light mt-1 text-lg leading-relaxed">ForMe Laterza<br/>Via Industrie Conte<br/>74014 Laterza (Puglia)</p>   
                  </div>
                </div>

                <div className="flex items-center text-white space-x-6 group">  
                  <div className="w-14 h-14 bg-[#101529] text-[#F7E842] flex items-center justify-center rounded-full group-hover:bg-[#F7E842] group-hover:text-[#161D36] transition-colors duration-300">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold uppercase tracking-widest text-[#F7E842] text-sm">Chiamaci</h4>
                    <p className="text-gray-300 font-light mt-1 text-lg">+39 333 123 4567</p>
                  </div>
                </div>

                <div className="flex items-center text-white space-x-6 group">  
                  <div className="w-14 h-14 bg-[#101529] text-[#F7E842] flex items-center justify-center rounded-full group-hover:bg-[#F7E842] group-hover:text-[#161D36] transition-colors duration-300">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold uppercase tracking-widest text-[#F7E842] text-sm">Scrivici</h4>
                    <p className="text-gray-300 font-light mt-1 text-lg">info@formefitness.it</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Visual / Form (Interactive Map) */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:w-1/2 flex pt-8 lg:pt-0"
            >
              <div className="w-full h-full min-h-[400px] bg-[#101529] rounded-[48px] border border-[#F7E842]/20 relative overflow-hidden flex items-center justify-center group shadow-[0_0_40px_rgba(59,130,246,0.1)]">
                
                {/* Google Maps Iframe integrato con stile in tema tramite filtri CSS */}
                <iframe 
                  src="https://maps.google.com/maps?q=Via%20Industrie%20Conte%20Laterza&t=&z=18&ie=UTF8&iwloc=hidden&output=embed" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0, filter: 'grayscale(100%) invert(95%) contrast(85%) hue-rotate(200deg)' }} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 z-0 opacity-80 pointer-events-none scale-[1.05]"
                ></iframe>
                
                <div className="absolute inset-0 bg-[#161D36]/10 pointer-events-none z-0"></div>

                {/* Link invisibile gigante che copre la mappa per bloccare zoom e trascinamento */}
                <a 
                  href="https://maps.app.goo.gl/3q4aM6FwRxKzLg7M8" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="absolute inset-0 z-10 flex flex-col items-center justify-center cursor-pointer transition-colors duration-300 hover:bg-[#161D36]/20 group/map"
                  aria-label="Apri su Google Maps"
                >
                  <div className="relative transform group-hover/map:-translate-y-2 transition-transform duration-300">
                    <div className="relative w-16 h-16 bg-[#161D36] border-[4px] border-[#3b82f6] flex items-center justify-center shadow-[0_0_25px_rgba(59,130,246,0.6)] drop-shadow-xl z-20 rounded-full">
                      <MapPin size={32} className="text-[#3b82f6] fill-[#161D36]" />
                    </div>
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-6 h-4 bg-black/60 blur-[4px] rounded-[100%] z-10"></div>
                  </div>
                </a>

              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0B0F24] py-10 w-full border-t border-[#F7E842]/10 relative z-20">
        <div className="container mx-auto px-6 max-w-7xl flex flex-col md:flex-row justify-between items-center text-center md:text-left">

          <div className="mb-6 md:mb-0">
            <h2 className="text-[#F7E842] text-2xl font-black italic tracking-tighter">4<span className="text-white">ME</span></h2>
            <p className="text-gray-500 text-xs mt-2 uppercase tracking-widest">Power Fitness Experience</p>
          </div>

          <div className="flex space-x-6 mb-6 md:mb-0 text-gray-400">
            <a href="#" className="hover:text-[#F7E842] transition-colors">     
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>     
            </a>
            <a href="#" className="hover:text-[#F7E842] transition-colors">     
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
          </div>

          <p className="text-gray-500 text-xs tracking-wider">
            &copy; 2026 ForMe Laterza. Tutti i diritti riservati. <br className="hidden md:block" /> Coded with <span className="text-[#F7E842]"></span>.
          </p>

        </div>
      </footer>
    </>
  );
};
