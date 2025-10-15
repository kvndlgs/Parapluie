import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SafetyEvent, EventType } from '../../types';

interface EventsState {
  events: SafetyEvent[];
  isLoading: boolean;
  error: string | null;
  lastFetch: string | null;
}

const initialState: EventsState = {
  events: [],
  isLoading: false,
  error: null,
  lastFetch: null,
};

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setEvents: (state, action: PayloadAction<SafetyEvent[]>) => {
      state.events = action.payload;
      state.isLoading = false;
      state.error = null;
      state.lastFetch = new Date().toISOString();
    },
    addEvent: (state, action: PayloadAction<SafetyEvent>) => {
      state.events.unshift(action.payload);
    },
    updateEvent: (state, action: PayloadAction<SafetyEvent>) => {
      const index = state.events.findIndex(e => e.id === action.payload.id);
      if (index !== -1) {
        state.events[index] = action.payload;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setEvents,
  addEvent,
  updateEvent,
  setLoading,
  setError,
  clearError,
} = eventsSlice.actions;

export default eventsSlice.reducer;
