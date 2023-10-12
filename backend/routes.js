const router = require("express").Router();
const activateController = require("./controllers/activate-controller");
const authController = require("./controllers/auth-controller");
const roomController = require("./controllers/room-controller");
const userController = require("./controllers/user-controller");
const webhookController = require("./controllers/webhook-controller");
const authMiddleware = require("./middlewares/auth-middleware");
const webhookMiddlerware = require("./middlewares/webhook-middlerware");

router.post("/api/send-otp", authController.sendOtp);
router.post("/api/verify-otp", authController.verifyOtp);
router.post("/api/activate", authMiddleware, activateController.activate);
router.post("/api/refresh", authController.refresh);
router.get("/api/user", authMiddleware, userController.getUser);
router.get("/api/user/:userId", authMiddleware, userController.getUserById);
router.post("/api/logout", authMiddleware, authController.logout);
router.patch("/api/avatar", authMiddleware, userController.updateAvatar);
router.patch("/api/bio", authMiddleware, userController.updateBio);
router.delete("/api/user", authMiddleware, userController.deleteUser);
router.get("/api/room", authMiddleware, roomController.getRooms);
router.post("/api/room", authMiddleware, roomController.createRoom);
router.post("/api/room/token", authMiddleware, roomController.authToken);
router.get(
  "/api/room/:roomId",
  authMiddleware,
  roomController.getUserIdFromRoomId
);
router.post("/api/room/count", authMiddleware, roomController.getActivePeers);
router.post("/webhook", webhookMiddlerware, webhookController.webhook);
module.exports = router;
