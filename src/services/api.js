import { create } from 'axios'

// const base = 'http://localhost:8000/api/'
const base = "https://neoway-api.herokuapp.com/api/"

const api = create({
    baseURL: base,
    headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Request-Headers": 'Content-Type, Authorization'

    }
})

api.defaults.headers.post['Content-Type'] = 'multipart/form-data';

const validate = (data) =>
{
    return api.post('/validate', data)
}

const save = (data) =>
{
    return api.post("/", data)
}

const deleteById = (id) =>
{
    return api.delete(`/${id}`)
}

const updateById = (id, data) =>
{
    return api.put(`/${id}`, data)
}

const getById = id =>
{
    return api.get(`/${id}`)
}

const listAll = (status, date) =>
{
    let params = '';
    if (status && date) params += `status=${status}&date=${date}`
    else if (!status && date) params += `date=${date}`
    else if (status) params += `status=${status}`

    return api.get(`/list/all?${params}`)
}

const addToBlockList = (data) =>
{
    return api.post("/blocklist", data)
}

const removeFromBlockList = (id) =>
{
    return api.delete(`/blocklist/${id}`)
}

const getBlocklist = (status, date) =>
{
    let params = '';
    if (status && date) params += `status=${status}&date=${date}`
    else if (!status && date) params += `date=${date}`
    else if (status) params += `status=${status}`

    return api.get(`blocklist/list/all?${params}`)
}

export default {
    validate, save, deleteById, updateById, getById, listAll, addToBlockList, removeFromBlockList, getBlocklist
}