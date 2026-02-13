import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check active session on load
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await fetchUserRole(session.user);
      } else {
        setLoading(false);
      }
    };

    checkSession();

    // 2. Listen for auth changes (Login/Logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await fetchUserRole(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Helper: Fetch Custom Role (MYDO_ADMIN vs SK_CHAIR)
  // We assume there is a 'users' table linking auth.uid to a role
  const fetchUserRole = async (authUser) => {
    try {
      const { data, error } = await supabase
        .from('users') // We will create this table in the DB setup step
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (data) {
        setUser({ ...authUser, ...data }); // Merge Auth data with Profile data
      } else {
        // Fallback if no profile found (rare)
        setUser(authUser);
      }
    } catch (err) {
      console.error("Error fetching user role:", err);
    } finally {
      setLoading(false);
    }
  };

  // 3. Login Function
  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  };

  // 4. Logout Function
  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};