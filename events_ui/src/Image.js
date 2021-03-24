export default function Image({id}) {
    // TODO: Take out into config
    const image_path = `http://localhost:4000/users/${id}/photo`
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
