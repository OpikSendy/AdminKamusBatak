import { useState, useEffect } from 'react';
import { supabaseService } from '../services/supabaseService';

export const useSupabaseData = (table) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
  if (!activeMenuItem) return;
  try {
    setIsLoading(true);
    const result = await supabaseService.fetchData(activeMenuItem.table);
    setData(prev => ({ ...prev, [activeMenu]: result }));
  } catch (error) {
    console.error(`Error fetching ${activeMenuItem.table}:`, error);
    alert(`Gagal memuat data ${activeMenuItem.label}`);
  } finally {
    setIsLoading(false);
  }
  }, [activeMenu, activeMenuItem, supabaseService]);

 useEffect(() => {
  if (activeMenu) {
    fetchData();
  }
  }, [activeMenu, fetchData]); 

  return { data, isLoading, error, refetch: fetchData };
};