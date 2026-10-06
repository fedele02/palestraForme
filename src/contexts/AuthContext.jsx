import { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isDevData } from '../lib/supabase';

const AuthContext = createContext({});

// In sviluppo locale senza Supabase il login è "di prova" (vedi src/lib/devStore.js)
const devMode = import.meta.env.DEV && isDevData;
const loadDevAuth = import.meta.env.DEV ? () => import('../lib/devStore').then((m) => m.devAuth) : null;

const loginErrorMessage = (err) => {
  const msg = err?.message || '';
  if (/invalid login credentials/i.test(msg)) return 'Email o password non corretti.';
  if (/email not confirmed/i.test(msg)) return "Email non ancora confermata: controlla la posta.";
  if (/failed to fetch|network/i.test(msg)) return 'Connessione assente: controlla internet e riprova.';
  return 'Accesso non riuscito. Riprova tra poco.';
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (devMode) {
      loadDevAuth().then((devAuth) => {
        setUser(devAuth.getUser());
        setLoading(false);
      });
      return undefined;
    }

    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error fetching session:', error);
      } finally {
        setLoading(false);
      }
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    if (devMode) {
      const devAuth = await loadDevAuth();
      const u = devAuth.login(email);
      setUser(u);
      return { user: u };
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(loginErrorMessage(error));
    return data;
  };

  const logout = async () => {
    if (devMode) {
      (await loadDevAuth()).logout();
      setUser(null);
      return;
    }
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAdmin: !!user, // Qualsiasi utente autenticato è admin (gli utenti si creano solo da Supabase)
    isDemo: devMode,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
