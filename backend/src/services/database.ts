/**
 * Supabase database service for caching ticket summaries
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { TicketSummary } from '../types';

/**
 * Supabase client instance
 */
let supabaseClient: SupabaseClient | null = null;

/**
 * Initializes the Supabase client
 * @param supabaseUrl - Supabase project URL
 * @param supabaseKey - Supabase anon/service role key
 * @returns Supabase client instance
 */
export function initializeDatabase(supabaseUrl: string, supabaseKey: string): SupabaseClient {
  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseKey);
  }
  return supabaseClient;
}

/**
 * Gets the Supabase client instance
 * @returns Supabase client or null if not initialized
 */
export function getDatabaseClient(): SupabaseClient | null {
  return supabaseClient;
}

/**
 * Saves a ticket summary to the cache
 * @param ticketId - Jira ticket ID or key
 * @param quickSummary - Quick summary text
 * @param fullSummary - Full summary text
 * @throws Error if database operation fails
 */
export async function saveSummaryCache(
  ticketId: string,
  quickSummary: string,
  fullSummary: string
): Promise<void> {
  if (!supabaseClient) {
    throw new Error('Database client not initialized. Call initializeDatabase first.');
  }

  try {
    const { error } = await supabaseClient
      .from('ticket_summaries')
      .upsert(
        {
          jira_ticket_id: ticketId,
          summary_text: quickSummary,
          full_summary: fullSummary,
        },
        {
          onConflict: 'jira_ticket_id',
        }
      );

    if (error) {
      throw error;
    }
  } catch (error) {
    const err = error as Error;
    throw new Error(`Failed to save summary cache: ${err.message}`);
  }
}

/**
 * Retrieves a cached ticket summary
 * @param ticketId - Jira ticket ID or key
 * @returns Cached summary or null if not found
 * @throws Error if database operation fails
 */
export async function getSummaryCache(ticketId: string): Promise<TicketSummary | null> {
  if (!supabaseClient) {
    throw new Error('Database client not initialized. Call initializeDatabase first.');
  }

  try {
    const { data, error } = await supabaseClient
      .from('ticket_summaries')
      .select('summary_text, full_summary')
      .eq('jira_ticket_id', ticketId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      throw error;
    }

    if (!data) {
      return null;
    }

    return {
      quick: data.summary_text,
      full: data.full_summary,
    };
  } catch (error) {
    const err = error as Error;
    throw new Error(`Failed to get summary cache: ${err.message}`);
  }
}

