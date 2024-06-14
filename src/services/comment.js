const httpStatusCode = require('@generics/http-status')
const commentQueries = require('@database/queries/comment')
const responses = require('@helpers/responses')
const common = require('@constants/common')
const userRequests = require('@requests/user')
const _ = require('lodash')

module.exports = class ProjectsHelper {
	/**
	 *  comment update
	 * @method
	 * @name update
	 * @param {Object} req - request data.
	 * @returns {JSON} - comment id
	 */
	static async update(comment_id = '', resource_id, bodyData, loggedInUserId) {
		try {
			if (bodyData.status === common.STATUS_RESOLVED || !bodyData.resolved_by) {
				bodyData.resolved_by = loggedInUserId
				bodyData.resolved_at = new Date()
				bodyData.status = common.STATUS_RESOLVED
			}

			if (!comment_id) {
				bodyData.user_id = loggedInUserId
				bodyData.resource_id = resource_id
				let commentCreate = await commentQueries.create(bodyData)
				return responses.successResponse({
					statusCode: httpStatusCode.ok,
					message: 'COMMENT_UPDATED_SUCCESSFULLY',
					result: commentCreate,
				})
			}

			const filter = {
				id: comment_id,
				resource_id: resource_id,
			}

			const [updateCount, updatedComment] = await commentQueries.updateOne(filter, bodyData, {
				returning: true,
				raw: true,
			})

			if (updateCount === 0) {
				return responses.failureResponse({
					message: 'COMMENT_NOT_FOUND',
					statusCode: httpStatusCode.bad_request,
					responseCode: 'CLIENT_ERROR',
				})
			}

			return responses.successResponse({
				statusCode: httpStatusCode.ok,
				message: 'COMMENT_UPDATED_SUCCESSFULLY',
				result: updatedComment,
			})
		} catch (error) {
			console.log(error, 'error')
			if (error.name === 'SequelizeDatabaseError' && error.original.code === '22P02') {
				return responses.failureResponse({
					message: 'STATUS_INVALID',
					statusCode: httpStatusCode.bad_request,
					responseCode: 'CLIENT_ERROR',
				})
			} else {
				throw error
			}
		}
	}

	/**
	 *  comment list
	 * @method
	 * @name list
	 * @param {Object} req - request data.
	 * @returns {JSON} - comment list
	 */
	static async list(resource_id, organization_id) {
		try {
			let result = {
				resource_id: resource_id,
				comments: [],
				count: 0,
			}

			const comments = await commentQueries.findAll({
				resource_id: resource_id,
			})

			if (comments.count <= 0) {
				return responses.successResponse({
					statusCode: httpStatusCode.ok,
					message: 'COMMENT_FETCHED',
					result: result,
				})
			}

			//get commenter and resolver details
			const user_ids = _.uniq(
				_.flatMap(comments.rows, (row) =>
					row.resolved_by !== null ? [row.resolved_by, row.user_id] : [row.user_id]
				)
			)

			const users = await userRequests.list(common.ALL_USER_ROLES, '', '', '', organization_id)

			if (users.success && users.data?.result?.length > 0) {
				const user_map = _.keyBy(users.data.result, 'id')
				comments.rows = _.map(comments.rows, (comment) => {
					const commenter = user_map[comment.user_id] ? _.pick(user_map[comment.user_id], ['id', 'name']) : {}
					const resolver = comment.resolved_by
						? user_map[comment.resolved_by]
							? _.pick(user_map[comment.resolved_by], ['id', 'name'])
							: {}
						: {}
					return {
						...comment,
						commenter: commenter,
						resolver: resolver ? resolver : {},
					}
				})
			}

			result.comments = comments.rows
			result.count = comments.count

			return responses.successResponse({
				statusCode: httpStatusCode.ok,
				message: 'COMMENT_UPDATED_SUCCESSFULLY',
				result: result,
			})
		} catch (error) {
			throw error
		}
	}
}