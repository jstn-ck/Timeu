import { auth, db } from '@/firebase/firebase';
import firebase from 'firebase';
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import "./login.scss";

const googleProvider = new firebase.auth.GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const res = await auth.signInWithPopup(googleProvider);
    const user = res.user;
    const query = await db
      .collection("users")
      .where("uid", "==", user!.uid)
      .get();
    if (query.docs.length === 0) {
      await db.collection("users").add({
        uid: user!.uid,
        authProvider: "google",
        email: user!.email,
      });
    }
  } catch (err: any) {
    console.error(err);
  }
};

const signInWithEmailAndPassword = async (email: string, password: string) => {
  try {
    await auth.signInWithEmailAndPassword(email, password);
  } catch (err: any) {
    console.error(err);
  }
};

const registerWithEmailAndPassword = async (email: string, password: string) => {
  try {
    const res = await auth.createUserWithEmailAndPassword(email, password);
    const user = res.user;
    await db.collection("users").add({
      uid: user!.uid,
      authProvider: "local",
      email,
    });
  } catch (err: any) {
    console.error(err);
  }
};

const sendPasswordResetEmail = async (email: string) => {
  try {
    await auth.sendPasswordResetEmail(email);
    alert("Password reset link sent!");
  } catch (err: any) {
    console.error(err);
  }
};
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading] = useAuthState(auth);
  const [initializing, setInitializing] = useState(true);
  const history = useHistory();

  useEffect(() => {
    if (loading) {
      return;
    }
    if (user) history.replace("/dashboard");
  }, [user, loading]);

  // Firebase connection loading screen
  if (initializing) return (
    <div className={'loading-dashboard'}>
      <div className="loading-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );

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
        <button className="btn login google" onClick={signInWithGoogle}>
          Login with Google
        </button>
        <div>
          <Link to="/reset">Forgot Password</Link>
        </div>
        <div>
          Don't have an account? <Link to="/register">Register</Link> now.
        </div>
      </div>
    </div>
  );
}

export {
  auth,
  db,
  signInWithGoogle,
  signInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordResetEmail,
};
