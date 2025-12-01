/**
 * Backend API client for FigmaFlow plugin
 */

import type { InboxResponse } from '../types';

// Determine API URL - check if localhost:3000 is available, else use env var
const API_URL = (() => {
  // In Figma plugin, we can't easily check if localhost is available
  // So we'll try localhost first, and fall back to env var if needed
  const envUrl = import.meta.env.VITE_API_URL;
  return envUrl || 'http://localhost:3000';
})();

console.log('API URL:', API_URL);

/**
 * Fetch inbox tickets from backend
 */
export async function fetchInbox(): Promise<InboxResponse> {
  try {
    console.log('Fetching inbox from:', `${API_URL}/api/inbox`);
    const response = await fetch(`${API_URL}/api/inbox`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch inbox: ${response.status} ${response.statusText}`);
    }

    const data: InboxResponse = await response.json();
    console.log('Inbox fetched successfully:', data);
    return data;
  } catch (error) {
    console.error('Error fetching inbox:', error);
    throw error;
  }
}

/**
 * Fetch full summary for a specific ticket
 */
export async function fetchFullSummary(ticketId: string): Promise<{ full: string }> {
  try {
    console.log('Fetching full summary for ticket:', ticketId);
    const response = await fetch(`${API_URL}/api/summary/${ticketId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch summary: ${response.status} ${response.statusText}`);
    }

    const data: { full: string } = await response.json();
    console.log('Full summary fetched successfully');
    return data;
  } catch (error) {
    console.error('Error fetching full summary:', error);
    throw error;
  }
}

