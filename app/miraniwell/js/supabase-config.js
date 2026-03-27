/**
 * Mirani Well — Supabase Configuration
 * Developed by StynerDev (Kishana Stiner)
 */

var SUPABASE_URL = 'https://xoqnbkwomilugpgsawmk.supabase.co';
var SUPABASE_ANON_KEY = 'sb_publishable_ombVulg5Nz29geuDwWVVvA_tiTP37px';

var supabaseClient = null;

function getSupabase() {
  if (!supabaseClient) {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return supabaseClient;
}
