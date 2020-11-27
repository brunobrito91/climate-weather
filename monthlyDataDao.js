const Dao = require('./dao');

class MonthlyDataDao extends Dao{

    constructor(repository){
        super();
        this._repository = repository;
    }

    create(item) {
        return this._repository.createMonthlyData(item);
    }
}
module.exports = MonthlyDataDao;