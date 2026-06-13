# Design System & Pattern Visivi

## Palette colori (hardcoded, non variabili CSS)
| Ruolo | Valore |
|---|---|
| Background principale | `#161D36` |
| Background sezioni scure | `#0B0F24` |
| Background offerte | `#0A0E27` |
| Background card admin | `#101530` / `#101529` |
| Giallo brand (accenti, CTA) | `#F7E842` |
| Giallo brand scuro (gradient fine) | `#F3C318` |
| Testo principale | `white` |
| Testo secondario | `gray-300`, `gray-400`, `slate-400` |
| Border sottile | `white/5`, `white/10` |

## Tipografia ricorrente

### Titoli sezione (h2/h3 grandi)
```jsx
<h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.9] text-white">
```

### Soprattitolo (label sopra il titolo)
```jsx
<p className="text-[#F7E842] tracking-[0.4em] text-sm font-bold uppercase">
```

### Testo descrittivo
```jsx
<p className="text-gray-400 font-light text-lg md:text-xl">
```

### Label admin / form
```jsx
<label className="block text-sm font-bold text-gray-400 mb-2">
```

## Bottoni

### CTA principale (giallo)
```jsx
<button className="bg-[#F7E842] text-[#161D36] px-8 py-4 rounded font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(247,232,66,0.3)] hover:bg-white hover:shadow-[0_0_30px_rgba(247,232,66,0.6)] transition-all duration-300">
```

### CTA outline (giallo bordo)
```jsx
<a className="text-[#F7E842] border-2 border-[#F7E842] px-8 py-4 rounded font-bold uppercase tracking-widest hover:bg-[#F7E842] hover:text-[#161D36] transition-all duration-300">
```

### Bottone admin primario
```jsx
<button className="px-6 py-3 rounded-lg font-bold bg-[#F7E842] text-[#161D36] hover:bg-white transition-colors">
```

### Bottone admin ghost
```jsx
<button className="px-6 py-3 rounded-lg font-bold text-gray-400 hover:text-white transition-colors">
```

## Input / Form
```jsx
<input className="w-full bg-[#0B0F24] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F7E842] transition-colors" />
```

## Card (pattern offerte/promozioni)
```jsx
<article className="group relative flex flex-col rounded-[2rem] bg-[#101530] border border-white/5 shadow-xl transition-all duration-500 hover:-translate-y-3 hover:border-white/10">
```

## Linea decorativa brand
```jsx
<div className="h-1 w-16 bg-[#F7E842]" />
```

## Badge/Tag
```jsx
<span className="inline-flex items-center rounded-full bg-white/5 border border-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-white">
```

## Icone contenitore (con hover giallo)
```jsx
<div className="w-14 h-14 bg-[#101529] text-[#F7E842] flex items-center justify-center rounded-full group-hover:bg-[#F7E842] group-hover:text-[#161D36] transition-colors duration-300">
  <Icon size={24} />
</div>
```

## Animazioni Framer Motion standard

### Fade-in dal basso (scroll)
```jsx
initial={{ opacity: 0, y: 50 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true, margin: '-100px' }}
transition={{ duration: 0.8 }}
```

### Fade-in da sinistra/destra (scroll)
```jsx
initial={{ opacity: 0, x: -50 }}  // o x: 50 per destra
whileInView={{ opacity: 1, x: 0 }}
viewport={{ once: true }}
transition={{ duration: 0.8 }}
```

### Mount (componenti che appaiono subito)
```jsx
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.8, delay: 0.2 }}
```

### Stagger per liste (delay progressivo)
```jsx
transition={{ duration: 0.6, delay: idx * 0.15 }}
```

## Sfondo decorativo (blur circles)
```jsx
<div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#F7E842]/5 blur-[120px] pointer-events-none" />
```

## Gradient testo (titoli highlight)
```jsx
<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F7E842] to-yellow-600">
```
