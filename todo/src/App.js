import React, { useEffect, useState } from "react";
import './App.css';


function App() {
  const [input, setInput] = useState({
    todo: "",
    error: ""
  });
  const [task, setTask] = useState(getStoredItems());

  function getStoredItems(){
    const items = localStorage.getItem("task")
    if(items){
      return JSON.parse(items)
    }else{
      return []
    }
  }

  useEffect(() => {
    localStorage.setItem("task", JSON.stringify(task));
  }, [task]);


  function handleChange(e) {
    setInput(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }

  function handleReset() {
    setInput({
      todo: "",
      error: ""
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const isValid = validate();
    if (isValid) {
      addTask(input.todo);
      handleReset();
    }
  }

  function validate() {
    if (input.todo.trim() === "") {
      setInput(prev => ({
        ...prev,
        error: "Input Field is Empty"
      }));
      return false;
    } else if (!/^[a-zA-Z]{2}[a-zA-Z0-9_-\s]*$/.test(input.todo)) {
      setInput(prev => ({
        ...prev,
        error: "Invalid Task"
      }));
      return false;
    } else if(task.some(item => item.todo === input.todo.trim())){
      setInput(prev => ({
        ...prev,
        error: "Task already Exist"
      }));
      return false;
    } else {
      setInput(prev => ({
        ...prev,
        error: ""
      }));
      return true;
    }
  }

  function addTask(todo) {
    setTask(prev => [...prev, {todo:todo,checked:false}]);
  }

  const deleteTask = index => {
    const newTaskList = [...task];
    newTaskList.splice(index, 1);
    setTask(newTaskList);
  };

  
  const checkTask = index => {
    const newTaskList = [...task];
    newTaskList[index] = {todo:newTaskList[index].todo,checked:true};
    setTask(newTaskList);
  };

  const uncheckTask = index => {
    const newTaskList = [...task];
    newTaskList[index] = {todo:newTaskList[index].todo,checked:false};
    setTask(newTaskList);
  };

  const renderData = () => {
    return task.map((item, index) => (
      <div key={index} className="todo-task">
        <span className="todo-task-index">{index+1}</span>
        <span className = {item.checked ? "todo-task-checked":"todo-task-unchecked"}>{item.todo}</span>
        {item.checked ? <button className="todo-uncheck-btn"  onClick={() => uncheckTask(index)}>Uncheck</button>
        :
        <button className="todo-check-btn" onClick={() => checkTask(index)}>Check</button>}
        <button className="todo-delete-btn" onClick={() => deleteTask(index)}>Delete</button>
      </div>
    ));
  };

  return (
    <div className="todo-container">
      <h3 className="todo-heading">Todo - List</h3>
      <form className="todo-form" onSubmit={handleSubmit} onReset={handleReset}>
        <div className="todo-input">
          <input type="text" className="todo-input-field" name="todo" value={input.todo} placeholder="Enter the task" onChange={handleChange} />
          <input type="submit" value="Add" className="todo-form-submit" />
          <input type="reset" value="Clear" className="todo-form-reset" />
        </div>
        {input.error && <h3 className="todo-input-error">{input.error}</h3>}
      </form>
      <div className="todo-task-list">
        {renderData()}
      </div>
    </div>
  );
}

export default App;
