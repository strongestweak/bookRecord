"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Location extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Location.belongsTo(Location, { as: "Parent", foreignKey: "ParentId" });
    }
  }
  Location.init(
    {
      name: DataTypes.STRING,
      ParentId: DataTypes.INTEGER,
      isPath: DataTypes.BOOLEAN,
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Location",
      paranoid: true,
      scopes: {
        withParent: {
          include: { all: true, nested: true },
        },
      },
    }
  );

  Location.createIfNotExist = async function (data) {
    try {
      const existing = await this.findOne({
        where: data,
      });
      console.log(data, { existing });
      if (!existing) {
        const obj = await this.create(data);
        return await this.findByPk(obj.id);
      } else {
        return existing;
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  };
  return Location;
};
