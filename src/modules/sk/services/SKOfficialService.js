import { supabase } from '@/lib/supabase';

export const SKOfficialService = {
  // GET ALL OFFICIALS
  getAll: async () => {
    try {
      const { data, error } = await supabase
        .from('sk_officials')
        .select('*')
        .order('rank', { ascending: true }); // Assuming you add a 'rank' column for sorting (Chairperson first)

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Supabase Error (getOfficials):", error);
      throw error;
    }
  },

  // ADD OFFICIAL
  create: async (data) => {
    try {
      const { data: result, error } = await supabase
        .from('sk_officials')
        .insert([data])
        .select();

      if (error) throw error;
      return result[0];
    } catch (error) {
      console.error("Supabase Error (createOfficial):", error);
      throw error;
    }
  },

  // UPDATE OFFICIAL
  update: async (id, data) => {
    try {
      const { data: result, error } = await supabase
        .from('sk_officials')
        .update(data)
        .eq('id', id)
        .select();

      if (error) throw error;
      return result[0];
    } catch (error) {
      console.error("Supabase Error (updateOfficial):", error);
      throw error;
    }
  },

  // DELETE OFFICIAL
  delete: async (id) => {
    try {
      const { error } = await supabase
        .from('sk_officials')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Supabase Error (deleteOfficial):", error);
      throw error;
    }
  },
};