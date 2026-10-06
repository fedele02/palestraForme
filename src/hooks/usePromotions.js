import { useTable } from './useTable';

export const usePromotions = () => {
  const { rows, loading, error, refetch, create, update, remove, move, nextOrderIndex } = useTable('promotions');
  return {
    promotions: rows,
    loading,
    error,
    refetch,
    createPromotion: create,
    updatePromotion: update,
    deletePromotion: remove,
    movePromotion: move,
    nextOrderIndex,
  };
};
