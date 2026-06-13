import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { EditButton } from './admin/EditButton';

export const OffersBoardSection = ({ promotions }) => {
  const navigate = useNavigate();
  const activePromotions = promotions.filter(p => p.is_active);

  return (
    <section id="offerte" className="relative bg-[#0B0F24] py-24 sm:py-28 md:py-40 z-10 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#F7E842]/5 blur-[120px]" />
        <div className="absolute top-1/2 -right-40 h-[600px] w-[600px] rounded-full bg-cyan-400/5 blur-[150px]" />
      </div>

      <div className="relative mx-auto max-w-[1300px] px-5 sm:px-6">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="mb-14 md:mb-20 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.9] text-white">
            Le Nostre<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F7E842] to-yellow-600">Promozioni</span>
          </h2>
          <p className="text-gray-400 font-light text-base sm:text-lg max-w-sm md:text-right leading-relaxed">
            Offerte a tempo limitato.<br className="hidden sm:block" /> Approfitta prima che scadano.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-5 sm:gap-6">
          {activePromotions.map((offer, idx) => (
            <motion.a
              href="#contatti"
              key={offer.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: (idx % 3) * 0.1 }}
              className="group relative rounded-3xl overflow-hidden border border-white/10 bg-[#111827] hover:border-[#F7E842]/30 hover:shadow-[0_0_60px_rgba(247,232,66,0.08)] transition-all duration-500 hover:-translate-y-2 cursor-pointer flex flex-col w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] sm:max-w-[440px]"
            >
              <EditButton onClick={(e) => { e.preventDefault(); navigate('/gestore-forme-2026'); }} className="top-4 right-4 scale-75" />

              <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-[#F7E842]/5 blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Fascia prezzo gialla */}
              <div className="relative bg-[#F7E842] px-6 sm:px-8 pt-7 sm:pt-8 pb-5 sm:pb-6">
                <p className="text-[#161D36]/60 text-xs font-bold uppercase tracking-[0.25em] mb-1">{offer.tag}</p>
                <div className="flex items-end gap-3 flex-wrap">
                  <p className="text-[#161D36] text-5xl sm:text-6xl font-black tracking-tighter leading-none">
                    {offer.price}
                  </p>
                  {offer.old_price && (
                    <p className="text-[#161D36]/40 text-base sm:text-lg font-bold line-through mb-1">{offer.old_price}</p>
                  )}
                </div>
              </div>

              {/* Corpo */}
              <div className="relative z-10 flex flex-col flex-grow p-6 sm:p-8">
                <h3 className="text-2xl lg:text-3xl font-black uppercase tracking-tight text-white leading-[1.05] mb-2">
                  {offer.title}
                </h3>
                {offer.subtitle && (
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F7E842] mb-4">
                    {offer.subtitle}
                  </p>
                )}
                {offer.detail && (
                  <p className="text-gray-400 font-light text-sm leading-relaxed flex-grow">
                    {offer.detail}
                  </p>
                )}
                {offer.valid_to && (
                  <p className="mt-6 text-xs font-light text-gray-600 tracking-wide">
                    Valida fino al <span className="text-gray-400 font-bold">{offer.valid_to}</span>
                  </p>
                )}
              </div>
            </motion.a>
          ))}
        </div>

      </div>
    </section>
  );
};
