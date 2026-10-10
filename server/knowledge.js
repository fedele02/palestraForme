// Documentazione della palestra per l'assistente AI.
// Corsi, offerte attive, telefono, email, indirizzo e orari di apertura NON vanno scritti qui:
// l'assistente li legge in tempo reale da Supabase (pannello admin), così restano sempre aggiornati.
// Scrivere solo informazioni vere: quello che non c'è, l'assistente dice di non saperlo e invita a chiamare.
// Nel testo non usare l'accento grave (il carattere che apre e chiude il testo qui sotto).

export const KNOWLEDGE = `
### Chi siamo
- ForMe (scritto anche 4ME) è una palestra e centro sportivo a Laterza (TA), in Via Industrie Conte.
- È un'associazione sportiva dilettantistica (ForMe a.s.d.), attiva a Laterza da molti anni.
- Motto: "ForMe - Power Fitness Experience - professionalità e qualità al servizio della tua esperienza fitness." Hashtag: #4MEdable.
- I nostri punti di forza: allenamenti personalizzati, personale qualificato, ambiente motivante, risultati visibili.

### La palestra
- Sala attrezzi climatizzata, con area isotonica (macchine e pesi) e area cardio fitness.
- In sala ci sono gli istruttori, che seguono i soci e preparano schede di allenamento personalizzate.
- Sala corsi per le lezioni di gruppo.
- Sotto lo stesso tetto: fitness, danza, discipline aeree, arti marziali e corsi di benessere (l'elenco aggiornato dei corsi è nella sezione Corsi attivi).
- Davanti alla palestra c'è un parcheggio gratuito.

### Per chi è
- Per tutte le età e tutti i livelli, anche per chi non ha mai fatto sport: gli istruttori adattano l'allenamento.
- Il karate ha corsi sia per adulti sia per bambini. Per gli altri corsi non è indicato se ci sono gruppi per bambini: per età e orari chiedere in palestra.
- Per chi ha problemi di schiena o postura ci sono corsi dedicati come la ginnastica posturale; per problemi di salute è sempre meglio sentire prima il medico.

### Iscrizione e offerte
- Per iscriversi o aderire a un'offerta si passa in palestra oppure si chiama: l'iscrizione non si fa dal sito né dalla chat.
- Le offerte attive sono quelle elencate nella sezione Offerte attive; sono a tempo limitato.
- Prezzi di abbonamenti e corsi non presenti in queste informazioni: vanno chiesti in palestra o al telefono.
### Kimi
- Kimi puzza parecchio, meglio palla
`.trim();

/*
  ------------------------------------------------------------------------------------------
  DA CONFERMARE CON IL CLIENTE prima di spostarle nel testo qui sopra.
  Fonte: articolo TuttoSportTaranto del 30/10/2019 (7 anni fa), potrebbero non essere più vere.
  ------------------------------------------------------------------------------------------

  Orari di apertura (meglio inserirli dal pannello admin, campo "Orari di apertura"):
  - Lunedì, mercoledì, venerdì: 9:00-22:00 orario continuato
  - Martedì e giovedì: 15:00-22:00
  - Sabato: 9:00-12:30 e 15:00-19:00
  - Domenica: chiuso (non indicato nell'articolo)

  Staff (nel 2019; chiedere al cliente se vuole i nomi in chat):
  - Titolari: un'insegnante di scienze motorie e istruttrice di fitness e discipline olistiche;
    un atleta nazionale di cultura fisica e body building, personal trainer.
  - Collaboratori: laureato in scienze motorie in sala attrezzi; personal trainer;
    istruttrice di walking e sala corsi; fisioterapista per ginnastica posturale e correttiva;
    maestro di karate e difesa personale (adulti e bambini); istruttore di corpo libero.

  Corsi citati nel 2019 e non presenti oggi sul sito (esistono ancora?):
  - Step, corpo libero, total body, functional training, Energy, yoga, difesa personale.

  Personal trainer: nel 2019 c'erano personal trainer. Si può prenotare un PT? Costo?

  ------------------------------------------------------------------------------------------
  DOMANDE DA FARE AL CLIENTE (sono le più frequenti in chat per una palestra):
  - Prezzi: abbonamento mensile, trimestrale, annuale; ingresso singolo; prezzi dei corsi; quota associativa/tesseramento.
  - C'è una lezione di prova gratuita?
  - Serve il certificato medico? Di che tipo?
  - Spogliatoi e docce? Armadietti? Cosa portare (asciugamano, scarpe pulite)?
  - Parcheggio?
  - Età minima per la sala attrezzi e per i corsi bambini.
  - Metodi di pagamento (contanti, carta, bonifico)?
  - Chiusure estive o festive?
  ------------------------------------------------------------------------------------------
*/
