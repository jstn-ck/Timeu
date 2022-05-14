import { auth, db } from '@/firebase/firebase';
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
// import { signInWithGoogle } from './Login';
import "./login.scss";
import { ErrorModal } from '@/components/ErrorModal/ErrorModal';

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
    if(err) {
      ErrorModal('User exists already');
    }
  }
};

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading] = useAuthState(auth);
  const history = useHistory();
  const register = () => {
    registerWithEmailAndPassword(email, password);
  };

  useEffect(() => {
    if (loading) return;
    if (user) history.replace("/dashboard");
  }, [user, loading]);

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
        <button className="btn register" onClick={register}>
          Register
        </button>
        {/* <button
          className="btn login google"
          onClick={signInWithGoogle}
        >
          Register with Google
        </button> */}
        <div className='login-container'>
          Already have an account? <Link to="/">Login</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
