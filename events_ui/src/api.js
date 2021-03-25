import store from './store';
const BASE_URL = "http://localhost:4000/api/v1"

export async function api_get(path) {
    let text = await fetch( BASE_URL + path, {});
    let resp = await text.json();
    return resp.data;
}


async function api_post(path, data) {
    let token =  store.getState().session && store.getState().session.token
    let opts = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-auth': token
        },
        body: JSON.stringify(data),
    };
    let text = await fetch(BASE_URL + path, opts);
    return await text.json();
}

export function api_login(email, password) {
    api_post("/session", {email, password}).then((data) => {
        if (data.session) {
            let action = {
                type: 'session/set',
                data: data.session,
            }
            store.dispatch(action);
            fetch_current_user();
        }
        else if (data.error) {
            let action = {
                type: 'error/set',
                data: data.error,
            };
            store.dispatch(action);
        }
    });
}


export function fetch_users() {
    api_get("/users").then((data) => store.dispatch({
        type: 'users/set',
        data: data,
    }));
}


export function fetch_current_user() {
    let id = store.getState().session.user_id
    api_get("/users/" + id).then((data) => store.dispatch({
        type: 'current_user/set',
        data: data,
    }));
}

export function create_user(user) {
    let data = new FormData();
    data.append("user[name]", user.name);
    data.append("user[email]", user.email);
    data.append("user[password]", user.password);
    data.append("user[photo]", user.photo);
    return fetch(BASE_URL + "/users", { method: 'POST', body: data})
}

export function create_event(event) {
    return api_post("/events", {event: event})
}

export function load_defaults() {
    fetch_users();
    if(store.getState().session) fetch_current_user()
}

export function fetch_event(id) {
    return api_get("/events/" + id)
}
