<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of the Expo React Native app by installing the PostHog mobile SDK, creating Expo config-backed environment wiring, initializing a shared PostHog client, wrapping the root layout with `PostHogProvider`, adding manual Expo Router screen tracking, identifying authenticated users from the Supabase session lifecycle, and instrumenting high-value authentication and subscription management events across the app.

| Event name | Description | File |
| --- | --- | --- |
| subscription_added | Captured when a user saves a new subscription from the add subscription modal. | components/AddSubscription.tsx |
| subscription_viewed | Captured when a user expands a subscription card to inspect its details. | components/SubscriptionCard.tsx |
| subscription_details_viewed | Captured when a user opens an individual subscription details screen. | app/subscriptions/[id].tsx |
| auth_sign_in_succeeded | Captured when a user signs in successfully with email and password. | app/(auth)/sign-in.tsx |
| auth_sign_in_failed | Captured when a sign-in attempt fails due to validation, auth, or unexpected errors. | app/(auth)/sign-in.tsx |
| auth_sign_up_succeeded | Captured when a user account is created successfully from the signup flow. | app/(auth)/sign-up.tsx |
| auth_sign_up_failed | Captured when a signup attempt fails validation, auth, or runtime checks. | app/(auth)/sign-up.tsx |
| user_signed_out | Captured when a signed-in user logs out from settings. | app/(tabs)/settings.tsx |
| insights_summary_viewed | Captured when the user views the insights tab summary. | app/(tabs)/insights.tsx |
| subscriptions_overview_viewed | Captured when the user views the subscriptions tab overview. | app/(tabs)/subscriptions.tsx |
| home_dashboard_viewed | Captured when the user views the main home dashboard tab. | app/(tabs)/index.tsx |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: https://eu.posthog.com/project/218182/dashboard/800352
- Insight: Sign-up to sign-in success — https://eu.posthog.com/project/218182/insights/v3wsGdNR
- Insight: Authentication failures — https://eu.posthog.com/project/218182/insights/fNRxBlMC
- Insight: Subscription engagement funnel — https://eu.posthog.com/project/218182/insights/3Vh7OBzG
- Insight: Subscription exploration — https://eu.posthog.com/project/218182/insights/eSEqjNQg
- Insight: Insights tab usage — https://eu.posthog.com/project/218182/insights/Tzzgjxdh

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
