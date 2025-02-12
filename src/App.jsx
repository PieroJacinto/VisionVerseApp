import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login/Login';
import Welcome from './components/Welcome/Welcome';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route 
          path="/auth/google/callback" 
          element={<div>Procesando autenticación...</div>} 
        />
      </Routes>
    </Router>
  );
}

export default App;