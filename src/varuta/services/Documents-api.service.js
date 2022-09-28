import http from '../../core/services/http-common';

export class DocumentsApiService {
    getAll() {
        return http.get('/Documents');
    }

    getById(id) {
        return http.get(`/Documents/${id}`);
    }

    create(data) {
        return http.post('/Documents', data);
    }

    update(id, data) {
        return http.put(`/Documents/${id}`, data);
    }

    delete(id) {
        return http.delete(`/Documents/${id}`);
    }

    findByName(name) {
        return http.get(`/Documents?name=${name}`);
    }
}
