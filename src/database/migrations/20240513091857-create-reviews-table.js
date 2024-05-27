'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('reviews', {
			id: {
				allowNull: false,
				autoIncrement: true,
				type: Sequelize.INTEGER,
			},
			resource_id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			reviewer_id: {
				allowNull: false,
				type: Sequelize.INTEGER,
			},
			status: {
				type: Sequelize.ENUM(
					'NOT_STARTED',
					'DRAFT',
					'STARTED',
					'INPROGRESS',
					'REQUESTED_FOR_CHANGES',
					'APPROVED',
					'REJECTED',
					'PUBLISHED'
				),
				defaultValue: 'NOT_STARTED',
			},
			organization_id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			created_at: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updated_at: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			deleted_at: {
				type: Sequelize.DATE,
			},
		})
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('reviews')
	},
}