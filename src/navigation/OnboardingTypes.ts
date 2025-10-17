// Shared types for onboarding navigation

export type OnboardingStackParamList = {
  Welcome: undefined;
  Permissions: {
    userName: string;
    phoneNumber: string;
  };
  Invitation: {
    userName: string;
    phoneNumber: string;
    permissions: PermissionsData;
  };
  ContactInfo: {
    userName: string;
    phoneNumber: string;
    permissions: PermissionsData;
  };
  Share: {
    userName: string;
    phoneNumber: string;
    permissions: PermissionsData;
    contactName: string;
    relationship: string;
    contactPhone?: string;
    contactEmail?: string;
    preferredMethod: 'sms' | 'email' | 'app';
  };
  Confirmation: {
    userName: string;
    phoneNumber: string;
    permissions: PermissionsData;
    contactName?: string;
    relationship?: string;
    contactPhone?: string;
    contactEmail?: string;
    preferredMethod?: 'sms' | 'email' | 'app';
  };
};

export interface PermissionsData {
  callProtection: boolean;
  smsProtection: boolean;
  locationAlerts: boolean;
  notifications: boolean;
}
