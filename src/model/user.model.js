const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true
    },
    username: {
      type: String,
      required: true,
      unique: true
    },
    userType: {
      type: String,
      enum: ["admin", "superuser", "user"],
      required: true
    },
    password: {
      type: String,
      required: true,
      minlength: 8
    },
    email: String,
    lastActive: Date,
    commentActivity: Object,
    browseActivity: Object
  },
  { minimize: false }
);

UserSchema.pre("save", async function(next) {
  if (this.isModified("password")) {
    const rounds = 10;
    this.password = await bcrypt.hash(this.password, rounds);
  }
  next();
});

const UserModel = mongoose.model("userModel", UserSchema);

module.exports = UserModel;
