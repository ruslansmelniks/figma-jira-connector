/**
 * Claude AI service for generating ticket summaries
 */
import Anthropic from '@anthropic-ai/sdk';
import { JiraTicket, TicketSummary } from '../types';

/**
 * Claude AI service class
 */
export class ClaudeService {
  private client: Anthropic;

  /**
   * Creates a new ClaudeService instance
   * @param apiKey - Anthropic API key
   */
  constructor(apiKey: string) {
    this.client = new Anthropic({
      apiKey,
    });
  }

  /**
   * Generates quick and full summaries for a Jira ticket
   * @param ticket - Jira ticket to summarize
   * @returns Object containing quick and full summaries
   * @throws Error if API request fails
   */
  async generateTicketSummary(ticket: JiraTicket): Promise<TicketSummary> {
    try {
      const prompt = this.buildPrompt(ticket);

      const response = await this.client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Claude API');
      }

      const fullText = content.text;
      const summaries = this.parseSummaries(fullText);

      return {
        quick: summaries.quick,
        full: summaries.full,
      };
    } catch (error) {
      const err = error as Error;
      throw new Error(`Failed to generate ticket summary: ${err.message}`);
    }
  }

  /**
   * Builds the prompt for Claude AI
   * @param ticket - Jira ticket
   * @returns Formatted prompt string
   */
  private buildPrompt(ticket: JiraTicket): string {
    const { key, fields } = ticket;
    const description = fields.description || 'No description provided.';
    const priority = fields.priority?.name || 'Not set';
    const dueDate = fields.duedate || 'No due date';
    const comments = fields.comment?.comments || [];
    const commentText = comments.length > 0
      ? comments.map(c => `- ${c.author.displayName}: ${c.body}`).join('\n')
      : 'No comments';

    return `You are analyzing a Jira ticket for a design team. Generate TWO summaries:

TICKET: ${key}
TITLE: ${fields.summary}
DESCRIPTION: ${description}
PRIORITY: ${priority}
DUE DATE: ${dueDate}
COMMENTS:
${commentText}

Please provide your response in the following EXACT format:

===QUICK SUMMARY===
[2-3 sentences describing what needs to be built. Be concise and actionable.]

===FULL SUMMARY===
🎯 WHAT TO BUILD
[Detailed description of what needs to be designed/built]

⚠️ KEY CONSTRAINTS
[Important limitations, requirements, or constraints to consider]

📋 WHY THIS MATTERS
[Context about why this ticket is important and its impact]

Focus on actionable design information that will help a designer understand what to create.`;
  }

  /**
   * Parses the response from Claude into quick and full summaries
   * @param responseText - Full response text from Claude
   * @returns Parsed summaries object
   */
  private parseSummaries(responseText: string): TicketSummary {
    const quickMatch = responseText.match(/===QUICK SUMMARY===\s*(.*?)(?=\s*===FULL SUMMARY===|$)/s);
    const fullMatch = responseText.match(/===FULL SUMMARY===\s*(.*?)$/s);

    const quick = quickMatch
      ? quickMatch[1].trim()
      : 'Summary generation failed. Please review the ticket manually.';

    const full = fullMatch
      ? fullMatch[1].trim()
      : 'Full summary generation failed. Please review the ticket manually.';

    return { quick, full };
  }
}

