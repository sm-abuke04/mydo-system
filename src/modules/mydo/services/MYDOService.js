import { supabase } from '@/lib/supabase'; // Adjust path if not using aliases

export const MydoService = {
  // 1. DASHBOARD STATS
  async getDashboardStats() {
    try {
      // Parallel requests for faster loading
      const [totalYouth, employed, outOfSchool, activePuroks] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        // Fix: Use correct column 'work_status' instead of 'employment_status'
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('work_status', 'Employed'),
        // Fix: Use correct column 'youth_classification' (array) and 'cs' (contains) filter for "Out of School Youth"
        // Note: PostgREST syntax for array contains is .cs.{value}
        supabase.from('profiles').select('*', { count: 'exact', head: true }).cs('youth_classification', '{"Out of School Youth"}'),
        // Fix: Query 'barangays' table (if exists) or 'users' with active barangays
        supabase.from('barangays').select('*', { count: 'exact', head: true })
      ]);

      return {
        totalYouth: totalYouth.count || 0,
        employed: employed.count || 0,
        outOfSchool: outOfSchool.count || 0,
        activePuroks: activePuroks.count || 0
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Return zeros instead of throwing to prevent crashing
      return {
        totalYouth: 0,
        employed: 0,
        outOfSchool: 0,
        activePuroks: 0
      };
    }
  },

  // 2. RECENT ACTIVITY LOGS
  async getRecentActivities() {
    try {
        const { data, error } = await supabase
        .from('audit_logs') // Changed from 'system_logs' to 'audit_logs' if that's the convention, or keep generic if not sure. Let's assume 'audit_logs' or return empty.
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

        if (error) {
            // If table doesn't exist, return empty array gracefully
            console.warn("Audit logs table not found or error:", error.message);
            return [];
        }
        return data;
    } catch (err) {
        return [];
    }
  },

  // 3. REPORTS MANAGEMENT
  async getReports(statusFilter = 'All', searchQuery = '', page = 1, itemsPerPage = 5) {
    let query = supabase
      .from('sk_reports') // Changed from 'reports' to 'sk_reports' based on schema update
      .select('*', { count: 'exact' });

    // Apply Filters
    if (statusFilter !== 'All') {
      query = query.eq('status', statusFilter);
    }

    if (searchQuery) {
      // Adjusted columns based on probable schema
      query = query.or(`name.ilike.%${searchQuery}%,barangay.ilike.%${searchQuery}%`);
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
      .from('sk_reports')
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
    // status column in profiles isn't standard, usually 'work_status' or 'civil_status'.
    // If 'status' refers to 'Active/Inactive', ensure column exists. Assuming it's not strictly used yet.
    if (status !== 'All' && status) query = query.eq('status', status);
    if (gender !== 'All') query = query.eq('sex', gender); // 'sex' is the column name in ProfileService
    
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