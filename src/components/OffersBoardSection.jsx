import { useRef } from 'react';
import { Clock, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { EditButton } from './admin/EditButton';
import { ScrollPulse } from './ScrollPulse';

// "29€" -> 29, "149,90 €" -> 149.9; null se non è un prezzo in euro
const euro = (value) => {
  const m = /^\s*(\d+(?:[.,]\d{1,2})?)\s*€\s*$/.exec(value || '');
  return m ? Number(m[1].replace(',', '.')) : null;
};

const formatEuro = (n) => `${Number.isInteger(n) ? n : n.toFixed(2).replace('.', ',')}€`;

// Ogni offerta è un tagliando: fascia gialla con il prezzo, linea da staccare, dettagli sotto
const OfferTicket = ({ offer, info }) => {
  const price = euro(offer.price);
  const oldPrice = euro(offer.old_price);
  const saving = price != null && oldPrice != null && oldPrice > price ? oldPrice - price : null;

  return (
    <article className="flex flex-col overflow-hidden rounded-[4px] bg-ink-raised transition-transform duration-300 ease-[var(--ease-out-strong)] md:hover:-translate-y-1">
      <div className="bg-sun px-5 pt-5 pb-6 text-ink sm:px-6">
        <div className="flex min-h-7 items-start justify-between gap-3">
          {offer.tag && (
            <p className="text-[0.8125rem] font-bold uppercase tracking-[0.08em] text-ink/70">{offer.tag}</p>
          )}
          {saving != null && (
            <p className="shrink-0 rounded-[4px] bg-ink px-2.5 py-1.5 text-[0.8125rem] font-bold leading-none text-sun">
              Risparmi <span className="tabular">{formatEuro(saving)}</span>
            </p>
          )}
        </div>
        <p className="mt-4 flex flex-wrap items-end gap-x-3 gap-y-1">
          <span className="display tabular text-[clamp(4.5rem,24vw,6rem)] leading-[0.82] md:text-[5.5rem]">
            {offer.price}
          </span>
          {offer.old_price && (
            <span className={`pb-1 text-lg font-semibold text-ink/55 ${oldPrice != null ? 'line-through decoration-2' : ''}`}>
              {offer.old_price}
            </span>
          )}
        </p>
      </div>

      {/* Linea da staccare, con le due mezzelune ai lati */}
      <div aria-hidden="true" className="relative h-0">
        <span className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-ink-deep" />
        <span className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-ink-deep" />
        <span className="absolute inset-x-5 top-0 border-t-2 border-dashed border-ink/25" />
      </div>

      <div className="flex flex-1 flex-col px-5 pt-6 pb-5 sm:px-6 sm:pb-6">
        <h3 className="text-[1.375rem] font-bold leading-snug text-paper">{offer.title}</h3>
        {offer.subtitle && <p className="mt-1 text-[0.9375rem] font-semibold text-sun">{offer.subtitle}</p>}
        {offer.detail && <p className="mt-3 text-base leading-relaxed text-mute">{offer.detail}</p>}

        <div className="mt-auto flex items-center justify-between gap-3 pt-6">
          {offer.valid_to ? (
            <p className="flex items-center gap-2 text-sm text-mute">
              <Clock size={16} strokeWidth={1.75} className="shrink-0 text-sun" aria-hidden="true" />
              <span>
                Fino al <span className="tabular font-semibold text-paper">{offer.valid_to}</span>
              </span>
            </p>
          ) : <span />}
          <a href={info.phoneHref} className="btn btn-sun min-h-11 shrink-0 px-4 text-sm">
            <Phone size={16} strokeWidth={2} aria-hidden="true" />
            Chiama
          </a>
        </div>
      </div>
    </article>
  );
};

export const OffersBoardSection = ({ promotions, info }) => {
  const navigate = useNavigate();
  const activePromotions = promotions.filter((p) => p.is_active);
  const single = activePromotions.length === 1;
  const sectionRef = useRef(null);

  return (
    <section ref={sectionRef} id="offerte" aria-labelledby="offerte-title" className="relative bg-ink-deep py-20 md:py-28 lg:py-32">
      <ScrollPulse targetRef={sectionRef} variant="double" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <EditButton onClick={() => navigate('/gestore-forme-2026')} className="right-5 top-0 sm:right-8" />

        <header className="mb-10 max-w-2xl md:mb-14">
          <h2 id="offerte-title" className="display text-[clamp(3.25rem,16vw,4.5rem)] text-paper md:text-[5.5rem]">
            Offerte
          </h2>
          <p className="mt-5 max-w-[44ch] text-[1.0625rem] leading-relaxed text-mute md:text-lg">
            A tempo limitato. Per aderire passa in palestra oppure chiamaci.
          </p>
        </header>

        <div className={`grid gap-5 md:gap-6 ${single ? 'max-w-md' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
          {activePromotions.map((offer) => (
            <OfferTicket key={offer.id} offer={offer} info={info} />
          ))}
        </div>
      </div>
    </section>
  );
};
