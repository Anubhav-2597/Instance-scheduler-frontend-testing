import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import ListRegion from './Components/ListRegion';

function App() {
  return (
    <div>
    <h2>Welcome to Scheduler</h2>
    <Link className="nav-link" to="list-region">List Region</Link>
    <Routes>
      <Route path="/list-region" element={<ListRegion/>} />
    </Routes>
    </div>
  );
}

export default App;
