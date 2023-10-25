import axios from 'axios'

const baseUrl = '/api/topics'

const getAll = (topicId) => {
    const request = axios.get(`${baseUrl}/${topicId}/messages`)
    return request.then(response => response.data)
}

const add = (newObject, topicId) => {
    const request = axios.post(`${baseUrl}/${topicId}/messages`, newObject)
    return request.then(response => response.data)
}

const edit = (newObject, topicId, messageId) => {
    const request = axios.put(`${baseUrl}/${topicId}/messages/${messageId}`, newObject)
    return request.then(response => response.data)
}

const getCount = (topicId) => {
    const request = axios.get(`${baseUrl}/${topicId}/count`)
    return request.then(response => response.data)
}

const newUpvote = (newObject) => {
    const request = axios.post(`/api/upvotes`, newObject)
    return request.then(response => response.data)
}

export default { getAll, add, edit, getCount, newUpvote }