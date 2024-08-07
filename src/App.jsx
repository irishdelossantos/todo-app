import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const storedTasks = JSON.parse(localStorage.getItem('taskList')) || [];
  const [taskName, setTaskName] = useState("");
  const [taskList, setTaskList] = useState(storedTasks);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [showDeadlineModal, setShowDeadlineModal] = useState(false);
  const [deadline, setDeadline] = useState("");
  const [allTasksDone, setAllTasksDone] = useState(false);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false); // New state

  useEffect(() => {
    localStorage.setItem('taskList', JSON.stringify(taskList));
  }, [taskList]);

  const addTask = () => {
    if (taskName.trim()) {
      setShowDeadlineModal(true);
    }
  };

  const saveDeadline = () => {
    if (deadline.trim()) {
      const newTask = {
        task: taskName,
        completed: false,
        timestamp: new Date(),
        deadline: new Date(deadline),
      };
      setTaskList([...taskList, newTask]);
      setTaskName("");
      setShowDeadlineModal(false);
      setDeadline("");
    }
  };

  const updateTask = () => {
    if (taskName.trim()) {
      const updatedTaskList = [...taskList];
      updatedTaskList[currentTaskIndex].task = taskName;
      setTaskList(updatedTaskList);
      setTaskName("");
      setIsEditing(false);
      setCurrentTaskIndex(null);
    }
  };

  const toggleComplete = (index) => {
    const newTaskList = [...taskList];
    newTaskList[index].completed = !newTaskList[index].completed;
    setTaskList(newTaskList);
  };

  const deleteTask = (index) => {
    const newTaskList = taskList.filter((_, i) => i !== index);
    setTaskList(newTaskList);
    setShowDeleteModal(false);
    setDeleteIndex(null);
  };

  const editTask = (index) => {
    setTaskName(taskList[index].task);
    setIsEditing(true);
    setCurrentTaskIndex(index);
  };

  const handleDelete = (index) => {
    setDeleteIndex(index);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    deleteTask(deleteIndex);
  };

  const deleteAllTasks = () => {
    setShowDeleteAllModal(true);
  };

  const confirmDeleteAll = () => {
    setTaskList([]);
    setShowDeleteAllModal(false);
  };

  const markAllDone = () => {
    const updatedTaskList = taskList.map((task) => ({
      ...task,
      completed: !allTasksDone,
    }));
    setTaskList(updatedTaskList);
    setAllTasksDone(!allTasksDone);
  };

  const renderTasks = (filter) => {
    const filteredTasks = taskList.filter((task) => {
      if (filter === "all") return true;
      if (filter === "completed") return task.completed;
      if (filter === "pending") return !task.completed;
      return false;
    });

    if (filteredTasks.length === 0) {
      let placeholderText = "";
      if (filter === "all") placeholderText = "No tasks available. Add a new task!";
      if (filter === "completed") placeholderText = "No completed tasks yet. Keep working!";
      if (filter === "pending") placeholderText = "All tasks are completed! Great job!";
      return <p className="placeholder-text">{placeholderText}</p>;
    }

    return filteredTasks.map((task, index) => (
      <li key={index}>
        <div className="task-info">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => toggleComplete(index)}
            style={{ marginBottom: "15px" }}
          />
          <div>
            <span
              style={{
                textDecoration: task.completed ? "line-through" : "none",
                marginLeft: "10px",
              }}
            >
              {task.task}
            </span>
            <span className="task-time">
              {new Date(task.timestamp).toLocaleTimeString()}{" "}
              {new Date(task.timestamp).toLocaleDateString()}
            </span>
            {task.deadline && (
              <span className="task-deadline">
                Deadline: {new Date(task.deadline).toLocaleString()}
              </span>
            )}
          </div>
        </div>
        <div className="task-actions">
          <button onClick={() => handleDelete(index)}>🗑</button>
          <button onClick={() => editTask(index)}>✎</button>
        </div>
      </li>
    ));
  };

  return (
    <div className="App">
      <h1>T O D O</h1>
      <div>
        <input
          type="text"
          id="task"
          placeholder="Do it!"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />
        {isEditing ? (
          <button onClick={updateTask}>Update</button>
        ) : (
          <button onClick={addTask}>Add Task</button>
        )}
      </div>

      <div className="tabs">
        <button
          onClick={() => setActiveTab("all")}
          className={activeTab === "all" ? "active" : ""}
        >
          All Tasks
        </button>
        <button
          onClick={() => setActiveTab("pending")}
          className={activeTab === "pending" ? "active" : ""}
        >
          Pending Tasks
        </button>
        <button
          onClick={() => setActiveTab("completed")}
          className={activeTab === "completed" ? "active" : ""}
        >
          Completed Tasks
        </button>
      </div>

      <ul>{renderTasks(activeTab)}</ul>

      {taskList.length > 0 && (
        <div className="universal-task-actions">
          <button onClick={deleteAllTasks}>Clear All</button>
          <button onClick={markAllDone}>
            {allTasksDone ? "Undone All" : "Done All"}
          </button>
        </div>
      )}

      {showDeleteModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this task?</p>
            <button onClick={confirmDelete} className="modal-button violet">Yes</button>
            <button onClick={() => setShowDeleteModal(false)} className="modal-button orange">No</button>
          </div>
        </div>
      )}

      {showDeleteAllModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Confirm Delete All</h2>
            <p>Are you sure you want to delete all tasks?</p>
            <button onClick={confirmDeleteAll} className="modal-button violet">Yes</button>
            <button onClick={() => setShowDeleteAllModal(false)} className="modal-button orange">No</button>
          </div>
        </div>
      )}

      {showDeadlineModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Set Deadline</h2>
            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              style={{ color: "gray" }}
            />
            <button onClick={saveDeadline}>Save Deadline</button>
            <button onClick={() => setShowDeadlineModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
