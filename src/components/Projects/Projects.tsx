import './projects.scss';
import React, { EffectCallback, useContext, useEffect, useState } from 'react';
import { generateUid } from '@/helpers/uid';
// Moment JS for getting created at date/time
import moment from "moment";
//moment().format('MMMM Do YYYY, h:mm:ss a');
import { SelectedProjectContext } from '@/views/Dashboard/Dashboard';

export default function Projects(props: any) {
  const [projectList, addToProjectList]: any = useState([]);
  const [modal, openModal] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectLimit, setProjectLimit] = useState(0);
  const { setSelectedProject } = useContext(SelectedProjectContext);

  useEffect(() => {
    if(projectList.length >= 1) {
      setSelectedProject(projectList[projectList.length - 1].id);
      const pContainer: any = document.querySelectorAll('.project-container');
      if(pContainer[pContainer.length - 1]) {
          pContainer[pContainer.length - 1].classList.add('selected');
          if(pContainer[pContainer.length - 2]) {
              pContainer[pContainer.length - 2].classList.remove('selected');
            }
        }
      }
  }, [projectList])

  // TODO: Another useEffect to get firebase data (use firebase data if data changes?)

  function openCreateNewProjectModal() {
    try {
      openModal(true);
    } catch (e) {
      console.error(e);
    }
  }

  function closeModal() {
    if (openModal) {
      openModal(false);
    }
  }

  function createProject() {
    const projectItem = [{
      name: projectName,
      limit: projectLimit,
      id: generateUid(),
      createdAt: moment().format('MM.Do.YY, h:mm')
    }]

    if (projectName !== "") {
      const newProject = projectList.concat(projectItem);
      addToProjectList(newProject);
      closeModal();
    } else {
      alert("Project name cant be empty");
    }
  }


  function selectProject(i: any): any {
    setSelectedProject(projectList[i].id);
    const pContainer: any = document.querySelectorAll('.project-container');
    // TODO: select first project after adding
    // Highlight selected Project with css class
    if (pContainer) {
      pContainer.forEach((item: any) => {
        item.addEventListener('click', () => {
          for (let items of pContainer) {
            items.classList.remove('selected');
          }
          // Set Context value for Cards
          item.classList.add('selected');
        })
      })
    }
  }

  return (
    <>
      <div className="project-title-container">
        <span className='list-title'>Projects</span>
        <button onClick={openCreateNewProjectModal} className='add-project'><span></span></button>
      </div>
      <div className={`modal new-project-modal ${modal ? 'open' : ''}`}>
        {/* modal content for fade-in scale-in animation to work */}
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
            <h4>Enter a Project time limit in hours (no limit if empty)</h4>
            <input
              type="text"
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
          projectList.map((project: any, index: any) => (
            <div onClick={() => selectProject(index)} key={project.id} className="project-container">
              <li className='project'>
                <span className='project-name'>{project.name}</span>
                <span className='project-time'>
                  <span className="project-current">4h </span>
                  <span className="project-time-seperator">| </span>
                  <span className="project-limit">4.2h</span>
                </span>
              </li>
            </div>
          ))
        }
      </ul>
    </>
  )
}
