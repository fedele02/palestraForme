# CMS, Dati e Admin

## Flusso dati
Tutti i contenuti del sito (corsi, promozioni, impostazioni) vengono da **Supabase**. 
Nessun contenuto è hardcoded nel frontend — usare sempre i dati dalla query.

## Hooks disponibili (non ricreare, usare questi)

### `useCourses()`
Ritorna: `{ courses, loading, error, refetch, createCourse, updateCourse, deleteCourse }`
- `courses` è già ordinato per `order_index ASC`
- Nel frontend mostrare solo `courses.filter(c => c.is_active)`

### `usePromotions()`
Ritorna: `{ promotions, loading, error, refetch, createPromotion, updatePromotion, deletePromotion }`
- `promotions` ordinato per `order_index ASC`
- Nel frontend mostrare solo `promotions.filter(p => p.is_active)`

### `useSiteSettings()`
Ritorna: `{ settings, loading, error, refetch, updateSetting, updateMultipleSettings }`
- `settings` è un oggetto flat: `{ phone, email, address, instagram_url, facebook_url, google_maps_url }`
- Usare fallback nei componenti: `settings.phone || 'valore di default'`

## Schema dati

### Course
```js
{
  id: uuid,
  title: string,          // uppercase nel DB, es. "BUNGEE FLY"
  description: string,
  schedule: string,       // es. "Mar & Gio - 18:30", default "Orari da definire"
  image_url: string,      // URL Cloudinary o null (fallback a foto Unsplash)
  cloudinary_public_id: string,
  order_index: number,    // multipli di 10 (10, 20, 30...)
  is_active: boolean,
}
```

### Promotion
```js
{
  id: uuid,
  tag: string,            // es. "Flash Deal"
  title: string,          // es. "Ingresso + Check InBody"
  subtitle: string,       // es. "Solo per nuovi iscritti"
  detail: string,
  price: string,          // es. "29€" o "-20%"
  old_price: string,      // es. "59€" o "Promo limitata"
  valid_from: string,     // formato "GG/MM"
  valid_to: string,       // formato "GG/MM"
  accent: string,         // classe Tailwind gradient, es. "from-[#F7E842] to-[#F3C318]"
  glow: string,           // rgba per radial-gradient sfondo hover
  icon_name: string,      // nome icona lucide-react: Flame, Gift, Sparkles, Star, Zap
  is_active: boolean,
  order_index: number,
}
```

### SiteSettings (key/value)
| key | descrizione |
|---|---|
| `phone` | Numero telefono |
| `email` | Email contatto |
| `address` | Indirizzo con `<br/>` per a capo |
| `instagram_url` | URL profilo Instagram |
| `facebook_url` | URL pagina Facebook |
| `google_maps_url` | URL condivisione Google Maps |

## Cloudinary
- Upload tramite `uploadToCloudinary(file)` da `src/lib/cloudinary.js`
- Ritorna `{ url, publicId }`
- Upload solo in area admin, file `image/*`
- Se Cloudinary non configurato, il form mostra errore leggibile

## Admin Panel
- Route: `/gestore-forme-2026` (URL oscurato, non linkato pubblicamente)
- Autenticazione: Supabase Auth email/password
- `useAuth()` da `AuthContext` → `{ user, login, logout, loading, isAdmin }`
- `EditButton` nel frontend: visibile solo se `isAdmin`, redirect all'admin

## Quando si aggiunge un nuovo dato al DB
1. Aggiornare `supabase.sql` con la migration
2. Aggiornare il tipo nei commenti dell'hook relativo
3. Se serve nel frontend, aggiornare il componente che consuma l'hook
4. Se serve nell'admin, aggiornare il form relativo (CourseForm / PromotionForm / SettingsForm)

## Pattern errori nei hook
Gli hook loggano con `console.error` e re-throw. I form mostrano l'errore in un div rosso:
```jsx
{error && (
  <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded mb-6">
    {error}
  </div>
)}
```
