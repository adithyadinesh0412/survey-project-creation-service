/**
 * name : projects.js
 * author : Priyanka Pradeep
 * created-date : 24-May-2024
 * Description : Project Controller.
 */

// Dependencies
const projectService = require('@services/projects')

module.exports = class Projects {
	/**
	 * get project details
	 * @method
	 * @name details
	 * @param {Object} req - request data.
	 * @returns {JSON} - project details
	 */

	async details(req) {
		try {
			const project = await projectService.details(
				req.params.id,
				req.decodedToken.organization_id,
				req.decodedToken.id
			)
			return project
		} catch (error) {
			return error
		}
	}
	/**
	 * List reviewers based on Org Id
	 * @method
	 * @name reviwerList
	 * @returns {JSON} - permissions creation object.
	 */

	async reviewerList(req) {
		try {
			const reviwerList = await projectService.reviewerList(
				req.decodedToken.organization_id,
				req.pageNo,
				req.pageSize
			)
			return reviwerList
		} catch (error) {
			return error
		}
	}
}