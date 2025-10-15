# Data Models & Types

## Overview
This document defines all data structures used in Parapluie for type safety and consistency across the application.

---

## Safety Events

### Base Event Structure
```typescript
interface SafetyEvent {
  id: string;                    // UUID
  userId: string;                // Senior's user ID
  type: EventType;               // Call, SMS, or Threat
  status: EventStatus;           // Current event status
  threatLevel: ThreatLevel;      // Severity assessment
  timestamp: string;             // ISO 8601 format
  metadata: EventMetadata;       // Type-specific data
  walterAnalysis?: WalterAnalysis; // AI assessment (optional if pending)
  userFeedback?: UserFeedback;   // User reported safe/unsafe (optional)
  trustedContactNotified: boolean; // Whether TC was alerted
  createdAt: string;             // ISO 8601 format
  updatedAt: string;             // ISO 8601 format
}
```

### Event Types
```typescript
enum EventType {
  CALL = 'call',
  SMS = 'sms',
  THREAT = 'threat',      // Generic elevated threat
  PHISHING = 'phishing',  // Specific phishing attempt
  SCAM = 'scam'          // Confirmed scam pattern
}
```

### Event Status
```typescript
enum EventStatus {
  BLOCKED = 'blocked',         // Automatically blocked by Walter
  ALLOWED = 'allowed',         // Passed through to user
  PENDING = 'pending',         // Awaiting Walter analysis
  REPORTED_SAFE = 'reported_safe',     // User marked as safe
  REPORTED_UNSAFE = 'reported_unsafe', // User marked as unsafe
  WHITELISTED = 'whitelisted', // On user's safe list
  REVIEWING = 'reviewing'      // TC reviewing the event
}
```

### Threat Levels
```typescript
enum ThreatLevel {
  NONE = 'none',           // No threat detected (0)
  LOW = 'low',             // Minor concern (1-3)
  MEDIUM = 'medium',       // Moderate threat (4-6)
  HIGH = 'high',           // Serious threat (7-8)
  CRITICAL = 'critical'    // Immediate danger (9-10)
}

// Helper type for numeric threat scores
type ThreatScore = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
```

### Event Metadata (Type-Specific)

#### Call Event Metadata
```typescript
interface CallEventMetadata {
  phoneNumber: string;           // E.164 format: +15145551234
  callerName?: string;           // If available from contacts/caller ID
  duration?: number;             // Call duration in seconds (if answered)
  callType: 'incoming' | 'outgoing';
  wasAnswered: boolean;
  blockedReason?: string;        // Why it was blocked
  knownScamDatabase?: string;    // If matched to known scam DB
  countryCode: string;           // ISO country code (CA, US, etc.)
  carrier?: string;              // Carrier name if available
}
```

#### SMS Event Metadata
```typescript
interface SmsEventMetadata {
  phoneNumber: string;           // E.164 format
  senderName?: string;           // Contact name if available
  messagePreview: string;        // First 100 chars (encrypted)
  fullMessage?: string;          // Full message (encrypted at rest)
  containsLinks: boolean;
  links?: string[];              // Extracted URLs
  containsPhoneNumbers: boolean;
  extractedNumbers?: string[];   // Phone numbers found in message
  blockedReason?: string;
  scamPatternMatched?: string;   // Which scam pattern triggered
  languageDetected: 'fr' | 'en' | 'other';
}
```

#### Generic Threat Metadata
```typescript
interface ThreatEventMetadata {
  source: 'call' | 'sms' | 'location' | 'app' | 'system';
  description: string;           // Human-readable description
  technicalDetails?: string;     // Technical info for debugging
  relatedEvents?: string[];      // Related event IDs
  mitigationTaken?: string;      // What action was taken
}
```

### Walter AI Analysis
```typescript
interface WalterAnalysis {
  analysisId: string;            // UUID for tracking
  confidence: number;            // 0-100 confidence score
  threatScore: ThreatScore;      // 0-10 numerical score
  threatLevel: ThreatLevel;      // Computed from threat score
  reasoning: string;             // Why Walter made this assessment (French)
  redFlags: RedFlag[];           // Specific concerns identified
  recommendation: Recommendation; // What Walter suggests
  processedAt: string;           // ISO 8601 timestamp
  modelVersion: string;          // AI model version used
}

interface RedFlag {
  type: RedFlagType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;           // French description
  evidence?: string;             // Supporting evidence
}

enum RedFlagType {
  UNKNOWN_NUMBER = 'unknown_number',
  SPOOFED_CALLER_ID = 'spoofed_caller_id',
  URGENCY_LANGUAGE = 'urgency_language',
  MONEY_REQUEST = 'money_request',
  PERSONAL_INFO_REQUEST = 'personal_info_request',
  THREATENING_LANGUAGE = 'threatening_language',
  IMPERSONATION = 'impersonation',        // Pretending to be authority
  SUSPICIOUS_LINK = 'suspicious_link',
  KNOWN_SCAM_PATTERN = 'known_scam_pattern',
  TIME_PRESSURE = 'time_pressure',        // "Act now or else"
  UNUSUAL_HOUR = 'unusual_hour',          // Call at 2am, etc.
  FOREIGN_ORIGIN = 'foreign_origin',      // Unexpected country
  GRAMMATICAL_ERRORS = 'grammatical_errors', // Poor French/English
}

interface Recommendation {
  action: RecommendedAction;
  explanation: string;           // French explanation
  userShouldReview: boolean;     // Should senior look at this?
  notifyTrustedContact: boolean; // Should TC be alerted?
}

enum RecommendedAction {
  BLOCK = 'block',               // Block immediately
  WARN = 'warn',                 // Show warning but allow
  ALLOW = 'allow',               // Safe to proceed
  REVIEW = 'review',             // Needs human review
  ESCALATE = 'escalate'          // High priority TC notification
}
```

### User Feedback
```typescript
interface UserFeedback {
  feedbackId: string;            // UUID
  reportedAs: 'safe' | 'unsafe';
  reportedAt: string;            // ISO 8601
  reportedBy: string;            // User ID (senior or TC)
  reason?: string;               // Optional explanation
  willWhitelist: boolean;        // Add to safe list?
  willBlacklist: boolean;        // Add to block list?
}
```

---

## User & Account Models

### Senior User
```typescript
interface SeniorUser {
  id: string;                    // UUID
  profile: UserProfile;
  settings: SecuritySettings;
  trustedContacts: TrustedContact[];
  subscription: Subscription;
  stats: UserStats;
  createdAt: string;
  updatedAt: string;
}

interface UserProfile {
  firstName: string;             // "Mary"
  lastName?: string;
  preferredName?: string;        // What Walter calls them
  phoneNumber: string;           // E.164 format
  email?: string;
  dateOfBirth?: string;          // ISO 8601 date
  language: 'fr' | 'en';
  location?: {
    city: string;                // "Montreal"
    province: string;            // "Quebec"
    country: string;             // "CA"
    postalCode?: string;
  };
  timezone: string;              // "America/Montreal"
}

interface SecuritySettings {
  protectionLevel: 'low' | 'medium' | 'high';
  callProtectionEnabled: boolean;
  smsProtectionEnabled: boolean;
  locationAlertsEnabled: boolean;
  notificationsEnabled: boolean;
  autoBlockUnknownNumbers: boolean;
  autoBlockInternational: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart?: string;      // "22:00"
  quietHoursEnd?: string;        // "08:00"
  emergencyBypass: string[];     // Phone numbers that always get through
}
```

### Trusted Contact
```typescript
interface TrustedContact {
  id: string;                    // UUID
  status: ContactStatus;
  profile: ContactProfile;
  permissions: ContactPermissions;
  invitationCode?: string;       // 4-digit code (if pending)
  invitedAt?: string;
  acceptedAt?: string;
  lastActiveAt?: string;
}

enum ContactStatus {
  PENDING = 'pending',           // Invitation sent, not accepted
  ACTIVE = 'active',             // Connected and active
  INACTIVE = 'inactive',         // Connected but hasn't checked in
  DECLINED = 'declined',         // Declined invitation
  REMOVED = 'removed',           // Removed by senior or self
  BLOCKED = 'blocked'            // Blocked by senior
}

interface ContactProfile {
  name: string;
  relationship: string;          // "Fils", "Fille", "Ami", etc.
  phoneNumber?: string;
  email?: string;
  preferredContactMethod: 'sms' | 'email' | 'app';
}

interface ContactPermissions {
  canViewAlerts: boolean;
  canReceiveNotifications: boolean;
  canViewLocation: boolean;
  canAccessCalendar: boolean;
  canModifySettings: boolean;    // Advanced: TC can adjust protection
  alertLevel: 'all' | 'high' | 'critical'; // Which threats to notify about
}
```

### Subscription
```typescript
interface Subscription {
  id: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  paymentMethod?: PaymentMethod;
}

enum SubscriptionPlan {
  FREE_TRIAL = 'free_trial',
  INDIVIDUAL = 'individual',     // $9.99/month
  FAMILY = 'family',             // $14.99/month
  ANNUAL = 'annual'              // $99/year
}

enum SubscriptionStatus {
  TRIALING = 'trialing',
  ACTIVE = 'active',
  PAST_DUE = 'past_due',
  CANCELED = 'canceled',
  PAUSED = 'paused'
}

interface PaymentMethod {
  type: 'card' | 'bank_account' | 'paypal';
  last4?: string;                // Last 4 digits of card
  brand?: string;                // "Visa", "Mastercard"
  expiryMonth?: number;
  expiryYear?: number;
}
```

### User Statistics
```typescript
interface UserStats {
  totalCallsBlocked: number;
  totalMessagesBlocked: number;
  totalThreatsDetected: number;
  highestThreatLevel: ThreatLevel;
  lastThreatAt?: string;
  streakDays: number;            // Days without threats
  protectionScore: number;       // 0-100 overall safety score
  since: string;                 // When they started using app
}
```

---

## Events & Calendar Models

### Calendar Event
```typescript
interface CalendarEvent {
  id: string;
  userId: string;
  title: string;
  description?: string;
  startTime: string;             // ISO 8601
  endTime: string;               // ISO 8601
  type: EventCategory;
  location?: string;
  attendees?: string[];          // Contact names
  reminderMinutes?: number;      // Minutes before to remind
  isRecurring: boolean;
  recurrenceRule?: string;       // iCal RRULE format
  createdBy: 'user' | 'trusted_contact' | 'system';
  metadata?: CalendarEventMetadata;
}

enum EventCategory {
  APPOINTMENT = 'appointment',   // Medical, dentist, etc.
  MEDICATION = 'medication',     // Pill reminders
  SOCIAL = 'social',             // Birthday, bingo, etc.
  PRESCRIPTION = 'prescription', // Prescription renewal
  PERSONAL = 'personal',
  OTHER = 'other'
}

interface CalendarEventMetadata {
  doctorName?: string;
  prescriptionName?: string;
  contactPerson?: string;
  phoneNumber?: string;
  confirmationRequired?: boolean;
  transportNeeded?: boolean;
}
```

---

## Community & Activities Models

### Community Activity
```typescript
interface CommunityActivity {
  id: string;
  title: string;
  description: string;
  category: ActivityCategory;
  location: ActivityLocation;
  schedule: ActivitySchedule;
  organizer: string;
  contactInfo: string;
  capacity?: number;
  currentParticipants: number;
  isUserRegistered: boolean;
  imageUrl?: string;
  tags: string[];
}

enum ActivityCategory {
  SOCIAL = 'social',             // Bingo, card games
  EXERCISE = 'exercise',         // Yoga, walking group
  ARTS = 'arts',                 // Painting, crafts
  EDUCATION = 'education',       // Computer classes
  VOLUNTEER = 'volunteer',
  SUPPORT_GROUP = 'support_group',
  OTHER = 'other'
}

interface ActivityLocation {
  name: string;                  // "Centre communautaire"
  address: string;
  city: string;
  postalCode: string;
  distanceKm?: number;           // From user's location
}

interface ActivitySchedule {
  frequency: 'once' | 'daily' | 'weekly' | 'monthly';
  dayOfWeek?: string;            // "Monday", "Lundi"
  startTime: string;             // "14:00"
  duration: number;              // Minutes
  nextOccurrence: string;        // ISO 8601
}
```

---

## Learning & Games Models

### Learning Module
```typescript
interface LearningModule {
  id: string;
  title: string;
  description: string;
  category: LearningCategory;
  difficulty: 'débutant' | 'intermédiaire' | 'avancé';
  estimatedMinutes: number;
  lessons: Lesson[];
  quiz?: Quiz;
  completionRate: number;        // 0-100
  userProgress?: UserProgress;
}

enum LearningCategory {
  SCAM_RECOGNITION = 'scam_recognition',
  PHONE_SAFETY = 'phone_safety',
  ONLINE_SECURITY = 'online_security',
  PASSWORD_SAFETY = 'password_safety',
  PRIVACY = 'privacy',
  TECH_SKILLS = 'tech_skills'
}

interface Lesson {
  id: string;
  title: string;
  content: string;               // Markdown format
  videoUrl?: string;
  duration: number;
  completed: boolean;
}

interface Quiz {
  questions: QuizQuestion[];
  passingScore: number;          // Percentage needed to pass
  userScore?: number;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;         // Index of correct option
  explanation: string;           // Why this is the answer
}

interface UserProgress {
  startedAt: string;
  lastAccessedAt: string;
  completedLessons: string[];    // Lesson IDs
  quizAttempts: number;
  quizScore?: number;
  completedAt?: string;
}
```

---

## Notification Models

### Push Notification
```typescript
interface PushNotification {
  id: string;
  userId: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  body: string;
  data: NotificationData;
  scheduledFor?: string;         // ISO 8601 (for scheduled notifications)
  sentAt?: string;
  readAt?: string;
  actionTaken?: string;
}

enum NotificationType {
  THREAT_DETECTED = 'threat_detected',
  CALL_BLOCKED = 'call_blocked',
  MESSAGE_FLAGGED = 'message_flagged',
  EVENT_REMINDER = 'event_reminder',
  MEDICATION_REMINDER = 'medication_reminder',
  TRUSTED_CONTACT_ALERT = 'trusted_contact_alert',
  SYSTEM_MESSAGE = 'system_message',
  WALTER_TIP = 'walter_tip'
}

enum NotificationPriority {
  LOW = 'low',                   // Tips, suggestions
  NORMAL = 'normal',             // Event reminders
  HIGH = 'high',                 // Threats detected
  URGENT = 'urgent'              // Critical threats
}

interface NotificationData {
  deepLink?: string;             // Internal navigation
  eventId?: string;              // Related event ID
  actionButtons?: NotificationAction[];
  imageUrl?: string;
  sound?: string;
  vibration?: number[];
}

interface NotificationAction {
  id: string;
  title: string;
  action: 'view' | 'dismiss' | 'mark_safe' | 'block' | 'call_contact';
  requiresUnlock?: boolean;
}
```

---

## API Response Wrappers

### Success Response
```typescript
interface ApiResponse<T> {
  success: true;
  data: T;
  timestamp: string;
  requestId: string;
}
```

### Error Response
```typescript
interface ApiError {
  success: false;
  error: {
    code: string;                // "UNAUTHORIZED", "NOT_FOUND", etc.
    message: string;             // Human-readable (French)
    details?: Record<string, unknown>;
    requestId: string;
  };
  timestamp: string;
}
```

### Paginated Response
```typescript
interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  timestamp: string;
  requestId: string;
}
```

---

## Storage Keys (AsyncStorage)

```typescript
enum StorageKeys {
  // User & Auth
  USER_ID = '@parapluie/userId',
  AUTH_TOKEN = '@parapluie/authToken',
  REFRESH_TOKEN = '@parapluie/refreshToken',
  
  // Onboarding
  ONBOARDING_COMPLETED = '@parapluie/onboardingCompleted',
  PERMISSIONS_GRANTED = '@parapluie/permissionsGranted',
  
  // Settings
  SECURITY_SETTINGS = '@parapluie/securitySettings',
  NOTIFICATION_SETTINGS = '@parapluie/notificationSettings',
  APP_LANGUAGE = '@parapluie/language',
  
  // Cache
  CACHED_EVENTS = '@parapluie/cachedEvents',
  CACHED_PROFILE = '@parapluie/cachedProfile',
  LAST_SYNC = '@parapluie/lastSync',
  
  // Feature Flags
  FEATURE_FLAGS = '@parapluie/featureFlags',
}
```

---

## Type Guards & Validators

```typescript
// Example type guard
function isSafetyEvent(obj: unknown): obj is SafetyEvent {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'type' in obj &&
    'status' in obj &&
    'threatLevel' in obj
  );
}

// Threat level from score
function getThreatLevelFromScore(score: ThreatScore): ThreatLevel {
  if (score === 0) return ThreatLevel.NONE;
  if (score <= 3) return ThreatLevel.LOW;
  if (score <= 6) return ThreatLevel.MEDIUM;
  if (score <= 8) return ThreatLevel.HIGH;
  return ThreatLevel.CRITICAL;
}

// Phone number validation (E.164 format)
function isValidE164(phone: string): boolean {
  return /^\+[1-9]\d{1,14}$/.test(phone);
}
```

---

## Notes for Implementation

1. **Encryption**: All `fullMessage` and sensitive data should be encrypted at rest using device keychain
2. **Timestamps**: Always use ISO 8601 format for consistency and timezone support
3. **Phone Numbers**: Always store in E.164 format (+15145551234) for international compatibility
4. **IDs**: Use UUIDs (v4) for all entity IDs
5. **Enums**: Use string enums for API compatibility and readability
6. **Optional Fields**: Mark with `?` to indicate they may not always be present
7. **French Text**: All user-facing strings should be in French for Montreal market
8. **Type Safety**: Use TypeScript strict mode and avoid `any` types

---

## Version History

- v1.0.0 (2025-01-15): Initial data models definition