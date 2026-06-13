import { motion } from 'framer-motion';
import { Timer, ArrowRight } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { usePromotions } from '../hooks/usePromotions';
import { EditButton } from './admin/EditButton';
import { useNavigate } from 'react-router-dom';

export const OffersBoardSection = () => {
  const { promotions, loading } = usePromotions();
  const navigate = useNavigate();

  const activePromotions = promotions.filter(p => p.is_active);

  return (
    <section id="offerte" className="relative overflow-hidden bg-[#0A0E27] py-28 md:py-40 z-10">
      
      {/* Sfondo Elegante (Sfumature morbide invece di scritte giganti) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#F7E842]/5 blur-[120px]" />
        <div className="absolute top-1/2 -right-40 h-[600px] w-[600px] rounded-full bg-cyan-400/5 blur-[150px]" />
      </div>

      <div className="relative mx-auto max-w-[1300px] px-6">
        
        {/* Intestazione Premium e Pulita */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-20 text-center flex flex-col items-center"
        >
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm px-5 py-2">
            <Timer size={16} className="text-[#F7E842]" />
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-white/90">Bacheca Offerte</span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase leading-[0.9] tracking-tighter text-white">
            Promozioni <br className="md:hidden" />
            <span className="inline-block text-transparent bg-gradient-to-r from-[#F7E842] to-yellow-500 bg-clip-text">
              In Corso
            </span>
          </h2>
          <p className="mt-6 max-w-xl text-lg md:text-xl text-slate-400 font-light">
            Vivi l'esperienza ForMe con i nostri pacchetti limitati. Trova il piano perfetto per i tuoi obiettivi.
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center text-[#F7E842] font-bold text-2xl uppercase tracking-widest py-20">
            Caricamento Offerte...
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            {activePromotions.map((offer, idx) => {
              const Icon = LucideIcons[offer.icon_name] || LucideIcons.Flame;
              
              return (
                <motion.article
                  key={offer.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: idx * 0.15 }}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] bg-[#101530] border border-white/5 shadow-xl transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:border-white/10"
                >
                  <EditButton 
                    onClick={() => navigate('/gestore-forme-2026')} 
                    className="top-2 right-2 scale-75 hover:scale-90" 
                  />

                  {/* Bagliore Di Fondo (Morbido e non esagerato) */}
                  <div 
                    className="absolute inset-0 transition-opacity duration-700 opacity-0 group-hover:opacity-100 pointer-events-none"
                    style={{ background: `radial-gradient(circle at top right, ${offer.glow} 0%, transparent 70%)` }}
                  />
                  
                  {/* Linea di accento superiore */}
                  <div className={`h-1.5 w-full bg-gradient-to-r ${offer.accent}`} />

                  <div className="p-8 md:p-10 flex-grow flex flex-col relative z-10">
                    <div className="flex justify-between items-center mb-8">
                      <span className="inline-flex items-center rounded-full bg-white/5 border border-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-white">
                        {offer.tag}
                      </span>
                      <div className="rounded-xl bg-white/5 p-2.5 text-white transition-transform duration-500 group-hover:scale-110 group-hover:text-[#F7E842]">
                        <Icon size={20} />
                      </div>
                    </div>

                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase leading-[0.95] tracking-tight text-white mb-3">
                      {offer.title}
                    </h3>
                    
                    <p className={`text-sm font-bold uppercase tracking-[0.15em] text-transparent bg-gradient-to-r ${offer.accent} bg-clip-text mb-6`}>
                      {offer.subtitle}
                    </p>

                    <p className="text-base text-slate-400 font-light leading-relaxed flex-grow mb-8">
                      {offer.detail}
                    </p>

                    {/* Prezzo e Scadenza */}
                    <div className="border-t border-white/5 pt-6 mt-auto">
                      <div className="flex items-end justify-between mb-6">
                        <div>
                          <p className="text-sm font-semibold uppercase tracking-wider text-slate-500 line-through mb-0.5 min-h-[20px]">
                            {offer.old_price}
                          </p>
                          <p className="text-4xl md:text-5xl font-black tracking-tighter text-white">
                            {offer.price}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        {offer.valid_to && (
                          <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                            <Timer size={14} className="text-[#F7E842]" /> 
                            Scade: {offer.valid_to}
                          </span>
                        )}
                        
                        <a
                          href="#contatti"
                          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-300 hover:bg-[#F7E842] hover:text-[#101530] ml-auto"
                        >
                          <ArrowRight size={18} />
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
