import { Request, Response } from "express";
import {
  createUserService,
  getAllUsersCountService,
  getAllUsersService,
  getUserService,
} from "../services/user-services";

export const getMyselfController = async (req: Request, res: Response) => {
  try {
    const { user } = req;
    const getUser = await getUserService(user.id);
    res.status(200).json({ user: getUser });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createUserController = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, role } = req.body;
    const user = { name, email, password, phone, role };
    const createUser = await createUserService(user);
    res.status(201).json({ user: createUser });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllUsersController = async (req: Request, res: Response) => {
  try {
    const { page, limit } = req.query;

    console.log({ page, limit });

    const getAllUsers = await getAllUsersService(
      Number(page || 1),
      Number(limit || 10)
    );

    const totalUsers = await getAllUsersCountService();
    const totalPages = Math.ceil(totalUsers / Number(limit || 10));
    res.status(200).json({ users: getAllUsers, totalPages, totalUsers });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
