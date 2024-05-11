const SuperDao = require('./superDao');
const models = require('../models');
const { UserStatus } = require('../config/constant');

class UserDao extends SuperDao {
    constructor() {
        super(models.User);
    }

    async findByEmail(email) {
        return this.Model.findOne({
            where: { email, status: UserStatus.ENABLED, email_verified: true },
        });
    }

    async isEmailExists(email) {
        return this.Model.count({
            where: { email, status: UserStatus.ENABLED, email_verified: true },
        }).then((count) => {
            if (count !== 0) {
                return true;
            }
            return false;
        });
    }

    async findByUuid(uuid) {
        return this.Model.findOne({ where: { uuid } });
    }

    async createWithTransaction(user, transaction) {
        return this.Model.create(user, { transaction });
    }

    async deleteByUuid(uuid) {
        return this.deleteByWhere({ uuid });
    }

}

module.exports = UserDao;
