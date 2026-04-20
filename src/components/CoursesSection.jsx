import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

const courses = [
  {
    id: 1,
    title: 'Pilates',
    description: 'Rafforza corpo e mente migliorando postura, forza, flessibilità ed equilibrio. Un lavoro profondo e chirurgico per il tuo benessere interiore ed esteriore. L\'equilibrio perfetto tra tensione e rilascio.',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1200&auto=format&fit=crop',
    time: 'Mar & Gio - 18:30'
  },
  {
    id: 2,
    title: 'Spinning',
    description: 'Sdraiati sui pedali e sfida la tua resistenza cardiovascolare. Ritmo, musica ad alto volume ed energia pura per bruciare e superare i tuoi stessi limiti.',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop',
    time: 'Lun & Mer - 19:30'
  },
  {
    id: 3,
    title: 'HIIT',
    description: 'High Intensity Interval Training: allenamento esplosivo alternato a brevi recuperi. Massimizza la resistenza, la potenza muscolare e il metabolismo basale in tempi record.',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200&auto=format&fit=crop',
    time: 'Tutti i gg - 13:00'
  },
  {
    id: 4,
    title: 'Yoga',
    description: 'Connessione con il proprio respiro. Ritrova la centratura, allenta le tensioni quotidiane e dona al tuo corpo una mobilità fluida e senza sforzo.',
    image: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?q=80&w=1200&auto=format&fit=crop',
    time: 'Ven & Sab - 10:00'
  },
  {
    id: 5,
    title: 'Funzionale',
    description: 'Il corso essenziale. Migliora i movimenti che compi ogni giorno sviluppando forza globale, agilità, coordinazione e stabilità del core in un circuito dinamico.',
    image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1200&auto=format&fit=crop',
    time: 'Lun, Mer, Ven - 20:00'
  }
];

export const CoursesSection = () => {
  return (
    <section id="corsi" className="py-32 bg-[#0B0F24] relative z-10 w-full overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Intestazione */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24 relative"
        >
          <div className="flex items-center justify-center space-x-4 mb-4">
            <h2 className="text-[#F7E842] tracking-[0.4em] text-sm font-bold uppercase">Le nostre discipline</h2>
          </div>
          
          <h3 className="text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-[0.9]">
            Scopri il<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F7E842] to-yellow-600">Movimento</span>
          </h3>
          <p className="mt-8 text-gray-400 font-light max-w-2xl mx-auto text-lg md:text-xl">
            L'allenamento come pura espressione del corpo. Esplora le discipline progettate per superare i tuoi limiti fisici ed energetici.
          </p>
        </motion.div>

        {/* Cinematic Vertical Layout per i Corsi */}
        <div className="flex flex-col space-y-32 md:space-y-48">
          {courses.map((course, idx) => {
            const isEven = idx % 2 === 0;
            
            return (
              <div key={course.id} className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 lg:gap-24 items-center`}>
                
                {/* LATO IMMAGINE gigante */}
                <motion.div 
                  className="w-full md:w-1/2 h-[450px] md:h-[650px] lg:h-[750px] relative rounded-3xl overflow-hidden group shadow-2xl shadow-[#161D36]/50"
                  initial={{ opacity: 0, y: 100, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: '-150px' }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[3s] group-hover:scale-110"
                    style={{ backgroundImage: `url(${course.image})` }}
                  />
                  {/* Overlay per fonderla col sito scuro */}
                  <div className="absolute inset-0 bg-[#0B0F24]/30 group-hover:bg-[#0B0F24]/10 transition-colors duration-700 mix-blend-overlay" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F24] via-transparent to-transparent opacity-80" />
                </motion.div>

                {/* LATO TESTO: Typografia Estrema e dettagli */}
                <motion.div 
                  className="w-full md:w-1/2 flex flex-col justify-center"
                  initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-150px' }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <div className="mb-6">
                    <div className="h-1 w-16 bg-[#F7E842]"></div>
                  </div>
                  
                  <h4 className="text-6xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter mb-8 leading-[0.9]">
                    {course.title}
                  </h4>
                  
                  <p className="text-gray-300 font-light text-xl md:text-2xl leading-relaxed mb-12 max-w-xl">
                    {course.description}
                  </p>
                  
                  <div className="flex items-center">
                    <div className="inline-flex items-center space-x-4 text-[#161D36] bg-[#F7E842] px-8 py-4 rounded-full font-black uppercase tracking-widest shadow-[0_0_30px_rgba(247,232,66,0.25)] hover:shadow-[0_0_40px_rgba(247,232,66,0.5)] hover:scale-105 transition-all duration-300 cursor-default">
                      <Clock size={20} />
                      <span className="text-sm">{course.time}</span>
                    </div>
                  </div>
                </motion.div>
                
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};