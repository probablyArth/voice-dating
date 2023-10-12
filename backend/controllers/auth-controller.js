const UserDto = require("../dtos/user-dto");
const hashService = require("../services/hash-service");
const otpService = require("../services/otp-service");
const tokenService = require("../services/token-service");
const userService = require("../services/user-service");

class AuthController {
  async sendOtp(req, res) {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ message: "Phone field Required" });
    }

    const otp = await otpService.generateOtp();

    const ttl = 1000 * 60 * 2; //2min
    const expires = Date.now() + ttl;
    const data = `${phone}.${otp}.${expires}`;

    const hash = hashService.hashOtp(data);

    try {
      await otpService.sendBySms(phone, otp);
      res.json({
        hash: `${hash}.${expires}`,
        phone,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "sending failed" });
    }
  }

  async verifyOtp(req, res) {
    const { otp, hash, phone } = req.body;
    if (!otp || !hash || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const [hashedOtp, expires] = hash.split(".");
    if (Date.now() > +expires) {
      return res.status(400).json({ message: "OTP Expired" });
    }

    const data = `${phone}.${otp}.${expires}`;
    const isValid = otpService.verifyOtp(hashedOtp, data);
    if (!isValid) {
      return res.status(400).json({ message: "invalid OTP" });
    }

    let user;
    try {
      user = await userService.findUser({ phone });
      if (!user) {
        user = await userService.createUser({ phone });
      }
    } catch (err) {
      console.log(err);
      return res.status(400).json({ message: "db error" });
    }

    //token

    const { accessToken, refreshToken } = tokenService.generateTokens({
      _id: user._id,
      activated: false,
    });

    await tokenService.storeRefreshToken(refreshToken, user._id);

    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
    });

    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
    });

    const userDto = new UserDto(user);
    return res.json({ user: userDto, auth: true });
  }
  async refresh(req, res) {
    const { refreshToken: refreshTokenFromCookie } = req.cookies;
    let userData;
    try {
      userData = await tokenService.verifyRefreshToken(refreshTokenFromCookie);
    } catch (err) {
      return res.status(401).json({ message: "Invalid Refresh Token" });
    }

    try {
      const token = await tokenService.findRefreshToken(
        userData._id,
        refreshTokenFromCookie
      );
      if (!token) {
        return res.status(401).json({ message: "Invalid Refresh Token" });
      }
    } catch (err) {
      return res.status(500).json({ message: "Internal Error" });
    }

    const user = await userService.findUser({ _id: userData._id });
    if (!user) {
      return res.status(404).json({ message: "Invalid Refresh Token" });
    }

    const { refreshToken, accessToken } = tokenService.generateTokens({
      _id: userData._id,
    });

    try {
      await tokenService.updateRefreshToken(userData._id, refreshToken);
    } catch (err) {
      return res.status(500).json({ message: "Internal Error" });
    }
    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
    });

    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
    });

    const userDto = new UserDto(user);
    return res.json({ user: userDto, auth: true });
  }

  async logout(req, res) {
    const { refreshToken } = req.cookies;
    tokenService.removeToken(refreshToken);

    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");

    res.send({ user: null, auth: false });
  }
}

module.exports = new AuthController();
