import { MapPin, Phone } from 'lucide-react';
import { useScrollZones } from '../hooks/useScrollZones';

// Barra in basso solo su telefono: compare dopo la prima schermata,
// sparisce quando i contatti sono già visibili. Il contatto resta a un tocco, nella zona del pollice.
export const MobileCallBar = ({ info }) => {
  const { pastHero, atContacts } = useScrollZones();
  const visible = pastHero && !atContacts;

  return (
    <div
      aria-hidden={!visible}
      inert={!visible}
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-line bg-ink px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] transition-transform duration-300 ease-[var(--ease-out-strong)] md:hidden ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="flex gap-2">
        <a href={info.phoneHref} className="btn btn-sun min-h-12 flex-1">
          <Phone size={18} strokeWidth={2} aria-hidden="true" />
          Chiama
        </a>
        <a href={info.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost min-h-12 flex-1">
          <MapPin size={18} strokeWidth={1.75} aria-hidden="true" />
          Indicazioni
        </a>
      </div>
    </div>
  );
};
