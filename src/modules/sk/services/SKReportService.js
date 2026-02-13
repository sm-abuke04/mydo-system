import { supabase } from '@/lib/supabase';

export const SKReportService = {
  // Fetch reports categorized by type (Annual, Quarterly, etc.)
  getReports: async () => {
    try {
      const { data, error } = await supabase
        .from('sk_reports') // New table needed in DB
        .select('*')
        .order('due_date', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Supabase Error (getReports):", error);
      throw error;
    }
  },

  // Upload a file and update the report record
  submitReport: async (reportId, file) => {
    try {
      // 1. Upload File to Storage Bucket
      const fileName = `${reportId}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('sk_documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // 2. Update Database Record with Status and File Path
      const { data, error } = await supabase
        .from('sk_reports')
        .update({ 
          status: 'Submitted', 
          submitted_at: new Date(),
          file_path: uploadData.path 
        })
        .eq('id', reportId)
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error("Submission Error:", error);
      throw error;
    }
  }
};