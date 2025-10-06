// src/services/validationService.js
import { supabase } from '../lib/supabaseClient';

export class ValidationService {
  /**
   * Fetch data pending validation untuk tabel tertentu
   */
  async fetchPendingData(table) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('input_source', 'user')
        .eq('is_validated', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error(`Error fetching pending data from ${table}:`, error);
      throw error;
    }
  }

  /**
   * Approve/validate data
   */
  async approveData(table, id) {
    try {
      const { data, error } = await supabase
        .from(table)
        .update({ 
          is_validated: true,
          validated_at: new Date().toISOString(),
          validated_by: 'admin' // Bisa diganti dengan user ID admin
        })
        .eq('id', id)
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error approving data in ${table}:`, error);
      throw error;
    }
  }

  /**
   * Reject data - hapus dari database
   */
  async rejectData(table, id) {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error rejecting data in ${table}:`, error);
      throw error;
    }
  }

  /**
   * Get count of pending validations per table
   */
  async getPendingCounts() {
    const tables = [
      'suku', 'marga', 'submarga', 'rumah_adat', 
      'pakaian_tradisional', 'kuliner_tradisional', 
      'senjata_tradisional', 'tarian_tradisional'
    ];

    const counts = {};
    
    for (const table of tables) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true })
          .eq('input_source', 'user')
          .eq('is_validated', false);

        if (error) throw error;
        counts[table] = count || 0;
      } catch (error) {
        console.error(`Error counting pending data in ${table}:`, error);
        counts[table] = 0;
      }
    }

    return counts;
  }

  /**
   * Fetch validated data only (untuk mobile app)
   */
  async fetchValidatedData(table) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .or('is_validated.eq.true,input_source.eq.admin')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error(`Error fetching validated data from ${table}:`, error);
      throw error;
    }
  }
}

export const validationService = new ValidationService();