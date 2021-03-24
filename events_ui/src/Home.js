import {Container, Card, CardColumns} from 'react-bootstrap'
import {connect} from 'react-redux'
function EventCard({event}) {
    return (
        <Card bg="dark" text="white" >
            <Card.Header>{event.date} {event.time}</Card.Header>
            <Card.Body>
                <Card.Title>{event.title}</Card.Title>
                <Card.Subtitle>{event.owner && event.owner.name}</Card.Subtitle>
                <Card.Text>
                    {event.description}
                </Card.Text>
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
