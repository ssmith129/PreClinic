export type AIPriority = 'critical' | 'high' | 'medium' | 'low';
export type AICategory = 'medical' | 'emergency' | 'appointment' | 'administrative' | 'follow-up';

export interface AIClassification {
  confidence: number; // 0..1
  priority: AIPriority;
  urgency: 1 | 2 | 3 | 4 | 5;
  actionRequired: boolean;
  estimatedResponseTime: string;
}

export interface AIMetadata {
  category: AICategory;
  tags: string[];
  attachments: number;
}

export interface AIMessage {
  id: string;
  from: string;
  subject: string;
  preview: string;
  avatar?: string;
  timestamp: string; // ISO
  isRead: boolean;
  metadata: AIMetadata;
  ai: AIClassification;
}

export interface AIInsightSlot {
  id: string;
  startISO: string;
  endISO: string;
  utilizationPct: number; // 0..100
  noShowRiskPct: number; // 0..100
  overbookRiskPct: number; // 0..100
  score: number; // 0..100
}
