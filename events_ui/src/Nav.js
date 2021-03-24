import {Navbar, Form, Button, Nav, Alert} from 'react-bootstrap'
import { NavLink } from 'react-router-dom';
import { FaHome, FaUsers } from "react-icons/fa"
import { connect } from 'react-redux';
import {useState} from 'react'

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
        </Form>
    );
}

function ToolBar({session}) {
    // TODO: Take out into config
    console.log(session)
    const image_path = `http://localhost:4000/users/${session.user_id}/photo`

    function logout(ev) {
        ev.preventDefault();
        store.dispatch({ type: 'session/clear' });
    }
    return (
        <>
            <img src={image_path} 
                alt="profile" 
                style={{maxHeight: "50px"}} 
                className="rounded" />
            <span class="mx-1 text-white"> {session.name} </span>
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
