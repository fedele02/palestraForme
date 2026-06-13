import { useState, useEffect } from 'react';
import { uploadToCloudinary } from '../../lib/cloudinary';

export const CourseForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    schedule: 'Orari da definire',
    order_index: 0,
    is_active: true,
  });
  
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        schedule: initialData.schedule || 'Orari da definire',
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

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let imageUrl = initialData?.image_url;
      let cloudinaryId = initialData?.cloudinary_public_id;

      if (file) {
        const uploadResult = await uploadToCloudinary(file);
        imageUrl = uploadResult.url;
        cloudinaryId = uploadResult.publicId;
      }

      const finalData = {
        ...formData,
        image_url: imageUrl,
        cloudinary_public_id: cloudinaryId,
      };

      await onSubmit(finalData);
    } catch (err) {
      setError(err.message || 'Errore durante il salvataggio del corso');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#161D36] p-8 rounded-2xl border border-white/10 shadow-2xl w-full max-w-2xl mx-auto">
      <h3 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider">
        {initialData ? 'Modifica Corso' : 'Nuovo Corso'}
      </h3>
      
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
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

        <div>
          <label className="block text-sm font-bold text-gray-400 mb-2">Descrizione</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full bg-[#0B0F24] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F7E842] transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-400 mb-2">Orario (es. Mar & Gio - 18:30)</label>
          <input
            type="text"
            name="schedule"
            value={formData.schedule}
            onChange={handleChange}
            className="w-full bg-[#0B0F24] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F7E842] transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-400 mb-2">Immagine Copertina</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-[#F7E842] file:text-[#161D36] hover:file:bg-white transition-all cursor-pointer"
          />
          {initialData?.image_url && !file && (
            <p className="text-xs text-gray-500 mt-2">Immagine attuale presente. Caricane una nuova per sostituirla.</p>
          )}
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-bold text-gray-400 mb-2">Ordine (numero)</label>
            <input
              type="number"
              name="order_index"
              value={formData.order_index}
              onChange={handleChange}
              className="w-full bg-[#0B0F24] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F7E842] transition-colors"
            />
          </div>
          
          <div className="flex-1 flex items-center mt-8">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="w-5 h-5 rounded border-gray-300 text-[#F7E842] focus:ring-[#F7E842] bg-[#0B0F24]"
              />
              <span className="text-white font-bold">Corso Attivo</span>
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
            {loading ? 'Salvataggio...' : 'Salva Corso'}
          </button>
        </div>
      </form>
    </div>
  );
};
