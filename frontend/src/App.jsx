import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Courses from './pages/Courses';
import CourseForm from './pages/CourseForm';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/courses" element={<Courses />} />
        <Route 
          path="/courses/new" 
          element={
            <ProtectedRoute>
              <CourseForm />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/courses/edit/:id" 
          element={
            <ProtectedRoute>
              <CourseForm />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </>
  );
}

export default App;
