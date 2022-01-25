import React, {useEffect} from "react";
import {useAuthState} from "react-firebase-hooks/auth";
import {useHistory} from "react-router";
import "./dashboard.scss";
import {auth, db} from "@/firebase/firebase";
import Settings from "@/components/Settings/Settings";
import Titlebar from "@/components/Titlebar/Titlebar";

function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const history = useHistory();

  useEffect(() => {
    if (loading) return;
    if (!user) return history.replace("/");
    fetchUserName();
    handleSidebarResize();
  }, [user, loading]);

  async function handleSidebarResize(): Promise<void> {
    const sidebarResizer = document.querySelectorAll('#side-pane-resizer')[0];
    const sidebar: Element | any = document.querySelectorAll('.side-pane')[0];

    sidebarResizer.addEventListener("mousedown", (event) => {
      document.addEventListener("mousemove", resize, false);
      document.addEventListener("mouseup", () => {
        document.removeEventListener("mousemove", resize, false);
      }, false);
    });

    function resize(e: any): void {
      sidebar.style.flexBasis = `${e.x}px`;
    }

    sidebar.style.flexBasis = '200px';
  }

  async function handleLogout() {
    await auth.signOut();

    history.replace("/");
  };

  const fetchUserName = async () => {
    try {
      const query = await db
        .collection("users")
        .where("uid", "==", user?.uid)
        .get();
      const data = query.docs[0].data();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="dashboard">
      <div className="side-pane">
        <div className="container">
          <h1>Test</h1>
        </div>
      </div>
      <div id="side-pane-resizer"></div>
      <div className="main-pane">
        <Titlebar default="default"/>
        <div className="container">
          Logged in as
          <div>Test</div>
          <div>{user?.email}</div>
          <button className="dashboard__btn" onClick={handleLogout}>
            Logout
          </button>
          <Settings />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
