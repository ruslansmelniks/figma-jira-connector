/**
 * Jira API service for interacting with Jira REST API v3
 */
import axios, { AxiosInstance, AxiosError } from 'axios';
import { JiraTicket } from '../types';

/**
 * Jira API service class
 */
export class JiraService {
  private client: AxiosInstance;
  private baseUrl: string;
  private email: string;
  private apiToken: string;

  /**
   * Creates a new JiraService instance
   * @param baseUrl - Jira base URL (e.g., https://your-domain.atlassian.net)
   * @param email - Jira account email
   * @param apiToken - Jira API token
   */
  constructor(baseUrl: string, email: string, apiToken: string) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.email = email;
    this.apiToken = apiToken;

    this.client = axios.create({
      baseURL: `${this.baseUrl}/rest/api/3`,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Generates Basic Auth header for Jira API requests
   * @returns Authorization header value
   */
  private getAuthHeader(): string {
    const credentials = Buffer.from(`${this.email}:${this.apiToken}`).toString('base64');
    return `Basic ${credentials}`;
  }

  /**
   * Fetches tickets assigned to the current user
   * @param userId - Jira user ID or account ID
   * @returns Array of assigned tickets
   * @throws Error if API request fails
   */
  async getAssignedTickets(userId?: string): Promise<JiraTicket[]> {
    try {
      // Build JQL query
      const jql = userId
        ? `assignee = ${userId} AND status IN ("To Do", "In Progress")`
        : 'assignee = currentUser() AND status IN ("To Do", "In Progress")';

      const response = await this.client.get('/search', {
        headers: {
          Authorization: this.getAuthHeader(),
        },
        params: {
          jql,
          fields: ['summary', 'description', 'status', 'priority', 'duedate', 'comment'],
          maxResults: 50,
        },
      });

      return response.data.issues || [];
    } catch (error) {
      const axiosError = error as AxiosError;
      throw new Error(
        `Failed to fetch assigned tickets: ${axiosError.response?.status} ${axiosError.response?.statusText} - ${axiosError.message}`
      );
    }
  }

  /**
   * Fetches a single ticket by ID
   * @param ticketId - Jira ticket ID or key (e.g., "DESIGN-123")
   * @returns Ticket details
   * @throws Error if API request fails
   */
  async getTicket(ticketId: string): Promise<JiraTicket> {
    try {
      const response = await this.client.get(`/issue/${ticketId}`, {
        headers: {
          Authorization: this.getAuthHeader(),
        },
        params: {
          fields: ['summary', 'description', 'status', 'priority', 'duedate', 'comment'],
        },
      });

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 404) {
        throw new Error(`Ticket ${ticketId} not found`);
      }
      throw new Error(
        `Failed to fetch ticket ${ticketId}: ${axiosError.response?.status} ${axiosError.response?.statusText} - ${axiosError.message}`
      );
    }
  }
}

