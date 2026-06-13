# ForMe — Sito Palestra

## Cos'è il progetto
Sito web per la palestra **ForMe** di Laterza (Puglia). Single page con CMS integrato per la gestione autonoma dei contenuti da parte dell'admin della palestra.

Il sito viene deployato su **Vercel** (con dominio custom Aruba in arrivo). Nessun base path: gli asset partono da `/`.

## Stack tecnico
- **React 19** + **Vite 8** (SPA, no SSR)
- **Tailwind CSS v4** via `@tailwindcss/vite` — NON usare `tailwind.config.js`, la configurazione è in `src/index.css` con `@theme`
- **Framer Motion** per tutte le animazioni
- **Supabase** come database e autenticazione (Postgres + RLS)
- **Cloudinary** per upload e hosting immagini dei corsi
- **React Router v7** senza basename (deploy Vercel su root dominio)
- **lucide-react** per le icone — importare le singole icone (`import { Flame } from 'lucide-react'`), MAI `import * as` (gonfia il bundle)

## Colori brand (usali sempre)
- Blu scuro principale: `#161D36`
- Sfondo sezioni alternate: `#0B0F24`, `#0A0E27`, `#101530`
- Giallo brand: `#F7E842` (accenti, CTA, highlight)
- Testo secondario: `gray-400`, `slate-400`
- Selezione testo: `selection:bg-[#F7E842] selection:text-[#161D36]`

## Font
Montserrat (definito come `--font-sans` in `@theme`). Usare classi `font-black` per titoli, `font-bold` per label, `font-light` per testo descrittivo.

## Stile visivo
- Titoli **uppercase**, tracking tight (`tracking-tighter`, `tracking-widest`)
- Border radius generoso: `rounded-3xl`, `rounded-[2rem]`, `rounded-full`
- Ombre luminose gialle sui CTA: `shadow-[0_0_20px_rgba(247,232,66,0.3)]`
- Gradients testo con `bg-clip-text text-transparent bg-gradient-to-r`
- Animazioni: sempre con Framer Motion, `initial/animate` per mount, `whileInView` per scroll
- Effetti hover su card: `-translate-y-3`, transizioni `duration-500`

## Struttura pagine
- `/` → MainSite (Navbar + HeroSection + CoursesSection + OffersBoardSection + ContactFooter)
- `/gestore-forme-2026` → AdminPage (area protetta da login Supabase Auth)

## Sezioni principali
1. **HeroSection** — parallax, tagline "Non aspettare il cambiamento. Crealo.", CTA verso corsi e contatti
2. **CoursesSection** (`#corsi`) — lista corsi da Supabase, layout alternato sinistra/destra, immagini Cloudinary
3. **OffersBoardSection** (`#offerte`) — griglia promozioni da Supabase (`flex-wrap justify-center`, ultima riga centrata), card con fascia prezzo gialla. Riceve `promotions` come prop da MainSite (NON rifà la fetch)
4. **ContactFooter** (`#contatti`) — info contatti da Supabase site_settings, mappa Google integrata, copyright in fondo (NON c'è più un footer separato)

## Navigazione (Navbar)
- I link sono `<button>` con scroll programmático (`scrollIntoView` / `scrollTo`), NON anchor con `#`
- Ogni click aggiorna l'URL con `history.pushState` → URL puliti in inglese: `/`, `/classes`, `/offers`, `/contacts`
- Le label visibili restano in italiano (Home, Corsi, Offerte, Contatti)
- Scroll spy: evidenzia la sezione attiva. Usa l'evento `scrollend` se disponibile, con fallback a timer debounce 150ms per Safari < 17.4 e browser datati
- Il link "Offerte" appare SOLO se ci sono promozioni attive (`hasOffers` passato come prop)
- `vercel.json` con rewrite SPA → tutte le route servono `index.html` (no 404 al refresh)

## Database Supabase
Tre tabelle:
- `courses`: id, title, description, schedule, image_url, cloudinary_public_id, order_index, is_active
- `promotions`: id, tag, title, subtitle, detail, price, old_price, valid_from, valid_to, accent (classe Tailwind gradient), glow (rgba), icon_name (lucide), is_active, order_index
- `site_settings`: key/value per phone, email, address, instagram_url, facebook_url, google_maps_url

RLS: lettura pubblica, scrittura solo per `auth.role() = 'authenticated'`.

## Hooks
- `useCourses()` → fetch/CRUD corsi
- `usePromotions()` → fetch/CRUD promozioni
- `useSiteSettings()` → fetch/update impostazioni sito

## Admin CMS
Accessibile a `/gestore-forme-2026`, protetto da Supabase Auth (email/password). Sidebar con 3 tab: Corsi, Promozioni, Impostazioni Sito. `EditButton` visibile nel frontend solo quando l'utente è autenticato, reindirizza all'admin.

## Variabili d'ambiente richieste (`.env`)
Il file `.env` è gitignorato (NON committarlo). C'è `.env.example` come riferimento. Su Vercel vanno impostate in Settings → Environment Variables.
```
VITE_SUPABASE_URL=          (URL base del progetto, SENZA /rest/v1)
VITE_SUPABASE_ANON_KEY=     (anon key, pubblica per design, protetta da RLS)
VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_UPLOAD_PRESET=
```

## Deploy (Vercel)
- Vercel rileva Vite in automatico, nessuna config build necessaria
- Variabili d'ambiente da impostare manualmente nel dashboard Vercel
- `vercel.json` gestisce il routing SPA
- Dominio custom Aruba: aggiungere in Settings → Domains, copiare i DNS record su Aruba
- NON esiste più il workflow GitHub Pages (rimosso, era in conflitto)

## Responsive
- Mobile-first. Breakpoint Tailwind standard: `sm` 640, `md` 768, `lg` 1024, `xl` 1280
- Testare anche pieghevoli chiusi (~280px) e tablet verticali
- Offerte: 1 col mobile → 2 col `sm` → 3 col `lg`, con `flex-wrap justify-center`
- Hero headline: va a capo sotto `sm`, su una riga da `sm` in su
- Usare `min-h-[100dvh]` (non `100vh`) per gestire la barra del browser mobile

## Convenzioni codice
- Componenti: named export con `export const ComponentName = () => {}`
- Hooks: `export const useHookName = () => {}`
- File: PascalCase per componenti, camelCase per hook/lib
- Niente TypeScript (progetto JS puro)
- Classi Tailwind inline, niente CSS modules o styled-components
- Usare `clsx` e `tailwind-merge` se servono classi condizionali
- Aggiungere sezioni con `id` per lo scroll spy della Navbar (`id="corsi"`, `id="offerte"`, `id="contatti"`)

## Verifica
- Gate reale: `npm run build` (deve passare). 
- `npm run lint` ha errori PRE-ESISTENTI a livello di config, non bloccanti:
  - `eslint.config.js` NON include `eslint-plugin-react`, quindi `no-unused-vars` non vede i componenti usati in JSX → falso "`motion` is defined but never used" in tutti i file con framer-motion. NON rimuovere gli import di `motion`: sono usati.
  - regole React 19 `react-hooks/set-state-in-effect` segnalano i pattern di data-fetching negli hooks (`useCourses`/`usePromotions`/`useSiteSettings`) e l'init dei form — sono pattern legittimi e intenzionali.
- Se si vuole pulire il lint: aggiungere `eslint-plugin-react` con `jsx-uses-vars` e valutare di allentare `set-state-in-effect`.
