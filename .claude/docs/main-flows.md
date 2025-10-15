# Main App Navigation Flows

## Overview
This document specifies all user navigation flows within the main Parapluie app (post-onboarding), including primary user journeys, decision trees, and interaction patterns.

---

## 1. App Launch Flow

```mermaid
flowchart TD
    Start[App Launches] --> CheckAuth{Authenticated?}

    CheckAuth -->|No| Login[Login Screen]
    CheckAuth -->|Yes| CheckOnboarding{Onboarding<br/>Complete?}

    Login --> OnboardingStack[Onboarding Flow]

    CheckOnboarding -->|No| OnboardingStack
    CheckOnboarding -->|Yes| LoadData[Load User Data]

    LoadData --> CheckPermissions{Permissions<br/>Granted?}

    CheckPermissions -->|All Granted| HomeScreen[Home Screen]
    CheckPermissions -->|Missing Some| PermissionPrompt[Permission Reminder]

    PermissionPrompt --> UserDecision{User Action?}
    UserDecision -->|Grant| RequestPermissions[Request Permissions]
    UserDecision -->|Dismiss| HomeScreen
    UserDecision -->|Later| HomeScreen

    RequestPermissions --> HomeScreen

    OnboardingStack --> HomeScreen

    style Start fill:#667eea
    style HomeScreen fill:#48bb78
    style PermissionPrompt fill:#ed8936
```

---

## 2. Home Screen Navigation

```mermaid
flowchart LR
    Home[Home Screen] --> SafetyCard{Tap Safety<br/>Events Card?}
    Home --> Walter{Tap Walter<br/>Button?}
    Home --> News{Tap News<br/>Item?}
    Home --> Calendar{Tap Event?}
    Home --> Activity{Tap Activity?}

    SafetyCard -->|Yes| SafetyEventsScreen[Safety Events Screen]
    Walter -->|Yes| WalterModal[Walter Chat Modal]
    News -->|Yes| NewsDetail[News Detail Screen]
    Calendar -->|Yes| EventDetail[Event Detail Screen]
    Activity -->|Yes| ActivityDetail[Activity Detail Screen]

    SafetyEventsScreen --> EventList[Event History List]
    EventList --> EventDetail2[Event Detail Screen]

    style Home fill:#667eea
    style WalterModal fill:#48bb78
```

---

## 3. Safety Events Complete Flow

```mermaid
flowchart TD
    HomeCard[Home: Safety Events Card] --> SafetyEvents[Safety Events Screen]

    SafetyEvents --> FilterChoice{User Action?}

    FilterChoice -->|View All Calls| CallHistory[Call History Screen]
    FilterChoice -->|View All SMS| SMSHistory[SMS History Screen]
    FilterChoice -->|View Threats| ThreatHistory[Threat History Screen]
    FilterChoice -->|Tap Event| EventDetail[Event Detail Screen]

    CallHistory --> CallDetail[Call Event Detail]
    SMSHistory --> SMSDetail[SMS Event Detail]
    ThreatHistory --> ThreatDetail[Threat Detail]

    CallDetail --> AskWalter{Ask Walter?}
    SMSDetail --> AskWalter
    ThreatDetail --> AskWalter

    AskWalter -->|Yes| WalterAnalysis[Walter AI Analysis]
    AskWalter -->|No| UserAction

    WalterAnalysis --> WalterAssessment[Walter's Assessment<br/>Low/Medium/High/Critical]

    WalterAssessment --> UserAction{User Decision?}

    UserAction -->|Mark Safe| MarkSafe[Mark as Safe]
    UserAction -->|Mark Unsafe| MarkUnsafe[Mark as Unsafe]
    UserAction -->|Block Number| BlockNumber[Add to Blacklist]
    UserAction -->|Report| ReportFlow[Report to Authorities]
    UserAction -->|Back| SafetyEvents

    MarkSafe --> AILearn[AI Learns Pattern]
    MarkUnsafe --> ReportPrompt{Report to<br/>Authorities?}

    ReportPrompt -->|Yes| ReportFlow
    ReportPrompt -->|No| AILearn

    BlockNumber --> Confirmation[Show Confirmation]
    Confirmation --> SafetyEvents

    ReportFlow --> SelectAuthority{Choose Authority}

    SelectAuthority -->|Anti-Fraud Centre| CallAntifraud[Call 1-888-495-8501]
    SelectAuthority -->|Local Police| CallPolice[Call Local Police]
    SelectAuthority -->|Consumer Protection| CallConsumer[Call Provincial Agency]
    SelectAuthority -->|Copy Details| CopyDetails[Copy to Clipboard]
    SelectAuthority -->|Share with Family| NotifyFamily[Notify Trusted Contact]

    CallAntifraud --> LogReport[Log Report]
    CallPolice --> LogReport
    CallConsumer --> LogReport
    CopyDetails --> LogReport
    NotifyFamily --> LogReport

    LogReport --> AILearn
    AILearn --> SafetyEvents

    style HomeCard fill:#667eea
    style WalterAnalysis fill:#48bb78
    style ReportFlow fill:#f56565
    style AILearn fill:#4299e1
```

---

## 4. Walter Chat Interaction Flow

```mermaid
flowchart TD
    TriggerWalter[Tap Walter Button] --> OpenModal[Walter Chat Modal Opens]

    OpenModal --> CheckContext{Context Available?}

    CheckContext -->|From Event Detail| ContextChat[Walter References Event]
    CheckContext -->|From Home| GeneralChat[Walter General Greeting]

    ContextChat --> WalterSpeaks[Walter Analyzes Event]
    GeneralChat --> QuickActions[Show Quick Actions]

    QuickActions --> UserChoice{User Selection?}

    UserChoice -->|Explain Threat| ThreatExplanation[Walter Explains Threat Types]
    UserChoice -->|Verify Number| NumberVerification[Walter Checks Number Safety]
    UserChoice -->|Safety Tips| SafetyTips[Walter Shares Tips]
    UserChoice -->|General Help| GeneralHelp[Walter General Assistance]
    UserChoice -->|Type Message| CustomMessage[User Types Question]
    UserChoice -->|Voice Input| VoiceMessage[User Speaks Question]

    VoiceMessage --> SpeechToText[Convert to Text]
    SpeechToText --> SendToAI[Send to Walter AI]
    CustomMessage --> SendToAI
    ThreatExplanation --> WalterResponds
    NumberVerification --> WalterResponds
    SafetyTips --> WalterResponds
    GeneralHelp --> WalterResponds

    SendToAI --> WalterProcessing[Walter Thinking...]
    WalterProcessing --> WalterResponds[Walter Responds]

    WalterResponds --> UserNext{User Next Action?}

    UserNext -->|Ask Follow-up| SendToAI
    UserNext -->|Take Action| ActionButtons[Walter Suggests Action]
    UserNext -->|Close| CloseModal[Return to Previous Screen]

    ActionButtons --> ActionChoice{Action Type?}

    ActionChoice -->|Block Number| BlockAction[Navigate to Block Confirmation]
    ActionChoice -->|Report| ReportAction[Navigate to Report Flow]
    ActionChoice -->|Mark Safe| SafeAction[Mark Event Safe]
    ActionChoice -->|Add to Whitelist| WhitelistAction[Add to Whitelist]

    BlockAction --> CloseModal
    ReportAction --> CloseModal
    SafeAction --> CloseModal
    WhitelistAction --> CloseModal

    WalterSpeaks --> WalterNext{Walter's Recommendation?}

    WalterNext -->|Low Risk| NoAction["No action needed"]
    WalterNext -->|Medium Risk| SuggestReview["Suggests user review"]
    WalterNext -->|High Risk| SuggestReport["Suggests reporting"]
    WalterNext -->|Critical| AutoNotify["Auto-notifies family +<br/>suggests reporting"]

    NoAction --> UserNext
    SuggestReview --> UserNext
    SuggestReport --> UserNext
    AutoNotify --> UserNext

    style TriggerWalter fill:#667eea
    style WalterResponds fill:#48bb78
    style AutoNotify fill:#f56565
```

---

## 5. Settings & Profile Flow

```mermaid
flowchart TD
    SafetyScreen[Safety Screen] --> ProtectionToggle{Toggle Protection?}
    SafetyScreen --> SettingsButton{Tap Settings?}

    ProtectionToggle -->|Turn Off| ConfirmDisable[Confirm Disable Protection]
    ProtectionToggle -->|Turn On| EnableProtection[Enable Protection]

    ConfirmDisable --> AreYouSure{"Êtes-vous sûr?"}
    AreYouSure -->|Yes| DisableProtection[Protection Disabled]
    AreYouSure -->|No| SafetyScreen

    DisableProtection --> ShowWarning[Show Warning Banner]
    EnableProtection --> SafetyScreen
    ShowWarning --> SafetyScreen

    SettingsButton -->|Yes| SettingsScreen[Settings Screen]

    SettingsScreen --> SettingOption{Setting Type?}

    SettingOption -->|Protection Level| LevelSelector[Low/Medium/High Selector]
    SettingOption -->|Auto-Block Settings| AutoBlockSettings[Configure Auto-Block]
    SettingOption -->|Quiet Hours| QuietHoursConfig[Set Quiet Hours]
    SettingOption -->|Emergency Bypass| BypassNumbers[Manage Bypass List]
    SettingOption -->|Trusted Contacts| ContactsManagement[Manage Contacts]
    SettingOption -->|Notification Prefs| NotificationSettings[Configure Notifications]
    SettingOption -->|Account| AccountScreen[Account Settings]

    LevelSelector --> UpdateSetting[Update Backend]
    AutoBlockSettings --> UpdateSetting
    QuietHoursConfig --> UpdateSetting
    BypassNumbers --> UpdateSetting
    NotificationSettings --> UpdateSetting

    UpdateSetting --> Confirmation[Show Success Message]
    Confirmation --> SettingsScreen

    ContactsManagement --> ContactAction{Action?}

    ContactAction -->|Add Contact| InviteFlow[Invite Contact Flow]
    ContactAction -->|Edit Permissions| EditPermissions[Edit Contact Permissions]
    ContactAction -->|Remove Contact| RemoveContact[Confirm Remove]

    InviteFlow --> ShareInvite[Share Invitation Code]
    EditPermissions --> SavePermissions[Save Changes]
    RemoveContact --> ConfirmRemove[Confirm Removal]

    ShareInvite --> ContactsManagement
    SavePermissions --> ContactsManagement
    ConfirmRemove --> ContactsManagement

    AccountScreen --> AccountOption{Account Action?}

    AccountOption -->|Edit Profile| EditProfile[Edit User Profile]
    AccountOption -->|Subscription| ManageSubscription[Manage Subscription]
    AccountOption -->|Privacy| PrivacySettings[Privacy Settings]
    AccountOption -->|Logout| ConfirmLogout[Confirm Logout]

    EditProfile --> SaveProfile[Save Profile Changes]
    SaveProfile --> AccountScreen

    ManageSubscription --> SubscriptionDetails[View Plan Details]
    SubscriptionDetails --> SubscriptionAction{Action?}

    SubscriptionAction -->|Upgrade| UpgradeFlow[Upgrade Plan]
    SubscriptionAction -->|Cancel| CancelFlow[Cancel Subscription]
    SubscriptionAction -->|Update Payment| PaymentFlow[Update Payment Method]

    ConfirmLogout -->|Yes| Logout[Logout User]
    ConfirmLogout -->|No| AccountScreen

    Logout --> LoginScreen[Return to Login]

    style SafetyScreen fill:#667eea
    style ConfirmDisable fill:#ed8936
    style DisableProtection fill:#f56565
```

---

## 6. Notification Handling Flow

```mermaid
flowchart TD
    NotificationReceived[Push Notification Received] --> NotifType{Notification Type?}

    NotifType -->|Threat Detected| ThreatNotif[Threat Alert]
    NotifType -->|Call Blocked| CallBlockedNotif[Call Blocked Alert]
    NotifType -->|SMS Flagged| SMSFlaggedNotif[SMS Flagged Alert]
    NotifType -->|Event Reminder| ReminderNotif[Event Reminder]
    NotifType -->|Family Alert| FamilyNotif[Family Alert]

    ThreatNotif --> NotifAction{User Taps Notification?}
    CallBlockedNotif --> NotifAction
    SMSFlaggedNotif --> NotifAction

    NotifAction -->|Tap Notification| OpenApp[Open App]
    NotifAction -->|Tap "Mark Safe"| QuickMarkSafe[Quick Action: Mark Safe]
    NotifAction -->|Tap "Block"| QuickBlock[Quick Action: Block Number]
    NotifAction -->|Dismiss| Dismissed[Notification Dismissed]

    OpenApp --> NavigateToEvent[Navigate to Event Detail]

    QuickMarkSafe --> UpdateEvent[Update Event Status]
    QuickBlock --> UpdateEvent

    UpdateEvent --> ShowToast[Show Confirmation Toast]
    ShowToast --> Done[Complete]

    ReminderNotif --> ReminderAction{User Action?}
    ReminderAction -->|Tap| OpenCalendar[Open Calendar Event]
    ReminderAction -->|Snooze| SnoozeReminder[Snooze for 10 min]
    ReminderAction -->|Dismiss| Dismissed

    FamilyNotif --> FamilyAction{User Action?}
    FamilyAction -->|Tap| OpenFamilyDashboard[Open Family Dashboard]
    FamilyAction -->|Call Contact| InitiateCall[Call Trusted Contact]
    FamilyAction -->|Dismiss| Dismissed

    NavigateToEvent --> EventDetailScreen[Event Detail Screen]
    OpenCalendar --> EventDetailScreen
    OpenFamilyDashboard --> FamilyScreen[Family Dashboard]

    style NotificationReceived fill:#667eea
    style ThreatNotif fill:#f56565
    style QuickMarkSafe fill:#48bb78
```

---

## 7. First-Time Feature Discovery Flow

```mermaid
flowchart TD
    FirstLaunch[First Time on Home] --> ShowTooltip[Show Walter Tooltip]

    ShowTooltip --> TooltipMessage["Tap here anytime<br/>to talk with Walter"]

    TooltipMessage --> UserDismiss{User Action?}

    UserDismiss -->|Tap Walter| OpenWalter[Open Walter Modal]
    UserDismiss -->|Dismiss| SaveDismissed[Save Tooltip Shown]

    OpenWalter --> WalterGreeting[Walter: First-time Greeting]

    WalterGreeting --> WalterIntro["Bonjour! I'm Walter.<br/>I'm here to protect you<br/>from scams and threats."]

    WalterIntro --> WalterTour{Offer Tour?}

    WalterTour -->|Yes| FeatureTour[Show Feature Tour]
    WalterTour -->|No| SaveDismissed

    FeatureTour --> TourStep1[Step 1: Safety Events]
    TourStep1 --> TourStep2[Step 2: Call me anytime]
    TourStep2 --> TourStep3[Step 3: Check your safety]
    TourStep3 --> TourComplete[Tour Complete]

    TourComplete --> SaveDismissed
    SaveDismissed --> NormalUsage[Normal App Usage]

    style FirstLaunch fill:#667eea
    style WalterGreeting fill:#48bb78
```

---

## 8. Error & Offline Handling Flow

```mermaid
flowchart TD
    UserAction[User Attempts Action] --> CheckConnection{Internet<br/>Available?}

    CheckConnection -->|Yes| PerformAction[Perform Action]
    CheckConnection -->|No| ShowOffline[Show Offline Banner]

    ShowOffline --> QueueAction[Queue Action]
    QueueAction --> WaitForConnection[Wait for Connection]

    WaitForConnection --> ConnectionRestored{Connection<br/>Restored?}

    ConnectionRestored -->|Yes| SyncQueued[Sync Queued Actions]
    ConnectionRestored -->|No| WaitForConnection

    SyncQueued --> PerformAction

    PerformAction --> ActionResult{Result?}

    ActionResult -->|Success| ShowSuccess[Show Success Message]
    ActionResult -->|API Error| HandleError[Handle Error]
    ActionResult -->|Timeout| RetryPrompt[Show Retry Option]

    HandleError --> ErrorType{Error Type?}

    ErrorType -->|401 Unauthorized| RedirectLogin[Redirect to Login]
    ErrorType -->|404 Not Found| ShowNotFound["Resource not found"]
    ErrorType -->|429 Rate Limit| ShowRateLimit["Too many requests.<br/>Please wait."]
    ErrorType -->|500 Server Error| ShowServerError["Server error.<br/>Try again later."]

    RetryPrompt --> UserRetry{User Action?}

    UserRetry -->|Retry| PerformAction
    UserRetry -->|Cancel| CancelAction[Cancel & Return]

    ShowSuccess --> Complete[Action Complete]
    ShowNotFound --> Complete
    ShowRateLimit --> Complete
    ShowServerError --> Complete
    RedirectLogin --> LoginScreen[Login Screen]
    CancelAction --> Complete

    style UserAction fill:#667eea
    style ShowOffline fill:#ed8936
    style HandleError fill:#f56565
    style ShowSuccess fill:#48bb78
```

---

## 9. Tab Navigation Flow

```mermaid
flowchart LR
    TabBar[Bottom Tab Bar] --> HomeTab{Tap Accueil?}
    TabBar --> WalterTab{Tap Walter?}
    TabBar --> SafetyTab{Tap Sécurité?}

    HomeTab -->|Yes| HomeScreen[Home Screen]
    WalterTab -->|Yes| WalterModal[Walter Chat Modal]
    SafetyTab -->|Yes| SafetyScreen[Safety Screen]

    HomeScreen --> HomeContent[Show Dashboard]
    SafetyScreen --> SafetyContent[Show Protection Status]

    WalterModal --> ModalOverlay[Modal Overlay]
    ModalOverlay --> ChatInterface[Chat Interface]

    ChatInterface --> CloseModal{Close Modal?}
    CloseModal -->|Yes| ReturnToTab[Return to Previous Tab]
    CloseModal -->|No| ChatInterface

    style TabBar fill:#667eea
    style WalterModal fill:#48bb78
```

---

## 10. Deep Link Handling Flow

```mermaid
flowchart TD
    DeepLink[Deep Link Received] --> ParseLink[Parse URL]

    ParseLink --> LinkType{Link Type?}

    LinkType -->|Event| EventLink[parapluie://event/123]
    LinkType -->|Invitation| InvitationLink[parapluie://invitation/ABC123]
    LinkType -->|Settings| SettingsLink[parapluie://settings]
    LinkType -->|Report| ReportLink[parapluie://report/456]

    EventLink --> CheckAuth{User<br/>Authenticated?}
    InvitationLink --> InvitationFlow[Invitation Acceptance Flow]
    SettingsLink --> CheckAuth
    ReportLink --> CheckAuth

    CheckAuth -->|Yes| NavigateToScreen[Navigate to Target Screen]
    CheckAuth -->|No| SaveDeepLink[Save Deep Link]

    SaveDeepLink --> PromptLogin[Prompt Login]
    PromptLogin --> LoginComplete[User Logs In]
    LoginComplete --> NavigateToScreen

    NavigateToScreen --> ShowScreen[Show Target Screen]

    InvitationFlow --> ValidateCode{Code Valid?}

    ValidateCode -->|Yes| AcceptInvitation[Accept Invitation]
    ValidateCode -->|No| ShowError["Invalid or expired<br/>invitation code"]

    AcceptInvitation --> LinkAccounts[Link to Senior Account]
    LinkAccounts --> ConfirmationScreen[Show Success]

    style DeepLink fill:#667eea
    style AcceptInvitation fill:#48bb78
    style ShowError fill:#f56565
```

---

## Navigation State Management

### Route Tracking
```typescript
interface NavigationState {
  currentRoute: string;
  previousRoute: string;
  history: string[];
  params: Record<string, any>;
}

// Example state:
{
  currentRoute: '/safety/events/evt_123',
  previousRoute: '/safety',
  history: ['/home', '/safety', '/safety/events', '/safety/events/evt_123'],
  params: { eventId: 'evt_123' }
}
```

### Deep Link Routes
```typescript
const deepLinkRoutes = {
  'parapluie://home': HomeScreen,
  'parapluie://event/:id': EventDetailScreen,
  'parapluie://invitation/:code': InvitationScreen,
  'parapluie://safety': SafetyScreen,
  'parapluie://settings': SettingsScreen,
  'parapluie://walter': WalterChatModal,
};
```

---

## Version History

- v1.0.0 (2025-01-15): Initial main app navigation flows
