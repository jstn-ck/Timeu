import './projects.scss';
import React, { EffectCallback, useEffect, useState } from 'react';
//nano id to easily generate random unique ids for projects/cards..
import { nanoid } from 'nanoid'
// model.id = nanoid() //=> "V1StGXR8_Z5jdHi6B-myT"

export default function Projects(props: any) {
  const [addedProject, addProject]: any = useState([]);
  const [modal, openModal] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectLimit, setProjectLimit] = useState("");

  // TODO: current time connected with cards

  useEffect(() => {
    selectProject;
  })

  let projects: Array<object> = [];

  let projectItem = {
    name: projectName,
    limit: projectLimit,
    id: nanoid(),
  }

  function createNewProject() {
    try {
      openModal(true);
    } catch (e) {
      console.error(e);
    }
  }

  function createProject() {
    // wait to get projects from db asyncrounus? then update state
    if (projectName !== "") {
      projects.push(projectItem);
      addProject(projects);
      closeModal();
    } else {
      alert("Project name cant be empty");
    }
  }

  function closeModal() {
    if (openModal) {
      openModal(false);
    }
  }

  function selectProject(p: any): any {
    // TODO: Get current selected project.limit ...
    console.log(p)
    const pContainer: any = document.querySelectorAll('.project-container');
    // TODO: select first project after adding

    if (pContainer) {
      pContainer.forEach((item: any) => {
        item.addEventListener('click', function() {
          for (let items of pContainer) {
            items.classList.remove('selected');
          }
          item.classList.add('selected');
        })
      })
    }
  }

  return (
    <>
      <div className="project-title-container">
        <span className='list-title'>Projects</span>
        <button onClick={createNewProject} className='add-project'><span></span></button>
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
              onChange={(e) => setProjectLimit(e.target.value)}
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
          addedProject &&
          addedProject.map((project: any, index: number) => (
            <div onClick={selectProject(project)} key={project.id} className="project-container">
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
        {props.children}
      </ul>
    </>
  )
}

export function projectInfo() {
  //f
}
