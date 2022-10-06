import HttpService from "./HttpService";

const uri = 'working-sheets'
export default class WorkSheetService {
    async getAll() {
        return HttpService.prototype.getAll(uri)
    }
    
    async getOne(id) {
        return HttpService.prototype.getOne(uri,id)
    }

    async start(payload) {
        let customUri=`${uri}/start`
        return HttpService.prototype.create(customUri, payload)
    }

    async pause(id, payload) {
        let customUri=`${uri}/${id}/pause`
        return HttpService.prototype.update2(customUri, payload)
    }


    async restart(id, payload) {
        let customUri=`${uri}/${id}/restart`
        return HttpService.prototype.update2(customUri, payload)
    }
    async stop(id, payload) {
        let customUri=`${uri}/${id}/stop`
        return HttpService.prototype.update2(customUri, payload)
    }

    async delete(id) {
        return HttpService.prototype.delete(uri, id)
    }
}