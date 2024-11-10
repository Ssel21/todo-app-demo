import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const app  = initializeApp( {
    apiKey: "AIzaSyAmkqyblxopnKrsm0Hfi52r-K0YZW3qRWU",
    authDomain: "todo-app-demo-d2c90.firebaseapp.com",
    projectId: "todo-app-demo-d2c90",
    storageBucket: "todo-app-demo-d2c90.firebasestorage.app",
    messagingSenderId: "765493034350",
    appId: "1:765493034350:web:51847a016fbedc4ca2157f"
  
});
// Initialize Firebase

export const auth = getAuth(app);
export default app;
