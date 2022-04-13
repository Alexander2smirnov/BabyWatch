import './App.css';
import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Nav from './Nav'
import CalendarPage from './CalendarPage';

function App() {
  return (
    <div className="App">
      
      <header className="App-header">
        <Nav/>
      </header>
      <CalendarPage />
      <footer>
      </footer>
    </div>
  );
}

export default App;
