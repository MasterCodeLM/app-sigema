const apiHost = 'https://stormy-tundra-82595.herokuapp.com/api/v1'
export default class HttpService {

    async getAll(uri) {
        return await httpService(`${apiHost}/${uri}`, {
            method: 'GET',
            ContentType: 'application/json',
        }).then(res => res.json())
            .then(d => d.data);
    }
    async getOne(uri, id) {
        return await httpService(`${apiHost}/${uri}/${id}`, {
            method: 'GET',
            ContentType: 'application/json',
        }).then(res => res.json())
            .then(d => d.data);
    }

    async create(uri, payload) {
        return await httpService(`${apiHost}/${uri}`, {
            method: 'POST',
            body: JSON.stringify(payload),
            ContentType: 'application/json',
        }).then(res => res.json())
            .then(d => d);
    }

    async update(uri, id, payload) {
        return await httpService(`${apiHost}/${uri}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
            ContentType: 'application/json',
        }).then(res => res.json())
            .then(d => d);
    }

    async delete(uri, id) {
        return await httpService(`${apiHost}/${uri}/${id}`, {
            method: 'DELETE',
            ContentType: 'application/json',
        }).then(res => res.json())
            .then(d => d);
    }
    async uploadFile(uri, formdata) {
        return await httpService(`${apiHost}/${uri}`, {
            method: 'POST',
            body: formdata,
            ContentType: 'multipart/form-data'
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
        // 'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')?`Bearer ${localStorage.getItem('token')}`:null
    };
    if (localStorage.jwt) {
        update.headers = {
            ...update.headers,
            'Authorization': `Bearer ${localStorage.jwt}`,
        };
    }
    return update
}
