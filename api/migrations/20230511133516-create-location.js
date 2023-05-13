"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable(
        "Locations",
        {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          name: {
            type: Sequelize.STRING,
          },
          ParentId: {
            type: Sequelize.INTEGER,
            references: {
              model: "Locations",
              key: "id",
            },
          },
          isPath: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
          },
          deletedAt: {
            allowNull: true,
            type: Sequelize.DATE,
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
        },
        { transaction }
      );
      await queryInterface.addIndex("Locations", ["name", "isPath"], {
        unique: true,
        name: "unique_name",
        where: {
          deletedAt: null,
          ParentId: null,
        },
        transaction,
      });
      await queryInterface.addIndex(
        "Locations",
        ["name", "ParentId", "isPath"],
        {
          unique: true,
          name: "unique_name_parent",
          where: {
            deletedAt: null,
          },
          transaction,
        }
      );
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable("Locations", { transaction });
      await queryInterface.removeIndex("Locations", "unique_name", {
        transaction,
      });
      await queryInterface.removeIndex("Locations", "unique_name_parent", {
        transaction,
      });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
