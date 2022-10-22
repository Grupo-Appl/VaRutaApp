import http from '../../core/services/http-common';

export class ShipmentsApiService {
    getAll() {
        return http.get('/Shipments');
    }

    getById(id) {
        return http.get(`/Shipments/${id}`);
    }

    create(data) {
        return http.post('/Shipments', data);
    }

    update(id, data) {
        return http.put(`/Shipments/${id}`, data);
    }

    delete(id) {
        return http.delete(`/Shipments/${id}`);
    }

    findByName(description) {
        return http.get(`/Shipments?description=${description}`);
    }
}

