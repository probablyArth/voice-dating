const Jwt = require("jsonwebtoken");
const uuid4 = require("uuid4");
const axios = require("axios").default;
const app_access_key = process.env.HMS_ACCESS_KEY;
const app_secret = process.env.HMS_APP_SECRET;

class HMSService {
  getManagementToken() {
    const token = Jwt.sign(
      {
        access_key: app_access_key,
        type: "management",
        version: 2,
        iat: Math.floor(Date.now() / 1000),
        nbf: Math.floor(Date.now() / 1000),
      },
      app_secret,
      {
        algorithm: "HS256",
        expiresIn: "24h",
        jwtid: uuid4(),
      }
    );
    return token;
  }

  async createRoom(name, management_token) {
    const api = "https://prod-in2.100ms.live/api/v2/rooms";
    const headers = {
      "Content-type": "application/json",
      Authorization: "Bearer " + management_token,
    };
    const body = {
      name: name,
      template: process.env.TEMPLATE_NAME,
    };
    const room = await axios.post(api, body, {
      headers: headers,
    });
    return room;
  }

  async disableRoom(name, management_token) {
    const api = "https://prod-in2.100ms.live/api/v2/rooms";
    const headers = {
      "Content-type": "application/json",
      Authorization: "Bearer " + management_token,
    };
    const body = {
      name: name,
      active: false,
    };
    await axios.post(api, body, {
      headers: headers,
    });
  }

  async activateRoom(name, management_token) {
    const api = "https://prod-in2.100ms.live/api/v2/rooms";
    const headers = {
      "Content-type": "application/json",
      Authorization: "Bearer " + management_token,
    };
    const body = {
      name: name,
      active: true,
    };
    await axios.post(api, body, {
      headers: headers,
    });
  }

  async grantAuthToken(hmsRoomId, id, role) {
    var payload = {
      access_key: app_access_key,
      room_id: hmsRoomId,
      user_id: id,
      role: role,
      type: "app",
      version: 2,
      iat: Math.floor(Date.now() / 1000),
      nbf: Math.floor(Date.now() / 1000),
    };

    const authToken = Jwt.sign(payload, app_secret, {
      algorithm: "HS256",
      expiresIn: "24h",
      jwtid: uuid4(),
    });

    return authToken;
  }
}

module.exports = new HMSService();
