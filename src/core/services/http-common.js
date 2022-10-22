import axios from 'axios';

export default axios.create({
    baseURL: 'http://localhost:3000/api/v1',
    //baseURL: 'https://mockend.com/U201726085/TrabajoParcial',
    //baseURL: 'https://my-json-server.typicode.com/U201726085/TrabajoParcial',
    headers: { 'Content-type': 'application/json'}
});
