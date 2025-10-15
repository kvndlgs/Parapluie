// Core Types for Parapluie

// ============================================================================
// Safety Events
// ============================================================================

export enum EventType {
  CALL = 'call',
  SMS = 'sms',
  THREAT = 'threat',
  PHISHING = 'phishing',
  SCAM = 'scam'
}

export enum EventStatus {
  BLOCKED = 'blocked',
  ALLOWED = 'allowed',
  PENDING = 'pending',
  REPORTED_SAFE = 'reported_safe',
  REPORTED_UNSAFE = 'reported_unsafe',
  WHITELISTED = 'whitelisted',
  REVIEWING = 'reviewing'
}

export enum ThreatLevel {
  NONE = 'none',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export type ThreatScore = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface CallEventMetadata {
  phoneNumber: string;
  callerName?: string;
  duration?: number;
  callType: 'incoming' | 'outgoing';
  wasAnswered: boolean;
  blockedReason?: string;
  knownScamDatabase?: string;
  countryCode: string;
  carrier?: string;
}

export interface SmsEventMetadata {
  phoneNumber: string;
  senderName?: string;
  messagePreview: string;
  fullMessage?: string;
  containsLinks: boolean;
  links?: string[];
  containsPhoneNumbers: boolean;
  extractedNumbers?: string[];
  blockedReason?: string;
  scamPatternMatched?: string;
  languageDetected: 'fr' | 'en' | 'other';
}

export interface ThreatEventMetadata {
  source: 'call' | 'sms' | 'location' | 'app' | 'system';
  description: string;
  technicalDetails?: string;
  relatedEvents?: string[];
  mitigationTaken?: string;
}

export type EventMetadata = CallEventMetadata | SmsEventMetadata | ThreatEventMetadata;

export enum RedFlagType {
  UNKNOWN_NUMBER = 'unknown_number',
  SPOOFED_CALLER_ID = 'spoofed_caller_id',
  URGENCY_LANGUAGE = 'urgency_language',
  MONEY_REQUEST = 'money_request',
  PERSONAL_INFO_REQUEST = 'personal_info_request',
  THREATENING_LANGUAGE = 'threatening_language',
  IMPERSONATION = 'impersonation',
  SUSPICIOUS_LINK = 'suspicious_link',
  KNOWN_SCAM_PATTERN = 'known_scam_pattern',
  TIME_PRESSURE = 'time_pressure',
  UNUSUAL_HOUR = 'unusual_hour',
  FOREIGN_ORIGIN = 'foreign_origin',
  GRAMMATICAL_ERRORS = 'grammatical_errors',
}

export interface RedFlag {
  type: RedFlagType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  evidence?: string;
}

export enum RecommendedAction {
  BLOCK = 'block',
  WARN = 'warn',
  ALLOW = 'allow',
  REVIEW = 'review',
  ESCALATE = 'escalate'
}

export interface Recommendation {
  action: RecommendedAction;
  explanation: string;
  userShouldReview: boolean;
  notifyTrustedContact: boolean;
}

export interface WalterAnalysis {
  analysisId: string;
  confidence: number;
  threatScore: ThreatScore;
  threatLevel: ThreatLevel;
  reasoning: string;
  redFlags: RedFlag[];
  recommendation: Recommendation;
  processedAt: string;
  modelVersion: string;
}

export interface UserFeedback {
  feedbackId: string;
  reportedAs: 'safe' | 'unsafe';
  reportedAt: string;
  reportedBy: string;
  reason?: string;
  willWhitelist: boolean;
  willBlacklist: boolean;
}

export interface SafetyEvent {
  id: string;
  userId: string;
  type: EventType;
  status: EventStatus;
  threatLevel: ThreatLevel;
  timestamp: string;
  metadata: EventMetadata;
  walterAnalysis?: WalterAnalysis;
  userFeedback?: UserFeedback;
  trustedContactNotified: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// User & Authentication
// ============================================================================

export interface UserProfile {
  firstName: string;
  lastName?: string;
  preferredName?: string;
  phoneNumber: string;
  email?: string;
  dateOfBirth?: string;
  language: 'fr' | 'en';
  location?: {
    city: string;
    province: string;
    country: string;
    postalCode?: string;
  };
  timezone: string;
}

export interface SecuritySettings {
  protectionLevel: 'low' | 'medium' | 'high';
  callProtectionEnabled: boolean;
  smsProtectionEnabled: boolean;
  locationAlertsEnabled: boolean;
  notificationsEnabled: boolean;
  autoBlockUnknownNumbers: boolean;
  autoBlockInternational: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart?: string;
  quietHoursEnd?: string;
  emergencyBypass: string[];
}

export enum ContactStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DECLINED = 'declined',
  REMOVED = 'removed',
  BLOCKED = 'blocked'
}

export interface ContactProfile {
  name: string;
  relationship: string;
  phoneNumber?: string;
  email?: string;
  preferredContactMethod: 'sms' | 'email' | 'app';
}

export interface ContactPermissions {
  canViewAlerts: boolean;
  canReceiveNotifications: boolean;
  canViewLocation: boolean;
  canAccessCalendar: boolean;
  canModifySettings: boolean;
  alertLevel: 'all' | 'high' | 'critical';
}

export interface TrustedContact {
  id: string;
  status: ContactStatus;
  profile: ContactProfile;
  permissions: ContactPermissions;
  invitationCode?: string;
  invitedAt?: string;
  acceptedAt?: string;
  lastActiveAt?: string;
}

export interface UserStats {
  totalCallsBlocked: number;
  totalMessagesBlocked: number;
  totalThreatsDetected: number;
  highestThreatLevel: ThreatLevel;
  lastThreatAt?: string;
  streakDays: number;
  protectionScore: number;
  since: string;
}

export interface SeniorUser {
  id: string;
  profile: UserProfile;
  settings: SecuritySettings;
  trustedContacts: TrustedContact[];
  stats: UserStats;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Calendar Events
// ============================================================================

export enum EventCategory {
  APPOINTMENT = 'appointment',
  MEDICATION = 'medication',
  SOCIAL = 'social',
  PRESCRIPTION = 'prescription',
  PERSONAL = 'personal',
  OTHER = 'other'
}

export interface CalendarEventMetadata {
  doctorName?: string;
  prescriptionName?: string;
  contactPerson?: string;
  phoneNumber?: string;
  confirmationRequired?: boolean;
  transportNeeded?: boolean;
}

export interface CalendarEvent {
  id: string;
  userId: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  type: EventCategory;
  location?: string;
  attendees?: string[];
  reminderMinutes?: number;
  isRecurring: boolean;
  recurrenceRule?: string;
  createdBy: 'user' | 'trusted_contact' | 'system';
  metadata?: CalendarEventMetadata;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T> {
  success: true;
  data: T;
  timestamp: string;
  requestId: string;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
    requestId: string;
  };
  timestamp: string;
}
