import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchingRef = useRef(false); // Ref to prevent simultaneous fetches

  // Helper: Fetch Role & Check Status
  const fetchUserRole = async (authUser) => {
    if (!authUser || fetchingRef.current) return;

    fetchingRef.current = true;
    console.log("AuthContext: Fetching profile for", authUser.email);

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error) {
        console.error("AuthContext: Error fetching profile:", error);
        // If RLS prevents access or row missing, treat as error
        throw new Error("Profile fetch failed: " + error.message);
      }

      if (data) {
        console.log("AuthContext: Profile found:", data);

        // ENFORCE PENDING CHECK
        if (data.status === 'Pending') {
           console.warn("AuthContext: Account is pending.");
           await supabase.auth.signOut();
           throw new Error("Account Pending Approval");
        }

        // Merge: DB data overrides Auth data (e.g. role)
        const enrichedUser = { ...authUser, ...data };

        // Ensure role is present (fallback if missing in DB, though schema says it exists)
        if (!enrichedUser.role) {
            console.warn("AuthContext: User has no role!", enrichedUser);
        }

        setUser(enrichedUser);
        return { user: enrichedUser };
      } else {
        console.warn("AuthContext: No profile data returned.");
        await supabase.auth.signOut();
        setUser(null);
        throw new Error("Profile not found.");
      }
    } catch (err) {
      console.error("AuthContext Error:", err);
      setUser(null); 
      return { error: err };
    } finally {
      fetchingRef.current = false;
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && mounted) {
           await fetchUserRole(session.user);
        } else if (mounted) {
           setLoading(false);
        }
      } catch (error) {
        console.error("Session check failed", error);
        if (mounted) setLoading(false);
      }
    };

    initializeAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      // console.log("Auth Event:", event);
      if (event === 'SIGNED_IN' && session?.user) {
        // Only fetch if we are not already fetching (handled by ref)
        if (!fetchingRef.current) {
            await fetchUserRole(session.user);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
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

    // 2. Fetch Profile Immediately (Bypass onAuthStateChange delay)
    // We force a fetch here because Login component needs the result now
    // Reset fetching ref to allow this explicit call
    fetchingRef.current = false;
    const roleCheck = await fetchUserRole(data.user);
    
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