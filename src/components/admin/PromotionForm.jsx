import { useState, useEffect } from 'react';

export const PromotionForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    tag: '',
    title: '',
    subtitle: '',
    detail: '',
    price: '',
    old_price: '',
    valid_from: '',
    valid_to: '',
    accent: 'from-[#F7E842] to-[#F3C318]',
    glow: 'rgba(247,232,66,0.15)',
    icon_name: 'Flame',
    order_index: 0,
    is_active: true,
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        tag: initialData.tag || '',
        title: initialData.title || '',
        subtitle: initialData.subtitle || '',
        detail: initialData.detail || '',
        price: initialData.price || '',
        old_price: initialData.old_price || '',
        valid_from: initialData.valid_from || '',
        valid_to: initialData.valid_to || '',
        accent: initialData.accent || 'from-[#F7E842] to-[#F3C318]',
        glow: initialData.glow || 'rgba(247,232,66,0.15)',
        icon_name: initialData.icon_name || 'Flame',
        order_index: initialData.order_index || 0,
        is_active: initialData.is_active !== undefined ? initialData.is_active : true,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err.message || 'Errore durante il salvataggio della promozione');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#161D36] p-8 rounded-2xl border border-white/10 shadow-2xl w-full max-w-2xl mx-auto">
      <h3 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider">
        {initialData ? 'Modifica Promozione' : 'Nuova Promozione'}
      </h3>
      
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2">Tag (es. Flash Deal)</label>
            <input
              type="text"
              name="tag"
              value={formData.tag}
              onChange={handleChange}
              required
              className="w-full bg-[#0B0F24] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F7E842] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2">Titolo</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full bg-[#0B0F24] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F7E842] transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-400 mb-2">Sottotitolo</label>
          <input
            type="text"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
            className="w-full bg-[#0B0F24] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F7E842] transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-400 mb-2">Dettaglio</label>
          <textarea
            name="detail"
            value={formData.detail}
            onChange={handleChange}
            rows={3}
            className="w-full bg-[#0B0F24] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F7E842] transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2">Prezzo Attuale</label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full bg-[#0B0F24] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F7E842] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2">Prezzo Vecchio</label>
            <input
              type="text"
              name="old_price"
              value={formData.old_price}
              onChange={handleChange}
              className="w-full bg-[#0B0F24] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F7E842] transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2">Valida Dal (es. 01/05)</label>
            <input
              type="text"
              name="valid_from"
              value={formData.valid_from}
              onChange={handleChange}
              className="w-full bg-[#0B0F24] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F7E842] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2">Valida Fino Al (es. 31/05)</label>
            <input
              type="text"
              name="valid_to"
              value={formData.valid_to}
              onChange={handleChange}
              className="w-full bg-[#0B0F24] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F7E842] transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2">Icona</label>
            <select
              name="icon_name"
              value={formData.icon_name}
              onChange={handleChange}
              className="w-full bg-[#0B0F24] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F7E842] transition-colors"
            >
              <option value="Flame">Flame</option>
              <option value="Gift">Gift</option>
              <option value="Sparkles">Sparkles</option>
              <option value="Star">Star</option>
              <option value="Zap">Zap</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2">Ordine</label>
            <input
              type="number"
              name="order_index"
              value={formData.order_index}
              onChange={handleChange}
              className="w-full bg-[#0B0F24] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F7E842] transition-colors"
            />
          </div>
          <div className="flex items-center mt-8">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="w-5 h-5 rounded border-gray-300 text-[#F7E842] focus:ring-[#F7E842] bg-[#0B0F24]"
              />
              <span className="text-white font-bold text-sm">Attiva</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t border-white/10">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-6 py-3 rounded-lg font-bold text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            Annulla
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-lg font-bold bg-[#F7E842] text-[#161D36] hover:bg-white transition-colors disabled:opacity-50 flex items-center"
          >
            {loading ? 'Salvataggio...' : 'Salva Promozione'}
          </button>
        </div>
      </form>
    </div>
  );
};
