import './App.scss';
import { Container } from 'react-bootstrap';
import { Switch, Route } from 'react-router-dom';
import Nav from './Nav';
import Home from './Home';

function App() {
  return (
    <Container>
        <Nav />
      <Switch>
        <Route path="/" exact>
            <Home />
        </Route>
        <Route path="/users">
            <p>Ok</p>
        </Route>
      </Switch>
    </Container>
  );
}

export default App;
