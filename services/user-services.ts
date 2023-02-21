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

export const createUserService = (user: IUser) => {
  if (!user.role) {
    throw new Error("Role is required");
  }
  if (user.role === roles.admin || user.role === roles.superAdmin) {
    if (!user.password) {
      throw new Error("Password is required for admin and super admin");
    }
    const hashedPassword = bcrypt.hashSync(user.password, 10);
    user.password = hashedPassword;
  }
  return users.create(user);
};
