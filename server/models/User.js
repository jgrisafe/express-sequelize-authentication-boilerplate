const db = require('./');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  // set up the associations so we can make queries that include
  // the related objects
  User.associate = function ({ AuthToken }) {
    User.hasMany(AuthToken);
  };

  // in order to define an instance method, we have to access the User
  // model prototype. This can be found in the sequelize documentation
  // here: http://docs.sequelizejs.com/manual/tutorial/models-definition.html#expansion-of-models
  User.prototype.authorize = async function () {
    const { AuthToken } = sequelize.models;

    const { token } = await AuthToken.generate(this.id);

    this.dataValues.token = token;
  };

  User.authenticate = async function(username, password) {

    const user = await User.findOne({ where: { username } });

    if (bcrypt.compareSync(password, user.password)) {
      return user;
    }

    return null;
  }

  User.prototype.logout = async function () {
    let user = this;

    const { AuthToken } = sequelize.models;

    // if for some reason the developer forgot to include the AuthTokens with
    // the user during the query, we can make sure they are retrieved before
    // logging the user out
    if (!user.AuthTokens) {
      user = await User.findById(user.id, { include: AuthToken });
    }

    const authTokenIds = user.AuthTokens.map(token => token.id);

    await AuthToken.destroy({ where: { id: authTokenIds } });
  };

  return User;
};
