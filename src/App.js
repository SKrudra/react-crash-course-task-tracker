import {useState, useEffect} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import Header from './componenets/Header';
import Footer from './componenets/Footer';
import About from './componenets/About';
import Home from './componenets/Home';

function App() {
  const [showAddTask, setShowAddTask] = useState(false);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks();
      setTasks(tasksFromServer);
    };
    getTasks();
  }, []); // dependency array

  // Fetch Tasks
  const fetchTasks = async () => {
    const res = await fetch('http://localhost:5000/tasks');
    const data = await res.json();
    return data;
  };

  // Fetch Tasks
  const fetchTask = async (id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`);
    const data = await res.json();
    return data;
  };

  // Add Task
  const addTask = async (task) => {
    // Add to the server
    const res = await fetch('http://localhost:5000/tasks', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
      },
      body: JSON.stringify(task),
    });

    const data = await res.json();
    setTasks([...tasks, data]);

    // static add on the local data
    // const id = Math.floor(Math.random() * 10000) + 1;
    // const newTask = {id, ...task};
    // setTasks([...tasks, newTask]);
  };

  // Delete Task
  const deleteTask = async (id) => {
    // DELETE from server
    // failing due to cors issue
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'DETELE',
      headers: {
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
      },
    });

    // remove from the UI
    setTasks(tasks.filter((task) => task.id !== id));
    console.log('deleted', id);
  };

  // Toggle reminder
  const toggerReminder = async (id) => {
    const taskToToggle = await fetchTask(id);
    const updatedTask = {...taskToToggle, reminder: !taskToToggle.reminder};

    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
      },
      body: JSON.stringify(updatedTask),
    });

    const data = await res.json();

    setTasks(tasks.map((task) => (task.id === id ? {...task, reminder: data.reminder} : task)));
  };

  return (
    <Router>
      <div className="container">
        <Header onAdd={() => setShowAddTask(!showAddTask)} showAdd={showAddTask} />
        <Routes>
          <Route
            path="/"
            exact
            element={
              <Home
                showAddTask={showAddTask}
                tasks={tasks}
                addTask={addTask}
                deleteTask={deleteTask}
                toggerReminder={toggerReminder}
              />
            }
          />
          <Route path="/about" element={<About />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

/*
1. We can only return one html parent element from the function
2. we can return <> empty if we don't want any parent html element

*/
