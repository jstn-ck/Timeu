import './projects.scss';
import {auth, db} from '@/firebase/firebase';
import {useAuthState} from "react-firebase-hooks/auth";
import React, {useContext, useEffect, useState} from 'react';
import {generateUid} from '@/helpers/uid';
// Moment JS for getting createdAt date/time
import moment from "moment-with-locales-es6";
import {SelectedProjectContext, SumCardsCurrentTimesContext} from '@/views/Dashboard/Dashboard';
import {disablePointer} from '@/helpers/disablePointer';
import {Project} from "@/components/Projects/Project";

moment.locale('de');

export default function Projects(props) {
  const [user, loading] = useAuthState(auth);
  const [projectList, addToProjectList] = useState([]);
  const [modal, openModal] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectLimit, setProjectLimit] = useState(0);
  const {setSelectedProject} = useContext(SelectedProjectContext);
  const [selectedProjectId, selectProjectId] = useState("");
  const {sumCardsCurrent} = useContext(SumCardsCurrentTimesContext);
  const [reRenderProjects, doReRenderProjects] = useState(false);

  useEffect(() => {
    if (projectList.length >= 1) {
      setSelectedProject(projectList[projectList.length - 1].id);
      const pContainer = document.querySelectorAll('.project-container');

      if (pContainer[pContainer.length - 1]) {
        pContainer[pContainer.length - 1].classList.add('selected');
        if (pContainer[pContainer.length - 2]) {
          pContainer[pContainer.length - 2].classList.remove('selected');
        }
      }
    }
  }, [projectList])

  async function getProjectListFromDb() {
    const docRef = db.collection("users").doc(user?.uid);

    docRef.get().then((doc) => {
      if (doc.exists) {
        if (doc.data().projectList && doc.data().projectList.length > 0) {
          addToProjectList(doc.data().projectList);
        }
      } else {
        // doc.data() will be undefined
        console.log("No Projects in document DB!");
      }
    }).catch((error) => {
      console.log("Error getting document:", error);
    });
  }

  async function addProjectListToDb() {
    try {
      const userRef = db.collection("users").doc(user?.uid);
      userRef.get().then((doc) => {
        if (doc.exists) {
          if (!doc.data().projectList) {
            userRef.update({projectList});
          } else if (doc.data().projectList) {
            userRef.update({projectList});
          }
        } else {
          // doc.data() will be undefined
          console.log("No Projects in document DB!");
        }
      })
    } catch (err) {
      console.error(err);
      alert('Couldnt connect to Database!');
    }
  }

  // Each useEffect depends on given callback(re renders if callback value changes)
  useEffect(() => {
    addProjectListToDb();
  }, [projectList])

  useEffect(() => {
    getProjectListFromDb();
  }, [user])

  useEffect(() => {
    updateProjectCurrent();
  }, [sumCardsCurrent])

  function reRenderProjectCurrent() {
    doReRenderProjects(!reRenderProjects);
    addToProjectList(projectList);
  }

  //Useful: findIndex((i) => i.id === id);

  function updateProjectCurrent() {
    if (projectList.length > 0) {
      if (sumCardsCurrent.cardProjectId !== "" && sumCardsCurrent.sumCurrents !== 0) {
        projectList.map((project) => {
          if (project.id === sumCardsCurrent.cardProjectId) {
            if (sumCardsCurrent.sumCurrents > 0) {
              project.current = sumCardsCurrent.sumCurrents;
              reRenderProjectCurrent();
              addProjectListToDb();
            }
          }
        })
      } else if (sumCardsCurrent.sumCurrents === 0) {
        projectList.map((project) => {
          if (project.id === selectedProjectId) {
            project.current = 0;
            reRenderProjectCurrent();
            addProjectListToDb();
          }
        })
      }
    }
  }

  function openCreateNewProjectModal() {
    try {
      openModal(true);
      disablePointer(true);
    } catch (e) {
      console.error(e);
    }
  }

  function closeModal() {
    if (openModal) {
      openModal(false);
      disablePointer(false);
    }
  }

  function createProject() {
    // Define a project object
    const projectItem = [{
      name: projectName,
      limit: projectLimit,
      current: 0,
      id: generateUid(),
      createdAt: moment().format('MM.Do.YY, h:mm')
    }]

    // Add project object to projectList state if name is not empty
    if (projectName !== "") {
      const newProject = projectList.concat(projectItem);

      addToProjectList(newProject);
      closeModal();
    } else {
      alert("Project name cant be empty");
    }
  }

  function deleteProject(id) {
    try {
      const updatedProjectList = projectList.filter((item) => item.id !== id);
      addToProjectList(updatedProjectList);
    } catch (e) {
      console.error(e);
    }
  }

  function editProject(editedProject, id) {
    const newList = projectList.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          name: editedProject.newName,
          limit: editedProject.newLimit,
        };
      }

      return item;
    });

    addToProjectList(newList);
  }

  function selectProject(i) {
    setSelectedProject(projectList[i].id);
    selectProjectId(projectList[i].id);
    const pContainer = document.querySelectorAll('.project-container');
    pContainer.forEach((item) => {
      item.classList.remove('selected');
    })
    pContainer[i].classList.add("selected")
  }

  return (
    <>
      <div className="project-title-container">
        <span className='list-title'>Projects</span>
        <button onClick={openCreateNewProjectModal} className='add-project'><span></span></button>
      </div>
      <div className={`modal new-project-modal ${modal ? 'open' : ''}`}>
        <div className="modal-content">
          <div className="input-container">
            <h2>Create new Project</h2>
            <input
              type="text"
              className="input"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter Project name"
            />
            <h4>Enter a Project time limit in hours (default is no limit)</h4>
            <input
              type="number"
              className="input"
              value={projectLimit}
              onChange={(e) => setProjectLimit(parseInt(e.target.value))}
              placeholder="Project limit in h"
            />
          </div>
          <div className="btn-container">
            <button onClick={closeModal} className='btn-cancel'>Cancel</button>
            <button onClick={createProject} className='btn-create'>Create</button>
          </div>
        </div>
      </div>
      <ul className='projects'>
        {
          projectList &&
          projectList.map((project, index) => {
            return (
              <div onClick={() => selectProject(index)} key={project.id} className="project-container">
                <Project
                  key={project.id}
                  id={project.id}
                  name={project.name}
                  limit={project.limit}
                  createdAt={project.createdAt}
                  getProjectCurrent={project.current}
                  handleDelete={deleteProject}
                  handleEdit={editProject}
                />
              </div>
            )
          })
        }
      </ul>
    </>
  )
}
