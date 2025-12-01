/**
 * SummaryView component - displays full ticket summary
 */

import { useState, useEffect } from 'react';
import type { Ticket } from '../types';
import { fetchFullSummary } from '../api/backend';

interface SummaryViewProps {
  ticket: Ticket;
  onBack: () => void;
}

export default function SummaryView({ ticket, onBack }: SummaryViewProps) {
  const [fullSummary, setFullSummary] = useState<string | null>(ticket.fullSummary || null);
  const [loading, setLoading] = useState<boolean>(!ticket.fullSummary);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ticket.fullSummary) {
      loadFullSummary();
    }
  }, [ticket.id]);

  const loadFullSummary = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchFullSummary(ticket.id);
      setFullSummary(data.full);
    } catch (err) {
      console.error('Failed to load full summary:', err);
      setError(err instanceof Error ? err.message : 'Failed to load summary');
    } finally {
      setLoading(false);
    }
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  };

  const backButtonStyle: React.CSSProperties = {
    padding: '8px 12px',
    backgroundColor: 'transparent',
    color: '#0066FF',
    border: '1px solid #0066FF',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    alignSelf: 'flex-start',
    transition: 'all 0.2s ease',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    paddingBottom: '16px',
    borderBottom: '1px solid #e0e0e0',
  };

  const ticketIdStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#0066FF',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
    lineHeight: '1.4',
  };

  const metaStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '8px',
    flexWrap: 'wrap',
  };

  const badgeStyle: React.CSSProperties = {
    fontSize: '11px',
    padding: '4px 8px',
    borderRadius: '4px',
    fontWeight: '500',
  };

  const statusBadgeStyle: React.CSSProperties = {
    ...badgeStyle,
    backgroundColor: '#f0f0f0',
    color: '#333',
  };

  const priorityBadgeStyle: React.CSSProperties = {
    ...badgeStyle,
    backgroundColor: '#fff3cd',
    color: '#856404',
  };

  const summaryContainerStyle: React.CSSProperties = {
    padding: '16px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
  };

  const summaryTextStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#333',
    lineHeight: '1.6',
    whiteSpace: 'pre-wrap',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  };

  const loadingStyle: React.CSSProperties = {
    padding: '24px',
    textAlign: 'center',
    color: '#666',
    fontSize: '14px',
  };

  const errorStyle: React.CSSProperties = {
    padding: '16px',
    backgroundColor: '#fee',
    border: '1px solid #fcc',
    borderRadius: '8px',
    color: '#c33',
    fontSize: '14px',
  };

  const createFileButtonStyle: React.CSSProperties = {
    padding: '12px 24px',
    backgroundColor: '#e0e0e0',
    color: '#666',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'not-allowed',
    opacity: 0.6,
  };

  const getPriorityColor = (priority: string): string => {
    const lower = priority.toLowerCase();
    if (lower.includes('high') || lower.includes('critical')) return '#dc3545';
    if (lower.includes('medium')) return '#ffc107';
    return '#28a745';
  };

  return (
    <div style={containerStyle}>
      <button
        style={backButtonStyle}
        onClick={onBack}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#f0f7ff';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        ← Back to Inbox
      </button>

      <div style={headerStyle}>
        <span style={ticketIdStyle}>{ticket.id}</span>
        <div style={titleStyle}>{ticket.title}</div>
        <div style={metaStyle}>
          <span style={statusBadgeStyle}>{ticket.status}</span>
          <span
            style={{
              ...priorityBadgeStyle,
              backgroundColor: getPriorityColor(ticket.priority) + '20',
              color: getPriorityColor(ticket.priority),
            }}
          >
            {ticket.priority}
          </span>
          {ticket.hasComments && ticket.commentCount > 0 && (
            <span style={{ fontSize: '12px', color: '#666' }}>
              💬 {ticket.commentCount} comment{ticket.commentCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      <div style={summaryContainerStyle}>
        {loading && <div style={loadingStyle}>Loading full summary...</div>}
        {error && (
          <div style={errorStyle}>
            <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Error loading summary</div>
            <div>{error}</div>
          </div>
        )}
        {!loading && !error && fullSummary && (
          <div style={summaryTextStyle}>{fullSummary}</div>
        )}
        {!loading && !error && !fullSummary && (
          <div style={loadingStyle}>No summary available</div>
        )}
      </div>

      <button style={createFileButtonStyle} disabled>
        Create Figma File (Coming Soon)
      </button>
    </div>
  );
}

