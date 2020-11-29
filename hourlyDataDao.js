const Dao = require('./dao');

class HourlyDataDao extends Dao {

    constructor(repository) {
        super();
        this._repository = repository;
    }

    async create(item) {
        return await this._repository.createHourlyData(item);
    }
}

module.exports = HourlyDataDao;