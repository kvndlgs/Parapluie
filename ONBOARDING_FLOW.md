# Onboarding Flow Implementation

## Current Setup

### Senior Onboarding (Complete ✅)
The senior goes through onboarding WITHOUT phone verification. They can start using the app immediately.

**Flow:**
1. **WelcomeScreen** - Collects name and phone number (2 steps)
2. **PermissionScreen** - Request app permissions
3. **InvitationScreen** - Intro to trusted contact concept
4. **ContactInfoScreen** - Collect trusted contact details
5. **ShareScreen** - Show 6-digit invitation code
6. **ConfirmationScreen** - Save everything to database

**What happens on finish:**
- Creates anonymous Supabase session (no OTP needed)
- Saves to database:
  - `user_profiles` - name, phone, language
  - `security_settings` - protection preferences
  - `trusted_contacts` - invitation pending with 6-digit code
- Navigates to main app

### Trusted Contact Onboarding (TODO)
The trusted contact receives invitation and verifies with OTP.

**Flow (to be built):**
1. Receive SMS/Email with 6-digit invitation code
2. Open app and enter invitation code
3. App sends OTP to their phone number
4. Verify OTP code
5. Complete profile setup
6. Link to senior's account

## Database Schema

```sql
-- Senior user (anonymous auth, no phone verification)
user_profiles: id, first_name, phone_number, language

-- Trusted contact invitation (with code)
trusted_contacts: senior_id, contact_status='pending', invitation_code

-- When contact accepts
trusted_contacts: contact_user_id (filled), contact_status='active'
```

## Supabase Configuration Required

### 1. Enable Anonymous Auth
Dashboard → Authentication → Settings → Enable "Anonymous sign-ins"

### 2. Enable Phone Auth (for trusted contacts)
Dashboard → Authentication → Providers → Enable Phone
- Provider: Twilio
- Twilio Account SID: (your SID)
- Twilio Auth Token: (your token)
- Twilio Phone Number: (your number)

### 3. Create Row Level Security Policies

```sql
-- Allow users to read their own profile
CREATE POLICY "Users can view own profile"
ON user_profiles FOR SELECT
USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
ON user_profiles FOR UPDATE
USING (auth.uid() = id);

-- Allow seniors to view their trusted contacts
CREATE POLICY "Seniors can view their contacts"
ON trusted_contacts FOR SELECT
USING (auth.uid() = senior_id);

-- Allow contacts to view their invitations
CREATE POLICY "Contacts can view their invitations"
ON trusted_contacts FOR SELECT
USING (auth.uid() = contact_user_id);
```

## Testing the Current Flow

1. Clear app data/AsyncStorage
2. Go through onboarding
3. Check console for: "✅ Anonymous session created for senior"
4. Check Supabase dashboard:
   - Authentication → Users → Should see new anonymous user
   - Table Editor → user_profiles → Should see new profile
   - Table Editor → trusted_contacts → Should see pending invitation

## Next Steps

1. Build Trusted Contact invitation acceptance flow
2. Add OTP verification screen
3. Link trusted contact to senior account
4. Test SMS sending with Twilio
