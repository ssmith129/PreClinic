import { useMemo } from 'react';
import type { AIInsightSlot } from '../services/ai/types';

function genSlots(): AIInsightSlot[] {
  const base = new Date();
  base.setMinutes(0,0,0);
  const slots: AIInsightSlot[] = [];
  for (let i = 1; i <= 6; i++) {
    const start = new Date(base.getTime() + i * 60 * 60 * 1000);
    const end = new Date(start.getTime() + 30 * 60 * 1000);
    const utilization = Math.min(95, 40 + i * 8);
    const noShow = Math.max(3, 20 - i * 3);
    const overbook = Math.max(2, 18 - i * 2);
    const score = Math.round(100 - (noShow * 0.4 + overbook * 0.4 + Math.max(0, utilization - 85) * 0.8));
    slots.push({
      id: `slot-${i}`,
      startISO: start.toISOString(),
      endISO: end.toISOString(),
      utilizationPct: utilization,
      noShowRiskPct: noShow,
      overbookRiskPct: overbook,
      score: Math.max(0, Math.min(100, score)),
    });
  }
  return slots.sort((a, b) => b.score - a.score).slice(0, 3);
}

export default function AppointmentInsights() {
  const slots = useMemo(genSlots, []);
  return (
    <div className="card mt-3">
      <div className="card-header d-flex align-items-center">
        <h6 className="mb-0 fw-semibold"><i className="ti ti-brain me-2 text-primary"/>AI Scheduling Insights</h6>
      </div>
      <div className="card-body">
        <div className="row g-3">
          {slots.map(s => (
            <div className="col-md-4" key={s.id}>
              <div className="border rounded p-2 h-100">
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <span className="fw-medium">{new Date(s.startISO).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})} - {new Date(s.endISO).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</span>
                  <span className="badge bg-primary">Score {s.score}</span>
                </div>
                <div className="d-flex flex-column gap-1">
                  <span className="fs-12 text-muted"><i className="ti ti-activity me-1"/>Utilization {s.utilizationPct}%</span>
                  <span className="fs-12 text-muted"><i className="ti ti-user-exclamation me-1"/>No-show risk {s.noShowRiskPct}%</span>
                  <span className="fs-12 text-muted"><i className="ti ti-alert-square-rounded me-1"/>Overbook risk {s.overbookRiskPct}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
