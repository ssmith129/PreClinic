import { AICategory, AIPriority, AIClassification } from './types';

const KEYWORDS: Record<AICategory, string[]> = {
  emergency: ['emergency', 'urgent', 'critical', 'asap', 'immediately', 'severe', 'chest pain', 'shortness of breath'],
  medical: ['lab', 'result', 'prescription', 'symptom', 'diagnosis', 'treatment', 'medicine', 'rx', 'test'],
  appointment: ['appointment', 'schedule', 'reschedule', 'cancel', 'calendar', 'booking', 'slot', 'availability'],
  administrative: ['policy', 'invoice', 'billing', 'report', 'administrative', 'compliance', 'hr', 'account', 'update'],
  'follow-up': ['follow up', 'follow-up', 'check-in', 'review', 'update required', 'status update'],
};

const PRIORITY_ORDER: AIPriority[] = ['critical', 'high', 'medium', 'low'];

function detectCategory(text: string): AICategory {
  const lower = text.toLowerCase();
  let best: {cat: AICategory; score: number} | null = null;
  (Object.keys(KEYWORDS) as AICategory[]).forEach(cat => {
    const score = KEYWORDS[cat].reduce((acc, kw) => acc + (lower.includes(kw) ? 1 : 0), 0);
    if (!best || score > best.score) best = { cat, score };
  });
  return (best && best.score > 0 ? best.cat : 'administrative');
}

function priorityFromCategory(cat: AICategory, text: string): AIPriority {
  const lower = text.toLowerCase();
  if (cat === 'emergency') return 'critical';
  if (cat === 'medical' && (lower.includes('stat') || lower.includes('abnormal'))) return 'high';
  if (cat === 'appointment' && (lower.includes('reschedule') || lower.includes('cancel'))) return 'high';
  if (cat === 'medical') return 'high';
  if (cat === 'appointment') return 'medium';
  if (cat === 'follow-up') return 'low';
  return 'medium';
}

function urgencyFromPriority(p: AIPriority): 1|2|3|4|5 {
  switch (p) {
    case 'critical': return 5;
    case 'high': return 4;
    case 'medium': return 3;
    default: return 2;
  }
}

function estimateResponseTime(urgency: 1|2|3|4|5): string {
  switch (urgency) {
    case 5: return 'Within 10 minutes';
    case 4: return 'Within 30 minutes';
    case 3: return 'Within 2 hours';
    case 2: return 'Within 24 hours';
    default: return 'Over 24 hours';
  }
}

export function classify(text: string): AIClassification {
  const cat = detectCategory(text);
  const priority = priorityFromCategory(cat, text);
  const urgency = urgencyFromPriority(priority);
  const actionRequired = priority === 'critical' || priority === 'high' || /please|need|action|confirm/i.test(text);
  const estimatedResponseTime = estimateResponseTime(urgency);
  const signalStrength = Math.min(1, Math.max(0.6, (urgency + (actionRequired ? 0.5 : 0)) / 6));
  const confidence = Number((0.8 * signalStrength + 0.1).toFixed(2));
  return { confidence, priority, urgency, actionRequired, estimatedResponseTime };
}

export function category(text: string): AICategory {
  return detectCategory(text);
}

export function priority(text: string): AIPriority {
  return priorityFromCategory(detectCategory(text), text);
}
