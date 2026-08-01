import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore, onSnapshot, query, QuerySnapshot } from "firebase/firestore";
import { browserCookiePersistence, browserSessionPersistence, getAuth, initializeAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDT4VpLuZQCmUHteVb8qz_okIumGjLRYZM",
    authDomain: "bunnycare-93a65.firebaseapp.com",
    databaseURL: "https://bunnycare-93a65-default-rtdb.firebaseio.com",
    projectId: "bunnycare-93a65",
    storageBucket: "bunnycare-93a65.firebasestorage.app",
    messagingSenderId: "396693874608",
    appId: "1:396693874608:web:dc4991ea438dc4ebcf5875",
    measurementId: "G-MHL3RG6YGS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
auth.setPersistence(browserSessionPersistence);

export const getAllUsers = (setUsers: (arg0: {}[]) => void) => {
    const q = query(collection(db, "users"));
    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
        const fetchedUsers: {}[] = [];
        QuerySnapshot.forEach((doc) => {
            fetchedUsers.push({ ...doc.data(), id: doc.id });
        });
        setUsers(fetchedUsers);
    });
    return unsubscribe;
}

export const getAllReports = (setReports: (arg0: {}[]) => void) => {
    const q = query(collection(db, "reports"));
    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
        const fetchedReports: {}[] = [];
        QuerySnapshot.forEach((doc) => {
            fetchedReports.push({ ...doc.data(), id: doc.id });
        });
        setReports(fetchedReports);
    });
    return unsubscribe;
}

export const getAllPosts = (setPosts: (arg0: {}[]) => void) => {
    const q = query(collection(db, "posts"));
    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
        const fetchedPosts: {}[] = [];
        QuerySnapshot.forEach((doc) => {
            fetchedPosts.push({ ...doc.data(), id: doc.id });
        });
        setPosts(fetchedPosts);
    });
    return unsubscribe;
}
