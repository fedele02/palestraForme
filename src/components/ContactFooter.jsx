import { ArrowUpRight, Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { useRef } from 'react';
import { Logo } from './Logo';
import { ScrollPulse } from './ScrollPulse';

const Row = ({ icon: Icon, label, children }) => (
  <div className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-x-4 border-t border-line py-6">
    <Icon size={20} strokeWidth={1.75} className="mt-0.5 text-sun" aria-hidden="true" />
    <div>
      <dt className="text-sm font-semibold text-mute">{label}</dt>
      <dd className="mt-1.5">{children}</dd>
    </div>
  </div>
);

export const ContactFooter = ({ info }) => {
  const socials = [
    info.instagramUrl && { name: 'Instagram', href: info.instagramUrl },
    info.facebookUrl && { name: 'Facebook', href: info.facebookUrl },
  ].filter(Boolean);
  const sectionRef = useRef(null);

  return (
    <footer ref={sectionRef} id="contatti" aria-labelledby="contatti-title" className="relative bg-ink-deep pt-20 md:pt-28 lg:pt-32">
      <ScrollPulse targetRef={sectionRef} variant="rise" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <h2 id="contatti-title" className="display text-[clamp(3.25rem,16vw,4.5rem)] text-paper md:text-[5.5rem]">
              Vieni a<br />trovarci
            </h2>
            <p className="mt-5 max-w-[40ch] text-[1.0625rem] leading-relaxed text-mute md:text-lg">
              Passa in palestra o chiamaci: ti raccontiamo corsi, orari e abbonamenti.
            </p>

            <dl className="mt-10 border-b border-line">
              <Row icon={MapPin} label="Indirizzo">
                <address className="text-lg not-italic leading-snug text-paper">
                  {info.addressLines.map((line) => (
                    <span key={line} className="block">{line}</span>
                  ))}
                </address>
              </Row>
              {info.openingLines.length > 0 && (
                <Row icon={Clock} label="Orari">
                  <p className="text-lg leading-snug text-paper">
                    {info.openingLines.map((line) => (
                      <span key={line} className="block">{line}</span>
                    ))}
                  </p>
                </Row>
              )}
              <Row icon={Phone} label="Telefono">
                <a href={info.phoneHref} className="link-underline tabular text-lg font-semibold text-paper">
                  {info.phone}
                </a>
              </Row>
              {info.whatsapp && (
                <Row icon={MessageCircle} label="WhatsApp">
                  <a href={info.whatsappHref} target="_blank" rel="noopener noreferrer" className="link-underline tabular text-lg font-semibold text-paper">
                    Scrivici su WhatsApp
                  </a>
                </Row>
              )}
              <Row icon={Mail} label="Email">
                <a href={`mailto:${info.email}`} className="link-underline break-words text-lg font-semibold text-paper">
                  {info.email}
                </a>
              </Row>
            </dl>
          </div>

          <div className="lg:col-span-7 lg:pt-4">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[4px] bg-ink-raised lg:aspect-auto lg:h-full lg:min-h-[32rem]">
              <iframe
                title={`Mappa: ForMe, ${info.addressLines.join(', ')}`}
                src={info.mapsEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                tabIndex={-1}
                className="pointer-events-none absolute inset-x-0 -top-24 h-[calc(100%+6rem)] w-full border-0 [filter:grayscale(1)_invert(0.9)_contrast(0.9)_brightness(0.95)]"
              />
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-ink/40 mix-blend-multiply" />
              <a
                href={info.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sun absolute bottom-4 left-4 min-h-11 px-4 text-sm shadow-[0_6px_20px_rgb(10_14_30/0.45)]"
              >
                Indicazioni
                <ArrowUpRight size={16} strokeWidth={2} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-8 border-t border-line py-10 pb-[calc(2.5rem+env(safe-area-inset-bottom))] md:mt-28 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Logo className="h-12 w-auto" />
            <div>
              <p className="display text-xl normal-case leading-none text-paper">ForMe</p>
              <p className="mt-1.5 text-sm text-mute">Power Fitness Experience · #4MEdable</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 text-sm text-mute md:items-end">
            {socials.length > 0 && (
              <ul className="flex gap-6">
                {socials.map((s) => (
                  <li key={s.name}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center gap-1 font-semibold text-paper"
                    >
                      {s.name}
                      <ArrowUpRight size={14} strokeWidth={2} aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
            <p>&copy; {new Date().getFullYear()} ForMe Laterza. Tutti i diritti riservati.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
