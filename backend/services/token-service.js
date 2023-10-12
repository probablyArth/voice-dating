const jwt = require("jsonwebtoken");
const refreshModel = require("../models/refresh-model");

const accessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.JWT_REFRESH_TOKEN_SECRET;

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, accessTokenSecret, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign(payload, refreshTokenSecret, {
      expiresIn: "1y",
    });
    return { accessToken, refreshToken };
  }

  async storeRefreshToken(token, userId) {
    try {
      await this.deleteRefreshToken(userId);
      await refreshModel.create({
        token,
        userId,
      });
    } catch (err) {
      console.log(err.message);
    }
  }

  async deleteRefreshToken(userId) {
    return await refreshModel.deleteOne({ userId });
  }

  async verifyAccessToken(token) {
    return jwt.verify(token, accessTokenSecret);
  }
  async verifyRefreshToken(refreshToken) {
    return jwt.verify(refreshToken, refreshTokenSecret);
  }

  async findRefreshToken(userId, token) {
    return await refreshModel.findOne({ userId, token });
  }
  async updateRefreshToken(userId, refreshToken) {
    return await refreshModel.updateOne(
      { userId: userId },
      { token: refreshToken }
    );
  }

  async removeToken(refreshToken){
    return await refreshModel.deleteOne({token: refreshToken});
  }
}

module.exports = new TokenService();
