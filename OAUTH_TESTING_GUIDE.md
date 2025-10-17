# OAuth Testing Guide - Parapluie

## ✅ Setup Complete

You've configured:
- ✅ Supabase redirect URLs
- ✅ Google Cloud OAuth credentials
- ✅ Deep linking in app.json
- ✅ OAuth handlers in AccountCreationScreen

## Testing Google Sign-In

### 1. Start Your Development Server

```bash
npx expo start
```

### 2. Run on Device/Simulator

**iOS:**
```bash
# Run on simulator
npx expo run:ios

# Or scan QR code with Expo Go on physical device
```

**Android:**
```bash
# Run on emulator
npx expo run:android

# Or scan QR code with Expo Go on physical device
```

### 3. Test the Flow

1. **Open the app**
2. **Go through onboarding** until you reach the AccountCreation screen
3. **Tap "Continuer avec Google"**
4. **Expected behavior:**
   - Browser/Google Sign-In opens
   - You authenticate with your Google account
   - Browser redirects to `parapluie://auth/callback`
   - App reopens automatically
   - Console shows: "OAuth success, creating profile for: [user-id]"
   - Navigates to Permissions screen

### 4. Debug with Console Logs

Open Metro bundler logs to see:
```
Deep link received: parapluie://auth/callback?code=...
Auth state changed: SIGNED_IN [user-id]
OAuth success, creating profile for: [user-id]
```

### 5. Common Issues & Solutions

#### Issue: "Invalid redirect URI"
**Solution:** Double-check Supabase redirect URLs match exactly:
- `parapluie://auth/callback` (no trailing slash)

#### Issue: Browser doesn't redirect back to app
**Solution:**
- iOS: Make sure `scheme: "parapluie"` is in app.json
- Android: Rebuild app with `npx expo run:android` after changing app.json
- Test custom scheme manually:
  ```bash
  # iOS
  xcrun simctl openurl booted "parapluie://auth/callback"

  # Android
  adb shell am start -W -a android.intent.action.VIEW -d "parapluie://auth/callback"
  ```

#### Issue: "No session found after OAuth callback"
**Solution:** Check Supabase logs:
- Go to Supabase Dashboard → Logs → Auth
- Look for errors during OAuth callback

#### Issue: App crashes after OAuth
**Solution:** Check that `createUserProfile` function doesn't error:
- Verify database tables exist
- Check RLS policies allow inserts
- Look at Metro bundler error logs

## Manual Testing Checklist

- [ ] Google Sign-In opens browser
- [ ] Can authenticate with Google account
- [ ] Redirects back to app automatically
- [ ] User profile created in Supabase
- [ ] Navigates to Permissions screen
- [ ] User can continue onboarding
- [ ] Check Supabase Dashboard → Authentication → Users (new user appears)
- [ ] Check user_profiles table (profile row created)
- [ ] Check security_settings table (settings row created)

## Supabase Dashboard Checks

### After successful OAuth:

1. **Authentication → Users**
   - New user should appear with Google provider
   - Email should match Google account

2. **Table Editor → user_profiles**
   - New row with same user ID
   - first_name, phone_number, email populated

3. **Table Editor → security_settings**
   - New row with user_id
   - Default protection settings

4. **Table Editor → user_stats**
   - New row with user_id
   - since timestamp set

## Testing Apple Sign-In (When Ready)

1. **Configure in Supabase:**
   - Authentication → Providers → Apple
   - Enable and add credentials

2. **Update code:**
   - Uncomment Apple handler in AccountCreationScreen
   - Test same flow as Google

3. **iOS Only:**
   - Apple Sign-In only works on iOS
   - Requires paid Apple Developer account
   - Must be tested on physical device or TestFlight

## Quick Test Script

```bash
# 1. Clear app data
npx expo start --clear

# 2. Run on iOS simulator
npx expo run:ios

# 3. Monitor logs
# Watch Metro bundler terminal for:
# - "Deep link received"
# - "Auth state changed: SIGNED_IN"
# - "OAuth success"

# 4. Test deep link manually
xcrun simctl openurl booted "parapluie://auth/callback"
```

## Production Testing

Before deploying:
- [ ] Test on physical iOS device
- [ ] Test on physical Android device
- [ ] Test with different Google accounts
- [ ] Test error scenarios (cancel OAuth, network error)
- [ ] Verify user data saves correctly
- [ ] Test complete onboarding flow after OAuth

## Troubleshooting Commands

```bash
# View iOS simulator logs
xcrun simctl spawn booted log stream --predicate 'process == "Parapluie"'

# View Android logs
adb logcat | grep Parapluie

# Reset Expo cache
npx expo start --clear

# Rebuild native app (after app.json changes)
npx expo prebuild --clean
npx expo run:ios
npx expo run:android
```

## Next Steps

Once Google OAuth works:
1. Add Apple Sign-In configuration
2. Add error tracking (Sentry)
3. Add analytics for OAuth events
4. Test on production environment
