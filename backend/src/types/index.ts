/**
 * TypeScript type definitions for FigmaFlow backend
 */

/**
 * Jira ticket priority levels
 */
export type JiraPriority = 'Lowest' | 'Low' | 'Medium' | 'High' | 'Highest' | 'Critical';

/**
 * Jira ticket status
 */
export type JiraStatus = 'To Do' | 'In Progress' | 'Done' | 'In Review' | 'Blocked';

/**
 * Jira comment structure
 */
export interface JiraComment {
  id: string;
  author: {
    displayName: string;
    emailAddress: string;
  };
  body: string;
  created: string;
}

/**
 * Jira ticket fields structure
 */
export interface JiraTicketFields {
  summary: string;
  description?: string;
  status: {
    name: string;
  };
  priority?: {
    name: JiraPriority;
  };
  duedate?: string;
  comment?: {
    comments: JiraComment[];
  };
}

/**
 * Complete Jira ticket structure from API
 */
export interface JiraTicket {
  id: string;
  key: string;
  fields: JiraTicketFields;
}

/**
 * Ticket summary structure
 */
export interface TicketSummary {
  quick: string;
  full: string;
}

/**
 * Ticket in inbox response format
 */
export interface InboxTicket {
  id: string;
  title: string;
  status: string;
  priority?: string;
  quickSummary: string;
  hasComments: boolean;
  commentCount: number;
}

/**
 * Inbox API response structure
 */
export interface InboxResponse {
  tickets: InboxTicket[];
}

