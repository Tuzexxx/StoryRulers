// --- Supabase Client ---
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Sign up a new user with email/password
 */
export const signUp = async (email, password) => {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
};

/**
 * Sign in an existing user
 */
export const signIn = async (email, password) => {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
};

/**
 * Sign out
 */
export const signOut = async () => {
  if (!supabase) return;
  await supabase.auth.signOut();
};

/**
 * Get current user session
 */
export const getSession = async () => {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session;
};

/**
 * Save game state to Supabase
 */
export const saveGameState = async (userId, gameData) => {
  if (!supabase) return;
  
  const { error } = await supabase
    .from('game_saves')
    .upsert({
      user_id: userId,
      language: gameData.language,
      theme: gameData.theme,
      youngest_age: gameData.youngestAge,
      players_context: gameData.playersContext,
      world_memory: gameData.worldMemory,
      public_chronicle: gameData.publicChronicle,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });
  
  if (error) console.error('Save error:', error);
};

/**
 * Load game state from Supabase
 */
export const loadGameState = async (userId) => {
  if (!supabase) return null;
  
  const { data, error } = await supabase
    .from('game_saves')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error || !data) return null;
  
  return {
    language: data.language,
    theme: data.theme,
    youngestAge: data.youngest_age,
    playersContext: data.players_context,
    worldMemory: data.world_memory || [],
    publicChronicle: data.public_chronicle || [],
    setupComplete: !!data.players_context,
  };
};
