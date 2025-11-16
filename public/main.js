import { auth, db, initializeAuthAndServices, currentAppId } from './firebase.js';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { 
    collection, 
    addDoc,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";


// --- UI Elements ---
const statusMessage = document.getElementById('status-message');
const authArea = document.getElementById('auth-area');
const authForm = document.getElementById('auth-form');
const authSubmitBtn = document.getElementById('auth-submit-btn');
const toggleModeBtn = document.getElementById('toggle-mode-btn');
const appContent = document.getElementById('app-content');
const userUidSpan = document.getElementById('user-uid');
const logoutBtn = document.getElementById('logout-btn');

let isRegisterMode = true;

// --- FIRESTORE HELPERS ---

// Base path for public collections (e.g., posts, public data)
function getPublicCollectionRef(collectionName) {
    // Path: /artifacts/{appId}/public/data/{collectionName}
    return collection(db, 'artifacts', currentAppId, 'public', 'data', collectionName);
}

// Base path for private user data (e.g., drafts, settings)
function getPrivateCollectionRef(collectionName, userId) {
    // Path: /artifacts/{appId}/users/{userId}/{collectionName}
    return collection(db, 'artifacts', currentAppId, 'users', userId, collectionName);
}

/**
 * Creates a new user profile document in Firestore upon successful registration.
 * This adheres to our structured data model.
 */
async function createUserProfile(user) {
    try {
        const userRef = getPublicCollectionRef('users');
        
        // Check if user profile already exists (e.g., for users created anonymously)
        const q = query(userRef, where("uid", "==", user.uid));
        const existingDocs = await getDocs(q);

        if (existingDocs.empty) {
            await addDoc(userRef, {
                uid: user.uid,
                email: user.email,
                username: user.email.split('@')[0], // Placeholder username
                profilePhotoURL: "",
                petNames: [],
                dateJoined: new Date().toISOString(),
            });
            console.log("✅ User profile added to Firestore 'users' collection.");
        } else {
            console.log("User profile already exists. Skipping creation.");
        }
    } catch (error) {
        console.error("❌ Failed to create user profile in Firestore:", error.message);
    }
}

// --- AUTHENTICATION HANDLERS ---

async function handleAuthentication(email, password) {
    try {
        let userCredential;
        statusMessage.textContent = isRegisterMode ? "Registering user..." : "Logging in...";

        if (isRegisterMode) {
            userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await createUserProfile(userCredential.user);
        } else {
            userCredential = await signInWithEmailAndPassword(auth, email, password);
        }

        statusMessage.textContent = `Success! Logged in as ${userCredential.user.email}`;
    } catch (error) {
        statusMessage.textContent = `Auth Error: ${error.message}`;
        console.error("Authentication failed:", error.message);
    }
}

authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    handleAuthentication(email, password);
});

toggleModeBtn.addEventListener('click', () => {
    isRegisterMode = !isRegisterMode;
    toggleModeBtn.textContent = isRegisterMode ? "Switch to Login" : "Switch to Register";
    authSubmitBtn.textContent = isRegisterMode ? "Register" : "Login";
});

logoutBtn.addEventListener('click', async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Logout failed:", error.message);
    }
});

// --- AUTH STATE LISTENER (Renders UI based on login status) ---

onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        authArea.classList.add('hidden');
        appContent.classList.remove('hidden');
        statusMessage.classList.add('hidden');
        userUidSpan.textContent = user.uid;
        console.log(`User logged in. UID: ${user.uid}`);
        
        // --- REAL DATA TEST: Write to a private collection ---
        // This confirms the AUTHED user can write to their private path
        const privateTestRef = getPrivateCollectionRef('test_user_data', user.uid);
        addDoc(privateTestRef, {
            test: 'Private connection confirmed',
            timestamp: new Date().toISOString()
        }).then(() => {
            console.log("✅ Private Firestore write successful!");
        }).catch(e => {
            console.error("❌ Private Firestore write failed. Check Security Rules:", e.message);
        });

    } else {
        // User is signed out
        authArea.classList.remove('hidden');
        appContent.classList.add('hidden');
        statusMessage.classList.remove('hidden');
        statusMessage.textContent = "Ready. Please Register or Log in.";
    }
});

// --- INITIALIZATION ---
// Start the process by initializing Auth with the environment token
initializeAuthAndServices();