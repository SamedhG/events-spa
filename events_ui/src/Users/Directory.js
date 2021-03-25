import {ListGroup, Container} from 'react-bootstrap';
import {connect} from 'react-redux';
import {FaClipboardList} from "react-icons/fa";
import Image from "../Image"

function Directory({users}) {
    return ( <Container>
        <h2 className="my-4"><FaClipboardList /> Users</h2>
        <ListGroup>
            { users.map((u, i) => (<ListGroup.Item key={i}>
                <Image id={u.id} /> &nbsp;
                <span>{u.name} ({u.email})</span>
                </ListGroup.Item>))}
        </ListGroup>
    </Container>
    )
}

export default connect(({users})=>({users}))(Directory);
