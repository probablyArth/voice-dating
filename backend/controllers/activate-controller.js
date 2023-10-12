const Jimp = require("jimp");
const path = require("path");
const userService = require("../services/user-service");
const UserDto = require("../dtos/user-dto");
const { writeFile } = require("fs/promises");
class ActivateController {
  async activate(req, res) {
    // Activation logic
    let { name, avatar, gender } = req.body;
    if (!name || !avatar) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    // Image Base64
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
        return res.status(500).json({ message: "Could not process the image" });
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
        return res.status(500).json({
          message: "Could not process the svg image",
        });
      }
    }
    const userId = req.user._id;
    // Update user
    try {
      const user = await userService.findUser({ _id: userId });
      if (!user) {
        res.status(404).json({ message: "User not found!" });
      }
      user.activated = true;
      user.name = name;
      user.avatar = `storage/${imagePath}`;
      user.gender = gender;
      user.save();
      res.json({ user: new UserDto(user), auth: true });
    } catch (err) {
      return res.status(500).json({ message: "Something went wrong!" });
    }
  }
}

module.exports = new ActivateController();
