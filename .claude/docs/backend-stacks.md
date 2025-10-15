# Backend Spec: Parapluie

## ** Core Infrastructure **

- Database:      Supabase (PostgreSQL)
- Authentication: Supabase Auth
- Real-time:     Supabase Realtime (WebSocket alternative)
- API Layer:     Supabase Edge Functions (Deno) + tRPC
- Storage:       Supabase Storage (for images, etc.)

## ** AI Integration **
Walter AI:     OpenAI API (GPT-4) or Anthropic Claude API
               → Called from Edge Functions (server-side)

## ** Native Integrations **
Call Screening: Android CallScreeningService + iOS CallKit
SMS Filtering:  Android SMS Retriever + iOS Message Filter Extension
                → These forward data to Supabase Edge Functions

// Push Notifications
Firebase Cloud Messaging (FCM) for both iOS/Android
Expo Push Notifications (alternative if using Expo)

// Monitoring & Analytics
Error Tracking: Sentry
Analytics:      PostHog or Mixpanel (privacy-friendly)
Performance:    Sentry Performance

// Payments (Phase 2)
Stripe (already has Quebec support)