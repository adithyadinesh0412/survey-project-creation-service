module.exports = (sequelize, DataTypes) => {
	const Comment = sequelize.define(
		'Comment',
		{
			id: {
				allowNull: false,
				autoIncrement: true,
				type: DataTypes.INTEGER,
			},
			resource_id: {
				allowNull: false,
				primaryKey: true,
				type: DataTypes.INTEGER,
			},
			comment: {
				allowNull: false,
				type: DataTypes.STRING,
			},
			user_id: {
				allowNull: false,
				type: DataTypes.INTEGER,
			},
			parent_id: {
				allowNull: false,
				defaultValue: 0,
				type: DataTypes.INTEGER,
			},
			status: {
				allowNull: false,
				type: DataTypes.ENUM('OPEN', 'RESOLVED'),
				defaultValue: 'OPEN',
			},
			resolved_by: {
				type: DataTypes.INTEGER,
			},
			resolved_at: {
				type: DataTypes.DATE,
			},
			context: {
				allowNull: false,
				defaultValue: 'page',
				type: DataTypes.STRING,
			},
			page: {
				allowNull: false,
				type: DataTypes.INTEGER,
			},
			is_read: {
				allowNull: false,
				defaultValue: false,
				type: DataTypes.BOOLEAN,
			},
		},
		{
			modelName: 'Comment',
			tableName: 'comments',
			freezeTableName: true,
			paranoid: false,
		}
	)

	return Comment
}