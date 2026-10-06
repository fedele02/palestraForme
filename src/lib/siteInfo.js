// Valori di riserva se site_settings su Supabase è vuoto.
// Fonte: pagina Facebook ufficiale (facebook.com/ForMeLaterza), ottobre 2026.
const FALLBACK = {
  phone: '328 652 0798',
  email: 'qualityforme@libero.it',
  address: 'Via Industrie Conte<br/>74014 Laterza (TA)',
  maps_query: 'Via Industrie Conte, Laterza',
  google_maps_url: 'https://maps.app.goo.gl/3q4aM6FwRxKzLg7M8',
  facebook_url: 'https://www.facebook.com/ForMeLaterza/',
  instagram_url: '',
};

// Le chiavi che l'area admin può modificare (tabella site_settings, chiave/valore)
export const SETTINGS_KEYS = [
  'phone', 'whatsapp', 'email', 'address', 'opening_hours',
  'maps_query', 'google_maps_url', 'instagram_url', 'facebook_url',
];

const isRealUrl = (url) => typeof url === 'string' && /^https?:\/\//.test(url.trim());
const digitsOf = (phone) => phone.replace(/[^\d+]/g, '');
const lines = (text) => text.split(/<br\s*\/?>|\n/i).map((l) => l.trim()).filter(Boolean);

export const toTelHref = (phone) => {
  const digits = digitsOf(phone);
  return `tel:${digits.startsWith('+') ? digits : `+39${digits}`}`;
};

export const toWhatsappHref = (phone) => {
  const digits = digitsOf(phone).replace(/^\+/, '');
  return `https://wa.me/${digits.startsWith('39') && digits.length > 10 ? digits : `39${digits}`}`;
};

export const mapsEmbedUrl = (query) =>
  `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=16&ie=UTF8&iwloc=&output=embed`;

export const mapsSearchUrl = (query) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

export const buildSiteInfo = (settings = {}) => {
  const value = (key) => (typeof settings[key] === 'string' ? settings[key].trim() : '');
  const pick = (key) => value(key) || FALLBACK[key];

  const phone = pick('phone');
  const addressLines = lines(pick('address'));
  const mapsQuery = value('maps_query') || addressLines.join(', ') || FALLBACK.maps_query;
  const whatsapp = value('whatsapp');

  return {
    phone,
    phoneHref: toTelHref(phone),
    whatsapp,
    whatsappHref: whatsapp ? toWhatsappHref(whatsapp) : '',
    email: pick('email'),
    addressLines,
    openingLines: lines(value('opening_hours')),
    mapsEmbedUrl: mapsEmbedUrl(mapsQuery),
    mapsUrl: isRealUrl(value('google_maps_url')) ? value('google_maps_url') : (value('maps_query') ? mapsSearchUrl(mapsQuery) : FALLBACK.google_maps_url),
    facebookUrl: isRealUrl(settings.facebook_url) ? settings.facebook_url : FALLBACK.facebook_url,
    instagramUrl: isRealUrl(settings.instagram_url) ? settings.instagram_url : '',
  };
};
