import { supabaseUrl, supabaseKey } from '../config/supabaseConfig';
import { supabase } from '../lib/supabaseClient'; // Ini memang diimpor, tapi tidak digunakan untuk fetchData, insert, update, delete.
                                                 // Anda bisa memilih untuk menggunakan supabase client atau raw fetch.
                                                 // Jika ingin pakai raw fetch, import ini tidak perlu di sini.

// Supabase Service Class
export class SupabaseService {
  constructor() {
    this.supabaseUrl = supabaseUrl;
    this.supabaseKey = supabaseKey;
  }

  async fetchData(table) {
    try {
      const response = await fetch(`${this.supabaseUrl}/rest/v1/${table}?select=*`, {
        headers: {
          'apikey': this.supabaseKey,
          'Authorization': `Bearer ${this.supabaseKey}`,
          'Content-Type': 'application/json'
        }
      });

      // --- PERBAIKAN DIMULAI DI SINI ---
      if (!response.ok) { // Cek apakah respons HTTP adalah OK (status 200-299)
        const errorData = await response.json().catch(() => ({ message: response.statusText || 'Unknown error' }));
        console.error(`Error fetching ${table}: Status ${response.status}`, errorData);
        throw new Error(`Failed to fetch data from ${table}: ${errorData.message || JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      return data || []; // Pastikan selalu mengembalikan array, bahkan jika data null/undefined
      // --- PERBAIKAN BERAKHIR DI SINI ---

    } catch (error) {
      console.error(`An unexpected error occurred while fetching ${table}:`, error);
      throw error;
    }
  }

  async insertData(table, data) {
    try {
      const response = await fetch(`${this.supabaseUrl}/rest/v1/${table}`, {
        method: 'POST',
        headers: {
          'apikey': this.supabaseKey,
          'Authorization': `Bearer ${this.supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText || 'Unknown error' }));
        console.error(`Error inserting into ${table}: Status ${response.status}`, errorData);
        throw new Error(`Failed to insert data into ${table}: ${errorData.message || JSON.stringify(errorData)}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`An unexpected error occurred while inserting into ${table}:`, error);
      throw error;
    }
  }

  async updateData(table, id, data) {
    try {
      const response = await fetch(`${this.supabaseUrl}/rest/v1/${table}?id=eq.${id}`, {
        method: 'PATCH',
        headers: {
          'apikey': this.supabaseKey,
          'Authorization': `Bearer ${this.supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText || 'Unknown error' }));
        console.error(`Error updating ${table}: Status ${response.status}`, errorData);
        throw new Error(`Failed to update data in ${table}: ${errorData.message || JSON.stringify(errorData)}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`An unexpected error occurred while updating ${table}:`, error);
      throw error;
    }
  }

  async deleteData(table, id) {
    try {
      const response = await fetch(`${this.supabaseUrl}/rest/v1/${table}?id=eq.${id}`, {
        method: 'DELETE',
        headers: {
          'apikey': this.supabaseKey,
          'Authorization': `Bearer ${this.supabaseKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText || 'Unknown error' }));
        console.error(`Error deleting from ${table}: Status ${response.status}`, errorData);
        throw new Error(`Failed to delete data from ${table}: ${errorData.message || JSON.stringify(errorData)}`);
      }

      return response.ok; // Mengembalikan true jika sukses
    } catch (error) {
      console.error(`An unexpected error occurred while deleting from ${table}:`, error);
      throw error;
    }
  }
}

export const supabaseService = new SupabaseService();