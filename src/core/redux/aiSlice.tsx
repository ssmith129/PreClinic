import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AIMessage, AIInsightSlot } from '../services/ai/types';
import { generateMockMessages } from '../services/ai/mockMessages';

export interface AIFeatureFlags {
  inboxTriage: boolean;
  notificationsIntelligence: boolean;
  appointmentInsights: boolean;
  emailInsights: boolean;
}

interface AIState {
  flags: AIFeatureFlags;
  inbox: {
    items: AIMessage[];
    loading: boolean;
    error?: string;
    filter: 'all' | 'emergency' | 'medical' | 'appointment' | 'administrative' | 'follow-up';
  };
  insights: {
    slots: AIInsightSlot[];
  };
}

const initialState: AIState = {
  flags: {
    inboxTriage: true,
    notificationsIntelligence: true,
    appointmentInsights: true,
    emailInsights: true,
  },
  inbox: {
    items: [],
    loading: false,
    filter: 'all',
  },
  insights: {
    slots: [],
  },
};

export const loadInbox = createAsyncThunk('ai/loadInbox', async () => {
  // In production, replace with API call
  const data = generateMockMessages(8);
  return data;
});

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    setFilter(state, action: PayloadAction<AIState['inbox']['filter']>) {
      state.inbox.filter = action.payload;
    },
    setFeatureFlags(state, action: PayloadAction<Partial<AIFeatureFlags>>) {
      state.flags = { ...state.flags, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadInbox.pending, (state) => {
        state.inbox.loading = true;
        state.inbox.error = undefined;
      })
      .addCase(loadInbox.fulfilled, (state, action: PayloadAction<AIMessage[]>) => {
        state.inbox.items = action.payload;
        state.inbox.loading = false;
      })
      .addCase(loadInbox.rejected, (state, action) => {
        state.inbox.loading = false;
        state.inbox.error = action.error.message || 'Failed to load inbox';
      });
  },
});

export const { setFilter, setFeatureFlags } = aiSlice.actions;
export default aiSlice.reducer;
