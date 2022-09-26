const apiHost = 'https://stormy-tundra-82595.herokuapp.com/api/v1'
export default class HttpService {

    async getAll(uri) {
        return await httpService(`${apiHost}/${uri}`, {
            method: 'GET',
        }).then(res => res.json())
            .then(d => d.data);
    }

    async getOne(uri, id) {
        return await httpService(`${apiHost}/${uri}/${id}`, {
            method: 'GET',
        }).then(res => res.json())
            .then(d => d.data);
    }

    async create(uri, payload) {
        return await httpService(`${apiHost}/${uri}`, {
            headers:{
                'Content-Type':'application/json',
            },
            method: 'POST',
            body: JSON.stringify(payload),
        }).then(res => res.json())
            .then(d => d);
    }

    async update(uri, id, payload) {
        return await httpService(`${apiHost}/${uri}/${id}`, {
            headers:{
                'Content-Type':'application/json',
            },
            method: 'PUT',
            body: JSON.stringify(payload),
        }).then(res => res.json())
            .then(d => d);
    }

    async delete(uri, id) {
        return await httpService(`${apiHost}/${uri}/${id}`, {
            method: 'DELETE',
        }).then(res => res.json())
            .then(d => d);
    }

    async uploadFile(uri, formdata) {
        return await httpService(`${apiHost}/${uri}`, {
            method: 'POST',
            body: formdata,
            headers:{
                ContentType:'multipart/form-data',
            }
        }).then(res => res.json())
            .then(d => d);
    }
}

function httpService(url, options) {
    return fetch(url, updateOptions(options));
}

function updateOptions(options) {
    const update = {...options};
    update.headers = {
        ...update.headers,
        'Accept': 'application/json',
        'Authorization': localStorage.getItem('token')?`Bearer ${localStorage.getItem('token')}`:null,
    };
    return update
}
