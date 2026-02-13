import { supabase } from '../../../lib/supabase'; // Adjust the path as needed

// The name of your table in Supabase
const TABLE_NAME = 'profiles'; 

export const ProfileService = {
  
  // GET ALL PROFILES (With optional Search)
  getAll: async (query = '') => {
    try {
      let dbQuery = supabase
        .from(TABLE_NAME)
        .select('*')
        .order('created_at', { ascending: false }); // Show newest first

      if (query) {
        // Search by First Name, Last Name, or SKMT Number (Case Insensitive)
        // Fixed: Use snake_case column names to match database schema
        dbQuery = dbQuery.or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,skmt_no.ilike.%${query}%`);
      }

      const { data, error } = await dbQuery;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Supabase Error (getAll):", error.message);
      throw error;
    }
  },

  // GET SINGLE PROFILE
  getById: async (id) => {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Supabase Error (getById):", error.message);
      throw error;
    }
  },

  // CREATE PROFILE
  create: async (profileData) => {
    try {
      // Remove 'id' if it exists to let Supabase auto-generate it
      // eslint-disable-next-line no-unused-vars
      const { id, ...dataToInsert } = profileData;
      
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .insert([dataToInsert])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Supabase Error (create):", error.message);
      throw error;
    }
  },

  // UPDATE PROFILE
  update: async (id, profileData) => {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .update(profileData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Supabase Error (update):", error.message);
      throw error;
    }
  },

  // DELETE PROFILE
  delete: async (id) => {
    try {
      const { error } = await supabase
        .from(TABLE_NAME)
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Supabase Error (delete):", error.message);
      throw error;
    }
  }
};