const { default: axios } = require("axios");
const hmsService = require("../services/hms-service");
const roomService = require("../services/room-service");
const RoomService = require("../services/room-service");

class RoomController {
  async getRooms(req, res) {
    try {
      const rooms = await RoomService.getRooms();
      res.json({ rooms });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "failed fetching all rooms" });
    }
  }

  async getUserIdFromRoomId(req, res) {
    try {
      const { roomId } = req.params;
      if (!roomId) {
        res.status(404).json({ message: "roomId not found." });
      }
      const userId = await roomService.getUserIdFromRoomId(roomId);
      res.json({ userId });
    } catch (e) {
      console.log(e);
      res
        .status(500)
        .json({ message: "Something went wrong while searching for room" });
    }
  }

  async createRoom(req, res) {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ message: "Room name cannot be empty." });
      }
      const management_token = hmsService.getManagementToken();
      const hmsRoom = await hmsService.createRoom(name, management_token);
      await hmsService.activateRoom(name, management_token);

      const roomData = {
        name,
        userId: req.user._id,
        hmsRoomId: hmsRoom.data.id,
      };

      const room = await roomService.createRoom(roomData);

      res.status(201).json({ message: "Room created successfully!", room });
    } catch (e) {
      res
        .status(500)
        .json({ message: "Something went wrong while creating a room" });
    }
  }

  async authToken(req, res) {
    try {
      const { hmsRoomId } = req.body;

      if (!hmsRoomId) {
        return res.status(400).json({ message: "Room id cannot be empty." });
      }

      const room = (await roomService.getRoomByRoomId(hmsRoomId)).toJSON();
      if (!room) {
        return res.status(404).json({ message: "Room not found." });
      }
      let role = "user";
      if (room.userId === req.user._id) {
        role = "creator";
      }

      const token = await hmsService.grantAuthToken(
        hmsRoomId,
        req.user._id,
        role
      );

      res.json({ authToken: token });
    } catch (e) {
      console.log(e);
      res
        .status(500)
        .json({ message: "Something went wrong while granting authToken" });
    }
  }

  async getActivePeers(req, res) {
    try {
      const { hmsRoomId } = req.body;
      const room = await roomService.getRoomByRoomId(hmsRoomId);
      if (!room) {
        return res.status(404).json({ message: "Room Not Found." });
      }
      res.json({
        count: room.toJSON().userCount,
      });
    } catch (e) {
      console.log(e);
      res
        .status(500)
        .json({ message: "Something went wrong while fetching peers" });
    }
  }
}
module.exports = new RoomController();
