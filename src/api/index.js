import axios from 'axios'

const API = axios.create({ baseURL: 'http://localhost:5001'})

API.interceptors.request.use((req) => {
    if(localStorage.getItem('jwt-token')) {
        req.headers.authorization = `Bearer ${JSON.parse(localStorage.getItem('jwt-token')).token}`
    }
    return req
})

export const fetchData = (users) => API.post('/users', users)