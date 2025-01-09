const { v4: uuidv4 } = require("uuid");
const db = require("../config/database");
const initModels = require("../models/init-models");
const models = initModels(db);

class UserService {
  static async createStaff({ nama, auth_id, gender }) {
    return await models.staff.create({
      idStaff: uuidv4(),
      nama,
      auth_id,
      gender,
      status: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static async createMurid({ nama, auth_id }) {
    return await models.murid.create({
      idMurid: uuidv4(),
      nama,
      auth_id,
      status: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}

module.exports = UserService;
