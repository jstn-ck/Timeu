import './projects.scss';
import React, { EffectCallback, useEffect, useState } from 'react';
//nano id to easily generate random unique ids for projects/cards..
import { nanoid } from 'nanoid'
import { iteratorSymbol } from 'immer/dist/internal';
// model.id = nanoid() //=> "V1StGXR8_Z5jdHi6B-myT"

export default function Projects(props: any) {
    const [addedProject, addProject]: any = useState([]);
    let projects: any = []; 

    useEffect(() => {
        selectProject();
    })

    let projectItem = {
        name: "testItem really long  for content name long",
        id: nanoid(),
    }

    function createNewProject() {
        // wait to get projects from db asyncrounus? then update state
        projects.push(projectItem);
        projects.push(projectItem);
        addProject(projects);
        console.log(addedProject);
    }

    function selectProject() {
        const pContainer: any = document.querySelectorAll('.project-container');
        // const selectFirstProject = pContainer[0];

        if (pContainer) {
            pContainer.forEach((item: any) => {
                item.addEventListener('click', function(){
                    for(let items of pContainer) {
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
        <ul className='projects'>
            {
                addedProject &&
                addedProject.map((project: any, index: number) => (
                    <div onClick={selectProject} key={project.id} className="project-container">
                        <li  className='project'>
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