import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const usePromotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setPromotions(data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching promotions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const createPromotion = async (promoData) => {
    try {
      const { data, error } = await supabase
        .from('promotions')
        .insert([promoData])
        .select()
        .single();

      if (error) throw error;
      setPromotions(prev => [...prev, data].sort((a, b) => a.order_index - b.order_index));
      return data;
    } catch (err) {
      console.error('Error creating promotion:', err);
      throw err;
    }
  };

  const updatePromotion = async (id, promoData) => {
    try {
      const { data, error } = await supabase
        .from('promotions')
        .update({ ...promoData, updated_at: new Date() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setPromotions(prev => prev.map(p => p.id === id ? data : p).sort((a, b) => a.order_index - b.order_index));
      return data;
    } catch (err) {
      console.error('Error updating promotion:', err);
      throw err;
    }
  };

  const deletePromotion = async (id) => {
    try {
      const { error } = await supabase
        .from('promotions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setPromotions(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error deleting promotion:', err);
      throw err;
    }
  };

  return { promotions, loading, error, refetch: fetchPromotions, createPromotion, updatePromotion, deletePromotion };
};
