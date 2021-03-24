import store from './store';
const BASE_URL = "http://localhost:4000/api/v1"

export async function api_get(path) {
    let text = await fetch( BASE_URL + path, {});
    let resp = await text.json();
    return resp.data;
}


async function api_post(path, data) {
    let opts = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
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

export function load_defaults() {
    fetch_users();
    if(store.getState().session) fetch_current_user()
}
