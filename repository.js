const NotImplementedException = require('./not-implemented-exception');

class Repository{

    createStation(station){
        throw new NotImplementedException();
    }

    createMonthlyData(monthlyData){
        throw new NotImplementedException();
    }
}
module.exports = Repository;