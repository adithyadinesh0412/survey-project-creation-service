const orgExtensions = require('../models/index').organizationExtensions

module.exports = class organizationExtensions {
	static async findMany(filter, attributes = []) {
		try {
			return await orgExtensions.findAll({
				where: filter,
				attributes,
				raw: true,
			})
		} catch (error) {
			throw error
		}
	}
}
