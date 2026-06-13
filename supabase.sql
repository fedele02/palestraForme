-- Schema Database Supabase per ForMe CMS

-- 1. Creazione Tabelle

-- Tabella corsi
CREATE TABLE IF NOT EXISTS public.courses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    description text NOT NULL,
    schedule text DEFAULT 'Orari da definire',
    image_url text,
    cloudinary_public_id text,
    order_index integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Tabella promozioni
CREATE TABLE IF NOT EXISTS public.promotions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tag text NOT NULL,
    title text NOT NULL,
    subtitle text,
    detail text,
    price text NOT NULL,
    old_price text,
    valid_from text,
    valid_to text,
    accent text DEFAULT 'from-[#F7E842] to-[#F3C318]',
    glow text DEFAULT 'rgba(247,232,66,0.15)',
    icon_name text DEFAULT 'Flame',
    is_active boolean DEFAULT true,
    order_index integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Tabella impostazioni sito
CREATE TABLE IF NOT EXISTS public.site_settings (
    key text PRIMARY KEY,
    value text NOT NULL
);

-- 2. Sicurezza (Row Level Security)

-- Corsi
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Corsi visibili a tutti"
ON public.courses FOR SELECT
USING (true);

CREATE POLICY "Solo admin può modificare i corsi"
ON public.courses FOR ALL
USING (auth.role() = 'authenticated');

-- Promozioni
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Promozioni visibili a tutti"
ON public.promotions FOR SELECT
USING (true);

CREATE POLICY "Solo admin può modificare le promozioni"
ON public.promotions FOR ALL
USING (auth.role() = 'authenticated');

-- Impostazioni Sito
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Impostazioni visibili a tutti"
ON public.site_settings FOR SELECT
USING (true);

CREATE POLICY "Solo admin può modificare le impostazioni"
ON public.site_settings FOR ALL
USING (auth.role() = 'authenticated');

-- 3. Inserimento Dati Iniziali

-- Impostazioni sito default
INSERT INTO public.site_settings (key, value) VALUES
('phone', '+39 333 123 4567'),
('email', 'info@formefitness.it'),
('address', 'ForMe Laterza<br/>Via Industrie Conte<br/>74014 Laterza (Puglia)'),
('instagram_url', '#'),
('facebook_url', '#'),
('google_maps_url', 'https://maps.app.goo.gl/3q4aM6FwRxKzLg7M8')
ON CONFLICT (key) DO NOTHING;

-- Inserimento Corsi
INSERT INTO public.courses (title, description, order_index) VALUES
('BUNGEE FLY', 'Allenati sospeso in aria, migliora coordinazione, resistenza e tono muscolare divertendoti. Sei pronto a sfidare la gravità? Vola oltre i tuoi limiti!', 10),
('PILATES', 'Concentrazione, tonificazione, respirazione, fluidità, allungamento e controllo muscolare: un lavoro profondo e mirato per il tuo benessere, che permette di rafforzare il corpo e migliorare la postura', 20),
('WALKING', 'Un lavoro ad alto impatto basato sull’interval training, un tappeto meccanico in pendenza e tanto divertimento!', 30),
('PUMP', 'Risultai visibili già dopo poche settimane grazie ad un allenamento completo per tutto il corpo che, oltre a scolpire ogni gruppo muscolare e fortificare la zona addominale, migliora la resistenza, la stabilità, la densità ossea e il metabolismo.', 40),
('JUMP', 'Come migliorare la funzionalità cardiaca, attivare fino a 400 muscoli nello stesso momento, bruciare calorie e migliorare coordinazione ed equilibrio? Saltando su un trampolino, no?', 50),
('SPINNING', 'Pedala sempre più forte e sfida la tua resistenza cardiovascolare. Ritmo, musica ad alto volume ed energia pura per bruciare e superare i tuoi stessi limiti.', 60),
('KOMBAT', 'Programma di allenamento ad alta intensità nato dalla fusione di aerobica e arti marziali, senza contatto diretto e con l’intento di fornire un tipo di approccio all’allenamento esplosivo che sia coinvolgente ma soprattutto divertente, oltre che tonificante.', 70),
('BALLI DI COPPIA E DI GRUPPO', 'Ritmo, energia e divertimento per vivere ogni lezione con passione. Muoviti a tempo di musica, socializza e scopri il piacere di ballare insieme!', 80),
('ENJOY', 'Workout innovativo che mescola diversi stili di danza, tra cui hip hop, house, drum ''n'' bass, trap e movimenti funzionali, eseguiti a ritmo di successi musicali attuali.', 90),
('ACROBATICA AEREA', 'Equilibrio, forza, coraggio e poesia sospesa. Bastano dei tessuti e la voglia di volare: ed è subito magia!', 100),
('GINNASTICA POSTURALE', 'Il benessere parte dalla postura: prenditi cura del tuo corpo ogni giorno: migliora mobilità, respirazione e controllo del tuo corpo.', 110),
('ZEN', 'L’equilibrio perfetto tra forza, flessibilità e benessere mentale. Respira, tonifica e rilassa il corpo con un allenamento completo e armonioso.', 120),
('KARATE', 'Arte marziale volta al miglioramento della persona e all''elevazione spirituale attraverso la pratica fisica e il perfezionamento delle tecniche.', 130),
('KICK BOXING', 'Potenza, disciplina e adrenalina: allenati come un fighter, migliora forza, velocità e sicurezza in te stesso!', 140);
-- BALLI DI COPPIA E DI GRUPPO rimosso duplicato

-- Inserimento Promozioni (dati demo)
INSERT INTO public.promotions (tag, title, subtitle, detail, price, old_price, valid_from, valid_to, accent, glow, icon_name, order_index) VALUES
('Flash Deal', 'Ingresso + Check InBody', 'Solo per nuovi iscritti', 'Valutazione completa della composizione corporea e piano iniziale personalizzato incluso.', '29€', '59€', '01/05', '31/05', 'from-[#F7E842] to-[#F3C318]', 'rgba(247,232,66,0.15)', 'Flame', 10),
('Pack Premium', '3 Mesi Unlimited', 'Accesso totale ai corsi', 'Accesso senza limiti, con onboarding dedicato.', '149€', '210€', '05/05', '30/06', 'from-[#5CE1E6] to-[#3DB8DE]', 'rgba(92,225,230,0.15)', 'Gift', 20),
('Bring a Friend', 'Allenati in Due', 'Promo coppia o amici', 'Sconto istantaneo sull''abbonamento mensile se vi iscrivete insieme nello stesso giorno.', '-20%', 'Promo limitata', '10/05', '09/06', 'from-[#C4FF36] to-[#8FEA19]', 'rgba(196,255,54,0.15)', 'Sparkles', 30);
