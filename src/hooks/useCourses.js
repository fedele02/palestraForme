import { useTable } from './useTable';

export const useCourses = () => {
  const { rows, loading, error, refetch, create, update, remove, move, swap, nextOrderIndex } = useTable('courses');
  return {
    courses: rows,
    loading,
    error,
    refetch,
    createCourse: create,
    updateCourse: update,
    deleteCourse: remove,
    moveCourse: move,
    swapCourses: swap,
    nextOrderIndex,
  };
};
