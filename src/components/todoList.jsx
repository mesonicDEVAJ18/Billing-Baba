import React, { useState } from "react";

function TodoList({ taskStatus, setTaskStatus }) {
  //   const [taskStatus, setTaskStatus] = useState(tasks);

  const [newTask, setNewTask] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleCheckboxChange = (task) => {
    setTaskStatus((prevTaskStatus) => ({
      ...prevTaskStatus,
      [task]: prevTaskStatus[task] === "done" ? "pending" : "done",
    }));
  };

  const handleAddTodoClick = () => {
    setIsAdding(true);
  };

  const handleSaveTodo = () => {
    if (newTask.trim() !== "") {
      setTaskStatus((prevTaskStatus) => ({
        ...prevTaskStatus,
        [newTask]: "pending",
      }));
      setNewTask("");
      setIsAdding(false);
    }
  };

  const handleDeleteTodo = (task) => {
    const updatedTasks = { ...taskStatus };
    delete updatedTasks[task];
    setTaskStatus(updatedTasks);
  };

  const handleInputChange = (e) => {
    setNewTask(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSaveTodo();
    }
  };

  return (
    <div className="todo">
      <ul>
        {Object.entries(taskStatus).map(([task, status]) => (
          <li key={task}>
            <label>
              <input
                type="checkbox"
                checked={status === "done"}
                onChange={() => handleCheckboxChange(task)}
              />
              {task}
            </label>
            <button onClick={() => handleDeleteTodo(task)}>X</button>
          </li>
        ))}
      </ul>
      {isAdding ? (
        <div>
          <input
            type="text"
            value={newTask}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Enter new task"
          />
          <button onClick={handleSaveTodo}>Save</button>
        </div>
      ) : (
        <button onClick={handleAddTodoClick}>Add Todo</button>
      )}
    </div>
  );
}

export default TodoList;
