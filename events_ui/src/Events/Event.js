import { useState, useEffect } from 'react';
import { Container, Jumbotron, Table, ListGroup, Form, Row, Col, Button } from 'react-bootstrap'
import Image from '../Image'
import { fetch_event, create_comment, delete_comment } from '../api'
import { connect } from 'react-redux';

function CommentForm({event_id, setEvent}) {
    const [comment, setComment] = useState({event_id: event_id, body: ""});

    function submit(ev) {
        ev.preventDefault()
        create_comment(comment).then((resp) => {
            fetch_event(event_id).then((ev) => setEvent(ev))
        });
    }

    return (
        <Form onSubmit={submit} className="my-4">
            <Row><Col sm={9}>
            <Form.Control 
                value={comment.body} 
                onChange={(ev)=> setComment({...comment, body: ev.target.value})} />
                </Col><Col sm={3}>
            <Button type="submit"> Comment </Button>
            </Col></Row>
        </Form>
    );
}

function Event(props) {
    const [event, setEvent] = useState({title: "", description: "", invites: [], comments: [], owner: {id: 1}})
    let id = props.id || props.match.params.id
    useEffect(() => {
        fetch_event(id).then((ev) => setEvent(ev))
    },[id])

    function del(comment_id) {
        delete_comment(comment_id).then(() => 
            fetch_event(id).then((ev) => setEvent(ev)))
    }
    // Roles
    const logged_in = props.session != null
    const owner = logged_in && props.session.user_id === event.owner.id
    const invitee = logged_in && event.invites.reduce((acc, i) => acc || i.email === props.session.email, false)
    return(
        <Container>

            <Jumbotron>
                <h2>{event.title}</h2>
                <p><Image id={event.owner.id} /> {event.owner.name} </p>
                <p><strong>Description: </strong>{event.description}</p>
                <p><strong>When: </strong>{event.date}, {event.time}</p>
            </Jumbotron>

            <h2>Responses</h2>
            <Table>
                <thead><tr>
                    <th width="70%">Email</th>
                    <th>Response</th>
                </tr></thead>
                <tbody>
                    {event.invites.map((invite, i) =>(
                        <tr key={i}> 
                            <td>{invite.email}</td>
                            <td>{invite.response}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <h2>Comments</h2>
            {(owner || invitee) && <CommentForm event_id={id} setEvent={setEvent} /> }
            <ListGroup>
                {event.comments.map((comment, i) => (
                    <ListGroup.Item key={i} className="d-flex justify-content-between">
                        <span>
                            <Image id={comment.user.id}/> 
                            <strong className="mx-2">{comment.user.name}</strong>
                            {comment.body}
                        </span>
                        {logged_in && (owner || props.session.user_id === comment.user.id) && 
                        <Button onClick={() => del(comment.id) }>X</Button>}
                    </ListGroup.Item>

                ))}
            </ListGroup>

        </Container>)
}


export default connect(({session})=>({session}))(Event);
