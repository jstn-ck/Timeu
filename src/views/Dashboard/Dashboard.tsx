import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useHistory } from "react-router";
import "./dashboard.scss";
import { auth, db } from "@/firebase/firebase";
import Settings from "@/components/Settings/Settings";
import Titlebar from "@/components/Titlebar/Titlebar";
import { LoadingScreen } from "@/components/LoadingScreen/LoadingScreen";

function Dashboard() {
  const [user, loading] = useAuthState(auth);
  const history = useHistory();

  useEffect((): any => {
    if (loading) {
      return <LoadingScreen />
    };

    if (!user) return history.replace('/');

    fetchUserName();
    handleSidebarResize();
  }, [user, loading]);

  async function handleSidebarResize(): Promise<void> {
    const sidebarResizer: Object | any = document.querySelectorAll('.side-pane-resizer')[0];
    const cardListResizer: Object | any = document.querySelectorAll('.card-list-pane-resizer')[0];
    const sidebar: Object | any = document.querySelectorAll('.side-pane')[0];
    const cardList: Object | any = document.querySelectorAll('.card-list-pane')[0];
    
    let mousX = 0;
    const maxWidth = 300;
    const minWidth = 135;

    sidebarResizer.addEventListener("mousedown", (e: any) => {
      e.preventDefault();
      mousX = e.x;

      if (!((parseInt(getComputedStyle(sidebar, '').flexBasis)) - mousX < 5)) {
        sidebar.style.flexBasis = mousX + "px";
      }

      let resizeOverlay = document.createElement('div');
      resizeOverlay.classList.add('resize-overlay');
      sidebar.appendChild(resizeOverlay);

      window.addEventListener("mousemove", resizeSidebar, false);
      window.addEventListener("mouseup", () => {
        resizeOverlay.remove();
        window.removeEventListener("mousemove", resizeSidebar, false);
      }, false);
    });

    cardListResizer.addEventListener("mousedown", (e: any) => {
      e.preventDefault();
      mousX = e.x;

      if (!((parseInt(getComputedStyle(cardList, '').flexBasis)) - mousX < 5)) {
        cardList.style.flexBasis = mousX + "px";
      }

      let resizeOverlay = document.createElement('div');
      resizeOverlay.classList.add('resize-overlay');
      cardList.appendChild(resizeOverlay);

      document.addEventListener("mousemove", resizeCardList, false);
      document.addEventListener("mouseup", () => {
        resizeOverlay.remove();
        document.removeEventListener("mousemove", resizeCardList, false);
      }, false);
    });

    function resizeSidebar(e: any): void {
      sidebar.style.flexBasis = e.x + "px";

      if ((parseInt(getComputedStyle(sidebar, '').flexBasis) >= maxWidth)) {
        sidebar.style.flexBasis = maxWidth + "px";
      }

      if ((parseInt(getComputedStyle(sidebar, '').flexBasis) <= minWidth)) {
        sidebar.style.flexBasis = minWidth + "px";
      }
    }

    function resizeCardList(e: any): void {
      cardList.style.flexBasis = (e.x - cardList.offsetLeft) + "px";

      if ((parseInt(getComputedStyle(cardList, '').flexBasis) >= maxWidth)) {
        cardList.style.flexBasis = maxWidth + "px";
      }

      if ((parseInt(getComputedStyle(cardList, '').flexBasis) <= minWidth)) {
        cardList.style.flexBasis = minWidth + "px";
      }
    }
  }

  async function handleLogout() {
    await auth.signOut();

    // Await with loading screen ?
    history.replace("/");
  };

  const fetchUserName = async () => {
    try {
      const query = await db
        .collection("users")
        .where("uid", "==", user?.uid)
        .get();
      const data = query.docs[0].data();
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="dashboard">
      <div className="side-pane">
        <div className="app-control"></div>
        <div className="container">
          <h1>Test</h1>
        </div>
      </div>
      <div className="side-pane-resizer"></div>
      <div className="card-list-pane">
        <div className="card-list-control">
          <h1>test</h1>
        </div>
      </div>
      <div className="card-list-pane-resizer"></div>
      <div className="main-pane">
        <Titlebar default="default" />
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
