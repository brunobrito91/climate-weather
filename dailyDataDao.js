const Dao = require('./dao');

class DailyDataDao extends Dao {

    constructor(repository) {
        super();
        this._repository = repository;
    }

    async create(item) {
        return await this._repository.createDailyData(item);
    }
}

module.exports = DailyDataDao;