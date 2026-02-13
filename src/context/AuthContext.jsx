import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper: Fetch Role & Check Status
  const fetchUserRole = async (authUser) => {
    try {
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (data) {
        // ENFORCE PENDING CHECK
        if (data.status === 'Pending') {
           // If pending, do not set user state (keeps them logged out in UI)
           // But strictly speaking we should sign them out from Supabase too
           await supabase.auth.signOut();
           throw new Error("Account Pending");
        }
        const enrichedUser = { ...authUser, ...data };
        setUser(enrichedUser);
        return { user: enrichedUser };
      } else {
        // If authenticated in Supabase Auth but no profile in 'users' table
        // We must consider this an error because the app relies on 'role'
        console.warn("User authenticated but no profile found in 'users' table.");
        await supabase.auth.signOut();
        setUser(null);
        throw new Error("Profile not found. Please contact administrator.");
      }
    } catch (err) {
      console.error("Error fetching user role:", err);
      // If error (like Pending or Profile Missing), force logout state
      setUser(null); 
      return { error: err };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await fetchUserRole(session.user);
      } else {
        setLoading(false);
      }
    };
    checkSession();

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

  const login = async (email, password) => {
    // 1. Authenticate with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return { error };

    // 2. Fetch Profile & Check Status
    const roleCheck = await fetchUserRole(data.user);
    
    // If fetchUserRole returned an error (like "Account Pending"), pass it up
    if (roleCheck?.error) return { error: roleCheck.error };

    return { user: roleCheck.user };
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);