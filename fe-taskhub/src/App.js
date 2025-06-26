import { Route, Routes, useLocation } from 'react-router-dom';
import './styles/index.scss';
import MainView from './mainLayout/MainView';
import Login from './pages/Login';
import Register from './pages/Register';

const App = () => {
  const location = useLocation();
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register';

  return isAuthRoute ? (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
    </Routes>
  ) : (
    <MainView />
  );
};

export default App
