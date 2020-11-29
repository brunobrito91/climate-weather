const Dao = require('./dao');

class StationDao extends Dao {

    constructor(repository) {
        super();
        this._repository = repository;
    }

    async create(item) {
        return await this._repository.createStation(item);
    }
}

module.exports = StationDao;