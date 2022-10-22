import http from '../../core/services/http-common';

export class StatusApiService {
    getById(id) {
        return http.get(`/Senders/${id}`);
    }
}
