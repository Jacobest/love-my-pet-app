import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInWithCustomToken, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, setLogLevel } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Set Firestore logging to debug mode (helpful for troubleshooting connection)
setLogLevel('debug');

// --- Manual Placeholder Configuration (To be pasted from Firebase Console) ---
// If the automatic linkage (via __firebase_config) fails, this fallback ensures connection.
const MANUAL_FIREBASE_CONFIG = {
  apiKey: "AIzaSyAymo9JNLtrEdOJHbnupfdoItQw70HfEtY",
  authDomain: "love-my-pet-app-dev.firebaseapp.com",
  projectId: "love-my-pet-app-dev",
  storageBucket: "love-my-pet-app-dev.firebasestorage.app",
  messagingSenderId: "764822525646",
  appId: "1:764822525646:web:fa183c232f9d3ba9dea29f",
  measurementId: "G-51HVH7EFKJ"
};

// --- Global Variables Provided by Firebase Studio Environment ---
// We use the project ID as a fallback for the App ID if the global variable isn't injected.
const appId = typeof __app_id !== 'undefined' ? __app_id : MANUAL_FIREBASE_CONFIG.projectId;

// Use injected config if available, otherwise fall back to the manual config object.
let configSource;
if (typeof __firebase_config !== 'undefined' && JSON.parse(__firebase_config).projectId) {
    configSource = JSON.parse(__firebase_config);
} else {
    console.warn("Using manual configuration. Please replace placeholders in firebase.js.");
    configSource = MANUAL_FIREBASE_CONFIG;
}

const firebaseConfig = configSource;
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Get services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const currentAppId = appId; // Exporting the app ID for storage paths

/**
 * Ensures the user is authenticated in the Studio environment.
 * Uses the initial auth token if provided, otherwise signs in anonymously.
 */
export async function initializeAuthAndServices() {
    try {
        if (initialAuthToken) {
            console.log("Authenticating with custom token...");
            await signInWithCustomToken(auth, initialAuthToken);
        } else {
            console.warn("No initial auth token found. Signing in anonymously.");
            await signInAnonymously(auth);
        }
        console.log("✅ Firebase services initialized and authenticated.");
        return true;
    } catch (error) {
        console.error("❌ Auth initialization failed:", error.message);
        return false;
    }
}