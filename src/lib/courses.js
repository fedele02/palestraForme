// Logica condivisa dei corsi: famiglie di disciplina, foto di riserva, orari.

// Foto stock segnaposto (Unsplash) per i corsi senza immagine caricata dall'admin.
// Scelte per tipo di disciplina in base al nome del corso: vanno sostituite con foto reali.
const U = (id) => `https://images.unsplash.com/photo-${id}`;
const FALLBACK_BY_KIND = {
  combat: [U('1549719386-74dfcbf7dbed'), U('1555597673-b21d5c935865'), U('1517438322307-e67111335449')],
  dance: [U('1524594152303-9fd13543fe6e'), U('1508700929628-666bc8bd84ea')],
  aerial: [U('1544367567-0f2fcb009e0b'), U('1518611012118-696072aa579a')],
  wellness: [U('1552196563-55cd4e45efb3'), U('1575052814086-f385e2e2ad1b'), U('1599901860904-17e6ed7083a0')],
  cardio: [U('1540497077202-7c8a3999166f'), U('1546483875-ad9014c88eba'), U('1518310383802-640c2de311b2')],
  strength: [U('1517836357463-d25dfeac3438'), U('1534438327276-14e5300c3a48')],
};

const KIND_PATTERNS = [
  ['combat', /karate|box|kombat|kick|marzial|difesa|judo/],
  ['aerial', /aere|bungee|tessut|aerial/],
  ['dance', /ball|danz|enjoy|zumba|hip ?hop/],
  ['wellness', /pilates|postural|zen|yoga|stretch/],
  ['cardio', /spinning|walking|jump|bike|cardio|step/],
];

// Famiglie mostrate al pubblico (vedi PRODUCT.md)
const FAMILY_OF_KIND = {
  strength: 'fitness',
  cardio: 'fitness',
  dance: 'danza',
  aerial: 'aeree',
  combat: 'marziali',
  wellness: 'benessere',
};
export const FAMILY_LABEL = {
  fitness: 'Fitness',
  danza: 'Danza',
  aeree: 'Discipline aeree',
  marziali: 'Arti marziali',
  benessere: 'Benessere',
};

const kindOf = (title = '') =>
  (KIND_PATTERNS.find(([, re]) => re.test(title.toLowerCase())) || ['strength'])[0];

export const hasSchedule = (schedule) =>
  !!schedule && !!schedule.trim() && schedule.trim().toLowerCase() !== 'orari da definire';

// Aggiunge famiglia e foto di riserva a ogni corso
export const prepareCourses = (courses) => {
  const used = {};
  return courses.map((course) => {
    const kind = kindOf(course.title);
    const family = FAMILY_OF_KIND[kind];
    if (course.image_url) return { ...course, kind, family };
    const pool = FALLBACK_BY_KIND[kind];
    used[kind] = (used[kind] ?? -1) + 1;
    return { ...course, kind, family, fallbackImage: pool[used[kind] % pool.length] };
  });
};

// Raggruppa per famiglia (ordine fisso di FAMILY_LABEL); dentro ogni famiglia
// resta l'ordine dell'admin, ma i corsi nuovi vengono per primi.
export const groupByFamily = (courses) => {
  const groups = [];
  courses.forEach((course) => {
    let group = groups.find((g) => g.id === course.family);
    if (!group) {
      group = { id: course.family, label: FAMILY_LABEL[course.family], courses: [] };
      groups.push(group);
    }
    group.courses.push(course);
  });
  groups.forEach((g) => {
    g.courses = [...g.courses.filter((c) => c.is_new), ...g.courses.filter((c) => !c.is_new)];
  });
  const order = Object.keys(FAMILY_LABEL);
  return groups.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
};

export const courseImage = (course, width) => {
  if (course.image_url) {
    // Cloudinary: formato e qualità automatici, larghezza adatta allo spazio
    return course.image_url.includes('/upload/')
      ? course.image_url.replace('/upload/', `/upload/f_auto,q_auto,c_fill,w_${width}/`)
      : course.image_url;
  }
  return `${course.fallbackImage}?auto=format&fit=crop&q=70&w=${width}`;
};

// Anteprima minuscola e sfocata (pochi KB) mostrata subito, finché arriva la foto vera
export const coursePlaceholder = (course) => {
  if (course.image_url) {
    return course.image_url.includes('/upload/')
      ? course.image_url.replace('/upload/', '/upload/f_auto,q_30,c_fill,w_40,e_blur:400/')
      : null;
  }
  return `${course.fallbackImage}?auto=format&fit=crop&q=30&w=40&blur=60`;
};

// Promozioni: valid_from/valid_to sono "GG/MM" senza anno. Una promo scaduta si nasconde.
const parseDayMonth = (value, year) => {
  const m = /^(\d{1,2})\/(\d{1,2})$/.exec((value || '').trim());
  return m ? new Date(year, Number(m[2]) - 1, Number(m[1]), 23, 59, 59) : null;
};
// Stato di un'offerta rispetto a oggi: 'live' visibile, 'scheduled' non ancora iniziata,
// 'expired' scaduta, 'hidden' spenta dall'admin
export const promotionStatus = (promo, today = new Date()) => {
  if (!promo.is_active) return 'hidden';
  const year = today.getFullYear();
  const to = parseDayMonth(promo.valid_to, year);
  const fromRaw = parseDayMonth(promo.valid_from, year);
  const from = fromRaw && new Date(fromRaw.getFullYear(), fromRaw.getMonth(), fromRaw.getDate(), 0, 0, 0);
  // Promo a cavallo d'anno (es. 15/12 - 15/01)
  if (from && to && from > to) {
    if (today >= from || today <= to) return 'live';
    return today < from && today > to ? (from - today < today - to ? 'scheduled' : 'expired') : 'expired';
  }
  if (from && today < from) return 'scheduled';
  if (to && today > to) return 'expired';
  return 'live';
};

export const isPromotionVisible = (promo, today = new Date()) => promotionStatus(promo, today) === 'live';
