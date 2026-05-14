# Petal 🌹 — Rose, Bud & Thorn

A shareable daily check-in app for you and your friends.

- **Rose** — something good that happened
- **Bud** — something you're looking forward to
- **Thorn** — something that was tough

No accounts. Just enter your name and post.

---

## Setup

### 1. Create a Firebase project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add project** → name it `petal-app` (or whatever)
3. Disable Google Analytics if you want (not needed)

### 2. Enable Firestore

1. In the Firebase console → **Build → Firestore Database**
2. Click **Create database** → Start in **production mode** → pick a region
3. The security rules are already in `firestore.rules` — deploy them in step 4

### 3. Add your Firebase config to app.js

1. In Firebase console → **Project Settings → General → Your apps**
2. Click the web icon (`</>`) → register your app
3. Copy the `firebaseConfig` object values into `app.js` where it says `REPLACE_WITH_YOUR_...`

### 4. Deploy

Install Firebase CLI (one time):
```bash
npm install -g firebase-tools
firebase login
```

Deploy:
```bash
cd rose-bud-thorn-app
firebase init    # select Hosting + Firestore, pick your project
firebase deploy
```

Firebase will give you a URL like `https://your-project.web.app` — share that link with your friends.

### 5. Share

Send your friends the `web.app` URL. They open it, enter their name, and can start posting. Works on mobile — they can add it to their home screen like an app.

---

## Hosting cost

Free on Firebase Spark plan. For a small friend group this will never hit the limits (50K reads/day, 20K writes/day).
