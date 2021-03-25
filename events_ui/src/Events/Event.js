import { useState, useEffect } from 'react';
import { Container, Jumbotron, Table, ListGroup, Form, Row, Col, Button, ToggleButtonGroup, ToggleButton } from 'react-bootstrap'
import Image from '../Image'
import { fetch_event, create_comment, delete_comment, create_invite, update_invite } from '../api'
import { connect } from 'react-redux';

function CommentForm({event_id, update}) {
    const [comment, setComment] = useState({event_id: event_id, body: ""});

    function submit(ev) {
        ev.preventDefault()
        create_comment(comment).then((resp) => {
            update()
            setComment({...comment, body: ""})
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

function InviteForm({event_id, update}) {
    const [invite, setInvite] = useState({event_id: event_id, email: ""});

    function submit(ev) {
        ev.preventDefault()
        create_invite(invite).then((resp) => {
            update()
            setInvite({...invite, email: ""})
        });
    }

    return (
        <Form onSubmit={submit} className="my-4">
            <Row><Col sm={9}>
            <Form.Control 
                value={invite.email} 
                placeholder="Email"
                onChange={(ev)=> setInvite({...invite, email: ev.target.value})} />
            </Col><Col sm={3}>
                <Button type="submit"> Invite </Button>
            </Col></Row>
        </Form>
    );
}

function InviteResponse({event_id, update, response}) {
    const [resp, setResp] = useState(response);
    function respond(response) {
        update_invite({event_id: event_id, response: response})
        update()
        setResp(response)
    }
    return(<>
        <h4>You Have Been Invited!</h4>
        Are You Going?
        <ToggleButtonGroup 
            value={resp} 
            name="response" 
            onChange={respond}
            className="mx-2">
            <ToggleButton variant="secondary" value="yes">Yes</ToggleButton>
            <ToggleButton variant="secondary" value="maybe">Maybe</ToggleButton>
            <ToggleButton variant="secondary" value="no">No</ToggleButton>
        </ToggleButtonGroup>
    </>)
}

function Event(props) {
    const [event, setEvent] = useState({title: "", 
        description: "", invites: [], comments: [], owner: {id: 1}})

    let id = props.id || props.match.params.id
    useEffect(() => {
        fetch_event(id).then((ev) => setEvent(ev))
    },[id])

    function update() {
        fetch_event(id).then((ev) => setEvent(ev))
    }

    function del(comment_id) {
        delete_comment(comment_id).then(() => 
            fetch_event(id).then((ev) => setEvent(ev)))
    }
    const scores = event.invites.reduce((acc, i) => {
        acc[i.response] = acc[i.response] + 1
        return acc
    }, {yes: 0, no: 0, maybe: 0})
    // Roles
    const logged_in = props.session != null
    const owner = logged_in && props.session.user_id === event.owner.id
    const invitee = logged_in && 
        event.invites.reduce((acc, i) => acc || i.email === props.session.email, false)
    return(
        <Container>

            <Jumbotron>
                <h2>{event.title}</h2>
                <p><Image id={event.owner.id} /> {event.owner.name} </p>
                <p><strong>Description: </strong>{event.description}</p>
                <p><strong>When: </strong>{event.date}, {event.time}</p>
                {owner && <InviteForm event_id={id} update={update} /> }
                {invitee && <InviteResponse 
                    event_id={id} 
                    update={update} 
                    response={event.invites.find(inv => inv.email === props.session.email).response}/> }
            </Jumbotron>

            <Row>
                <Col sm={4}>
                    <h2>Responses</h2>
                </Col> <Col sm={8}>
                    <ListGroup horizontal>
                        <ListGroup.Item>
                            Yes: {scores.yes}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            Maybe: {scores.maybe}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            No: {scores.no}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
            </Row>
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
            {(owner || invitee) && <CommentForm event_id={id} update={update}/> }
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
