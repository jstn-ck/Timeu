import React, { createContext, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useHistory } from "react-router";
import "./dashboard.scss";
import { auth, db } from "@/firebase/firebase";
import Titlebar from "@/components/Titlebar/Titlebar";
import { LoadingScreen } from "@/components/LoadingScreen/LoadingScreen";
import Projects from "@/components/Projects/Projects";
import { Cards } from "@/components/Card/Card";

// Context Providers so projects and cards components can use these values as states
export const SelectedProjectContext = createContext({});
export const SumCardsCurrentTimesContext = createContext({});

function Dashboard() {
  const [user, loading] = useAuthState(auth);
  const history = useHistory();

  const [selectedProject, setSelectedProject] = useState("");
  const [sumCardsCurrent, setSumCardsCurrent] = useState(0);

  useEffect(() => {
    if (loading) {
      return <LoadingScreen />
    };

    if (!user) return history.replace('/');

    fetchUserName();
    handleSidebarResize();
  }, [user, loading]);

  async function handleSidebarResize() {
    const sidebarResizer = document.querySelectorAll('.project-list-pane-resizer')[0];
    const sidebar = document.querySelectorAll('.project-list-pane')[0];

    let mouseX = 0;
    const maxWidth = 400;
    const minWidth = 135;

    sidebarResizer.addEventListener("mousedown", (e) => {
      e.preventDefault();
      mouseX = e.x;

      if (!((parseInt(getComputedStyle(sidebar, '').flexBasis)) - mouseX < 5)) {
        sidebar.style.flexBasis = mouseX + "px";
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

    function resizeSidebar(e) {
      sidebar.style.flexBasis = e.x + "px";

      if ((parseInt(getComputedStyle(sidebar, '').flexBasis) >= maxWidth)) {
        sidebar.style.flexBasis = maxWidth + "px";
      }

      if ((parseInt(getComputedStyle(sidebar, '').flexBasis) <= minWidth)) {
        sidebar.style.flexBasis = minWidth + "px";
      }
    }
  }

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
      <SelectedProjectContext.Provider value={{selectedProject, setSelectedProject}}>
        <SumCardsCurrentTimesContext.Provider value={{sumCardsCurrent, setSumCardsCurrent}}>
          <div className="project-list-pane">
            <div className="app-control"></div>
            <div className="container">
              <Projects />
            </div>
          </div>
          <div className="project-list-pane-resizer"></div>
          <div className="main-pane">
            <Titlebar default="default" />
            <div className="container">
                <Cards />
            </div>
          </div>
        </SumCardsCurrentTimesContext.Provider>
      </SelectedProjectContext.Provider>
    </div>
  );
}

export default Dashboard;
