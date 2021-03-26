import {Container, Card, CardColumns} from 'react-bootstrap'
import {connect} from 'react-redux'
import { Link } from 'react-router-dom';

function EventCard({event}) {
    return (
        <Card bg="dark" text="white" >
            <Card.Header className="d-flex justify-content-between"> 
                {event.title} 
                <span className="text-muted">{event.owner && event.owner.name}</span>
            </Card.Header>
            <Card.Body>
                <Card.Title></Card.Title>
                <Card.Subtitle className="text-muted">
                    {(new Date(event.date + " " + event.time)).toLocaleString()} 
                </Card.Subtitle>
                <Card.Text>
                {event.description}
                </Card.Text>
                <Link to={`/events/${event.id}`} className='btn btn-outline-info'>Go</Link>
            </Card.Body>
        </Card>
    );
}



function Home({current_user}) {
    let main = null;
    if(current_user) main = (
        <>
        <Link to="/events/new" className="btn btn-info my-4">
        Create Event
        </Link>
            <h2 className="my-2">Your Events</h2>
            <CardColumns>
                {current_user.events.map((e, i) => <EventCard event={e} key={i} />) }
            </CardColumns>

            <h2 className="my-2">Your Invites</h2>
            <CardColumns>
                {current_user.invites.map((e, i) => <EventCard event={e} key={i} />) }
            </CardColumns>
        </>

    );
    else main = <h1 className="my-4">Register or login to start :)</h1>

        return(<Container>
            {main}
        </Container>)

}

export default connect(({current_user})=>({current_user}))(Home);
