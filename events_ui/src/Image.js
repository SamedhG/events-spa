import {BASE_URL} from './api';

export default function Image({id}) {
    // TODO: Take out into config
    const image_path = `${BASE_URL}/users/${id}/photo`
    const style = {
        width: "50px",
        height: "50px",
        objectFit: "cover",
        objectPosition: "center",
    }
    return (<img  
        style={style} 
        className="rounded" 
        src={image_path}
        alt="profile"/>)
}
