const Dao = require('./dao');

class StationDao extends Dao{

    constructor(repository){
        super();
        this._repository = repository;
    }

    create(item) {
        return this._repository.createStation(item);
    }
}
module.exports = StationDao;