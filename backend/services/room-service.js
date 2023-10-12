const { Client } = require("redis-om");
const roomSchema = require("../models/room-model");
const hmsService = require("./hms-service");

const client = new Client();
if (!client.isOpen()) {
  client.open(process.env.REDIS_URL).then();
}
class RoomService {
  async createRoom(data) {
    const repository = client.fetchRepository(roomSchema);
    const rooms = await this.getRoomsListByRoomId(data.hmsRoomId);

    if (rooms.length >= 1) {
      throw new Error("Room already exists.");
    }
    const room = repository.createEntity({ ...data, userCount: 0 });
    await repository.save(room);
    return room.toJSON();
  }

  async joinRoom(hmsRoomId) {
    const repository = client.fetchRepository(roomSchema);
    const room = await this.getRoomByRoomId(hmsRoomId);
    if (!room) throw new Error("Room not found");
    if (room.userCount === 2) throw new Error("room_full");
    room.userCount += 1;
    await repository.save(room);
    return room.toJSON();
  }

  async leaveRoom(hmsRoomName, userId) {
    const repository = client.fetchRepository(roomSchema);
    const room = await this.getRoomByRoomName(hmsRoomName);
    if (!room) throw new Error("Room not found");
    if (room.userId == userId) {
      const management_token = hmsService.getManagementToken();
      await hmsService.disableRoom(hmsRoomName, management_token);
      this.deleteRoom(room.entityId);
      return;
    }
    room.userCount -= 1;
    await repository.save(room);
  }

  async getUserIdFromRoomId(roomId) {
    const repository = client.fetchRepository(roomSchema);
    return (
      await repository.search().where("hmsRoomId").equals(roomId).return.first()
    ).toJSON().userId;
  }

  async getRooms() {
    const repository = client.fetchRepository(roomSchema);
    return repository.search().returnAll();
  }

  async getRoomsListByRoomId(hmsRoomId) {
    const repository = client.fetchRepository(roomSchema);
    const rooms = await repository
      .search()
      .where("hmsRoomId")
      .equals(hmsRoomId)
      .return.all();
    return rooms;
  }

  async getRoomByRoomName(hmsRoomName) {
    const repository = client.fetchRepository(roomSchema);
    return await repository
      .search()
      .where("name")
      .equals(hmsRoomName)
      .return.first();
  }

  async getRoomByRoomId(hmsRoomId) {
    const repository = client.fetchRepository(roomSchema);
    const rooms = await repository
      .search()
      .where("hmsRoomId")
      .equals(hmsRoomId)
      .return.all();
    return rooms[0];
  }

  async deleteRoom(entityId) {
    const repository = client.fetchRepository(roomSchema);
    return repository.remove(entityId);
  }
}

module.exports = new RoomService();
