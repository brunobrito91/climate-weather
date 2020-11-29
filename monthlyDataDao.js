const Dao = require('./dao');

class MonthlyDataDao extends Dao {

    constructor(repository) {
        super();
        this._repository = repository;
    }

    async create(item) {
        return await this._repository.createMonthlyData(item);
    }
}

module.exports = MonthlyDataDao;