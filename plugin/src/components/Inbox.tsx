/**
 * Inbox component - displays list of Jira tickets
 */

import type { Ticket } from '../types';
import TicketCard from './TicketCard';

interface InboxProps {
  tickets: Ticket[];
  loading: boolean;
  error: string | null;
  onViewSummary: (ticket: Ticket) => void;
  onRefresh: () => void;
}

export default function Inbox({ tickets, loading, error, onViewSummary, onRefresh }: InboxProps) {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  };

  const headerStyle: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '8px',
  };

  const loadingContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  };

  const loadingTextStyle: React.CSSProperties = {
    padding: '16px',
    textAlign: 'center',
    color: '#666',
    fontSize: '14px',
    fontWeight: '500',
  };

  const spinnerStyle: React.CSSProperties = {
    width: '32px',
    height: '32px',
    border: '3px solid #e0e0e0',
    borderTop: '3px solid #0066FF',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 16px',
  };

  const skeletonCardStyle: React.CSSProperties = {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '12px',
    backgroundColor: '#f9f9f9',
  };

  const skeletonLineStyle: React.CSSProperties = {
    height: '12px',
    backgroundColor: '#e0e0e0',
    borderRadius: '4px',
    marginBottom: '8px',
    animation: 'pulse 1.5s ease-in-out infinite',
  };

  const emptyStyle: React.CSSProperties = {
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
    marginBottom: '16px',
  };

  const refreshButtonStyle: React.CSSProperties = {
    padding: '8px 16px',
    backgroundColor: '#0066FF',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    alignSelf: 'flex-start',
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>🔥 Your Jira Inbox</div>

      {error && (
        <div style={errorStyle}>
          <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Error loading tickets</div>
          <div>{error}</div>
          <button
            style={refreshButtonStyle}
            onClick={onRefresh}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#0052CC';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#0066FF';
            }}
          >
            Retry
          </button>
        </div>
      )}

      {loading && !error && (
        <div style={loadingContainerStyle}>
          <div style={loadingTextStyle}>
            <div style={spinnerStyle}></div>
            Loading your tickets...
          </div>
          {/* Skeleton cards */}
          {[1, 2, 3].map((i) => (
            <div key={i} style={skeletonCardStyle}>
              <div style={{ ...skeletonLineStyle, width: '60%' }}></div>
              <div style={{ ...skeletonLineStyle, width: '100%' }}></div>
              <div style={{ ...skeletonLineStyle, width: '80%' }}></div>
              <div style={{ ...skeletonLineStyle, width: '40%', marginBottom: '0' }}></div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && tickets.length === 0 && (
        <div style={emptyStyle}>No tickets assigned to you</div>
      )}

      {!loading && !error && tickets.length > 0 && (
        <div>
          {tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} onViewSummary={onViewSummary} />
          ))}
        </div>
      )}
    </div>
  );
}

