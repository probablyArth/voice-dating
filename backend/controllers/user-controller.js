const UserDto = require("../dtos/user-dto");
const { findUserById, deleteUser } = require("../services/user-service");
const { writeFile, unlink } = require("fs/promises");
const path = require("path");
const Jimp = require("jimp");
const { deleteRefreshToken } = require("../services/token-service");
const userService = require("../services/user-service");
class UserController {
  async getUser(req, res) {
    try {
      const user = await findUserById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: "User doesn't exist." });
      }
      const userDto = new UserDto(user);
      return res.json({ user: userDto, auth: true });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "Error finding the user." });
    }
  }

  async updateBio(req, res) {
    try {
      const { bio } = req.body;
      if (!bio) {
        return res.status(404).json({ message: "New bio not found" });
      }
      const user = await findUserById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: "User doesn't exist." });
      }
      user.bio = bio;
      await user.save();
      return res.json({ user: new UserDto(user) });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "Error updating the user." });
    }
  }

  async updateAvatar(req, res) {
    try {
      const { avatar } = req.body;
      if (!avatar) {
        return res.status(404).json({ message: "Avatar not found." });
      }
      const user = await findUserById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: "User doesn't exist." });
      }
      let imagePath;
      if (avatar.substring(11, 18) != "svg+xml") {
        const buffer = Buffer.from(
          avatar.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
          "base64"
        );
        try {
          const jimResp = await Jimp.read(buffer);
          imagePath = `${Date.now()}-${Math.round(Math.random() * 1e9)}.png`;
          jimResp
            .resize(150, Jimp.AUTO)
            .write(path.resolve(__dirname, `../storage/${imagePath}`));
        } catch (err) {
          console.log(err);
          return res
            .status(500)
            .json({ message: "Could not process the image" });
        }
      } else {
        try {
          const buffer = Buffer.from(avatar.split(",")[1], "base64");
          imagePath = `${Date.now()}-${Math.round(Math.random() * 1e9)}.svg`;
          await writeFile(
            path.resolve(__dirname, `../storage/${imagePath}`),
            buffer
          );
        } catch (err) {
          console.log(err);
          return res
            .status(500)
            .json({ message: "Could not process the svg image" });
        }
      }

      await unlink(path.resolve(__dirname, `../${user.avatar}`));
      user.avatar = `storage/${imagePath}`;
      user.save();
      res.json({
        user: new UserDto(user),
        message: "Avatar updated successfully.",
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "Error updating the avatar." });
    }
  }
  async deleteUser(req, res) {
    try {
      const userId = req.user._id;
      const user = findUserById(userId);
      if (!user) {
        return res.status(404).json({ message: "User doesn't exist." });
      }
      res.clearCookie("refreshToken");
      res.clearCookie("accessToken");
      await deleteRefreshToken(userId);
      await deleteUser(userId);
      return res.json({ user: null, auth: null });
    } catch (e) {
      res
        .status(500)
        .json({ message: "There was some error deleting the account." });
    }
  }

  async getUserById(req, res) {
    try {
      const { userId } = req.params;
      if (!userId) {
        res.status(404).json({ message: "No userId provided" });
      }

      const user = await userService.findUserById(userId);
      if (!user) {
        res.status(404).json({ message: "User not found." });
      }

      res.json({ user: new UserDto(user) });
    } catch (e) {
      res.status(500).json({ message: "Error while fetching user." });
    }
  }
}

module.exports = new UserController();
