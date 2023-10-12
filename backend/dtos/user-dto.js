class UserDto {
  _id;
  phone;
  name;
  avatar;
  activated;
  createdAt;
  gender;

  constructor(user) {
    this._id = user._id;
    this.phone = user.phone;
    this.name = user.name;
    this.avatar = user.avatar ? `${process.env.BASE_URL}${user.avatar}` : null;
    this.activated = user.activated;
    this.createdAt = user.createdAt;
    this.gender = user.gender;
    this.bio = user.bio;
  }
}

module.exports = UserDto;
