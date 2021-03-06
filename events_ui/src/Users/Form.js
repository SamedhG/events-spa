import { Container, Form, Button } from 'react-bootstrap';
import { useState } from 'react'
import { useHistory } from 'react-router-dom';
import pick from 'lodash/pick';
import { create_user, fetch_users, update_user } from '../api';
import store from '../store'
import { connect } from 'react-redux';

function UserForm({session}) {

    console.log(session)
    let history = useHistory();
    const [user, setUser] = useState({
        name: (session && session.name) || "", 
        pass1: "", 
        pass2: "",
        email: (session && session.email) || "", 
        pass_msg: ""});

    function check_pass(p1, p2) {
        if (p1 !== p2) {
            return "Passwords don't match.";
        }

        if (p1.length < 8) {
            return "Password too short.";
        }

        return "";
    }

    function update(field, ev) {
        let u1 = Object.assign({}, user);
        u1[field] = ev.target.value;
        u1.password = u1.pass1;
        u1.pass_msg = check_pass(u1.pass1, u1.pass2);
        setUser(u1);
    }


    function updatePhoto(ev) {
        let u1 = Object.assign({}, user);
        u1["photo"] = ev.target.files[0];
        u1["photo_url"] = URL.createObjectURL(ev.target.files[0]);
        setUser(u1);
    }

    function submit(ev) {
        ev.preventDefault()
        let data = pick(user, ['name', 'email', 'password', 'photo']);
        let func = session ? () => update_user(data, session.user_id) : () => create_user(data)
        func().then((data) => {
            if (data.errors) {
                let action = {
                    type: 'error/set',
                    data: Object.entries(data.errors).reduce((acc, [key, value]) =>
                        `${acc}\n${key.toUpperCase()}\n${value.join('\n')}`, ""),
                };
                store.dispatch(action);
            } else {
                fetch_users();
                history.goBack();
            }
        });
    }

    return (
        <Container>
            <h2 className="my-4">{session ? "Edit" : "Register" }</h2>
            <Form onSubmit={submit}>
                <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="input" value={user.name} onChange={(ev)=> update("name", ev)} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="input" value={user.email} onChange={(ev)=> update("email", ev)} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>
                        Password &nbsp; 
                        <span style={{color: "red"}}>{user.pass_msg} </span>
                    </Form.Label>
                    <Form.Control type="password" value={user.pass1} onChange={(ev)=> update("pass1", ev)} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Re-Enter Password </Form.Label>
                    <Form.Control type="password" value={user.pass2} onChange={(ev)=> update("pass2", ev)} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Photo</Form.Label>
                    <Form.Control type="file" onChange={updatePhoto} />
                </Form.Group>
                {user.photo_url && 
                <img src={user.photo_url} 
                    style={{maxWidth: 200, maxHeight: 200}} 
                    alt="uploaded"/>}
                <br />
                <br />
                <Button type="submit">{session ? "Save" : "Register" }</Button>
            </Form>
        </Container>
    );
}


export default connect(({session})=>({session}))(UserForm);
