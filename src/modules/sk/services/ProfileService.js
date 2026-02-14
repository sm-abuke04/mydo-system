import { supabase } from '../../../lib/supabase'; // Adjust the path as needed
import { INITIAL_FORM_STATE } from '../../sk-system/data/Form_Constants';

// The name of your table in Supabase
const TABLE_NAME = 'profiles'; 

// --- MAPPERS ---
// Convert DB Snake Case -> Frontend Camel Case
const mapToCamelCase = (dbData) => {
  if (!dbData) return null;
  return {
    ...INITIAL_FORM_STATE, // Merge with defaults to ensure all fields exist
    id: dbData.id,
    firstName: dbData.first_name || '',
    middleName: dbData.middle_name || '',
    lastName: dbData.last_name || '',
    suffix: dbData.suffix || '',
    region: dbData.region || INITIAL_FORM_STATE.region,
    province: dbData.province || INITIAL_FORM_STATE.province,
    cityMunicipality: dbData.city_municipality || INITIAL_FORM_STATE.cityMunicipality,
    barangay: dbData.barangay || '',
    purokZone: dbData.purok_zone || '',
    sex: dbData.sex || '',
    age: dbData.age,
    birthday: dbData.birthday,
    email: dbData.email || '',
    contact: dbData.contact || '',
    civilStatus: dbData.civil_status || '',
    // Handle array or string conversion if DB stores as JSON or text array
    youthClassification: Array.isArray(dbData.youth_classification) ? dbData.youth_classification : [],
    youthAgeGroup: dbData.youth_age_group || '',
    workStatus: dbData.work_status || '',
    educationalBackground: dbData.educational_background || '',
    isSkVoter: dbData.is_sk_voter || false,
    isNationalVoter: dbData.is_national_voter || false,
    skmtNo: dbData.skmt_no || ''
  };
};

// Convert Frontend Camel Case -> DB Snake Case
const mapToSnakeCase = (formData) => {
  return {
    first_name: formData.firstName,
    middle_name: formData.middleName,
    last_name: formData.lastName,
    suffix: formData.suffix,
    region: formData.region,
    province: formData.province,
    city_municipality: formData.cityMunicipality,
    barangay: formData.barangay,
    purok_zone: formData.purokZone,
    sex: formData.sex,
    age: formData.age ? parseInt(formData.age) : null,
    birthday: formData.birthday,
    email: formData.email,
    contact: formData.contact,
    civil_status: formData.civilStatus,
    youth_classification: formData.youthClassification, // Assuming DB column is text[] or jsonb
    youth_age_group: formData.youthAgeGroup,
    work_status: formData.workStatus,
    educational_background: formData.educationalBackground,
    is_sk_voter: formData.isSkVoter,
    is_national_voter: formData.isNationalVoter,
    skmt_no: formData.skmtNo // ENABLED: This ensures SKMT No is saved to DB
  };
};

export const ProfileService = {
  
  // GET ALL PROFILES (With optional Search)
  getAll: async (query = '') => {
    try {
      let dbQuery = supabase
        .from(TABLE_NAME)
        .select('*')
        .order('created_at', { ascending: false }); // Show newest first

      if (query) {
        // Search by First Name, Last Name (Case Insensitive)
        dbQuery = dbQuery.or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%`);
      }

      const { data, error } = await dbQuery;

      if (error) throw error;

      // Map all results to camelCase
      return (data || []).map(mapToCamelCase);
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
      return mapToCamelCase(data);
    } catch (error) {
      console.error("Supabase Error (getById):", error.message);
      throw error;
    }
  },

  // CREATE PROFILE
  create: async (profileData) => {
    try {
      const dataToInsert = mapToSnakeCase(profileData);
      
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .insert([dataToInsert])
        .select()
        .single();

      if (error) throw error;
      return mapToCamelCase(data);
    } catch (error) {
      console.error("Supabase Error (create):", error.message);
      throw error;
    }
  },

  // UPDATE PROFILE
  update: async (id, profileData) => {
    try {
      const dataToUpdate = mapToSnakeCase(profileData);

      const { data, error } = await supabase
        .from(TABLE_NAME)
        .update(dataToUpdate)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return mapToCamelCase(data);
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
