import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCourses } from '../hooks/useCourses';
import { useFamilies } from '../hooks/useFamilies';
import { EditButton } from './admin/EditButton';
import { ScrollPulse } from './ScrollPulse';
import { courseImage, coursePlaceholder, groupByFamily, hasSchedule, prepareCourses } from '../lib/courses';

const NewBadge = () => (
  <span className="inline-flex shrink-0 items-center rounded-[4px] bg-sun px-2 py-1 text-[0.6875rem] font-bold uppercase leading-none tracking-[0.06em] text-ink">
    Nuovo
  </span>
);

// Ritmo della griglia su tablet/desktop: una larga, due affiancate, una larga...
// Se l'ultimo corso resterebbe da solo in una riga, diventa largo.
const isWide = (idx, total) => idx % 3 === 0 || (idx === total - 1 && idx % 3 === 1);

// La foto compare quando è davvero pronta (non quando la scheda entra nello schermo):
// niente riquadri vuoti, niente comparse di colpo. Stato scritto sul DOM, senza re-render.
const markLoaded = (img) => {
  if (img) img.dataset.loaded = 'true';
};
const markIfCached = (img) => {
  if (img?.complete && img.naturalWidth > 0) markLoaded(img);
};

const CourseCard = ({ course, idx, total }) => {
  const reduceMotion = useReducedMotion();
  const frameRef = useRef(null);
  // Profondità: la foto scorre un filo più lenta della pagina (solo se il movimento è consentito)
  const { scrollYProgress } = useScroll({ target: frameRef, offset: ['start end', 'end start'] });
  const photoY = useTransform(scrollYProgress, [0, 1], reduceMotion ? ['0%', '0%'] : ['-6%', '6%']);
  const wide = isWide(idx, total);
  const lead = idx === 0;
  const longTitle = course.title.length > 18;

  // Su telefono il primo corso di ogni famiglia è più alto, gli altri più bassi: ritmo e meno scroll
  const mobileAspect = lead ? 'aspect-[5/4]' : 'aspect-[16/10]';
  const desktopAspect = wide ? 'md:aspect-[21/9]' : 'md:aspect-[4/3]';

  return (
    <article className={wide ? 'md:col-span-2' : ''}>
      <div
        ref={frameRef}
        className={`group relative -mx-5 overflow-hidden bg-ink-raised sm:mx-0 sm:rounded-[4px] ${mobileAspect} ${desktopAspect}`}
      >
        {coursePlaceholder(course) && (
          <div
            aria-hidden="true"
            className="absolute inset-0 scale-110 bg-cover bg-center [filter:grayscale(1)_contrast(1.08)_brightness(0.7)_blur(14px)]"
            style={{ backgroundImage: `url(${coursePlaceholder(course)})` }}
          />
        )}
        <motion.div className="absolute -inset-y-[8%] inset-x-0" style={{ y: photoY }}>
        <div className="absolute inset-0 transition-transform duration-700 ease-[var(--ease-out-strong)] group-hover:scale-[1.03]">
          <img
            ref={markIfCached}
            onLoad={(e) => markLoaded(e.currentTarget)}
            src={courseImage(course, wide ? 1800 : 1100)}
            srcSet={`${courseImage(course, 700)} 700w, ${courseImage(course, wide ? 1800 : 1100)} ${wide ? 1800 : 1100}w`}
            sizes={wide ? '(min-width: 768px) 90vw, 100vw' : '(min-width: 768px) 45vw, 100vw'}
            alt=""
            loading="lazy"
            decoding="async"
            className="course-photo absolute inset-0 h-full w-full object-cover"
          />
        </div>
        </motion.div>
        {/* Tinta blu del brand su tutte le foto, così stock e foto caricate parlano la stessa lingua */}
        <div aria-hidden="true" className="absolute inset-0 bg-ink/45 mix-blend-multiply" />
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_top,rgb(16_22_43/0.92)_0%,rgb(16_22_43/0.4)_40%,transparent_68%)]" />
        {course.is_new && (
          <div className="absolute left-5 top-4 sm:left-4 md:left-6 md:top-6">
            <NewBadge />
          </div>
        )}
        <h4
          className={`display absolute inset-x-5 bottom-4 text-paper sm:inset-x-4 md:inset-x-6 md:bottom-6 ${
            longTitle ? 'text-[clamp(2.25rem,10.5vw,3.25rem)]' : 'text-[clamp(2.75rem,13vw,3.75rem)]'
          } ${wide ? 'md:text-[5rem] lg:text-[6rem]' : 'md:text-[3.25rem] lg:text-[4rem]'}`}
        >
          {course.title}
        </h4>
      </div>

      <div className={`mt-5 grid gap-4 ${wide ? 'md:grid-cols-12 md:gap-8' : ''}`}>
        <p className={`max-w-[60ch] text-base leading-relaxed text-mute ${wide ? 'md:col-span-7 md:text-[1.0625rem]' : ''}`}>
          {course.description}
        </p>
        {hasSchedule(course.schedule) && (
          <p className={`flex items-center gap-2.5 text-[0.9375rem] font-semibold text-paper ${wide ? 'md:col-span-5 md:border-l md:border-line md:pl-8' : ''}`}>
            <Clock size={18} strokeWidth={1.75} className="shrink-0 text-sun" aria-hidden="true" />
            <span className="tabular">{course.schedule}</span>
          </p>
        )}
      </div>
    </article>
  );
};

// Linea della famiglia: un filo grigio su cui una linea gialla si traccia da sinistra scorrendo
const FamilyRule = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 92%', 'start 55%'] });
  return (
    <div ref={ref} aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-line">
      <motion.div className="h-[2px] origin-left bg-sun" style={{ scaleX: scrollYProgress }} />
    </div>
  );
};

const FamilyBlock = ({ group }) => (
  <section id={`famiglia-${group.id}`} aria-labelledby={`famiglia-${group.id}-title`} className="scroll-mt-20">
    <div className="relative mb-8 flex items-baseline justify-between gap-4 pt-6 md:mb-10">
      <FamilyRule />
      <h3 id={`famiglia-${group.id}-title`} className="display text-[2.25rem] text-sun md:text-[3rem]">
        {group.label}
      </h3>
      <p className="shrink-0 text-sm font-semibold text-mute">
        {group.courses.length} {group.courses.length === 1 ? 'corso' : 'corsi'}
      </p>
    </div>
    <div className="grid gap-x-6 gap-y-12 md:grid-cols-2 md:gap-y-16 lg:gap-x-8">
      {group.courses.map((course, idx) => (
        <CourseCard key={course.id} course={course} idx={idx} total={group.courses.length} />
      ))}
    </div>
  </section>
);

const CoursesSkeleton = () => (
  <div aria-hidden="true" className="grid gap-12 md:grid-cols-2">
    {[0, 1].map((i) => (
      <div key={i} className={i === 0 ? 'md:col-span-2' : ''}>
        <div className="-mx-5 aspect-[5/4] animate-pulse bg-white/[0.05] sm:mx-0 sm:rounded-[4px] md:aspect-[21/9]" />
        <div className="mt-5 h-4 w-3/4 animate-pulse rounded-[4px] bg-white/[0.06]" />
        <div className="mt-3 h-4 w-1/2 animate-pulse rounded-[4px] bg-white/[0.06]" />
      </div>
    ))}
  </div>
);

export const CoursesSection = ({ info }) => {
  const { courses, loading: coursesLoading, error } = useCourses();
  const { families, loading: familiesLoading } = useFamilies();
  const loading = coursesLoading || familiesLoading;
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const reduceMotion = useReducedMotion();

  // Il titolo si accende mentre la linea del battito si completa (vedi ScrollPulse)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'start 30%'] });
  const titleOpacity = useTransform(scrollYProgress, [0.3, 1], [0.15, 1]);
  const titleY = useTransform(scrollYProgress, [0.3, 1], reduceMotion ? [0, 0] : [28, 0]);
  const activeCourses = prepareCourses(courses.filter((c) => c.is_active));
  const groups = groupByFamily(activeCourses, families);

  const jumpTo = (e, id) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  };

  return (
    <section ref={sectionRef} id="corsi" aria-labelledby="corsi-title" className="relative bg-ink-deep py-20 md:py-28 lg:py-32">
      <ScrollPulse targetRef={sectionRef} />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <EditButton onClick={() => navigate('/gestore-forme-2026')} className="right-5 top-0 sm:right-8" />

        <header className="mb-14 max-w-3xl md:mb-20">
          <motion.h2
            id="corsi-title"
            style={{ opacity: titleOpacity, y: titleY }}
            className="display text-[clamp(3.25rem,16vw,4.5rem)] text-paper md:text-[5.5rem]"
          >
            I corsi
          </motion.h2>
          {activeCourses.length > 0 && (
            <p className="mt-5 max-w-[46ch] text-[1.0625rem] leading-relaxed text-mute md:text-lg">
              {activeCourses.length} discipline sotto lo stesso tetto. Scegli la tua e vieni a provarla.
            </p>
          )}

          {groups.length > 1 && (
            <nav aria-label="Famiglie di corsi" className="mt-8">
              <ul className="flex flex-wrap gap-2">
                {groups.map((g) => (
                  <li key={g.id}>
                    <a
                      href={`#famiglia-${g.id}`}
                      onClick={(e) => jumpTo(e, `famiglia-${g.id}`)}
                      className="inline-flex min-h-11 items-center gap-2 rounded-[4px] border border-line px-3.5 text-[0.9375rem] font-semibold text-paper transition-colors duration-200 hover:border-paper/50 active:bg-white/[0.06]"
                    >
                      {g.label}
                      <span className="tabular text-mute">{g.courses.length}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </header>

        {loading && <CoursesSkeleton />}

        {!loading && error && (
          <p className="max-w-[48ch] border-t border-line pt-6 text-base leading-relaxed text-mute">
            Non riusciamo a caricare i corsi in questo momento. Chiamaci al{' '}
            <a href={info.phoneHref} className="link-underline font-semibold text-paper">{info.phone}</a>{' '}
            e ti diciamo tutto.
          </p>
        )}

        {!loading && !error && activeCourses.length === 0 && (
          <p className="border-t border-line pt-6 text-base text-mute">
            I corsi della nuova stagione saranno pubblicati a breve.
          </p>
        )}

        {!loading && !error && activeCourses.length > 0 && (
          <div className="space-y-20 md:space-y-28">
            {groups.map((group) => (
              <FamilyBlock key={group.id} group={group} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
