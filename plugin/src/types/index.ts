/**
 * TypeScript types for FigmaFlow plugin
 */

export interface Ticket {
  id: string;
  title: string;
  status: string;
  priority: string;
  quickSummary: string;
  fullSummary?: string;
  hasComments: boolean;
  commentCount: number;
}

export interface InboxResponse {
  tickets: Ticket[];
}

export type ViewType = 'inbox' | 'summary';

