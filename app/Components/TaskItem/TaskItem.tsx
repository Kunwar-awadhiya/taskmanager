"use client";
import { useGlobalState } from "@/app/context/globalProvider";
import { edit, trash } from "@/app/utils/Icons";
import React from "react";
import styled from "styled-components";
import formatDate from "@/app/utils/formatDate";
import { useState } from "react";

interface Props {
  title: string;
  description: string;
  date: string;
  isCompleted: boolean;
  id: string;
}

function TaskItem({ title, description, date, isCompleted, id }: Props) {
  const { theme, deleteTask, updateTask } = useGlobalState();

   const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editDescription, setEditDescription] = useState(description);

  const handleUpdate = () => {
    updateTask({
      id,
      title: editTitle,
      description: editDescription,
      isCompleted,
    });
    setIsEditing(false);
  };


   return (
  <TaskItemStyled theme={theme}>
    {isEditing ? (
      <>
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
        />
        <textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
        />
        <div className="task-footer">
          <button onClick={handleUpdate}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      </>
    ) : (
      <>
        <h1>{title}</h1>
        <p>{description}</p>
        <p className="date">{formatDate(date)}</p>

        <div className="task-footer">
          <button
            className={isCompleted ? "completed" : "incomplete"}
            onClick={() => updateTask({ id, isCompleted: !isCompleted })}
          >
            {isCompleted ? "Completed" : "Incomplete"}
          </button>

          <button className="edit" onClick={() => setIsEditing(true)}>
            {edit}
          </button>

          <button className="delete" onClick={() => deleteTask(id)}>
            {trash}
          </button>
        </div>
      </>
    )}
  </TaskItemStyled>
);

}

const TaskItemStyled = styled.div`

  input,
  textarea {
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid ${(props) => props.theme.borderColor2};
  border-radius: 0.5rem;
}

  padding: 1.2rem 1rem;
  border-radius: 1rem;
  background-color: ${(props) => props.theme.borderColor2};
  box-shadow: ${(props) => props.theme.shadow7};
  border: 2px solid ${(props) => props.theme.borderColor2};

  height: 16rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  .date {
    margin-top: auto;
  }

  > h1 {
    font-size: 1.5rem;
    font-weight: 600;
  }

  .task-footer {
    display: flex;
    align-items: center;
    gap: 1.2rem;

    button {
      border: none;
      outline: none;
      cursor: pointer;

      i {
        font-size: 1.4rem;
        color: ${(props) => props.theme.colorGrey2};
      }
    }

    .edit {
      margin-left: auto;
    }

    .completed,
    .incomplete {
      display: inline-block;
      padding: 0.4rem 1rem;
      background: ${(props) => props.theme.colorDanger};
      border-radius: 30px;
    }

    .completed {
      background: ${(props) => props.theme.colorGreenDark} !important;
    }
  }
`;

export default TaskItem;
