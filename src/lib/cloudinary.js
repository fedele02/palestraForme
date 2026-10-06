import { isDevData } from './supabase';

const MAX_MB = 10;

const isConfigured = (cloudName, preset) =>
  !!cloudName && !!preset && !cloudName.includes('inserisci') && !preset.includes('inserisci') && !cloudName.includes('your-');

// Solo sviluppo locale: senza Cloudinary la foto viene ridotta e salvata nel browser (database di prova)
const toLocalDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, 1400 / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(img.src);
      resolve(canvas.toDataURL('image/jpeg', 0.78));
    };
    img.onerror = () => reject(new Error('Questa immagine non si riesce a leggere. Prova con un JPG o PNG.'));
    img.src = URL.createObjectURL(file);
  });

export const uploadToCloudinary = async (file) => {
  if (!file.type.startsWith('image/')) throw new Error('Il file scelto non è un\'immagine.');
  if (file.size > MAX_MB * 1024 * 1024) throw new Error(`La foto è troppo pesante (massimo ${MAX_MB} MB).`);

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!isConfigured(cloudName, uploadPreset)) {
    if (import.meta.env.DEV && isDevData) {
      return { url: await toLocalDataUrl(file), publicId: null };
    }
    throw new Error('Caricamento foto non configurato: mancano i dati di Cloudinary nel file .env.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || "Errore durante il caricamento dell'immagine.");
  }
  const data = await response.json();
  return { url: data.secure_url, publicId: data.public_id };
};
