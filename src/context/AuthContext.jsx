import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Check LocalStorage on Load (Persist Login)
  useEffect(() => {
    const storedUser = localStorage.getItem('mydo_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // 2. Mock Login Function (Replace with API/Supabase later)
  const login = async (username, password) => {
    // Simulate Network Delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // --- MOCK CREDENTIALS LOGIC ---
    let userData = null;

    if (username === 'admin' && password === 'admin123') {
      // SCENARIO 1: MYDO Admin
      userData = {
        id: 1,
        username: 'admin',
        firstName: 'Jules',
        lastName: 'Admin',
        role: 'MYDO_ADMIN',
        avatar: null
      };
    } else if (username === 'sk_poblacion' && password === 'sk123') {
      // SCENARIO 2: SK Chairperson (Barangay Specific)
      userData = {
        id: 2,
        username: 'sk_poblacion',
        firstName: 'Juan',
        lastName: 'Dela Cruz',
        role: 'SK_CHAIR', // or 'SK_SEC'
        barangay: 'Poblacion',
        avatar: null
      };
    } else {
      throw new Error('Invalid username or password');
    }

    // Success: Save to State and Storage
    setUser(userData);
    localStorage.setItem('mydo_user', JSON.stringify(userData));
    return userData;
  };

  // 3. Logout Function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('mydo_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom Hook for easier usage
export const useAuth = () => {
  return useContext(AuthContext);
};