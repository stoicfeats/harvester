# Firebase Setup Guide for Harvester

Follow these steps to configure the backend for your application.

## 1. Create Project
1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Click **"Add project"** and name it `harvester-data` (or similar).
3. Disable Google Analytics (not needed for this).
4. Click **"Create project"**.

## 2. Register Web App
1. In the Project Overview, click the **Web icon (`</>`)** to add an app.
2. App nickname: `Harvester Web`.
3. Uncheck "Also set up Firebase Hosting" (we handle this later).
4. Click **"Register app"**.
5. You will see a code block with `firebaseConfig`. **Keep this open** or copy the values. You need them for step 5.

## 3. Enable Authentication
1. Go to **Build** > **Authentication** in the sidebar.
2. Click **"Get started"**.
3. Select **Google** from the Sign-in providers.
4. Click **Enable**.
5. Set the "Project support email" to your email.
6. Click **Save**.

## 4. Enable Firestore Database
1. Go to **Build** > **Firestore Database**.
2. Click **"Create database"**.
3. Location: Choose one close to you (e.g., `us-central1` or `eur3`).
4. Rules: Select **"Start in test mode"** (allows development without strict rules initially).
   - *Note: We will secure this later.*
5. Click **Create**.

### Set Security Rules (Recommended)
Once the database is created, go to the **Rules** tab and replace the code with this to secure user data:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      // Only allow users to read/write their own data
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 5. Configure Local Environment
1. Open the file named `.env` in your project root (I have created this for you).
2. Fill in the values from Step 2.

It should look like this:
```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=harvester-data.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=harvester-data
VITE_FIREBASE_STORAGE_BUCKET=harvester-data.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

## 6. Finish
1. Restart your terminal server (`ctrl+c` then `npm run dev`) to load the new `.env` file.
2. The app should now switch from "Offline Mode" to "Restricted Access".
3. Click "Connect" to log in with Google.
