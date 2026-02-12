// src/services/ProfileService.js

// CONFIGURATION:
// Currently pointing to Local JSON Server.
// LATER: You will replace this URL or this entire file with Supabase logic.
const API_URL = 'http://localhost:5000/api/profiles';

export const ProfileService = {
  
  // GET ALL PROFILES
  getAll: async (query = '') => {
    try {
      const url = query ? `${API_URL}?search=${encodeURIComponent(query)}` : API_URL;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error("API Error (getAll):", error);
      throw error;
    }
  },

  // GET SINGLE PROFILE
  getById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error("API Error (getById):", error);
      throw error;
    }
  },

  // CREATE PROFILE
  create: async (profileData) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error("API Error (create):", error);
      throw error;
    }
  },

  // UPDATE PROFILE
  update: async (id, profileData) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT', // or 'PATCH' depending on your backend
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error("API Error (update):", error);
      throw error;
    }
  },

  // DELETE PROFILE
  delete: async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return true;
    } catch (error) {
      console.error("API Error (delete):", error);
      throw error;
    }
  }
};