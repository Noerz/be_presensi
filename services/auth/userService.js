const { v4: uuidv4 } = require("uuid");
const db = require("../../config/database");
const initModels = require("../../models/init-models");
const models = initModels(db);

class UserService {
  static async createStaff({ nip, nama, auth_id }) {
    return await models.user.create({
      idUser: uuidv4(),
      nip,
      nama,
      auth_id,
      status: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}

module.exports = UserService;
