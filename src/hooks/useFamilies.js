import { useTable } from './useTable';

// Sezioni dei corsi (Fitness, Danza, ...): tabella course_families, gestita dall'area admin
export const useFamilies = () => {
  const { rows, loading, error, refetch, create, update, remove, move, nextOrderIndex } = useTable('course_families');
  return {
    families: rows,
    loading,
    error,
    refetch,
    createFamily: create,
    updateFamily: update,
    deleteFamily: remove,
    moveFamily: move,
    nextOrderIndex,
  };
};
