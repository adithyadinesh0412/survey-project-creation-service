/**
 * name : comment.js
 * author : Priyanka Pradeep
 * created-date : 04-June-2024
 * Description : Controller for comments
 */

const commentService = require('@services/comment')
module.exports = class configs {
	/**
	 * List Comments.
	 * @method
	 * @name list
	 * @returns {JSON} - List of comments as response.
	 */
	async list(req) {
		try {
			const comments = await commentService.list(req.query.resource_id, req.decodedToken.organization_id)
			return comments
		} catch (error) {
			return error
		}
	}

	/**
	 * Create or Update Comment.
	 * @method
	 * @name update
	 * @returns {JSON} - Detail of comments as response.
	 */
	async update(req) {
		try {
			const comment = await commentService.update(
				req.params.id ? req.params.id : '',
				req.query.resource_id,
				req.body,
				req.decodedToken.id
			)
			return comment
		} catch (error) {
			return error
		}
	}
}