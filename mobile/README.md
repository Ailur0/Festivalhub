# FestivalHub mobile

The FestivalHub app for Android (and later iOS), built with [Expo](https://expo.dev) SDK 57, React Native and Expo Router. It rebuilds the web prototype in the parent folder with native components.

Sign-in and all data come from Supabase (Postgres). The schema lives in [`../supabase`](../supabase).

## Features

- **Home** – totals across your groups, your groups, recent activity, create or join a group
- **Group** – festival details, members with roles, invite sharing, admin role changes and removals
- **Finances** – budget and per-member share, expenses by category, contributions, record payments, reminders, share a summary
- **Vendors** – search, category and filter chips, sorting, saved vendors, vendor details with call/email/text
- **Group settings** (admins) – details, privacy, role permissions, invite codes, delete group
- **Account** – profile, notification preferences, sign out

Totals are calculated from the members and expenses the server returns (`src/lib/finance.ts`), so the numbers match on every screen. What you can do in a group comes from the database (`myPermissions` in `get_group_detail`), and the same rules are enforced there, so a modified app can't bypass them.

## How it's put together

| Area | Where |
|---|---|
| Supabase client | `src/lib/supabase.ts` (rewrites a local URL to `10.0.2.2` for the Android emulator) |
| Sign-in | `src/state/session.tsx` – password and emailed 6-digit code |
| Database calls | `src/lib/api.ts` |
| Caching and refresh | `src/state/queries.ts` (React Query); pull to refresh on tab screens |
| Error messages | `src/lib/errors.ts` turns Postgres/Auth errors into plain sentences |

## Connect a backend

1. Start a database — either locally (`npx supabase start` in the repo root) or a free project at [supabase.com](https://supabase.com).
2. Copy `.env.example` to `.env.local` and fill in the URL and publishable key.
3. Restart the dev server so Expo picks up the new environment values.

Without those values the app still runs and says no backend is connected.

There are no demo accounts — create one with **Create account** in the app.

Hosted projects require email confirmation by default. Turn it off under Authentication → Sign In / Providers → Email while testing, or confirm each new account from its email.

## Run it

```bash
npm install
npm start          # then press "a" for Android, or scan the QR code with a development build
npm run web        # quick preview in the browser
```

Native tabs, the date picker and secure storage only behave natively on a device or emulator; the web preview uses simpler fallbacks.

## Build an Android APK

Requires Android Studio (its bundled JDK) and the Android SDK.

```bash
npx expo prebuild --platform android
cd android
gradlew.bat assembleRelease
```

The APK is written to `android/app/build/outputs/apk/release/app-release.apk`. It is signed with the **debug key**, which is fine for testing but not for the Play Store. For store builds, create an upload keystore or use [EAS Build](https://docs.expo.dev/build/introduction/).

`android/` is generated from `app.json` and is not committed; re-run `prebuild` after changing native config.

## Project structure

```
src/
  app/            Screens (Expo Router file-based routes)
    (tabs)/       Home, Group, Finances, Vendors
    group/        Create, join, settings
  components/     Shared UI (buttons, fields, cards, tab bar…)
  constants/      Colours, spacing, type scale
  data/           Types and sample data
  lib/            Finance maths, permissions, formatting, storage, demo auth
  state/          Session and app state (persisted on device)
```

## Before release

- Point the app at a hosted Supabase project and rebuild (a release APK can't use a local `http://` server)
- Replace the Expo template icon and splash image with FestivalHub artwork
- Confirm the Android package name `com.festivalhub.app` (it can't change after publishing)
- Set up release signing
