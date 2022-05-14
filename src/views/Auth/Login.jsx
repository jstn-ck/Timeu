import { auth, db } from '@/firebase/firebase';
import firebase from 'firebase';
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import "./login.scss";
import { LoadingScreen } from '@/components/LoadingScreen/LoadingScreen';
import { ErrorModal } from '@/components/ErrorModal/ErrorModal';

// const googleProvider = new firebase.auth.GoogleAuthProvider();

// const signInWithGoogle = async () => {
//   try {
//     const res = await auth.signInWithPopup(googleProvider);
//     const user = res.user;
//     const query = await db
//       .collection("users")
//       .where("uid", "==", user!.uid)
//       .get();
//     if (query.docs.length === 0) {
//       await db.collection("users").add({
//         uid: user!.uid,
//         authProvider: "google",
//         email: user!.email,
//       });
//     }
//   } catch (err: any) {
//     console.error(err);
//   }
// };

const signInWithEmailAndPassword = async (email, password) => {
  try {
    await auth.signInWithEmailAndPassword(email, password);
  } catch (err) {
    if(err) {
      ErrorModal('Invalid email or password');
    }
  }
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading] = useAuthState(auth);
  const [initializing, setInitializing] = useState(true);
  const history = useHistory();

  // Todo: Login with enter
  // Implement loading screen after click on login and others ?

  useEffect(() => {
    if (loading) {
      return <LoadingScreen />
    }

    if (user) {
      history.replace("/dashboard")
      setInitializing(false);
    } else if(!loading){
      setInitializing(false);
    };
  }, [user, loading]);

  // Firebase connection loading screen
  if (initializing) {
    return (
      <LoadingScreen />
    )
  }

  return (
    <div className="auth">
      <div className="container">
        <input
          type="text"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
        />
        <input
          type="password"
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button
          className="btn login"
          onClick={() => signInWithEmailAndPassword(email, password)}
        >
          Login
        </button>

        {/* <button className="btn login google" onClick={signInWithGoogle}>
          Login with Google
        </button> */}

        <div className='forgot-password'>
          <Link to="/reset">Forgot Password</Link>
        </div>
        <div className='register-container'>
          Don't have an account? <Link to="/register">Register</Link> now.
        </div>
      </div>
    </div>
  );
}

export {
  auth,
  db,
  //signInWithGoogle,
  signInWithEmailAndPassword,
};
