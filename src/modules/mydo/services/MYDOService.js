import { supabase } from '@/lib/supabase'; // Adjust path if not using aliases

export const MydoService = {
  // 1. DASHBOARD STATS
  async getDashboardStats() {
    try {
      // Parallel requests for faster loading
      const [totalYouth, employed, outOfSchool, activePuroks] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('employment_status', 'Employed'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('education_status', 'Out of School Youth'),
        supabase.from('barangays').select('*', { count: 'exact', head: true }).eq('status', 'Active') // Assuming 'barangays' table exists
      ]);

      return {
        totalYouth: totalYouth.count || 0,
        employed: employed.count || 0,
        outOfSchool: outOfSchool.count || 0,
        activePuroks: activePuroks.count || 0
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  },

  // 2. RECENT ACTIVITY LOGS
  async getRecentActivities() {
    const { data, error } = await supabase
      .from('system_logs') // Ensure you create this table in Supabase
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) throw error;
    return data;
  },

  // 3. REPORTS MANAGEMENT
  async getReports(statusFilter = 'All', searchQuery = '', page = 1, itemsPerPage = 5) {
    let query = supabase
      .from('reports') // Ensure you create this table in Supabase
      .select('*', { count: 'exact' });

    // Apply Filters
    if (statusFilter !== 'All') {
      query = query.eq('status', statusFilter);
    }

    if (searchQuery) {
      query = query.or(`type.ilike.%${searchQuery}%,submitted_by.ilike.%${searchQuery}%,barangay.ilike.%${searchQuery}%`);
    }

    // Pagination
    const from = (page - 1) * itemsPerPage;
    const to = from + itemsPerPage - 1;
    
    const { data, count, error } = await query
      .range(from, to)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, count };
  },

  async updateReportStatus(id, newStatus) {
    const { data, error } = await supabase
      .from('reports')
      .update({ status: newStatus })
      .eq('id', id)
      .select();

    if (error) throw error;
    return data;
  },

  async getAllBarangays() {
    // Fetches all barangays for the Map and Dropdowns
    const { data, error } = await supabase
      .from('barangays')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data;
  },

  // --- PROFILE MANAGEMENT ---
  async getProfiles({ barangay = null, search = '', status = 'All', gender = 'All', page = 1, limit = 10 }) {
    let query = supabase
      .from('profiles')
      .select('*', { count: 'exact' });

    // 1. Apply Filters
    if (barangay) query = query.eq('barangay', barangay);
    if (status !== 'All') query = query.eq('status', status);
    if (gender !== 'All') query = query.eq('gender', gender);
    
    // 2. Apply Search (Check First/Last Name or SKMT ID)
    if (search) {
      query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,skmt_no.ilike.%${search}%`);
    }

    // 3. Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, count, error } = await query
      .range(from, to)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, count };
  },

  async createProfile(profileData) {
    const { data, error } = await supabase.from('profiles').insert([profileData]).select();
    if (error) throw error;
    return data;
  },

  async updateProfile(id, profileData) {
    const { data, error } = await supabase.from('profiles').update(profileData).eq('id', id).select();
    if (error) throw error;
    return data;
  },

  async deleteProfile(id) {
    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (error) throw error;
    return true;
  }
};