// src/lib/supabaseClient.js (Pastikan ini ada)
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://cdwdmevwsgmqvjyuhhhf.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkd2RtZXZ3c2dtcXZqeXVoaGhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1NzQ1NTQsImV4cCI6MjA2MTE1MDU1NH0.SrTGcwTqUUKPSblbOF0q3u-BvFC8-qFiRCUDec-eA9s";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);