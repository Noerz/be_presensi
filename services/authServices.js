const db = require("../config/database");
const initModels = require("../models/init-models");
const models = initModels(db);


class AuthServices {
  static async validateRole(roleCode) {
    return models.role.findOne({ where: { code: roleCode } });
  }

  static async findAuthByEmailOrNisn(email, nisn) {
    if (email) return models.auth.findOne({ where: { email } });
    if (nisn) return models.auth.findOne({ where: { nisn } });
    return null;
  }

  static async findUserByAuthId(authId) {
    return models.user.findOne({ where: { auth_id: authId } });
  }

  static async createAuthEntry(data) {
    return models.auth.create(data);
  }

  static async createUserEntry(data) {
    return models.user.create(data);
  }

  static async updateUserPassword(email, hashedPassword) {
    return models.user.update({ password: hashedPassword }, { where: { email } });
  }
}

module.exports = AuthServices;
