import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useHistory } from "react-router";
import "./dashboard.scss";
import { auth, db } from "@/firebase/firebase";
import { logout } from "@/views/Login/Login";
import Settings from "@/components/Settings/Settings";
import NetStatus from "@/components/Connectivity/Connectivity";

function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const history = useHistory();

  const fetchUserName = async () => {
    try {
      const query = await db
        .collection("users")
        .where("uid", "==", user?.uid)
        .get();
      const data = await query.docs[0].data();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return history.replace("/");
    fetchUserName();
  }, [user, loading]);

  return (
    <div className="dashboard">
      <NetStatus />
      <div className="container">
        Logged in as
        <div>Test</div>
        <div>{user?.email}</div>
        <button className="dashboard__btn" onClick={logout}>
          Logout
        </button>
        <Settings />
      </div>
    </div>
  );
}

export default Dashboard;
