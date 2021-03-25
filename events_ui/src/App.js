import './App.scss';
import { Switch, Route } from 'react-router-dom';
import Nav from './Nav';
import Home from './Home';
import Directory from './Users/Directory';
import UserForm from './Users/Form';
import Event from './Events/Event';
import EventForm from './Events/Form';
function App() {
    return (
        <>
            <Nav />
            <Switch>
                <Route path="/" exact>
                    <Home />
                </Route>
                <Route path="/users/new">
                    <UserForm />
                </Route>
                <Route path="/users/edit">
                    <UserForm />
                </Route>
                <Route path="/users" exact>
                    <Directory />
                </Route>
                <Route path="/events/new" exact>
                    <EventForm />
                </Route>
                <Route path="/events/:id" component={Event} exact />
            </Switch>
        </>
    );
}

export default App;
