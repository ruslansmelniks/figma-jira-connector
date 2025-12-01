/**
 * TicketCard component - displays individual Jira ticket
 */

import type { Ticket } from '../types';

interface TicketCardProps {
  ticket: Ticket;
  onViewSummary: (ticket: Ticket) => void;
}

export default function TicketCard({ ticket, onViewSummary }: TicketCardProps) {
  const cardStyle: React.CSSProperties = {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '12px',
    backgroundColor: 'white',
    cursor: 'default',
    transition: 'box-shadow 0.2s ease',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
  };

  const ticketIdStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#0066FF',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  };

  const summaryStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#666',
    lineHeight: '1.5',
    marginBottom: '12px',
    marginTop: '4px',
  };

  const metaStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px',
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

  const commentStyle: React.CSSProperties = {
    fontSize: '11px',
    color: '#666',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '8px 16px',
    backgroundColor: '#0066FF',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    width: '100%',
    transition: 'background-color 0.2s ease',
  };

  const getPriorityColor = (priority: string): string => {
    const lower = priority.toLowerCase();
    if (lower.includes('high') || lower.includes('critical')) return '#dc3545';
    if (lower.includes('medium')) return '#ffc107';
    return '#28a745';
  };

  return (
    <div
      style={cardStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={headerStyle}>
        <span style={ticketIdStyle}>{ticket.id}</span>
        <span style={titleStyle}>{ticket.title}</span>
      </div>

      <div style={summaryStyle}>{ticket.quickSummary}</div>

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
          <span style={commentStyle}>💬 {ticket.commentCount} comment{ticket.commentCount !== 1 ? 's' : ''}</span>
        )}
      </div>

      <button
        style={buttonStyle}
        onClick={() => onViewSummary(ticket)}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#0052CC';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#0066FF';
        }}
      >
        View Full Summary
      </button>
    </div>
  );
}

