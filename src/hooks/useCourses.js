import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setCourses(data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const createCourse = async (courseData) => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .insert([courseData])
        .select()
        .single();

      if (error) throw error;
      setCourses(prev => [...prev, data].sort((a, b) => a.order_index - b.order_index));
      return data;
    } catch (err) {
      console.error('Error creating course:', err);
      throw err;
    }
  };

  const updateCourse = async (id, courseData) => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .update({ ...courseData, updated_at: new Date() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setCourses(prev => prev.map(c => c.id === id ? data : c).sort((a, b) => a.order_index - b.order_index));
      return data;
    } catch (err) {
      console.error('Error updating course:', err);
      throw err;
    }
  };

  const deleteCourse = async (id) => {
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setCourses(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error('Error deleting course:', err);
      throw err;
    }
  };

  return { courses, loading, error, refetch: fetchCourses, createCourse, updateCourse, deleteCourse };
};
