import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadInbox, setFilter } from '../redux/aiSlice';
import type { RootState } from './typesInternal';
import ImageWithBasePath from '../imageWithBasePath';

const PRIORITY_BADGE: Record<string, string> = {
  critical: 'badge bg-danger',
  high: 'badge bg-warning',
  medium: 'badge bg-info',
  low: 'badge bg-success',
};

export default function InboxTriageCard() {
  const dispatch = useDispatch<any>();
  const { items, loading, error, filter } = useSelector((s: RootState) => s.ai.inbox);

  useEffect(() => {
    dispatch(loadInbox());
  }, [dispatch]);

  const filtered = items.filter(m => filter === 'all' || m.metadata.category === filter);

  return (
    <div className="card shadow-sm h-100">
      <div className="card-header d-flex align-items-center justify-content-between">
        <h5 className="fw-bold mb-0 d-flex align-items-center">
          <i className="ti ti-brain me-2 text-primary" /> AI Inbox Triage
        </h5>
        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-success d-flex align-items-center"><i className="ti ti-robot me-1"/>Active</span>
          <div className="dropdown">
            <button className="btn btn-sm btn-outline-primary dropdown-toggle" data-bs-toggle="dropdown">{filter === 'all' ? 'All' : filter}</button>
            <ul className="dropdown-menu dropdown-menu-end">
              {['all','emergency','medical','appointment','administrative','follow-up'].map(opt => (
                <li key={opt}><button className="dropdown-item" onClick={() => dispatch(setFilter(opt as any))}>{opt}</button></li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="card-body">
        {loading && (
          <div className="d-flex justify-content-center py-5"><div className="spinner-border text-primary" role="status" aria-label="Loading"/></div>
        )}
        {error && (
          <div className="alert alert-danger" role="alert">{error}</div>
        )}
        {!loading && !error && (
          <div className="list-group">
            {filtered.map(msg => (
              <div key={msg.id} className="list-group-item border-0 border-bottom py-3">
                <div className="d-flex align-items-start">
                  <div className="me-2">
                    {msg.avatar ? (
                      <ImageWithBasePath src={msg.avatar} className="avatar-md rounded-circle" alt="" />
                    ) : (
                      <span className="avatar avatar-md rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center">{msg.from.slice(0,2).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="flex-fill">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <p className="mb-0 fw-medium text-dark">{msg.from}</p>
                        <p className="mb-1">{msg.subject}</p>
                      </div>
                      <div className="text-end">
                        <span className={`${PRIORITY_BADGE[msg.ai.priority]} me-2 text-uppercase`}>{msg.ai.priority}</span>
                        <span className="badge bg-light text-dark">{Math.round(msg.ai.confidence*100)}%</span>
                      </div>
                    </div>
                    <div className="d-flex align-items-center justify-content-between mt-1">
                      <div className="d-flex align-items-center gap-2">
                        <span className="text-muted fs-12"><i className="ti ti-clock me-1"/> {new Date(msg.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                        <span className="text-muted fs-12"><i className="ti ti-bolt me-1"/>Urgency {msg.ai.urgency}/5</span>
                        {msg.ai.actionRequired && <span className="badge bg-danger-transparent text-danger border">Action Required</span>}
                      </div>
                      <span className="text-muted fs-12">{msg.ai.estimatedResponseTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
