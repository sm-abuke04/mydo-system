import { supabase } from '@/lib/supabase';

// --- MAPPERS ---
// DB Snake Case -> Frontend Camel Case
const mapToCamelCase = (dbData) => {
  if (!dbData) return null;
  return {
    id: dbData.id,
    skmtNo: dbData.skmt_no || '',
    name: dbData.name || '',
    position: dbData.position || '',
    birthdate: dbData.birthdate || '',
    age: dbData.age || '',
    status: dbData.status || 'Active',
    barangay: dbData.barangay || ''
  };
};

// Frontend Camel Case -> DB Snake Case
const mapToSnakeCase = (formData) => {
  return {
    skmt_no: formData.skmtNo,
    name: formData.name,
    position: formData.position,
    birthdate: formData.birthdate,
    age: formData.age ? parseInt(formData.age) : null,
    status: formData.status,
    // barangay: formData.barangay // If we add barangay field later
  };
};

export const SKOfficialService = {
  // GET ALL OFFICIALS
  getAll: async () => {
    try {
      const { data, error } = await supabase
        .from('sk_officials')
        .select('*')
        .order('id', { ascending: true }); // Ideally order by rank/position if possible

      if (error) throw error;
      return (data || []).map(mapToCamelCase);
    } catch (error) {
      console.error("Supabase Error (getOfficials):", error);
      throw error;
    }
  },

  // ADD OFFICIAL
  create: async (data) => {
    try {
      const dataToInsert = mapToSnakeCase(data);
      const { data: result, error } = await supabase
        .from('sk_officials')
        .insert([dataToInsert])
        .select()
        .single();

      if (error) throw error;
      return mapToCamelCase(result);
    } catch (error) {
      console.error("Supabase Error (createOfficial):", error);
      throw error;
    }
  },

  // UPDATE OFFICIAL
  update: async (id, data) => {
    try {
      const dataToUpdate = mapToSnakeCase(data);
      const { data: result, error } = await supabase
        .from('sk_officials')
        .update(dataToUpdate)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return mapToCamelCase(result);
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
