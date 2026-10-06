// Dati SOLO per l'anteprima locale (npm run dev) quando Supabase non è configurato.
// Fonte: supabase.sql. Le promozioni sono i dati demo del seed, non offerte reali.
// Il corso marcato is_new e le date delle promo (spostate in avanti) servono solo all'anteprima.
export const devCourses = [
  {
    "id": "dev-course-1",
    "title": "BUNGEE FLY",
    "description": "Allenati sospeso in aria, migliora coordinazione, resistenza e tono muscolare divertendoti. Sei pronto a sfidare la gravità? Vola oltre i tuoi limiti!",
    "schedule": "Orari da definire",
    "image_url": null,
    "order_index": 10,
    "is_active": true,
    "is_new": false
  },
  {
    "id": "dev-course-2",
    "title": "PILATES",
    "description": "Concentrazione, tonificazione, respirazione, fluidità, allungamento e controllo muscolare: un lavoro profondo e mirato per il tuo benessere, che permette di rafforzare il corpo e migliorare la postura",
    "schedule": "Orari da definire",
    "image_url": null,
    "order_index": 20,
    "is_active": true,
    "is_new": false
  },
  {
    "id": "dev-course-3",
    "title": "WALKING",
    "description": "Un lavoro ad alto impatto basato sull’interval training, un tappeto meccanico in pendenza e tanto divertimento!",
    "schedule": "Orari da definire",
    "image_url": null,
    "order_index": 30,
    "is_active": true,
    "is_new": false
  },
  {
    "id": "dev-course-4",
    "title": "PUMP",
    "description": "Risultai visibili già dopo poche settimane grazie ad un allenamento completo per tutto il corpo che, oltre a scolpire ogni gruppo muscolare e fortificare la zona addominale, migliora la resistenza, la stabilità, la densità ossea e il metabolismo.",
    "schedule": "Orari da definire",
    "image_url": null,
    "order_index": 40,
    "is_active": true,
    "is_new": false
  },
  {
    "id": "dev-course-5",
    "title": "JUMP",
    "description": "Come migliorare la funzionalità cardiaca, attivare fino a 400 muscoli nello stesso momento, bruciare calorie e migliorare coordinazione ed equilibrio? Saltando su un trampolino, no?",
    "schedule": "Orari da definire",
    "image_url": null,
    "order_index": 50,
    "is_active": true,
    "is_new": false
  },
  {
    "id": "dev-course-6",
    "title": "SPINNING",
    "description": "Pedala sempre più forte e sfida la tua resistenza cardiovascolare. Ritmo, musica ad alto volume ed energia pura per bruciare e superare i tuoi stessi limiti.",
    "schedule": "Orari da definire",
    "image_url": null,
    "order_index": 60,
    "is_active": true,
    "is_new": false
  },
  {
    "id": "dev-course-7",
    "title": "KOMBAT",
    "description": "Programma di allenamento ad alta intensità nato dalla fusione di aerobica e arti marziali, senza contatto diretto e con l’intento di fornire un tipo di approccio all’allenamento esplosivo che sia coinvolgente ma soprattutto divertente, oltre che tonificante.",
    "schedule": "Orari da definire",
    "image_url": null,
    "order_index": 70,
    "is_active": true,
    "is_new": false
  },
  {
    "id": "dev-course-8",
    "title": "BALLI DI COPPIA E DI GRUPPO",
    "description": "Ritmo, energia e divertimento per vivere ogni lezione con passione. Muoviti a tempo di musica, socializza e scopri il piacere di ballare insieme!",
    "schedule": "Orari da definire",
    "image_url": null,
    "order_index": 80,
    "is_active": true,
    "is_new": false
  },
  {
    "id": "dev-course-9",
    "title": "ENJOY",
    "description": "Workout innovativo che mescola diversi stili di danza, tra cui hip hop, house, drum 'n' bass, trap e movimenti funzionali, eseguiti a ritmo di successi musicali attuali.",
    "schedule": "Orari da definire",
    "image_url": null,
    "order_index": 90,
    "is_active": true,
    "is_new": false
  },
  {
    "id": "dev-course-10",
    "title": "ACROBATICA AEREA",
    "description": "Equilibrio, forza, coraggio e poesia sospesa. Bastano dei tessuti e la voglia di volare: ed è subito magia!",
    "schedule": "Orari da definire",
    "image_url": null,
    "order_index": 100,
    "is_active": true,
    "is_new": true
  },
  {
    "id": "dev-course-11",
    "title": "GINNASTICA POSTURALE",
    "description": "Il benessere parte dalla postura: prenditi cura del tuo corpo ogni giorno: migliora mobilità, respirazione e controllo del tuo corpo.",
    "schedule": "Orari da definire",
    "image_url": null,
    "order_index": 110,
    "is_active": true,
    "is_new": false
  },
  {
    "id": "dev-course-12",
    "title": "ZEN",
    "description": "L’equilibrio perfetto tra forza, flessibilità e benessere mentale. Respira, tonifica e rilassa il corpo con un allenamento completo e armonioso.",
    "schedule": "Orari da definire",
    "image_url": null,
    "order_index": 120,
    "is_active": true,
    "is_new": false
  },
  {
    "id": "dev-course-13",
    "title": "KARATE",
    "description": "Arte marziale volta al miglioramento della persona e all'elevazione spirituale attraverso la pratica fisica e il perfezionamento delle tecniche.",
    "schedule": "Orari da definire",
    "image_url": null,
    "order_index": 130,
    "is_active": true,
    "is_new": false
  },
  {
    "id": "dev-course-14",
    "title": "KICK BOXING",
    "description": "Potenza, disciplina e adrenalina: allenati come un fighter, migliora forza, velocità e sicurezza in te stesso!",
    "schedule": "Orari da definire",
    "image_url": null,
    "order_index": 140,
    "is_active": true,
    "is_new": false
  }
];

export const devPromotions = [
  {
    "tag": "Flash Deal",
    "title": "Ingresso + Check InBody",
    "subtitle": "Solo per nuovi iscritti",
    "detail": "Valutazione completa della composizione corporea e piano iniziale personalizzato incluso.",
    "price": "29€",
    "old_price": "59€",
    "valid_from": "01/10",
    "valid_to": "30/11",
    "accent": "from-[#F7E842] to-[#F3C318]",
    "glow": "rgba(247,232,66,0.15)",
    "icon_name": "Flame",
    "order_index": 10,
    "id": "dev-promo-1",
    "is_active": true
  },
  {
    "tag": "Pack Premium",
    "title": "3 Mesi Unlimited",
    "subtitle": "Accesso totale ai corsi",
    "detail": "Accesso senza limiti, con onboarding dedicato.",
    "price": "149€",
    "old_price": "210€",
    "valid_from": "01/10",
    "valid_to": "31/12",
    "accent": "from-[#5CE1E6] to-[#3DB8DE]",
    "glow": "rgba(92,225,230,0.15)",
    "icon_name": "Gift",
    "order_index": 20,
    "id": "dev-promo-2",
    "is_active": true
  },
  {
    "tag": "Bring a Friend",
    "title": "Allenati in Due",
    "subtitle": "Promo coppia o amici",
    "detail": "Sconto istantaneo sull'abbonamento mensile se vi iscrivete insieme nello stesso giorno.",
    "price": "-20%",
    "old_price": "Promo limitata",
    "valid_from": "01/10",
    "valid_to": "15/11",
    "accent": "from-[#C4FF36] to-[#8FEA19]",
    "glow": "rgba(196,255,54,0.15)",
    "icon_name": "Sparkles",
    "order_index": 30,
    "id": "dev-promo-3",
    "is_active": true
  }
];

export const devSettings = {};
