const { Entity, Schema } = require("redis-om");

class Room extends Entity {}

const roomSchema = new Schema(
  Room,
  {
    name: { type: "string" },
    hmsRoomId: { type: "string" },
    userId: { type: "string" },
    userCount: { type: "number" },
  },
  {
    dataStructure: "JSON",
  }
);

module.exports = roomSchema;
