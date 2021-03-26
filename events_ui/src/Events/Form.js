import { Container, Form, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom';
import pick from 'lodash/pick';
import { create_event, fetch_current_user, fetch_event, update_event } from '../api';
import store from '../store'

export default function EventForm() {
    const { id } = useParams()
    let history = useHistory();
    const [event, setEvent] = useState({
        title: "", 
        description: "", 
        date: new Date(),
        time: ""});
    useEffect(() =>{
        if(id) {
            fetch_event(id).then(setEvent)
        }
    }, [id])


    function submit(ev) {
        ev.preventDefault()
        let data = pick(event, ['title', 'description', 'date', 'time']);
        let func = id ? () => update_event(data, id) : () => create_event(data)
        func().then((resp) => {
            if (resp.error) {
                let action = {
                    type: 'error/set',
                    data: resp.error,
                };
                store.dispatch(action);
            } else {
                fetch_current_user();
                history.push("/events/" + resp.data.id);
            }
        });
    }

    return (
        <Container>
            <h2 className="my-4">{ id ? "Edit" : "Create" } Event</h2>
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
                <Button type="submit"> {id ? "Edit" : "Create" } </Button>
            </Form>
        </Container>
    );
}
