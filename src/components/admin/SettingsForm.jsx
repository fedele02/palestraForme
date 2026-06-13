import { useState, useEffect } from 'react';
import { useSiteSettings } from '../../hooks/useSiteSettings';

export const SettingsForm = () => {
  const { settings, loading: loadingSettings, updateMultipleSettings } = useSiteSettings();
  
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    address: '',
    instagram_url: '',
    facebook_url: '',
    google_maps_url: '',
  });
  
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (Object.keys(settings).length > 0) {
      setFormData({
        phone: settings.phone || '',
        email: settings.email || '',
        address: settings.address || '',
        instagram_url: settings.instagram_url || '',
        facebook_url: settings.facebook_url || '',
        google_maps_url: settings.google_maps_url || '',
      });
    }
  }, [settings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      await updateMultipleSettings(formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Errore durante il salvataggio delle impostazioni');
    } finally {
      setSaving(false);
    }
  };

  if (loadingSettings) {
    return <div className="text-white">Caricamento impostazioni...</div>;
  }

  return (
    <div className="bg-[#161D36] p-8 rounded-2xl border border-white/10 shadow-2xl w-full max-w-3xl">
      <h3 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider">
        Impostazioni Sito (Footer)
      </h3>
      
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-500/20 border border-green-500 text-green-200 px-4 py-3 rounded mb-6">
          Impostazioni salvate con successo!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2">Telefono</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full bg-[#0B0F24] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F7E842] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-[#0B0F24] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F7E842] transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-400 mb-2">Indirizzo (usa &lt;br/&gt; per andare a capo)</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={3}
            className="w-full bg-[#0B0F24] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F7E842] transition-colors font-mono text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2">Link Instagram</label>
            <input
              type="text"
              name="instagram_url"
              value={formData.instagram_url}
              onChange={handleChange}
              className="w-full bg-[#0B0F24] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F7E842] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2">Link Facebook</label>
            <input
              type="text"
              name="facebook_url"
              value={formData.facebook_url}
              onChange={handleChange}
              className="w-full bg-[#0B0F24] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F7E842] transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-400 mb-2">URL Google Maps (Condividi &gt; Copia Link)</label>
          <input
            type="text"
            name="google_maps_url"
            value={formData.google_maps_url}
            onChange={handleChange}
            className="w-full bg-[#0B0F24] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F7E842] transition-colors"
          />
        </div>

        <div className="flex justify-end pt-6 border-t border-white/10">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 rounded-lg font-bold bg-[#F7E842] text-[#161D36] hover:bg-white transition-colors disabled:opacity-50 flex items-center"
          >
            {saving ? 'Salvataggio...' : 'Salva Impostazioni'}
          </button>
        </div>
      </form>
    </div>
  );
};
