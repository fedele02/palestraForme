import { motion } from 'framer-motion';
import { MapPin, Phone, Mail } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';

export const ContactFooter = () => {
  const { settings } = useSiteSettings();

  const phone = settings.phone || '+39 333 123 4567';
  const email = settings.email || 'info@formefitness.it';
  const address = settings.address || 'ForMe Laterza<br/>Via Industrie Conte<br/>74014 Laterza (Puglia)';
  const googleMapsUrl = settings.google_maps_url || 'https://maps.app.goo.gl/3q4aM6FwRxKzLg7M8';

  return (
    <section id="contatti" className="py-32 bg-[#161D36] relative w-full border-t border-[#101529]">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-16 justify-between">

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2"
          >
            <h2 className="text-4xl sm:text-5xl md:text-5xl lg:text-7xl font-black text-white uppercase tracking-tighter mb-8 cursor-default break-words md:break-normal">
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
                  <p className="text-gray-300 font-light mt-1 text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: address }} />
                </div>
              </div>

              <div className="flex items-center text-white space-x-6 group">
                <div className="w-14 h-14 bg-[#101529] text-[#F7E842] flex items-center justify-center rounded-full group-hover:bg-[#F7E842] group-hover:text-[#161D36] transition-colors duration-300">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-bold uppercase tracking-widest text-[#F7E842] text-sm">Chiamaci</h4>
                  <p className="text-gray-300 font-light mt-1 text-lg">{phone}</p>
                </div>
              </div>

              <div className="flex items-center text-white space-x-6 group">
                <div className="w-14 h-14 bg-[#101529] text-[#F7E842] flex items-center justify-center rounded-full group-hover:bg-[#F7E842] group-hover:text-[#161D36] transition-colors duration-300">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-bold uppercase tracking-widest text-[#F7E842] text-sm">Scrivici</h4>
                  <p className="text-gray-300 font-light mt-1 text-lg">{email}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:w-1/2 flex pt-8 lg:pt-0"
          >
            <div className="w-full h-full min-h-[400px] bg-[#101529] rounded-[48px] border border-[#F7E842]/20 relative overflow-hidden flex items-center justify-center group shadow-[0_0_40px_rgba(59,130,246,0.1)]">
              <iframe
                src="https://maps.google.com/maps?q=Via%20Industrie%20Conte%20Laterza&t=&z=18&ie=UTF8&iwloc=hidden&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'grayscale(100%) invert(95%) contrast(85%) hue-rotate(200deg)' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 z-0 opacity-80 pointer-events-none scale-[1.05]"
              />
              <div className="absolute inset-0 bg-[#161D36]/10 pointer-events-none z-0" />
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 z-10 flex flex-col items-center justify-center cursor-pointer transition-colors duration-300 hover:bg-[#161D36]/20 group/map"
                aria-label="Apri su Google Maps"
              >
                <div className="relative transform group-hover/map:-translate-y-2 transition-transform duration-300">
                  <div className="relative w-16 h-16 bg-[#161D36] border-[4px] border-[#3b82f6] flex items-center justify-center shadow-[0_0_25px_rgba(59,130,246,0.6)] drop-shadow-xl z-20 rounded-full">
                    <MapPin size={32} className="text-[#3b82f6] fill-[#161D36]" />
                  </div>
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-6 h-4 bg-black/60 blur-[4px] rounded-[100%] z-10" />
                </div>
              </a>
            </div>
          </motion.div>

        </div>

        <div className="mt-16 pt-6 border-t border-white/5">
          <p className="text-gray-600 text-xs tracking-wider text-center">
            &copy; {new Date().getFullYear()} ForMe Laterza. Tutti i diritti riservati.
          </p>
        </div>

      </div>
    </section>
  );
};
