# Petal 🌹 — Rose, Bud & Thorn

A native mobile app (iOS + Android) for sharing daily check-ins with your friends.

- **Rose** — something good that happened
- **Bud** — something you're looking forward to
- **Thorn** — something that was tough

No accounts. Just enter your name and start posting. Real-time feed so everyone sees each other's updates instantly.

Built with **Expo (React Native)** + **Firebase Firestore**.

---

## Setup

### 1. Firebase

1. Go to [console.firebase.google.com](https://console.firebase.google.com) → **Add project**
2. Enable **Firestore Database** (production mode, pick a region)
3. Go to **Project Settings → Your apps → web icon (`</>`)** → register an app → copy the config
4. Paste your config values into `src/lib/firebase.js`
5. Deploy Firestore rules: `firebase deploy --only firestore:rules`

### 2. Install & run

```bash
npm install
npx expo start
```

Scan the QR code in the **Expo Go** app on your phone. Done.

### 3. Share with friends (free, no app store)

1. Push your code to GitHub
2. Tell your friends to install **Expo Go** (free on App Store / Google Play)
3. Share your QR code or run `npx expo start --tunnel` and share the tunnel URL

Friends open the QR link in Expo Go and the app loads instantly.

---

## Build a real APK (Android sideload)

If you want an APK file friends can install directly without Expo Go:

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build -p android --profile preview
```

EAS gives you a download link for the APK. Share it, friends tap to install.
(Free tier: 30 builds/month)

---

## Firestore rules

The `firestore.rules` file restricts posts so:
- Anyone with the link can read and create
- No one can edit or delete after posting

Deploy with: `firebase deploy --only firestore:rules`
