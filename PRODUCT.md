# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Persone di Laterza (TA) e dintorni che cercano una palestra o un corso: chi non è ancora iscritto e sta valutando, e gli iscritti che vogliono vedere i corsi nuovi. Arrivano soprattutto da smartphone (link da Facebook/Instagram, WhatsApp, ricerca Google), spesso in pochi secondi liberi.

## Product Purpose
Sito vetrina della palestra ForMe (anche scritto "4ME"): dare una panoramica della palestra, mostrare i corsi (e quelli nuovi), le promozioni attive e i contatti, per far iscrivere nuove persone. Successo = il visitatore capisce cosa offre ForMe e contatta o passa in palestra.

## Positioning
Centro sportivo di paese con un'offerta di corsi molto ampia sotto lo stesso tetto: fitness (Pump, Spinning, Walking, Jump, Bungee Fly), danza (balli di coppia e di gruppo, Enjoy), discipline aeree (acrobatica aerea), arti marziali (Karate, Kick Boxing, Kombat) e benessere (Pilates, Ginnastica posturale, Zen). Tagline ufficiale: "ForMe - Power Fitness Experience - professionalità e qualità al servizio della tua esperienza fitness."

## Operating Context
- Contenuti gestiti dall'admin della palestra tramite CMS (Supabase): corsi, promozioni, impostazioni (telefono, email, indirizzo, social, Google Maps). Nessun contenuto hardcoded oltre ai fallback.
- Admin su `/gestore-forme-2026`.
- Deploy su Vercel, dominio formefitness.it (canonical in index.html).

## Capabilities and Constraints
- SPA React 19 + Vite + Tailwind v4 + Framer Motion; struttura a sezioni (Hero, Corsi, Offerte, Contatti) da mantenere.
- La sezione Offerte appare solo se ci sono promozioni attive.
- Titoli dei corsi arrivano MAIUSCOLI dal DB; descrizioni di lunghezza variabile; orario spesso "Orari da definire"; immagine del corso opzionale (Cloudinary).
- Uso prevalente da smartphone: deve essere perfetto da 320 px in su, poi tablet e desktop.

## Brand Commitments
- Nome ForMe / 4ME, hashtag #4MEdable.
- Logo esistente (`public/icona2.png`, `favicon-logo2.svg`): il "4" giallo con "ME POWER FITNESS EXPERIENCE".
- Colori: blu notte `#161D36` e giallo `#F7E842`.
- Lingua: italiano. Tono diretto, da palestra di paese, non da startup.

## Evidence on Hand
- Contatti pubblici dalla pagina Facebook ufficiale (facebook.com/ForMeLaterza): Via Industrie Conte, Laterza; tel. 328 652 0798; email qualityforme@libero.it; circa 1.700 follower.
- Elenco corsi e descrizioni in `supabase.sql` (fonte: dati del progetto).
- Le promozioni in `supabase.sql` sono marcate come dati demo: non sono offerte reali.
- Nessuna foto reale della palestra da usare (scelta dell'utente: no foto da Facebook). Le foto sono stock segnaposto da sostituire.
- Nessuna recensione, numero di iscritti, prezzo o orario reale da pubblicare: non inventarli.

## Product Principles
1. Prima il telefono: tutto si legge e si tocca bene con una mano.
2. Far vedere l'ampiezza dell'offerta: i corsi sono il cuore del sito.
3. Un contatto a un tocco: chiamare o scrivere non deve richiedere ricerca.
4. Sembrare la palestra vera, non un template: niente claim o numeri inventati.
