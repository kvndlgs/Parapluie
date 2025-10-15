# Native Platform Integration

** Important **
### The MVP will exclusively be released for Android

## Overview
This document specifies the native platform integrations required for call screening, SMS filtering, permissions, and background services in Parapluie.

---

## Android Call Screening

### CallScreeningService Implementation

#### Service Configuration
```xml
<!-- AndroidManifest.xml -->
<service
    android:name=".services.ParapluieCallScreeningService"
    android:permission="android.permission.BIND_SCREENING_SERVICE"
    android:exported="true">
    <intent-filter>
        <action android:name="android.telecom.CallScreeningService" />
    </intent-filter>
</service>
```

#### Permissions Required
```xml
<uses-permission android:name="android.permission.READ_PHONE_STATE" />
<uses-permission android:name="android.permission.READ_CALL_LOG" />
<uses-permission android:name="android.permission.ANSWER_PHONE_CALLS" />
<uses-permission android:name="android.permission.CALL_PHONE" />
```

#### Service Implementation
```kotlin
class ParapluieCallScreeningService : CallScreeningService() {

    override fun onScreenCall(callDetails: Call.Details) {
        val phoneNumber = callDetails.handle.schemeSpecificPart

        // Send to backend for Walter AI analysis
        lifecycleScope.launch {
            val analysis = analyzeCall(phoneNumber, callDetails)

            val response = CallResponse.Builder()
                .setDisallowCall(analysis.shouldBlock)
                .setRejectCall(analysis.shouldBlock)
                .setSkipCallLog(analysis.shouldBlock)
                .setSkipNotification(analysis.shouldBlock)
                .build()

            respondToCall(callDetails, response)

            // Log event
            logCallEvent(phoneNumber, analysis)

            // Send notification if threat detected
            if (analysis.threatLevel >= ThreatLevel.MEDIUM) {
                sendThreatNotification(analysis)
            }
        }
    }

    private suspend fun analyzeCall(
        phoneNumber: String,
        callDetails: Call.Details
    ): WalterAnalysis {
        // Check local cache first
        val cachedResult = database.getCachedAnalysis(phoneNumber)
        if (cachedResult != null && !cachedResult.isExpired()) {
            return cachedResult
        }

        // Check whitelist/blacklist
        if (database.isWhitelisted(phoneNumber)) {
            return WalterAnalysis.safe()
        }
        if (database.isBlacklisted(phoneNumber)) {
            return WalterAnalysis.blocked()
        }

        // Call backend API
        return api.analyzeCall(
            phoneNumber = phoneNumber,
            timestamp = callDetails.creationTimeMillis,
            userContext = getUserContext()
        )
    }
}
```

### User Flow
```
1. Incoming call detected
2. CallScreeningService intercepts
3. Send to backend for analysis (< 2 seconds)
4. Walter AI analyzes:
   - Check known scam database
   - Pattern matching
   - User's whitelist/blacklist
5. Return decision:
   - Allow: Call rings normally
   - Block: Call rejected silently
   - Warn: Call rings with warning overlay
6. Log event to database
7. Sync to cloud when online
8. Send notification if high/critical threat
```

---

## Android SMS Filtering

### SMS Retriever API (Android 11+)

#### Permissions Required
```xml
<uses-permission android:name="android.permission.RECEIVE_SMS" />
<uses-permission android:name="android.permission.READ_SMS" />
<!-- For SMS filtering (Android 11+) -->
<uses-permission android:name="android.permission.SMS_FINANCIAL_TRANSACTIONS" />
```

#### BroadcastReceiver Implementation
```kotlin
class SmsReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == Telephony.Sms.Intents.SMS_RECEIVED_ACTION) {
            val bundle = intent.extras ?: return
            val pdus = bundle["pdus"] as Array<*>

            for (pdu in pdus) {
                val message = SmsMessage.createFromPdu(pdu as ByteArray)
                val sender = message.originatingAddress ?: continue
                val body = message.messageBody

                // Analyze SMS
                lifecycleScope.launch {
                    val analysis = analyzeSms(sender, body)

                    if (analysis.shouldBlock) {
                        // Block SMS (requires being default SMS app)
                        abortBroadcast()
                    }

                    // Log event
                    logSmsEvent(sender, body, analysis)

                    // Notify if threat
                    if (analysis.threatLevel >= ThreatLevel.MEDIUM) {
                        sendThreatNotification(analysis)
                    }
                }
            }
        }
    }

    private suspend fun analyzeSms(
        sender: String,
        body: String
    ): WalterAnalysis {
        // Check if sender is whitelisted
        if (database.isWhitelisted(sender)) {
            return WalterAnalysis.safe()
        }

        // Quick local checks
        if (containsPhishingPatterns(body)) {
            return WalterAnalysis.phishing()
        }

        // Backend AI analysis
        return api.analyzeSms(
            phoneNumber = sender,
            messageContent = body.take(500), // Limit for privacy
            containsLinks = extractLinks(body).isNotEmpty(),
            userContext = getUserContext()
        )
    }

    private fun containsPhishingPatterns(body: String): Boolean {
        val patterns = listOf(
            Regex("(click|cliquez).*(http|www)", RegexOption.IGNORE_CASE),
            Regex("(urgent|compte|suspendu)", RegexOption.IGNORE_CASE),
            Regex("(verify|vérifiez).*(account|compte)", RegexOption.IGNORE_CASE),
            Regex("(gift|cadeau).*(won|gagné)", RegexOption.IGNORE_CASE)
        )
        return patterns.any { it.containsMatchIn(body) }
    }
}
```

### Manifest Registration
```xml
<receiver
    android:name=".receivers.SmsReceiver"
    android:permission="android.permission.BROADCAST_SMS"
    android:exported="true">
    <intent-filter android:priority="999">
        <action android:name="android.provider.Telephony.SMS_RECEIVED" />
    </intent-filter>
</receiver>
```

---

## Permissions Flow

### Permission Request Sequence

#### 1. Phone & Call Permissions
```kotlin
// Request during onboarding
val phonePermissions = arrayOf(
    Manifest.permission.READ_PHONE_STATE,
    Manifest.permission.READ_CALL_LOG,
    Manifest.permission.ANSWER_PHONE_CALLS,
    Manifest.permission.CALL_PHONE
)

fun requestPhonePermissions(activity: Activity) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
        activity.requestPermissions(phonePermissions, REQUEST_PHONE)
    }
}

// Set as default call screening app
fun requestDefaultCallScreener(activity: Activity) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
        val roleManager = activity.getSystemService(RoleManager::class.java)
        if (!roleManager.isRoleHeld(RoleManager.ROLE_CALL_SCREENING)) {
            val intent = roleManager.createRequestRoleIntent(RoleManager.ROLE_CALL_SCREENING)
            activity.startActivityForResult(intent, REQUEST_CALL_SCREENING)
        }
    }
}
```

#### 2. SMS Permissions
```kotlin
val smsPermissions = arrayOf(
    Manifest.permission.RECEIVE_SMS,
    Manifest.permission.READ_SMS
)

fun requestSmsPermissions(activity: Activity) {
    activity.requestPermissions(smsPermissions, REQUEST_SMS)
}

// Optionally set as default SMS app for blocking
fun requestDefaultSmsApp(activity: Activity) {
    val intent = Intent(Telephony.Sms.Intents.ACTION_CHANGE_DEFAULT)
    intent.putExtra(Telephony.Sms.Intents.EXTRA_PACKAGE_NAME, activity.packageName)
    activity.startActivityForResult(intent, REQUEST_DEFAULT_SMS)
}
```

#### 3. Location Permissions
```kotlin
val locationPermissions = arrayOf(
    Manifest.permission.ACCESS_FINE_LOCATION,
    Manifest.permission.ACCESS_COARSE_LOCATION
)

fun requestLocationPermissions(activity: Activity) {
    activity.requestPermissions(locationPermissions, REQUEST_LOCATION)
}
```

#### 4. Notification Permissions (Android 13+)
```kotlin
fun requestNotificationPermission(activity: Activity) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
        activity.requestPermissions(
            arrayOf(Manifest.permission.POST_NOTIFICATIONS),
            REQUEST_NOTIFICATIONS
        )
    }
}
```

### Permission Handling UI
```typescript
// React Native side
import { PermissionsAndroid, Platform } from 'react-native';

async function requestAllPermissions() {
  if (Platform.OS !== 'android') return;

  try {
    // 1. Phone permissions
    const phoneGranted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
      PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
      PermissionsAndroid.PERMISSIONS.ANSWER_PHONE_CALLS,
      PermissionsAndroid.PERMISSIONS.CALL_PHONE,
    ]);

    // 2. SMS permissions
    const smsGranted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
      PermissionsAndroid.PERMISSIONS.READ_SMS,
    ]);

    // 3. Location
    const locationGranted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    // 4. Notifications (Android 13+)
    if (Platform.Version >= 33) {
      const notifGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
    }

    // 5. Request call screening role via native module
    await NativeModules.ParapluieNative.requestCallScreeningRole();

    return {
      phone: phoneGranted,
      sms: smsGranted,
      location: locationGranted,
    };
  } catch (error) {
    console.error('Permission request failed:', error);
    return null;
  }
}
```

### Graceful Degradation
```typescript
// If permissions denied:
interface PermissionStatus {
  phone: boolean;
  sms: boolean;
  location: boolean;
  notifications: boolean;
}

function getFeatureAvailability(permissions: PermissionStatus) {
  return {
    callScreening: permissions.phone,
    smsFiltering: permissions.sms,
    locationAlerts: permissions.location,
    pushNotifications: permissions.notifications,
    // App still works with partial permissions
    canUseApp: true,
    // Show warnings in UI
    showPhoneWarning: !permissions.phone,
    showSmsWarning: !permissions.sms,
  };
}
```

---

## Background Service Configuration

### Foreground Service for Call Monitoring
```kotlin
class ParapluieMonitoringService : Service() {

    private val NOTIFICATION_ID = 1001
    private val CHANNEL_ID = "parapluie_monitoring"

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
        startForeground(NOTIFICATION_ID, createNotification())
    }

    private fun createNotification(): Notification {
        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("Parapluie actif")
            .setContentText("Walter veille sur vous")
            .setSmallIcon(R.drawable.ic_shield)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .setOngoing(true)
            .build()
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "Protection Parapluie",
                NotificationManager.IMPORTANCE_LOW
            )
            val notificationManager = getSystemService(NotificationManager::class.java)
            notificationManager.createNotificationChannel(channel)
        }
    }

    override fun onBind(intent: Intent?): IBinder? = null
}
```

### Service Declaration
```xml
<service
    android:name=".services.ParapluieMonitoringService"
    android:enabled="true"
    android:exported="false"
    android:foregroundServiceType="phoneCall" />
```

### Battery Optimization Handling
```kotlin
fun requestBatteryOptimizationExemption(activity: Activity) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
        val intent = Intent()
        val packageName = activity.packageName
        val pm = activity.getSystemService(Context.POWER_SERVICE) as PowerManager

        if (!pm.isIgnoringBatteryOptimizations(packageName)) {
            intent.action = Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS
            intent.data = Uri.parse("package:$packageName")
            activity.startActivity(intent)
        }
    }
}
```

---

## Contact Picker Integration

### Native Contact Picker
```kotlin
// Native module for React Native
class ContactPickerModule(reactContext: ReactApplicationContext)
    : ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "ContactPicker"

    @ReactMethod
    fun pickContact(promise: Promise) {
        val intent = Intent(Intent.ACTION_PICK).apply {
            type = ContactsContract.CommonDataKinds.Phone.CONTENT_TYPE
        }

        val activity = currentActivity
        if (activity == null) {
            promise.reject("NO_ACTIVITY", "Activity doesn't exist")
            return
        }

        activity.startActivityForResult(intent, REQUEST_CONTACT_PICKER)
        contactPickerPromise = promise
    }

    fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        if (requestCode == REQUEST_CONTACT_PICKER) {
            if (resultCode == Activity.RESULT_OK && data != null) {
                val contactUri = data.data
                val contact = getContactInfo(contactUri)
                contactPickerPromise?.resolve(contactToMap(contact))
            } else {
                contactPickerPromise?.reject("CANCELLED", "User cancelled")
            }
        }
    }

    private fun getContactInfo(uri: Uri?): Contact? {
        // Query contacts database
        // Return name, phone, email
    }
}
```

### Permission for Contacts
```xml
<uses-permission android:name="android.permission.READ_CONTACTS" />
```

### React Native Usage
```typescript
import { NativeModules } from 'react-native';

async function selectContact() {
  try {
    const contact = await NativeModules.ContactPicker.pickContact();
    // Returns: { name, phoneNumber, email }
    return contact;
  } catch (error) {
    if (error.code === 'CANCELLED') {
      // User cancelled
    }
    throw error;
  }
}
```

---

## Push Notifications (FCM)

### Firebase Cloud Messaging Setup

#### Dependencies
```gradle
// android/app/build.gradle
dependencies {
    implementation 'com.google.firebase:firebase-messaging:23.1.0'
}
```

#### FCM Service
```kotlin
class ParapluieFirebaseMessagingService : FirebaseMessagingService() {

    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        // Handle notification payload
        val data = remoteMessage.data
        val notificationType = data["type"] ?: return

        when (notificationType) {
            "threat_detected" -> showThreatNotification(data)
            "event_reminder" -> showReminderNotification(data)
            "trusted_contact_alert" -> showContactNotification(data)
        }
    }

    override fun onNewToken(token: String) {
        // Send token to backend
        sendTokenToBackend(token)
    }

    private fun showThreatNotification(data: Map<String, String>) {
        val notification = NotificationCompat.Builder(this, THREAT_CHANNEL_ID)
            .setContentTitle(data["title"])
            .setContentText(data["body"])
            .setSmallIcon(R.drawable.ic_shield_alert)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setAutoCancel(true)
            .setContentIntent(createDeepLinkIntent(data["eventId"]))
            .addAction(R.drawable.ic_check, "Marquer sûr", createSafeAction(data["eventId"]))
            .addAction(R.drawable.ic_block, "Bloquer", createBlockAction(data["eventId"]))
            .build()

        NotificationManagerCompat.from(this).notify(THREAT_NOTIFICATION_ID, notification)
    }
}
```

### Notification Channels
```kotlin
fun createNotificationChannels(context: Context) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        val channels = listOf(
            NotificationChannel(
                "threats",
                "Menaces détectées",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Alertes de menaces de sécurité"
                enableVibration(true)
                enableLights(true)
                lightColor = Color.RED
            },
            NotificationChannel(
                "reminders",
                "Rappels",
                NotificationManager.IMPORTANCE_DEFAULT
            ),
            NotificationChannel(
                "monitoring",
                "Surveillance active",
                NotificationManager.IMPORTANCE_LOW
            )
        )

        val notificationManager = context.getSystemService(NotificationManager::class.java)
        channels.forEach { notificationManager.createNotificationChannel(it) }
    }
}
```

---

## Deep Linking

### Intent Filter Configuration
```xml
<activity
    android:name=".MainActivity"
    android:launchMode="singleTask">

    <!-- Deep links -->
    <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />

        <data
            android:scheme="parapluie"
            android:host="app" />
    </intent-filter>

    <!-- Universal links -->
    <intent-filter android:autoVerify="true">
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />

        <data
            android:scheme="https"
            android:host="parapluie.app" />
    </intent-filter>
</activity>
```

### Deep Link Handling
```kotlin
// MainActivity.kt
override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    handleDeepLink(intent)
}

override fun onNewIntent(intent: Intent?) {
    super.onNewIntent(intent)
    handleDeepLink(intent)
}

private fun handleDeepLink(intent: Intent?) {
    val uri = intent?.data ?: return

    when (uri.host) {
        "event" -> {
            val eventId = uri.lastPathSegment
            // Navigate to event detail
            sendDeepLinkToReactNative("event", eventId)
        }
        "invitation" -> {
            val code = uri.lastPathSegment
            // Navigate to invitation acceptance
            sendDeepLinkToReactNative("invitation", code)
        }
    }
}
```

### React Native Integration
```typescript
import { Linking } from 'react-native';

useEffect(() => {
  // Handle deep links
  const handleUrl = ({ url }: { url: string }) => {
    const route = parseDeepLink(url);
    navigation.navigate(route.screen, route.params);
  };

  Linking.addEventListener('url', handleUrl);

  // Check if app was opened via deep link
  Linking.getInitialURL().then((url) => {
    if (url) handleUrl({ url });
  });

  return () => {
    Linking.removeEventListener('url', handleUrl);
  };
}, []);
```

---

## Testing Strategies

### Testing Call Screening
```kotlin
@Test
fun testCallBlocking() {
    val testNumber = "+15145551234"
    val callDetails = mockCallDetails(testNumber)

    val analysis = analyzeCall(testNumber, callDetails)

    assertTrue(analysis.shouldBlock)
    assertEquals(ThreatLevel.HIGH, analysis.threatLevel)
}
```

### Testing SMS Filtering
```kotlin
@Test
fun testPhishingSmsDetection() {
    val phishingSms = "Urgent! Click here to verify your account: http://fake-bank.com"

    val analysis = analyzeSms("+10000000000", phishingSms)

    assertTrue(analysis.isPhishing)
    assertTrue(analysis.containsLinks)
}
```

### Testing Permissions
```kotlin
@Test
fun testPermissionFlow() {
    val activity = activityScenario.launch<PermissionScreen>()

    onView(withId(R.id.request_phone_permission)).perform(click())

    // Verify permission request dialog shown
    // Grant permission
    // Verify callback received
}
```

---

## Performance Considerations

### Call Screening Performance
- **Target:** < 2 seconds from call received to decision
- **Strategy:**
  - Local whitelist/blacklist check (< 50ms)
  - Cache recent analyses (5 minutes)
  - Async backend call with timeout
  - Fallback to "allow" if timeout

### Battery Impact
- **Target:** < 5% battery drain per day
- **Strategy:**
  - Efficient background service
  - Batch API calls
  - Use WorkManager for non-urgent tasks
  - Request battery optimization exemption only when necessary

### Memory Management
- **Target:** < 50MB average memory usage
- **Strategy:**
  - Limit cache size
  - Clean up old events
  - Use efficient data structures
  - Avoid memory leaks in services

---

## Security Considerations

### Data Privacy
- Encrypt SMS content at rest
- Never send full SMS content to backend (only metadata + hashes)
- Store call logs securely
- Use Android Keystore for sensitive data

### API Security
- Use certificate pinning
- Encrypt API payloads
- Validate all backend responses
- Handle authentication securely

---

## Version History

- v1.0.0 (2025-01-15): Initial Android native integration specification
- MVP: Android-only release
