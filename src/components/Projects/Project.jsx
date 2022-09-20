import React, {useEffect, useState} from "react";
import {disablePointer} from "@/helpers/disablePointer";
import EIcon from "@/components/Icons/EditIcon";
import TIcon from "@/components/Icons/TrashIcon";

export const Project = (props) => {
  const [projectCurrent, setProjectCurrent] = useState(props.getProjectCurrent);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editedProjectName, setEditedProjectName] = useState(props.name);
  const [editedProjectLimit, setEditedProjectLimit] = useState(props.limit);
  const currentRef = React.createRef();

  useEffect(() => {
    if (props.getProjectCurrent !== projectCurrent) {
      setProjectCurrent(props.getProjectCurrent);
    } else if (props.getProjectCurrent === 0) {
      setProjectCurrent(0);
    }

    // Red current if over limit, green if under Limit
    if (projectCurrent > 0 && projectCurrent > props.limit && props.limit !== 0) {
      currentRef.current.classList.remove('green');
      currentRef.current.classList.add('red');
    } else if (projectCurrent >= 0 && props.limit !== 0) {
      currentRef.current.classList.remove('red');
      currentRef.current.classList.add('green');
    }
  })

  function handleDelete(id) {
    if (openDeleteModal) {
      props.handleDelete(id);
      setOpenDeleteModal(false);
      disablePointer(false);
    }
  }

  function handleDeleteModal() {
    if (!openDeleteModal) {
      setOpenDeleteModal(true);
      disablePointer(true);
    } else if (openDeleteModal) {
      disablePointer(false);
      setOpenDeleteModal(false);
    }
  }

  function handleEdit(id) {
    if (openEditModal) {
      const updatedItemValues = {
        newName: editedProjectName,
        newLimit: editedProjectLimit,
      }

      props.handleEdit(updatedItemValues, id);
      setOpenEditModal(false);
      disablePointer(false);
    }
  }

  function handleEditModal() {
    if (!openEditModal) {
      setOpenEditModal(true);
      disablePointer(true);
    } else if (openEditModal) {
      disablePointer(false);
      setOpenEditModal(false);
    }
  }

  return (
    <li className='project'>
      <div className={`modal edit-project-modal ${openEditModal ? 'open' : ''}`}>
        <div className="modal-content">
          <div className="input-container">
            <h2>Edit Project</h2>
            <input
              type="text"
              className="input"
              maxLength={50}
              value={editedProjectName}
              onChange={(e) => setEditedProjectName(e.target.value)}
              placeholder="Enter new Project name"
            />
            <h4>Enter a new Project time limit in hours</h4>
            <input
              type="number"
              className="input"
              value={editedProjectLimit}
              onChange={(e) => setEditedProjectLimit(parseInt(e.target.value))}
              placeholder="Project limit in h"
            />
          </div>
          <div className="btn-container">
            <button onClick={handleEditModal} className='btn-cancel'>Cancel</button>
            <button onClick={(e) => { handleEdit(props.id) }} className='btn-create'>Save</button>
          </div>
        </div>
      </div>
      <div className={`modal delete-project-modal ${openDeleteModal ? 'open' : ''}`}>
        <div className="modal-content">
          <h2>Delete Project ?</h2>
          <div className="btn-container">
            <button onClick={handleDeleteModal} className='btn-cancel'>Cancel</button>
            <button onClick={(e) => { handleDelete(props.id) }} className='btn-delete'>Delete</button>
          </div>
        </div>
      </div>
      <span className='project-name'>{props.name}</span>
      <span className='project-time'>
        <span ref={currentRef} className="project-current"><span className='current-num'>{projectCurrent}h</span></span>
        <span className="project-time-seperator"> | </span>
        <span className="project-limit">{props.limit}h</span>
      </span>
      <span className='project-controls'>
        <span onClick={handleEditModal} className="edit-container">
          <EIcon />
        </span>
        <span className="project-control-seperator"> | </span>
        <span onClick={handleDeleteModal} className="delete-container">
          <TIcon />
        </span>
      </span>
    </li>
  )
}
