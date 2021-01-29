import React from 'react'

const DeleteEventFab = ({deleteEvent}) => {
    return (
        <button className="btn btn-danger fab-danger" onClick={deleteEvent}>
            <i className="fas fa-trash"></i>
            <span> Delete Event </span>
        </button>
    )
}

export default DeleteEventFab
