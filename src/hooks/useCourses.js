import { useTable } from './useTable';

export const useCourses = () => {
  const { rows, loading, error, refetch, create, update, remove, move, nextOrderIndex } = useTable('courses');
  return {
    courses: rows,
    loading,
    error,
    refetch,
    createCourse: create,
    updateCourse: update,
    deleteCourse: remove,
    moveCourse: move,
    nextOrderIndex,
  };
};
