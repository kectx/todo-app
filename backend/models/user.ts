import mongoose from "mongoose";
import bcrypt from 'bcrypt'
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  email: { type: String, required: true, unique: true  }
}, { timestamps: true });

userSchema.methods.generateHash = function(password: string) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

userSchema.methods.validPassword = function(password: string) {
  return bcrypt.compareSync(password, this.password);
};

export default mongoose.model("User", userSchema);