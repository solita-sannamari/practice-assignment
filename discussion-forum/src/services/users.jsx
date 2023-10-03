import axios from "axios";

const baseUrl = '/api/users'

const getById = (id) => {
    const request = axios.get(`${baseUrl}/id/${id}`)
    return request.then(response => response.data)
}

const getByUsername = (username) => {
    const request = axios.get(`${baseUrl}/username/${username}`)
    return request.then(response => response.data)
}

export default { getById, getByUsername }