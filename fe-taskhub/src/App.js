import { BrowserRouter, Route } from 'react-router-dom';
import MainView from './mainLayout/MainView';
import './styles/index.scss';

function App() {
  return (
    <BrowserRouter>
      <MainView />
    </BrowserRouter>
  );
}

export default App;
