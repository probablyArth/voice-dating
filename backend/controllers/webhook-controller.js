const roomService = require("../services/room-service");

class WebHookController {
  async webhook(req, res) {
    try {
      const payload = req.body;
      if (payload.type === "peer.join.success") {
        await roomService.joinRoom(payload.data.room_id);
      }

      if (payload.type === "peer.leave.success") {
        await roomService.leaveRoom(
          payload.data.room_name,
          payload.data.user_id
        );
      }
      res.json({ message: "Webhook recieved" });
    } catch (e) {
      console.log(e);
      res.json({ message: "Something went wrong" });
    }
  }
}

module.exports = new WebHookController();
