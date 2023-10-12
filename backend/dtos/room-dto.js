class RoomDto {
  _id;
  name;
  createdAt;
  userId;
  msRoomId;

  constructor(room) {
    this._id = room._id;
    this.name = room.name;
    this.userId = room.userId;
    this.userCount = room.usercount;
    this.msRoomId = room.msRoomId;
  }
}

module.exports = RoomDto;
