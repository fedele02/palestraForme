import { useId } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// L'omino dell'assistente: un piccolo coach dalla testa grande (stile "chibi"), con la fascetta del battito
// e la maglietta blu ForMe con il logo 4ME giallo, come il logo vero.
// Sbatte gli occhi e saluta con la mano per far capire che è "vivo" e che gli si può parlare.
// wave: numero che cambia ogni volta che deve salutare (0 = fermo). Con riduzione movimento resta statico.
export const ChatMascot = ({ size = 64, wave = 0, idle = true, className = '' }) => {
  const reduceMotion = useReducedMotion();
  const clipId = `mascot-head-${useId().replace(/:/g, '')}`;
  const animate = idle && !reduceMotion;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={`overflow-visible ${className}`}
    >
      {/* Braccia (dietro la maglietta): la sinistra a riposo, la destra saluta ruotando dalla spalla */}
      <path d="M21 51c-3 2.5-4.5 5.5-4.5 9" fill="none" stroke="var(--color-sun)" strokeWidth="5" strokeLinecap="round" />
      <motion.g
        key={wave}
        style={{ transformBox: 'view-box', transformOrigin: '43px 50px' }}
        initial={{ rotate: 0 }}
        animate={animate && wave ? { rotate: [0, -26, 8, -26, 8, 0] } : { rotate: 0 }}
        transition={{ duration: 1.4, ease: 'easeInOut' }}
      >
        <path d="M43 50c4-2 6.5-5.5 7.5-10.5" fill="none" stroke="var(--color-sun)" strokeWidth="5" strokeLinecap="round" />
        <circle cx="51" cy="37.5" r="3.8" fill="var(--color-sun)" />
      </motion.g>

      {/* Maglietta ForMe: blu con bordo e logo gialli */}
      <path
        d="M19.5 64v-8.5c0-7 5.5-11.5 12.5-11.5s12.5 4.5 12.5 11.5V64"
        fill="#26305C"
        stroke="var(--color-sun)"
        strokeWidth="1.5"
      />
      <path d="M28 44.8q4 3 8 0" fill="none" stroke="var(--color-sun)" strokeWidth="1.5" strokeLinecap="round" />
      <text
        x="32"
        y="58.5"
        textAnchor="middle"
        fill="var(--color-sun)"
        style={{ fontSize: 8, fontWeight: 800, fontStretch: '62%', letterSpacing: '0.03em' }}
      >
        4ME
      </text>

      {/* Testa, con un leggero dondolio */}
      <motion.g
        animate={animate ? { y: [0, -1.2, 0] } : { y: 0 }}
        transition={animate ? { duration: 2.6, repeat: Infinity, ease: 'easeInOut' } : undefined}
      >
        <circle cx="32" cy="24" r="18" fill="var(--color-sun)" />
        {/* Ciuffo che esce dalla fascetta */}
        <path d="M29 7.5c1-2.5 3.5-3.5 5.5-2.5-1.5.5-2 1.5-2 2.5" fill="var(--color-sun)" />
        {/* Fascetta con il battito */}
        <clipPath id={clipId}>
          <circle cx="32" cy="24" r="18" />
        </clipPath>
        <g clipPath={`url(#${clipId})`}>
          <rect x="12" y="10" width="40" height="6.5" fill="var(--color-ink)" />
          <path d="M12 13.3h12.5l1.5-2.4 2.4 4.8 2-4.4 1.5 2h20" fill="none" stroke="var(--color-sun)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        {/* Guance */}
        <ellipse cx="21.5" cy="30" rx="3" ry="2" fill="#F08A6C" opacity="0.55" />
        <ellipse cx="42.5" cy="30" rx="3" ry="2" fill="#F08A6C" opacity="0.55" />
        {/* Occhi grandi con riflesso, che sbattono */}
        <motion.g
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
          animate={animate ? { scaleY: [1, 1, 0.1, 1] } : { scaleY: 1 }}
          transition={animate ? { duration: 4.2, times: [0, 0.92, 0.96, 1], repeat: Infinity } : undefined}
        >
          <ellipse cx="25.5" cy="24.5" rx="3" ry="3.6" fill="var(--color-ink)" />
          <ellipse cx="38.5" cy="24.5" rx="3" ry="3.6" fill="var(--color-ink)" />
          <circle cx="26.6" cy="23.1" r="1.1" fill="#fff" />
          <circle cx="39.6" cy="23.1" r="1.1" fill="#fff" />
        </motion.g>
        {/* Sorriso aperto */}
        <path d="M28.5 30.5h7a3.5 3.5 0 0 1-7 0z" fill="var(--color-ink)" />
        <ellipse cx="32" cy="32.9" rx="1.9" ry="1.05" fill="#F08A6C" />
      </motion.g>
    </svg>
  );
};
