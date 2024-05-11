const { CustomerStatus } = require("../config/constant");
const SuperDao = require("./superDao");
const models = require('../models');
const { Op } = require("sequelize");


class CustomerDao extends SuperDao {
    constructor() {
        super(models.Customer);
    }


    async findAllBlacklisted() {
        return this.findByWhere(
            { blacklisted: true, }
        );
    }

    async listAllDisabled() {
        return this.findByWhere(
            { status: CustomerStatus.DISABLED, }
        );
    }

    async findByUuid(uuid) {
        return this.findOneByWhere(
            { uuid, status: { [Op.ne]: CustomerStatus.INACTIVE } },
            { exclude: ['id', 'blacklisted'] },
        );
    }

    async listAllCustomers() {
        return this.findByWhere(
            {
                status: { [Op.notIn]: [CustomerStatus.INACTIVE, CustomerStatus.DISABLED] },
                blacklisted: { [Op.or]: [false, null] },
            },
            {
                exclude: ['id', 'blacklisted'],
            }
        );
    }

    async isEmailExists(email) {
        return this.Model.count({
            where: {
                email,
                status: { [Op.ne]: CustomerStatus.INACTIVE }
            },
        }).then((count) => {
            if (count !== 0) {
                return true;
            }
            return false;
        });
    }

    async isPanExists(pan) {
        return this.Model.count({
            where: {
                pan,
                status: { [Op.ne]: CustomerStatus.INACTIVE }
            },
        }).then((count) => {
            if (count !== 0) {
                return true;
            }
            return false;
        })
    }

    async deleteByUuid(uuid) {
        return this.updateWhere({ status: CustomerStatus.INACTIVE }, { uuid });
    }

}

module.exports = CustomerDao;