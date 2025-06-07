/*
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
*/

"use client";
import { useGlobalState } from "@/app/context/globalProvider";
import { edit, trash } from "@/app/utils/Icons";
import React from "react";
import styled from "styled-components";
import formatDate from "@/app/utils/formatDate";
import { useState, useRef, useEffect } from "react";

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
  const [isExpanded, setIsExpanded] = useState(false);
  
  const titleInputRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  // Auto-focus on title input when editing starts
  useEffect(() => {
    if (isEditing && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isEditing]);

  // Check if description is truncated
  useEffect(() => {
    const checkTruncation = () => {
      if (descriptionRef.current && !isEditing) {
        const element = descriptionRef.current;
        setIsExpanded(element.scrollHeight > element.clientHeight);
      }
    };

    checkTruncation();
    window.addEventListener('resize', checkTruncation);
    return () => window.removeEventListener('resize', checkTruncation);
  }, [description, isEditing]);

  const handleUpdate = () => {
    if (editTitle.trim() === "") {
      alert("Title cannot be empty");
      return;
    }
    
    updateTask({
      id,
      title: editTitle.trim(),
      description: editDescription.trim(),
      isCompleted,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(title);
    setEditDescription(description);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel();
    } else if (e.key === 'Enter' && e.ctrlKey) {
      handleUpdate();
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <TaskItemStyled theme={theme} isCompleted={isCompleted}>
      {isEditing ? (
        <div className="edit-mode">
          <div className="input-group">
            <label htmlFor={`title-${id}`} className="sr-only">Task Title</label>
            <input
              id={`title-${id}`}
              ref={titleInputRef}
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter task title..."
              className="title-input"
              maxLength={100}
            />
          </div>
          
          <div className="input-group">
            <label htmlFor={`description-${id}`} className="sr-only">Task Description</label>
            <textarea
              id={`description-${id}`}
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter task description..."
              className="description-textarea"
              rows={3}
              maxLength={500}
            />
          </div>
          
          <div className="edit-footer">
            <div className="edit-actions">
              <button 
                onClick={handleUpdate} 
                className="save-btn"
                disabled={editTitle.trim() === ""}
              >
                Save
              </button>
              <button onClick={handleCancel} className="cancel-btn">
                Cancel
              </button>
            </div>
            <div className="edit-hint">
              <span>Ctrl+Enter to save • Esc to cancel</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="view-mode">
          <div className="task-header">
            <h1 className="task-title">{title}</h1>
            {isCompleted && <span className="completed-badge">✓</span>}
          </div>
          
          <div className="task-content">
            <p 
              ref={descriptionRef}
              className={`task-description ${isExpanded ? 'expanded' : ''}`}
              onClick={toggleExpanded}
            >
              {description}
            </p>
            {description.length > 100 && (
              <button 
                className="expand-btn"
                onClick={toggleExpanded}
                aria-label={isExpanded ? 'Show less' : 'Show more'}
              >
                {isExpanded ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>

          <div className="task-meta">
            <p className="date" title={new Date(date).toLocaleString()}>
              {formatDate(date)}
            </p>
          </div>

          <div className="task-footer">
            <button
              className={`status-btn ${isCompleted ? "completed" : "incomplete"}`}
              onClick={() => updateTask({ id, isCompleted: !isCompleted })}
              aria-label={`Mark as ${isCompleted ? 'incomplete' : 'completed'}`}
            >
              <span className="status-text">
                {isCompleted ? "Completed" : "Incomplete"}
              </span>
            </button>

            <div className="action-buttons">
              <button 
                className="edit-btn" 
                onClick={() => setIsEditing(true)}
                aria-label="Edit task"
                title="Edit task"
              >
                {edit}
              </button>

              <button 
                className="delete-btn" 
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this task?')) {
                    deleteTask(id);
                  }
                }}
                aria-label="Delete task"
                title="Delete task"
              >
                {trash}
              </button>
            </div>
          </div>
        </div>
      )}
    </TaskItemStyled>
  );
}

const TaskItemStyled = styled.div<{ isCompleted: boolean }>`
  padding: 1.2rem 1rem;
  border-radius: 1rem;
  background-color: ${(props) => props.theme.borderColor2};
  box-shadow: ${(props) => props.theme.shadow7};
  border: 2px solid ${(props) => props.theme.borderColor2};

  min-height: 16rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  position: relative;
  transition: all 0.3s ease;
  opacity: ${(props) => props.isCompleted ? 0.8 : 1};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${(props) => props.theme.shadow8 || props.theme.shadow7};
    border-color: ${(props) => props.theme.colorPrimary};
  }

  /* Screen reader only content */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  /* Edit Mode Styles */
  .edit-mode {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    height: 100%;
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .title-input,
  .description-textarea {
    width: 100%;
    padding: 0.75rem;
    font-size: clamp(0.9rem, 2.5vw, 1rem);
    border: 2px solid ${(props) => props.theme.borderColor2};
    border-radius: 0.5rem;
    background-color: ${(props) => props.theme.colorBg};
    color: ${(props) => props.theme.colorGrey0};
    font-family: inherit;
    transition: border-color 0.2s ease;

    &:focus {
      outline: none;
      border-color: ${(props) => props.theme.colorPrimary};
      box-shadow: 0 0 0 3px ${(props) => props.theme.colorPrimary}33;
    }

    &::placeholder {
      color: ${(props) => props.theme.colorGrey2};
    }
  }

  .title-input {
    font-weight: 600;
    font-size: clamp(1rem, 3vw, 1.2rem);
  }

  .description-textarea {
    resize: vertical;
    min-height: 80px;
    font-family: inherit;
    line-height: 1.4;
  }

  .edit-footer {
    margin-top: auto;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .edit-actions {
    display: flex;
    gap: 0.75rem;
    align-items: center;
  }

  .save-btn,
  .cancel-btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.5rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.9rem;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .save-btn {
    background: ${(props) => props.theme.colorGreenDark};
    color: white;

    &:hover:not(:disabled) {
      background: ${(props) => props.theme.colorGreen};
      transform: translateY(-1px);
    }
  }

  .cancel-btn {
    background: ${(props) => props.theme.colorGrey5};
    color: ${(props) => props.theme.colorGrey0};

    &:hover {
      background: ${(props) => props.theme.colorGrey4};
      transform: translateY(-1px);
    }
  }

  .edit-hint {
    font-size: 0.75rem;
    color: ${(props) => props.theme.colorGrey2};
    font-style: italic;
  }

  /* View Mode Styles */
  .view-mode {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    height: 100%;
  }

  .task-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.5rem;
  }

  .task-title {
    font-size: clamp(1.1rem, 3vw, 1.5rem);
    font-weight: 600;
    line-height: 1.3;
    margin: 0;
    word-wrap: break-word;
    hyphens: auto;
    flex: 1;
    color: ${(props) => props.theme.colorGrey0};
    text-decoration: ${(props) => props.isCompleted ? 'line-through' : 'none'};
    opacity: ${(props) => props.isCompleted ? 0.7 : 1};
  }

  .completed-badge {
    background: ${(props) => props.theme.colorGreenDark};
    color: white;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    flex-shrink: 0;
  }

  .task-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .task-description {
    font-size: clamp(0.85rem, 2.5vw, 0.95rem);
    line-height: 1.5;
    color: ${(props) => props.theme.colorGrey2};
    word-wrap: break-word;
    hyphens: auto;
    margin: 0;
    
    /* Text truncation for mobile */
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    cursor: pointer;
    
    &.expanded {
      -webkit-line-clamp: unset;
      display: block;
    }
    
    &:hover {
      color: ${(props) => props.theme.colorGrey1};
    }
  }

  .expand-btn {
    align-self: flex-start;
    background: none;
    border: none;
    color: ${(props) => props.theme.colorPrimary};
    cursor: pointer;
    font-size: 0.8rem;
    font-weight: 500;
    padding: 0.25rem 0;
    
    &:hover {
      text-decoration: underline;
    }
  }

  .task-meta {
    margin-top: auto;
  }

  .date {
    font-size: clamp(0.75rem, 2vw, 0.85rem);
    color: ${(props) => props.theme.colorGrey3};
    margin: 0;
    font-style: italic;
  }

  .task-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    margin-top: 0.5rem;
  }

  .status-btn {
    border: none;
    outline: none;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 1rem;
    border-radius: 30px;
    font-weight: 500;
    font-size: clamp(0.8rem, 2.2vw, 0.9rem);
    transition: all 0.2s ease;
    white-space: nowrap;

    &.incomplete {
      background: ${(props) => props.theme.colorDanger};
      color: white;
      
      &:hover {
        background: ${(props) => props.theme.colorDangerDark || props.theme.colorDanger};
        transform: translateY(-1px);
      }
    }

    &.completed {
      background: ${(props) => props.theme.colorGreenDark};
      color: white;
      
      &:hover {
        background: ${(props) => props.theme.colorGreen};
        transform: translateY(-1px);
      }
    }
  }

  .action-buttons {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .edit-btn,
  .delete-btn {
    border: none;
    outline: none;
    cursor: pointer;
    background: transparent;
    padding: 0.5rem;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;

    i, svg {
      font-size: clamp(1.2rem, 3vw, 1.4rem);
      color: ${(props) => props.theme.colorGrey2};
      transition: color 0.2s ease;
    }

    &:hover {
      background: ${(props) => props.theme.colorBg3};
      transform: translateY(-1px);
    }
  }

  .edit-btn:hover {
    i, svg {
      color: ${(props) => props.theme.colorPrimary};
    }
  }

  .delete-btn:hover {
    i, svg {
      color: ${(props) => props.theme.colorDanger};
    }
  }

  /* Mobile Responsiveness */
  @media screen and (max-width: 768px) {
    padding: 1rem;
    min-height: 14rem;
    
    .task-footer {
      flex-direction: column;
      align-items: stretch;
      gap: 0.75rem;
    }
    
    .status-btn {
      width: 100%;
      justify-content: center;
      padding: 0.75rem 1rem;
    }
    
    .action-buttons {
      justify-content: center;
      gap: 1rem;
    }
    
    .edit-btn,
    .delete-btn {
      padding: 0.75rem;
      flex: 1;
      max-width: 60px;
    }
  }

  /* Small Mobile */
  @media screen and (max-width: 480px) {
    padding: 0.875rem;
    min-height: 12rem;
    
    .task-description {
      -webkit-line-clamp: 2;
    }
    
    .edit-actions {
      flex-direction: column;
      align-items: stretch;
      gap: 0.5rem;
    }
    
    .save-btn,
    .cancel-btn {
      width: 100%;
      padding: 0.75rem;
      font-size: 1rem;
    }
    
    .edit-hint {
      text-align: center;
      font-size: 0.7rem;
    }
  }

  /* Landscape Mobile */
  @media screen and (max-height: 500px) and (orientation: landscape) {
    min-height: 10rem;
    padding: 0.75rem;
    
    .task-description {
      -webkit-line-clamp: 1;
      font-size: 0.8rem;
    }
    
    .task-footer {
      flex-direction: row;
      margin-top: 0.25rem;
    }
  }

  /* High DPI Displays */
  @media screen and (-webkit-min-device-pixel-ratio: 2) {
    border-width: 1px;
    
    .title-input,
    .description-textarea {
      border-width: 1px;
    }
  }

  /* Dark mode enhancements */
  @media (prefers-color-scheme: dark) {
    &:hover {
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
    }
  }

  /* Reduced motion preference */
  @media (prefers-reduced-motion: reduce) {
    transition: none;
    
    &:hover {
      transform: none;
    }
    
    .save-btn:hover,
    .cancel-btn:hover,
    .status-btn:hover,
    .edit-btn:hover,
    .delete-btn:hover {
      transform: none;
    }
  }

  /* Focus management for accessibility */
  &:focus-within {
    outline: 2px solid ${(props) => props.theme.colorPrimary};
    outline-offset: 2px;
  }
`;

export default TaskItem;