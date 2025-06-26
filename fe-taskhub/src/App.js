import { BrowserRouter, Route } from 'react-router-dom';
import MainView from './mainLayout/MainView';
import './styles/index.scss';
import Router from './routes/Router'

function App() {
  return (
    <BrowserRouter>
      {/* <MainView /> */}
      <Router />
    </BrowserRouter>
  );
}

export default App;
