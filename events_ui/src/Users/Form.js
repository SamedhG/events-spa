import { Container, Form, Button } from 'react-bootstrap';
import { useState } from 'react'
import { useHistory } from 'react-router-dom';
import pick from 'lodash/pick';
import { create_user, fetch_users } from '../api';

export default function UserForm({id}) {
    let history = useHistory();
    const [user, setUser] = useState({
        name: "", 
        pass1: "", 
        pass2: "",
        email: "",
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
        create_user(data).then(() => {
            fetch_users();
            history.push("/users");
        });
    }

    return (
        <Container>
            <h2 className="my-4">Register</h2>
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
                <Button type="submit"> Register </Button>
            </Form>
        </Container>
    );
}
