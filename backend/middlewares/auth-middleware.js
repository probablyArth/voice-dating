const tokenService = require("../services/token-service");

module.exports = async function (req, res, next) {
  try {
    const { accessToken } = req.cookies;
    if (!accessToken) {
      throw new Error(
        JSON.stringify({ status: 404, error: "token not found" })
      );
    }
    const userData = await tokenService
      .verifyAccessToken(accessToken)
      .catch(() => {
        throw new Error(
          JSON.stringify({ status: 401, error: "invalid access token" })
        );
      });
    if (!userData) {
      throw new Error(
        JSON.stringify({ status: 401, error: "invalid access token" })
      );
    }
    req.user = userData;
    next();
  } catch (err) {
    const parsedError = JSON.parse(err.message);
    res
      .status(parsedError.status)
      .json({ cause: "accessToken", message: parsedError.error });
  }
};
