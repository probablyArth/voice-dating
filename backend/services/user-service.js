const userModel = require("../models/user-model");

class UserService {
  async findUser(filter) {
    const user = await userModel.findOne(filter);
    return user;
  }

  async findUserById(id) {
    return await userModel.findById(id);
  }

  async createUser(data) {
    const user = await userModel.create(data);
    return user;
  }

  async deleteUser(id) {
    return await userModel.deleteOne({ _id: id });
  }
}

module.exports = new UserService();
