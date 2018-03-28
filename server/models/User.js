const db = require("./")

module.exports = (sequelize, DataTypes) => {

  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });


  // in order to define an instance method, we have to access the User
  // model prototype. This can be found in the sequelize documentation
  // here: http://docs.sequelizejs.com/manual/tutorial/models-definition.html#expansion-of-models
  User.prototype.authorize = async function() {

    const { AuthToken } = sequelize.models

    const { token } = await AuthToken.generate(this.id)

    this.dataValues.token = token
  }

  return User;
};
