const SuperDao = require('./superDao');
const models = require('../models');

class TokenDao extends SuperDao {
    constructor() {
        super(models.Token);
    }

    async findOne(where) {
        return this.Model.findOne({ where });
    }

    async remove(where) {
        return this.Model.destroy({ where });
    }
}

module.exports = TokenDao;
