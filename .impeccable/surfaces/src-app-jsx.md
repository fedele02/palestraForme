---
version: 1
slug: "src-app-jsx"
primary_target: "src/App.jsx"
related_targets: []
---

## Scope
Homepage pubblica di ForMe (src/App.jsx: Navbar, Hero, Corsi, Offerte, Contatti). Mode: Persuade.

## Audience and job
Persone di Laterza e dintorni, quasi sempre da telefono: capire cosa offre la palestra, vedere i corsi (e i nuovi), chiamare o passare.

## Direction contract
THESIS: la palestra di paese raccontata con la cura di Equinox. Rifiuta il template "hero scuro con glow giallo + card arrotondate + gradient text": niente card, niente bagliori, niente pillole.
OWN-WORLD: blu notte #161D36 e #10162B a campiture piene, giallo #F7E842 solo per azioni, stato attivo e accenti di testo; Archivo variabile, titoli condensati (wdth 62-68%) neri maiuscoli, testo a larghezza normale; foto in bianco e nero velate di blu; angoli 4px ovunque; separatori a filo 1px.
STORY: chi arriva capisce in un colpo d'occhio che ForMe ha tante discipline sotto lo stesso tetto, vede ogni corso in grande scorrendo, trova sempre il telefono a un tocco.
FIRST VIEWPORT: foto a tutto schermo (100svh), titolo "Non aspettare il cambiamento. Crealo." in basso a sinistra (zona del pollice su telefono), "Crealo." in giallo; sotto una riga di tagline ufficiale e due azioni: "Scopri i corsi" (giallo) e "Chiama" (contorno). Barra in alto con logo 4ME, link e numero di telefono.
FORM: canon (palestra classica fatta bene), scelta dall'utente dopo due giri; riferimento di cura: Equinox; seed key fe627e4f. Firma: le foto dei corsi si svelano con un clip-path dal basso entrando nello schermo; il titolo hero sale riga per riga.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Constraints
Contenuti solo da Supabase (fallback contatti da Facebook ufficiale). Nessun prezzo, orario, recensione o numero inventato. Foto stock segnaposto da sostituire con foto reali.
