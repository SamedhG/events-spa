import {Container, Card, CardColumns} from 'react-bootstrap'
import {connect} from 'react-redux'
import { Link } from 'react-router-dom';

function EventCard({event}) {
    return (
        <Card bg="dark" text="white" >
            <Card.Header> {event.title} </Card.Header>
            <Card.Body>
                <Card.Title></Card.Title>
                
                <Card.Text>

                <p className="text-muted">{(new Date(event.date + " " + event.time)).toLocaleString()} </p>
                <p className="text-muted">Created By {event.owner && event.owner.name}</p>
                <p>   {event.description} </p>
                </Card.Text>
                <Link to={`/events/${event.id}`} className='btn btn-outline-info'>Go</Link>
            </Card.Body>
        </Card>
    );
}



function Home({current_user}) {
    let main = null;
    console.log(current_user)
    if(current_user) main = (
        <>
            <h2 className="my-4">Your Events</h2>
            <CardColumns>
                {current_user.events.map((e, i) => <EventCard event={e} key={i} />) }
            </CardColumns>

            <h2 className="my-4">Your Invites</h2>
            <CardColumns>
                {current_user.invites.map((e, i) => <EventCard event={e} key={i} />) }
            </CardColumns>
        </>

    );
    else main = <h1 className="my-6">Sign Up to start creating events!</h1>

        return(<Container>
            {main}
        </Container>)

}

export default connect(({current_user})=>({current_user}))(Home);
