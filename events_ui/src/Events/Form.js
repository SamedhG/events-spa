import { Container, Form, Button } from 'react-bootstrap';
import { useState } from 'react'
import { useHistory } from 'react-router-dom';
import pick from 'lodash/pick';
import { create_event, fetch_current_user } from '../api';

export default function EventForm({id}) {
    let history = useHistory();
    const [event, setEvent] = useState({
        title: "", 
        description: "", 
        date: new Date(),
        time: ""});

    function submit(ev) {
        ev.preventDefault()
        let data = pick(event, ['title', 'description', 'date', 'time']);
        create_event(data).then((resp) => {
            fetch_current_user();
            history.push("/events/" + resp.data.id);
        });
    }

    return (
        <Container>
            <h2 className="my-4">Create Event</h2>
            <Form onSubmit={submit}>
                <Form.Group>
                    <Form.Label>Title</Form.Label>
                    <Form.Control type="input" value={event.title} onChange={(ev)=> setEvent({...event, title: ev.target.value})} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Description</Form.Label>
                    <Form.Control type="textarea" value={event.description} onChange={(ev)=> setEvent({...event, description: ev.target.value})} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Date</Form.Label>
                    <Form.Control type="date" value={event.date} onChange={(ev)=> setEvent({...event, date: ev.target.value})} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Time</Form.Label>
                    <Form.Control type="time" value={event.time} onChange={(ev)=> setEvent({...event, time: ev.target.value})} />
                </Form.Group>
                <Button type="submit"> Create </Button>
            </Form>
        </Container>
    );
}
