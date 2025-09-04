import { AIMessage } from './types';
import { classify, category as detectCategory } from './classifier';

const AVATARS = [
  'assets/img/profiles/avatar_1.jpg',
  'assets/img/profiles/avatar_2.jpg',
  'assets/img/profiles/avatar_3.jpg',
  'assets/img/profiles/avatar_4.jpg',
];

function pick<T>(arr: T[], i: number) { return arr[i % arr.length]; }

const SUBJECTS: string[] = [
  'Emergency: Patient experiencing chest pain',
  'Lab results available for review',
  'Appointment reschedule request',
  'Administrative: Policy update for billing',
  'Follow-up required: Post-visit check-in',
  'Urgent: Shortness of breath reported',
  'Prescription renewal needed',
  'Calendar conflict for tomorrow',
];

const PREVIEWS: string[] = [
  'Please review the attached report and advise on next steps.',
  'Patient requests an earlier slot due to increased symptoms.',
  'This message requires action from the care team.',
  'Kindly confirm the appointment details at the earliest.',
  'No immediate action required, informational update.',
];

export function generateMockMessages(count = 8): AIMessage[] {
  const now = Date.now();
  const items: AIMessage[] = [];
  for (let i = 0; i < count; i++) {
    const subject = pick(SUBJECTS, i);
    const preview = pick(PREVIEWS, count - i);
    const text = `${subject}. ${preview}`;
    const ai = classify(text);
    const metadata = {
      category: detectCategory(text),
      tags: [],
      attachments: i % 3 === 0 ? 1 : 0,
    };
    items.push({
      id: `mock-${i}`,
      from: i % 2 === 0 ? 'Dr. Smith' : 'Admin Team',
      subject,
      preview,
      avatar: pick(AVATARS, i),
      timestamp: new Date(now - i * 1000 * 60 * 7).toISOString(),
      isRead: i % 4 === 0 ? true : false,
      metadata,
      ai,
    });
  }
  // sort by urgency then time desc
  return items.sort((a, b) => {
    if (a.ai.urgency !== b.ai.urgency) return b.ai.urgency - a.ai.urgency;
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });
}
