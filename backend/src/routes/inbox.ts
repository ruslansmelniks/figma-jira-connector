/**
 * Inbox route handler for fetching and processing Jira tickets
 */
import { Router, Request, Response } from 'express';
import { JiraService } from '../services/jira';
import { ClaudeService } from '../services/claude';
import { initializeDatabase, getSummaryCache, saveSummaryCache } from '../services/database';
import { InboxResponse, InboxTicket, JiraTicket } from '../types';

const router = Router();

/**
 * GET /api/inbox
 * Fetches assigned Jira tickets with AI-generated summaries
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    // Initialize services with environment variables
    const jiraBaseUrl = process.env.JIRA_URL || process.env.JIRA_BASE_URL;
    const jiraEmail = process.env.JIRA_EMAIL;
    const jiraApiToken = process.env.JIRA_API_TOKEN;
    const claudeApiKey = process.env.ANTHROPIC_API_KEY;
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    // Validate required environment variables
    if (!jiraBaseUrl || !jiraEmail || !jiraApiToken) {
      return res.status(500).json({
        error: 'Jira credentials not configured. Please set JIRA_URL (or JIRA_BASE_URL), JIRA_EMAIL, and JIRA_API_TOKEN.',
      });
    }

    if (!claudeApiKey) {
      return res.status(500).json({
        error: 'Claude API key not configured. Please set ANTHROPIC_API_KEY.',
      });
    }

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({
        error: 'Supabase credentials not configured. Please set SUPABASE_URL and SUPABASE_KEY.',
      });
    }

    // Initialize services
    const jiraService = new JiraService(jiraBaseUrl, jiraEmail, jiraApiToken);
    const claudeService = new ClaudeService(claudeApiKey);
    initializeDatabase(supabaseUrl, supabaseKey);

    // Fetch assigned tickets from Jira
    const jiraTickets = await jiraService.getAssignedTickets();

    // Process each ticket
    const inboxTickets: InboxTicket[] = await Promise.all(
      jiraTickets.map(async (ticket: JiraTicket) => {
        const ticketId = ticket.key;
        const comments = ticket.fields.comment?.comments || [];
        const commentCount = comments.length;

        // Check cache first
        let quickSummary: string;
        let cachedSummary = await getSummaryCache(ticketId);

        if (cachedSummary) {
          // Use cached summary
          quickSummary = cachedSummary.quick;
        } else {
          // Generate new summary with Claude
          try {
            const summary = await claudeService.generateTicketSummary(ticket);
            quickSummary = summary.quick;

            // Save to cache
            await saveSummaryCache(ticketId, summary.quick, summary.full);
          } catch (error) {
            const err = error as Error;
            console.error(`Failed to generate summary for ${ticketId}:`, err.message);
            // Fallback summary
            quickSummary = `Design and implement: ${ticket.fields.summary}`;
          }
        }

        return {
          id: ticketId,
          title: ticket.fields.summary,
          status: ticket.fields.status.name,
          priority: ticket.fields.priority?.name,
          quickSummary,
          hasComments: commentCount > 0,
          commentCount,
        };
      })
    );

    const response: InboxResponse = {
      tickets: inboxTickets,
    };

    res.json(response);
  } catch (error) {
    const err = error as Error;
    console.error('Error in inbox route:', err);
    res.status(500).json({
      error: 'Failed to fetch inbox tickets',
      message: err.message,
    });
  }
});

export default router;

