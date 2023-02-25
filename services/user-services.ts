import { roles } from "../constants/Roles";
import users from "../models/users";
import bcrypt from "bcrypt";

interface IUser {
  name: string;
  email: string;
  phone: string;
  password?: string;
  role: string;
}

export const getUserService = (userId: string) => {
  return users.findById(userId).select("-password");
};

export const getAllUsersService = (page: number, limit: number) => {
  return users
    .find()
    .select("-password")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
};

export const getAllUsersCountService = () => {
  return users.countDocuments();
};

export const createUserService = async (user: IUser) => {
  if (!user.role) {
    throw new Error("Role is required");
  }
  if (user.role === roles.admin || user.role === roles.superAdmin) {
    if (!user.password) {
      throw new Error("Password is required for admin and super admin");
    }
    const findUser = await users.findOne({ email: user.email });
    if (findUser) throw new Error("User already exists");
    const hashedPassword = await bcrypt.hash(user.password, 10);
    return users.create({ ...user, password: hashedPassword });
  }
  return users.create(user);
};
