import { Pencil } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const EditButton = ({ onClick, className = '' }) => {
  const { isAdmin } = useAuth();

  if (!isAdmin) return null;

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      className={`absolute z-50 flex items-center justify-center w-12 h-12 bg-[#F7E842] text-[#161D36] rounded-full shadow-[0_0_20px_rgba(247,232,66,0.5)] hover:scale-110 transition-transform duration-300 ${className}`}
      title="Modifica"
    >
      <Pencil size={20} />
    </button>
  );
};
