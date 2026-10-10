import { useEffect, useState } from 'react';

// Dove si trova il visitatore nella pagina: oltre la prima schermata? già ai contatti?
// Usato dagli elementi fissi in basso (barra Chiama su telefono, assistente) per non coprire l'hero.
export const useScrollZones = () => {
  const [pastHero, setPastHero] = useState(false);
  const [atContacts, setAtContacts] = useState(false);

  useEffect(() => {
    const hero = document.querySelector('main > section');
    const contacts = document.getElementById('contatti');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.target === hero) setPastHero(!e.isIntersecting);
        if (e.target === contacts) setAtContacts(e.isIntersecting);
      });
    }, { rootMargin: '-35% 0px 0px 0px' });
    if (hero) io.observe(hero);
    if (contacts) io.observe(contacts);
    return () => io.disconnect();
  }, []);

  return { pastHero, atContacts };
};
