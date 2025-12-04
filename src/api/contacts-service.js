import axios from 'axios';

export default axios.create({
    baseURL: 'http://localhost:5001/contacts',
    headers: {
        'Content-Type': 'application/json',
    },
});
