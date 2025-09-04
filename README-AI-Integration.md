# AI Integration

## Architecture
- Redux slice: src/core/redux/aiSlice.tsx
- Services: src/core/services/ai/{types, classifier, mockMessages}.ts
- Components: 
  - Inbox Triage: src/core/ai/InboxTriageCard.tsx (Dashboard)
  - Appointment Insights: src/core/ai/AppointmentInsights.tsx (Calendars)
  - Email Enhancer: src/core/ai/EmailAIEnhancer.tsx (Email page)
- Styles: src/style/scss/_ai.scss (forwarded by main.scss)

## Configuration
Enabled by default via aiSlice.flags. Swap mock data with a real API by replacing generateMockMessages in loadInbox thunk.

## Accessibility & UX
- Uses semantic buttons and badges
- Keyboard/tab friendly controls
- Loading spinners and error alerts

## Testing
Utility functions are pure (classifier) and can be unit-tested. Add a test runner (e.g., Vitest/Jest) to execute tests.
