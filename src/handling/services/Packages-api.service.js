import http from '../../core/services/http-common';

export class PackagesApiService {
    getAll() {
        return http.get('/Packages');
    }

    getById(id) {
        return http.get(`/Packages/${id}`);
    }

    create(data) {
        return http.post('/Packages', data);
    }

    update(id, data) {
        return http.put(`/Packages/${id}`, data);
    }

    delete(id) {
        return http.delete(`/Packages/${id}`);
    }

    findByName(name) {
        return http.get(`/Packages?name=${name}`);
    }
}
