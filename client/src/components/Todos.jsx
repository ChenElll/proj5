import React, { useState, useEffect } from 'react';
import '../css/Todos.css';

const Todos = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [todos, setTodos] = useState([]);
  const [sortCriterion, setSortCriterion] = useState('serial');
  const [searchCriterion, setSearchCriterion] = useState('serial');
  const [searchTerm, setSearchTerm] = useState('');
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch(`http://localhost:3000/todos?userId=${user.id}`);
        const data = await response.json();
        setTodos(data);
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };

    fetchTodos();
  }, [user.id]);

  const getNewId = async () => {
    try {
      const response = await fetch(`http://localhost:3000/todos`);
      const data = await response.json();
      const maxId = data.reduce((max, todo) => Math.max(max, parseInt(todo.id, 10)), 0);
      return maxId + 1;
    } catch (error) {
      console.error('Error fetching todos:', error);
      const maxId = todos.reduce((max, todo) => Math.max(max, parseInt(todo.id, 10)), 0);
      return maxId + 1; // fallback in case of error
    }
  };

  const handleSortChange = (e) => {
    setSortCriterion(e.target.value);
  };

  const handleSearchCriterionChange = (e) => {
    setSearchCriterion(e.target.value);
    setSearchTerm('');
  };

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleNewTodoChange = (e) => {
    setNewTodo(e.target.value);
  };

  const handleAddTodo = async () => {
    if (newTodo.trim() === '') return;

    const newTodoId = await getNewId();
    const newTodoItem = {
      userId: parseInt(user.id),
      id: newTodoId.toString(),
      title: newTodo,
      completed: false
    };

    try {
      const response = await fetch('http://localhost:3000/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTodoItem)
      });
      if (!response.ok) throw new Error('Failed to add todo');
      setTodos([newTodoItem, ...todos]);
      setNewTodo('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddTodo();
    }
  };

  const handleDeleteTodo = async (id) => {
    console.log(`Attempting to delete todo with id: ${id}`);
    try {
      const response = await fetch(`http://localhost:3000/todos/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete todo');
      console.log('Delete response:', response);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleUpdateTodo = async (id, updatedTodo) => {
    console.log(`Attempting to update todo with id: ${id}`);
    console.log('Updated todo:', updatedTodo);
    try {
      const response = await fetch(`http://localhost:3000/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedTodo)
      });
      if (!response.ok) throw new Error('Failed to update todo');
      console.log('Update response:', response);
      setTodos(todos.map(todo => (todo.id === id ? updatedTodo : todo)));
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleToggleCompleted = async (id) => {
    const todo = todos.find(todo => todo.id === id);
    const updatedTodo = { ...todo, completed: !todo.completed };
    handleUpdateTodo(id, updatedTodo);
  };

  const sortTodos = (todos) => {
    switch (sortCriterion) {
      case 'serial':
        return todos.slice().sort((a, b) => b.id - a.id);
      case 'completed':
        return todos.slice().sort((a, b) => a.completed - b.completed);
      case 'alphabetical':
        return todos.sort((a, b) => a.title.localeCompare(b.title));
      case 'random':
        return todos.sort(() => Math.random() - 0.5);
      default:
        return todos;
    }
  };

  const getLocalIndex = (id) => {
    const sortedTodos = sortTodos([...todos]);
    return sortedTodos.findIndex(todo => todo.id === id) + 1;
  };

  const filterTodos = (todos) => {
    return todos.filter((todo) => {
      switch (searchCriterion) {
        case 'serial':
          return getLocalIndex(todo.id).toString().includes(searchTerm);
        case 'title':
          return todo.title.toLowerCase().includes(searchTerm.toLowerCase());
        case 'completed': {
          if (searchTerm === '') return true;
          const isCompleted = searchTerm.toLowerCase() === 'true';
          return todo.completed === isCompleted;
        }
        default:
          return true;
      }
    });
  };

  const getSuggestions = () => {
    switch (searchCriterion) {
      case 'serial':
        return todos.map(todo => getLocalIndex(todo.id).toString());
      case 'title':
        return todos.map(todo => todo.title);
      case 'completed':
        return ['true', 'false'];
      default:
        return [];
    }
  };

  return (
    <div className="todos-container">
      <div className="todos-header">
        <h2>{user.username}'s Todos</h2>
        <div className="search-sort-container">
          <select onChange={handleSortChange} value={sortCriterion}>
            <option value="serial">Serial</option>
            <option value="completed">Completed</option>
            <option value="alphabetical">Alphabetical</option>
            <option value="random">Random</option>
          </select>
          <select onChange={handleSearchCriterionChange} value={searchCriterion}>
            <option value="serial">Serial</option>
            <option value="title">Title</option>
            <option value="completed">Completion Status</option>
          </select>
          <input 
            type="text" 
            onChange={handleSearchTermChange} 
            value={searchTerm} 
            placeholder="Search..." 
            list="suggestions"
          />
          <datalist id="suggestions">
            {getSuggestions().map((suggestion, index) => (
              <option key={index} value={suggestion} />
            ))}
          </datalist>
        </div>
      </div>
      <div className="add-todo-container">
        <input 
          type="text" 
          value={newTodo} 
          onChange={handleNewTodoChange} 
          onKeyDown={handleKeyDown}
          placeholder="Add a new todo..." 
        />
        <button onClick={handleAddTodo}>Add</button>
      </div>
      <div className="todos-list">
        <ul>
          {sortTodos(filterTodos(todos)).map((todo) => (
            <li key={todo.id} className="todo-item">
              <span className="todo-id">{getLocalIndex(todo.id)}</span> {/* Display local index */}
              <span><input type="checkbox" checked={todo.completed} onChange={() => handleToggleCompleted(todo.id)} /></span>
              <span className="todo-title">
                <input 
                  type="text" 
                  value={todo.title} 
                  onChange={(e) => handleUpdateTodo(todo.id, { ...todo, title: e.target.value })} 
                />
              </span>
              <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Todos;
