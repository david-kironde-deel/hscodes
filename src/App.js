import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import ClassificationForm from './components/ClassificationForm';
import RecentSearches from './components/RecentSearches';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="container">
          <Routes>
            <Route path="/" element={<ClassificationForm />} />
            <Route path="/recent" element={<RecentSearches />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
