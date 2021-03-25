import {Navbar, Form, Button, Nav, Alert} from 'react-bootstrap'
import { NavLink } from 'react-router-dom';
import { FaHome, FaUsers } from "react-icons/fa"
import { connect } from 'react-redux';
import {useState} from 'react'
import Image from './Image';
import store from './store';
import {api_login} from './api'

function LoginForm() {
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");

    function on_submit(ev) {
        ev.preventDefault();
        api_login(email, pass);
    }

    return (
        <Form onSubmit={on_submit} inline>
            <Form.Control placeholder="Email"
                type="text"
                onChange={(ev) => setEmail(ev.target.value)}
                className="mr-sm-2" 
                value={email} />
            <Form.Control placeholder="Password"
                type="password"
                onChange={(ev) => setPass(ev.target.value)}
                className="mr-sm-2" 
                value={pass} />
            <Button variant="outline-info" 
                className="mr-sm-2" 
                type="submit">
                Login
            </Button>
        <NavLink to="/users/new" exact className="btn btn-outline-info mr-sm-2">
        Register
        </NavLink>
        </Form>
    );
}

function ToolBar({session}) {
    function logout(ev) {
        ev.preventDefault();
        store.dispatch({ type: 'session/clear' });
    }
    return (
        <>
            <Image id={session.user_id} /> 
            <span className="mx-4 text-white"> {session.name} </span>

            <NavLink to="/users/edit" exact className="btn btn-outline-info mr-sm-2">
                Edit
            </NavLink>
            <Button variant="outline-info" 
                className="mr-sm-2" 
                type="submit" onClick={logout}>
                Logout
            </Button>

        </>

    )
}


function AppNav({error, session}) {
    let sessionDisplay = session ? <ToolBar session={session} /> : <LoginForm />
        return (
            <>
                <Navbar bg="dark" variant="dark" expand="lg">
                    <NavLink to="/" exact className="navbar-brand">
                        <FaHome />
                    </NavLink>
                    <Nav className="mr-auto">
                        <NavLink 
                            to="/users" 
                            exact className="nav-link" 
                            activeClassName="active">
                            <FaUsers />
                        </NavLink>
                    </Nav>
                    {sessionDisplay}
                </Navbar>
                {error && <Alert variant="danger">{error}</Alert>}
            </>
        )
}
export default connect(({error, session})=>({error, session}))(AppNav);
