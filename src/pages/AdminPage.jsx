import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCourses } from '../hooks/useCourses';
import { usePromotions } from '../hooks/usePromotions';
import { CourseForm } from '../components/admin/CourseForm';
import { PromotionForm } from '../components/admin/PromotionForm';
import { SettingsForm } from '../components/admin/SettingsForm';
import { Plus, LogOut, Settings, LayoutGrid, Tag } from 'lucide-react';

export const AdminPage = () => {
  const { user, login, logout, loading: authLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const [activeTab, setActiveTab] = useState('courses'); // courses, promotions, settings
  const [editingItem, setEditingItem] = useState(null);

  const { 
    courses, 
    createCourse, 
    updateCourse, 
    deleteCourse 
  } = useCourses();

  const { 
    promotions, 
    createPromotion, 
    updatePromotion, 
    deletePromotion 
  } = usePromotions();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      await login(email, password);
    } catch (err) {
      setLoginError('Credenziali non valide o errore di connessione');
    }
  };

  if (authLoading) {
    return <div className="min-h-screen bg-[#0B0F24] flex items-center justify-center text-white text-xl">Caricamento...</div>;
  }

  // --- LOGIN VIEW ---
  if (!user) {
    return (
      <div className="min-h-screen bg-[#0B0F24] flex items-center justify-center p-4">
        <div className="bg-[#161D36] p-8 rounded-3xl w-full max-w-md border border-white/10 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-white uppercase tracking-wider mb-2">Area Admin</h1>
            <p className="text-gray-400">Inserisci le credenziali per accedere</p>
          </div>
          
          {loginError && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm mb-6 text-center">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#0B0F24] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F7E842] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#0B0F24] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F7E842] transition-colors"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3.5 rounded-lg font-bold uppercase tracking-widest bg-[#F7E842] text-[#161D36] hover:bg-white transition-colors"
            >
              Accedi
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- ADMIN DASHBOARD ---

  const renderContent = () => {
    if (editingItem) {
      if (activeTab === 'courses') {
        return (
          <CourseForm 
            initialData={editingItem.id ? editingItem : null}
            onSubmit={async (data) => {
              if (editingItem.id) await updateCourse(editingItem.id, data);
              else await createCourse(data);
              setEditingItem(null);
            }}
            onCancel={() => setEditingItem(null)}
          />
        );
      }
      if (activeTab === 'promotions') {
        return (
          <PromotionForm 
            initialData={editingItem.id ? editingItem : null}
            onSubmit={async (data) => {
              if (editingItem.id) await updatePromotion(editingItem.id, data);
              else await createPromotion(data);
              setEditingItem(null);
            }}
            onCancel={() => setEditingItem(null)}
          />
        );
      }
    }

    if (activeTab === 'settings') {
      return <SettingsForm />;
    }

    // List view
    return (
      <div className="bg-[#161D36] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white uppercase tracking-wider">
            {activeTab === 'courses' ? 'Gestione Corsi' : 'Gestione Promozioni'}
          </h2>
          <button
            onClick={() => setEditingItem({})} // Empty object triggers "New" form
            className="flex items-center gap-2 px-4 py-2 bg-[#F7E842] text-[#161D36] rounded-lg font-bold text-sm hover:bg-white transition-colors"
          >
            <Plus size={16} /> Nuovo
          </button>
        </div>
        
        <div className="divide-y divide-white/5">
          {(activeTab === 'courses' ? courses : promotions).map((item) => (
            <div key={item.id} className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-[#0B0F24] rounded flex items-center justify-center font-bold text-gray-500">
                  {item.order_index}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-3">
                    {item.title}
                    {!item.is_active && <span className="text-[10px] uppercase bg-red-500/20 text-red-400 px-2 py-0.5 rounded border border-red-500/50">Inattivo</span>}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    {activeTab === 'courses' ? item.schedule : `${item.price} - ${item.tag}`}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setEditingItem(item)}
                  className="px-4 py-2 text-sm font-bold text-[#F7E842] hover:bg-[#F7E842]/10 rounded transition-colors"
                >
                  Modifica
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Sei sicuro di voler eliminare questo elemento?')) {
                      activeTab === 'courses' ? deleteCourse(item.id) : deletePromotion(item.id);
                    }
                  }}
                  className="px-4 py-2 text-sm font-bold text-red-400 hover:bg-red-500/10 rounded transition-colors"
                >
                  Elimina
                </button>
              </div>
            </div>
          ))}
          {(activeTab === 'courses' ? courses : promotions).length === 0 && (
            <div className="p-8 text-center text-gray-500">
              Nessun elemento presente. Creane uno nuovo.
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0B0F24] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#161D36] border-r border-white/5 p-6 flex flex-col h-screen sticky top-0">
        <div className="mb-10">
          <h2 className="text-[#F7E842] text-2xl font-black italic tracking-tighter">4<span className="text-white">ME</span></h2>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Admin Panel</p>
        </div>

        <nav className="space-y-2 flex-grow">
          <button
            onClick={() => { setActiveTab('courses'); setEditingItem(null); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-sm transition-colors ${activeTab === 'courses' ? 'bg-[#F7E842] text-[#161D36]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <LayoutGrid size={18} /> Corsi
          </button>
          <button
            onClick={() => { setActiveTab('promotions'); setEditingItem(null); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-sm transition-colors ${activeTab === 'promotions' ? 'bg-[#F7E842] text-[#161D36]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <Tag size={18} /> Promozioni
          </button>
          <button
            onClick={() => { setActiveTab('settings'); setEditingItem(null); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-sm transition-colors ${activeTab === 'settings' ? 'bg-[#F7E842] text-[#161D36]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <Settings size={18} /> Impostazioni Sito
          </button>
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-sm text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={18} /> Disconnetti
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};
