import { initializeApp } from "firebase/app";
import { collection, deleteDoc, doc, getDocs, getFirestore, onSnapshot, query, QuerySnapshot, updateDoc } from "firebase/firestore";
import { browserCookiePersistence, browserSessionPersistence, getAuth, initializeAuth } from "firebase/auth";

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

export const getUsersByRole = (users: {}[], role: string) => {
    return users.filter((user: any) => user?.role?.toLowerCase() == role);
}

export const getUsersByVerification = (users: {}[], isVerified: boolean) => {
    return users.filter((user: any) => user?.verified == isVerified);
}

export const getUserById = (users: {}[], id: string) => {
    return users.filter((user: any) => user?.id == id)[0];
}

export const getAllVerificationRequests = (setVerificationRequests: (arg0: {}[]) => void) => {
    const q = query(collection(db, "verificationRequests"));
    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
        const fetchedRequests: {}[] = [];
        QuerySnapshot.forEach((doc) => {
            fetchedRequests.push({ ...doc.data(), id: doc.id });
        });
        setVerificationRequests(fetchedRequests);
    });
    return unsubscribe;
}

export const getVerificationRequestById = (requests: {}[], id: string) => {
    return requests.filter((request: any) => request?.id == id)[0];
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

export const handleVerificationRequest = async (id: string) => {
    const request = doc(db, "verificationRequests", id);
    await updateDoc(request, {
        status: "approved"
    })
}

export const verifyUserById = async (id: string) => {
    const user = doc(db, "users", id);
    await updateDoc(user, {
        verified: true
    })
}

export const verifySupplierUserById = async (id: string) => {
    const user = doc(db, "users", id);
    await updateDoc(user, {
        verifiedFeedSupplier: true
    })
}

export const unverifyUserById = async (id: string) => {
    const user = doc(db, "users", id);
    await updateDoc(user, {
        verified: false
    })
}

export const unverifyVetUserById = async (id: string) => {
    const user = doc(db, "users", id);
    await updateDoc(user, {
        verifiedVet: false
    })
}

export const unverifySupplierUserById = async (id: string) => {
    const user = doc(db, "users", id);
    await updateDoc(user, {
        verifiedFeedSupplier: false
    })
}

export const disableUserById = async (id: string) => {
    const user = doc(db, "users", id);
    await updateDoc(user, {
        disabled: true
    })
}

export const enableUserById = async (id: string) => {
    const user = doc(db, "users", id);
    await updateDoc(user, {
        disabled: false
    })
}

export const getReportById = (reports: {}[], id: string) => {
    return reports.filter((report: any) => report?.id == id)[0];
}

export const getReportsByHandling = (reports: {}[], isHandled: boolean) => {
    return reports.filter((report: any) => (report?.handled ? true : false) == isHandled);
}

export const handleReport = async (id: string) => {
    const report = doc(db, "reports", id);
    await updateDoc(report, {
        handled: true
    })
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

export const getPostById = (posts: {}[], id: string) => {
    return posts.filter((post: any) => post?.id == id)[0];
}

export const deletePostById = async (id: string) => {
    const post = doc(db, "posts", id);
    await deleteDoc(post);
}

export const getAllVetPins = (setPins: (arg0: {}[]) => void) => {
    const q = query(collection(db, "vetPins"));
    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
        const fetchedPins: {}[] = [];
        QuerySnapshot.forEach((doc) => {
            fetchedPins.push({ ...doc.data(), id: doc.id });
        });
        setPins(fetchedPins);
    });
    return unsubscribe;
}

export const getPinsById = (pins: {}[], id: string) => {
    return pins.filter((pin: any) => pin?.vetId == id);
}

export const deletePinById = async (id: string) => {
    const pin = doc(db, "vetPins", id);
    await deleteDoc(pin);
}

export const getAllVetRecommendations = (setRecommendations: (arg0: {}[]) => void) => {
    const q = query(collection(db, "vetRecommendations"));
    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
        const fetchedRecommendations: {}[] = [];
        QuerySnapshot.forEach((doc) => {
            fetchedRecommendations.push({ ...doc.data(), id: doc.id });
        });
        setRecommendations(fetchedRecommendations);
    });
    return unsubscribe;
}

export const getVetRecommendationById = (recommendations: {}[], id: string) => {
    return recommendations.filter((rec: any) => rec?.id == id)[0];
}

export const approveVetRecommendation = async (id: string) => {
    const recommendation = doc(db, "vetRecommendations", id);
    await updateDoc(recommendation, {
        approved: true,
        status: "approved",
        approvedBy: auth.currentUser?.uid ?? null
    })
}

export const deleteVetRecommendation = async (id: string) => {
    const recommendation = doc(db, "vetRecommendations", id);
    await deleteDoc(recommendation);
}

export const getAllVetImageSubmissions = (setSubmissions: (arg0: {}[]) => void) => {
    const q = query(collection(db, "vetImageSubmissions"));
    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
        const fetchedSubmissions: {}[] = [];
        QuerySnapshot.forEach((doc) => {
            fetchedSubmissions.push({ ...doc.data(), id: doc.id });
        });
        setSubmissions(fetchedSubmissions);
    });
    return unsubscribe;
}

export const getVetImageSubmissionById = (submissions: {}[], id: string) => {
    return submissions.filter((sub: any) => sub?.id == id)[0];
}

export const deleteVetImageSubmissionById = async (id: string) => {
    const submission = doc(db, "vetImageSubmissions", id);
    await deleteDoc(submission);
}