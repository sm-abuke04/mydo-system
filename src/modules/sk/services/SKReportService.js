import { supabase } from '@/lib/supabase';

export const SKReportService = {
  // 1. GET ALL REPORTS FOR A SPECIFIC BARANGAY
  getReportsByBarangay: async (barangayName) => {
    try {
      const { data, error } = await supabase
        .from('sk_reports')
        .select('*')
        .eq('barangay', barangayName)
        .order('category', { ascending: true }); // Groups them roughly

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Supabase Error (getReports):", error);
      throw error;
    }
  },

  // 2. SUBMIT A REPORT (Update File & Status)
  submitReport: async (reportId, file, userId, barangayName) => {
    try {
      // A. Upload File to Storage
      // Use barangay/filename structure
      const filePath = `${barangayName}/${reportId}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('sk_documents')
        .upload(filePath, file, {
            upsert: true
        });

      if (uploadError) throw uploadError;

      // B. Update Database Record
      const { data, error } = await supabase
        .from('sk_reports')
        .update({
          status: 'Submitted',
          submitted_at: new Date().toISOString(),
          file_path: uploadData.path,
          user_id: userId // Tracks who uploaded it
        })
        .eq('id', reportId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Submission Error:", error);
      throw error;
    }
  },

  // 3. INITIALIZE REPORT LIST FOR A NEW BARANGAY (Run once per year/term)
  initializeReportsForBarangay: async (barangayName) => {
    // Standard List of Reports
    const standardReports = [
        // ANNUAL
        { name: "CBYDP (3 annum coverage)", category: "Annual Requirements", barangay: barangayName },
        { name: "ABYIP", category: "Annual Requirements", barangay: barangayName },
        { name: "Annual Budget", category: "Annual Requirements", barangay: barangayName },
        { name: "KK Profiling", category: "Annual Requirements", barangay: barangayName },
        { name: "SK Directory", category: "Annual Requirements", barangay: barangayName },
        { name: "Fund Utilization Report", category: "Annual Requirements", barangay: barangayName },
        { name: "ABYIP Monitoring Form", category: "Annual Requirements", barangay: barangayName },

        // QUARTERLY
        { name: "SK FPDP Board Compliance Report (Q1)", category: "Quarterly Requirements", barangay: barangayName },
        { name: "SK FPDP Board Compliance Report (Q2)", category: "Quarterly Requirements", barangay: barangayName },
        { name: "SK FPDP Board Compliance Report (Q3)", category: "Quarterly Requirements", barangay: barangayName },
        { name: "SK FPDP Board Compliance Report (Q4)", category: "Quarterly Requirements", barangay: barangayName },

        // MONTHLY (Example: Jan-Dec)
        { name: "SK Session Documents (January)", category: "Monthly Requirements", barangay: barangayName },
        { name: "SK Session Documents (February)", category: "Monthly Requirements", barangay: barangayName },
        { name: "SK Session Documents (March)", category: "Monthly Requirements", barangay: barangayName },
        // ... Add all months as needed
    ];

    try {
        const { data, error } = await supabase
            .from('sk_reports')
            .insert(standardReports)
            .select();

        if (error) throw error;
        return data;
    } catch (err) {
        console.error("Initialization Error:", err);
        throw err;
    }
  }
};
