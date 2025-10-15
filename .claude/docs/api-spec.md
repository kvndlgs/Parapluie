# API Integration & Backend Communication

## Overview
This document specifies all backend API endpoints, authentication, data sync strategies, and integration patterns for Parapluie.

**Base URL (Production):** `https://api.parapluie.app/v1`  
**Base URL (Staging):** `https://api-staging.parapluie.app/v1`  
**Base URL (Development):** `http://localhost:3000/v1`

---

## Authentication

### Auth Token Structure
```typescript
interface AuthTokens {
  accessToken: string;           // JWT, expires in 1 hour
  refreshToken: string;          // JWT, expires in 30 days
  expiresAt: number;             // Unix timestamp
  tokenType: 'Bearer';
}
```

### Headers Required
```typescript
const headers = {
  'Authorization': `Bearer ${accessToken}`,
  'Content-Type': 'application/json',
  'X-App-Version': '1.0.0',      // App version
  'X-Platform': 'ios' | 'android',
  'X-Device-ID': '...',          // Unique device identifier
  'Accept-Language': 'fr-CA,fr;q=0.9,en;q=0.8',
};
```

### Token Refresh Flow
```typescript
// When access token expires:
POST /auth/refresh
Body: {
  refreshToken: string
}
Response: AuthTokens

// If refresh fails (401), redirect to login
```

---

## Safety Events API

### Get Safety Events (Paginated)
```typescript
GET /events
Query Parameters:
  - page: number (default: 1)
  - pageSize: number (default: 20, max: 100)
  - type?: 'call' | 'sms' | 'threat' (optional filter)
  - threatLevel?: 'low' | 'medium' | 'high' | 'critical'
  - status?: EventStatus
  - startDate?: string (ISO 8601)
  - endDate?: string (ISO 8601)
  - sortBy?: 'timestamp' | 'threatLevel'
  - sortOrder?: 'asc' | 'desc' (default: 'desc')

Response: PaginatedResponse<SafetyEvent>

Example:
GET /events?page=1&pageSize=20&type=call&threatLevel=high

{
  "success": true,
  "data": [/* array of SafetyEvent */],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalPages": 5,
    "totalItems": 87,
    "hasNext": true,
    "hasPrevious": false
  },
  "timestamp": "2025-01-15T10:30:00Z",
  "requestId": "req_abc123"
}
```

### Get Single Event
```typescript
GET /events/{eventId}

Response: ApiResponse<SafetyEvent>

Example:
GET /events/evt_123abc

{
  "success": true,
  "data": {/* SafetyEvent object */},
  "timestamp": "2025-01-15T10:30:00Z",
  "requestId": "req_def456"
}
```

### Submit User Feedback
```typescript
POST /events/{eventId}/feedback
Body: {
  reportedAs: 'safe' | 'unsafe',
  reason?: string,
  willWhitelist?: boolean,
  willBlacklist?: boolean
}

Response: ApiResponse<SafetyEvent> (updated event with feedback)

Example:
POST /events/evt_123abc/feedback
{
  "reportedAs": "safe",
  "reason": "C'est mon médecin",
  "willWhitelist": true
}
```

### Get Event Statistics
```typescript
GET /events/stats
Query Parameters:
  - period?: 'day' | 'week' | 'month' | 'year' | 'all' (default: 'week')
  - startDate?: string (ISO 8601)
  - endDate?: string (ISO 8601)

Response: ApiResponse<EventStats>

interface EventStats {
  totalEvents: number;
  callsBlocked: number;
  messagesBlocked: number;
  threatsDetected: number;
  byThreatLevel: {
    none: number;
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  byStatus: {
    blocked: number;
    allowed: number;
    pending: number;
    reported_safe: number;
    reported_unsafe: number;
  };
  trendData: TrendPoint[];      // For charts
  period: string;
}

interface TrendPoint {
  date: string;                  // ISO 8601 date
  count: number;
  threatLevel: ThreatLevel;
}
```

---

## Real-Time Updates

### WebSocket Connection
```typescript
// Connect to WebSocket for real-time events
const ws = new WebSocket('wss://api.parapluie.app/v1/ws');

// After connection, authenticate
ws.send(JSON.stringify({
  type: 'auth',
  token: accessToken
}));

// Listen for events
ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  
  switch (message.type) {
    case 'event.created':
      // New safety event detected
      const newEvent: SafetyEvent = message.data;
      break;
      
    case 'event.updated':
      // Event status changed (e.g., Walter finished analysis)
      const updatedEvent: SafetyEvent = message.data;
      break;
      
    case 'trusted_contact.action':
      // Trusted contact took action
      const action: ContactAction = message.data;
      break;
      
    case 'ping':
      // Keepalive ping
      ws.send(JSON.stringify({ type: 'pong' }));
      break;
  }
};

// Reconnect on disconnect
ws.onclose = () => {
  setTimeout(() => connectWebSocket(), 5000);
};
```

### Push Notification Webhooks
```typescript
// Backend sends push notifications via Firebase Cloud Messaging (FCM)
// and Apple Push Notification service (APNs)

// Register device token:
POST /devices/register
Body: {
  token: string,                 // FCM/APNs device token
  platform: 'ios' | 'android',
  model: string,
  osVersion: string,
  appVersion: string
}

Response: ApiResponse<{ deviceId: string }>

// Unregister (on logout):
POST /devices/unregister
Body: {
  deviceId: string
}
```

---

## User & Profile API

### Get Current User Profile
```typescript
GET /users/me

Response: ApiResponse<SeniorUser>
```

### Update User Profile
```typescript
PATCH /users/me
Body: Partial<UserProfile>

Response: ApiResponse<SeniorUser>

Example:
PATCH /users/me
{
  "preferredName": "Marie",
  "language": "fr"
}
```

### Update Security Settings
```typescript
PATCH /users/me/settings
Body: Partial<SecuritySettings>

Response: ApiResponse<SecuritySettings>

Example:
PATCH /users/me/settings
{
  "protectionLevel": "high",
  "autoBlockUnknownNumbers": true
}
```

---

## Trusted Contacts API

### List Trusted Contacts
```typescript
GET /contacts

Response: ApiResponse<TrustedContact[]>
```

### Invite Trusted Contact
```typescript
POST /contacts/invite
Body: {
  name: string,
  relationship: string,
  phoneNumber?: string,
  email?: string,
  preferredContactMethod: 'sms' | 'email'
}

Response: ApiResponse<{
  contactId: string,
  invitationCode: string,        // 4-digit code
  invitationLink: string,        // Deep link for app
  expiresAt: string             // ISO 8601 (24 hours from now)
}>

Example:
POST /contacts/invite
{
  "name": "Jean Dubois",
  "relationship": "Fils",
  "phoneNumber": "+15145551234",
  "preferredContactMethod": "sms"
}

Response:
{
  "success": true,
  "data": {
    "contactId": "tc_abc123",
    "invitationCode": "A63N",
    "invitationLink": "https://parapluie.app/i/A63N",
    "expiresAt": "2025-01-16T10:30:00Z"
  },
  "timestamp": "2025-01-15T10:30:00Z",
  "requestId": "req_xyz789"
}
```

### Accept Invitation (Contact Side)
```typescript
POST /contacts/accept
Body: {
  invitationCode: string         // 4-digit code
}

Response: ApiResponse<{
  seniorUser: SeniorUser,        // Info about senior they're now connected to
  contactProfile: TrustedContact // Their own contact profile
}>

// This endpoint is called BY the trusted contact, not the senior
// Creates/links their account to the senior's account
```

### Remove Trusted Contact
```typescript
DELETE /contacts/{contactId}

Response: ApiResponse<{ success: true }>
```

### Update Contact Permissions
```typescript
PATCH /contacts/{contactId}/permissions
Body: Partial<ContactPermissions>

Response: ApiResponse<TrustedContact>

Example:
PATCH /contacts/tc_abc123/permissions
{
  "canViewAlerts": true,
  "alertLevel": "high"
}
```

---

## Calendar & Events API

### List Calendar Events
```typescript
GET /calendar
Query Parameters:
  - startDate?: string (ISO 8601, default: today)
  - endDate?: string (ISO 8601, default: +30 days)
  - type?: EventCategory

Response: ApiResponse<CalendarEvent[]>
```

### Create Calendar Event
```typescript
POST /calendar
Body: Omit<CalendarEvent, 'id' | 'userId'>

Response: ApiResponse<CalendarEvent>
```

### Update Calendar Event
```typescript
PATCH /calendar/{eventId}
Body: Partial<CalendarEvent>

Response: ApiResponse<CalendarEvent>
```

### Delete Calendar Event
```typescript
DELETE /calendar/{eventId}

Response: ApiResponse<{ success: true }>
```

---

## Community Activities API

### List Nearby Activities
```typescript
GET /community/activities
Query Parameters:
  - latitude: number
  - longitude: number
  - radius?: number (km, default: 10)
  - category?: ActivityCategory
  - limit?: number (default: 20)

Response: ApiResponse<CommunityActivity[]>
```

### Register for Activity
```typescript
POST /community/activities/{activityId}/register

Response: ApiResponse<{
  success: true,
  confirmationNumber: string
}>
```

---

## Learning Center API

### List Learning Modules
```typescript
GET /learning/modules
Query Parameters:
  - category?: LearningCategory
  - difficulty?: 'débutant' | 'intermédiaire' | 'avancé'

Response: ApiResponse<LearningModule[]>
```

### Get Module Progress
```typescript
GET /learning/modules/{moduleId}/progress

Response: ApiResponse<UserProgress>
```

### Update Lesson Progress
```typescript
POST /learning/modules/{moduleId}/lessons/{lessonId}/complete

Response: ApiResponse<UserProgress>
```

### Submit Quiz
```typescript
POST /learning/modules/{moduleId}/quiz/submit
Body: {
  answers: number[]              // Array of answer indices
}

Response: ApiResponse<{
  score: number,
  passed: boolean,
  correctAnswers: number[],
  totalQuestions: number,
  feedback: string[]             // Per-question feedback
}>
```

---

## Notifications API

### Get Notification History
```typescript
GET /notifications
Query Parameters:
  - page?: number
  - pageSize?: number
  - type?: NotificationType
  - read?: boolean

Response: PaginatedResponse<PushNotification>
```

### Mark Notification as Read
```typescript
POST /notifications/{notificationId}/read

Response: ApiResponse<{ success: true }>
```

### Update Notification Preferences
```typescript
PATCH /users/me/notification-preferences
Body: {
  threatsEnabled: boolean,
  remindersEnabled: boolean,
  tipsEnabled: boolean,
  quietHoursEnabled: boolean,
  quietHoursStart?: string,
  quietHoursEnd?: string
}

Response: ApiResponse<NotificationPreferences>
```

---

## Walter AI API

### Analyze Incoming Event (Internal)
```typescript
// This endpoint is called BY THE BACKEND, not the mobile app
// Mobile app receives the analyzed result via WebSocket or polling

POST /walter/analyze
Body: {
  eventId: string,
  eventType: EventType,
  metadata: CallEventMetadata | SmsEventMetadata,
  userContext: {
    protectionLevel: string,
    whitelistedNumbers: string[],
    blacklistedNumbers: string[],
    recentEvents: string[]       // Recent event IDs for pattern detection
  }
}

Response: ApiResponse<WalterAnalysis>

// This happens server-side in real-time:
// 1. Incoming call/SMS detected by mobile OS
// 2. Mobile app forwards to backend
// 3. Backend calls Walter AI
// 4. Backend updates event with Walter's analysis
// 5. Backend pushes update to mobile via WebSocket
// 6. Mobile app shows result to user
```

### Submit Feedback for AI Training
```typescript
POST /walter/feedback
Body: {
  eventId: string,
  walterWasCorrect: boolean,
  userComment?: string
}

Response: ApiResponse<{ success: true }>

// This helps improve Walter's accuracy over time
```

---

## Health Check & System

### API Health Check
```typescript
GET /health

Response: {
  status: 'healthy' | 'degraded' | 'down',
  version: string,
  timestamp: string,
  services: {
    database: 'up' | 'down',
    walter_ai: 'up' | 'down',
    websocket: 'up' | 'down'
  }
}

// Mobile app can check this on launch to detect issues
```

### Get Feature Flags
```typescript
GET /config/features

Response: ApiResponse<{
  bankingIntegrationEnabled: boolean,
  communityFeaturesEnabled: boolean,
  voiceCallsEnabled: boolean,
  advancedAnalyticsEnabled: boolean,
  // Add new features here as they're developed
}>

// Use feature flags to enable/disable features remotely
// without requiring app updates
```

---

## Data Sync Strategy

### Sync Philosophy
Parapluie uses a **hybrid sync approach**:
- **Real-time (WebSocket)**: Critical safety events
- **Polling**: Secondary data (calendar, community, stats)
- **On-demand**: User-initiated actions

### Sync Flow
```typescript
// On App Launch:
1. Connect to WebSocket (for real-time events)
2. Fetch latest events (GET /events?page=1&pageSize=50)
3. Fetch user profile (GET /users/me)
4. Fetch trusted contacts (GET /contacts)
5. Cache everything to AsyncStorage

// During Session:
1. WebSocket delivers real-time safety events
2. Poll stats endpoint every 5 minutes (if on Home screen)
3. Poll calendar on Calendar screen mount

// On Background/Kill:
1. Disconnect WebSocket gracefully
2. Persist unsynced changes to AsyncStorage
3. On next launch, sync pending changes
```

### Offline Behavior
```typescript
// When offline:
1. Show cached data from AsyncStorage
2. Queue write operations (feedback, settings changes)
3. Show "Offline" indicator in UI
4. Display last sync time

// When back online:
1. Reconnect WebSocket
2. Sync queued operations
3. Refresh all data
4. Remove "Offline" indicator
```

### Conflict Resolution
```typescript
// If server data conflicts with local cache:
1. Server data always wins (source of truth)
2. Overwrite local cache
3. Show notification if user-initiated change was lost
4. Allow user to retry their change
```

---

## Rate Limiting

### Rate Limits
```
- GET requests: 100/minute per user
- POST/PATCH/DELETE: 30/minute per user
- WebSocket messages: 1000/minute per connection

// If rate limit exceeded:
HTTP 429 Too Many Requests
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Trop de requêtes. Réessayez dans 60 secondes.",
    "retryAfter": 60
  }
}
```

### Retry Strategy
```typescript
// Exponential backoff with jitter
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries = 3
) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        const delay = retryAfter ? parseInt(retryAfter) * 1000 : Math.pow(2, i) * 1000;
        await sleep(delay + Math.random() * 1000); // Add jitter
        continue;
      }
      
      return response;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await sleep(Math.pow(2, i) * 1000);
    }
  }
}
```

---

## Error Handling

### Standard Error Codes
```typescript
enum ApiErrorCode {
  // Authentication & Authorization
  UNAUTHORIZED = 'UNAUTHORIZED',               // 401
  FORBIDDEN = 'FORBIDDEN',                     // 403
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',             // 401
  INVALID_TOKEN = 'INVALID_TOKEN',             // 401
  
  // Resource Errors
  NOT_FOUND = 'NOT_FOUND',                     // 404
  CONFLICT = 'CONFLICT',                       // 409
  GONE = 'GONE',                               // 410 (invitation expired)
  
  // Validation
  VALIDATION_ERROR = 'VALIDATION_ERROR',       // 400
  INVALID_INPUT = 'INVALID_INPUT',             // 400
  
  // Rate Limiting
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED', // 429
  
  // Server Errors
  INTERNAL_ERROR = 'INTERNAL_ERROR',           // 500
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE', // 503
  GATEWAY_TIMEOUT = 'GATEWAY_TIMEOUT',         // 504
  
  // Business Logic
  INVITATION_EXPIRED = 'INVITATION_EXPIRED',
  INVITATION_USED = 'INVITATION_USED',
  MAX_CONTACTS_REACHED = 'MAX_CONTACTS_REACHED',
  SUBSCRIPTION_REQUIRED = 'SUBSCRIPTION_REQUIRED',
}
```

### Error Handling Pattern
```typescript
async function handleApiCall<T>(
  apiCall: () => Promise<ApiResponse<T>>
): Promise<T> {
  try {
    const response = await apiCall();
    
    if (!response.success) {
      throw new ApiException(response.error);
    }
    
    return response.data;
  } catch (error) {
    if (error instanceof ApiException) {
      // Show user-friendly error message
      switch (error.code) {
        case 'UNAUTHORIZED':
          // Redirect to login
          break;
        case 'RATE_LIMIT_EXCEEDED':
          // Show "too many requests" message
          break;
        case 'SERVICE_UNAVAILABLE':
          // Show "service temporarily unavailable"
          break;
        default:
          // Generic error message
          break;
      }
    }
    
    // Log to error tracking service (Sentry, etc.)
    logError(error);
    
    throw error;
  }
}
```

---

## Security Considerations

### Data Encryption
- All API requests use HTTPS (TLS 1.3)
- Sensitive data (messages, call recordings if any) encrypted at rest
- JWT tokens stored in secure storage (iOS Keychain, Android Keystore)

### API Key Security
- No hardcoded API keys in mobile app
- Use environment-specific configurations
- Rotate keys regularly

### Privacy
- No unnecessary data collection
- GDPR/CCPA compliant
- Quebec Bill 25 compliant
- User can export/delete all data

### Logging
- Log all API errors
- Do NOT log sensitive user data
- Do NOT log full request/response bodies in production
- Use request IDs for tracing

---

## Version History

- v1.0.0 (2025-01-15): Initial API specification