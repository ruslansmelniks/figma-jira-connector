/**
 * Main app component for FigmaFlow plugin
 */

import { useState, useEffect } from 'react';
import { fetchInbox } from './api/backend';
import type { Ticket, ViewType } from './types';
import Inbox from './components/Inbox';
import SummaryView from './components/SummaryView';

function App() {
  const [view, setView] = useState<ViewType>('inbox');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInbox();
  }, []);

  const loadInbox = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchInbox();
      setTickets(data.tickets);
    } catch (err) {
      console.error('Failed to load inbox:', err);
      setError('Failed to load tickets. Check backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewSummary = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setView('summary');
  };

  const handleBackToInbox = () => {
    setView('inbox');
    setSelectedTicket(null);
  };

  const appStyle: React.CSSProperties = {
    padding: '16px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    height: '100%',
    boxSizing: 'border-box',
    overflow: 'auto',
  };

  return (
    <div style={appStyle}>
      {view === 'inbox' && (
        <Inbox
          tickets={tickets}
          loading={loading}
          error={error}
          onViewSummary={handleViewSummary}
          onRefresh={loadInbox}
        />
      )}
      {view === 'summary' && selectedTicket && (
        <SummaryView ticket={selectedTicket} onBack={handleBackToInbox} />
      )}
    </div>
  );
}

export default App;

