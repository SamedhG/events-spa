import { useState, useEffect } from 'react';
import { Container, Jumbotron, Table, ListGroup } from 'react-bootstrap'
import Image from '../Image'
import { fetch_event } from '../api'

export default function Event(props) {
    const [event, setEvent] = useState({title: "", description: "", invites: [], comments: [], owner: {id: 1}})
    let id = props.id || props.match.params.id
    useEffect(() => {
        fetch_event(id).then((ev) => setEvent(ev))
    }, [id])
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
            <ListGroup>
                {event.comments.map((comment, i) => (
                    <ListGroup.Item key={i}>
                        <Image id={comment.user.id}/> 
                        <strong className="mx-2">{comment.user.name}</strong>
                        {comment.body}
                    </ListGroup.Item>

                ))}
            </ListGroup>

        </Container>)
}
