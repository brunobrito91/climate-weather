const NotImplementedException = require('./not-implemented-exception');

class Dao {
    constructor(repository){

    }
    create(item) {
        throw new NotImplementedException();
    }
}

module.exports = Dao;
