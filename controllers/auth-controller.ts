import { Request, Response } from "express";
import {
    decodeJWT,
    loginService,
    registerAdminService,
    registerUserService,
    signJWT,
    verifyJWT,
} from "../services/auth-services";
import { sendMagicLinkService } from "../services/email-services";
import users from "../models/users";
import bcrypt from "bcrypt";
import { getUserUp } from "../services/user-services";

export const handleLoginController = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const token = await loginService(email, password);
        console.log("pop",token)
        return res
            .cookie("access_token", token, {
                httpOnly: true,
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
                secure: process.env.NODE_ENV === "production",
            })
            .status(200)
            .json({data:token, success: true, message: "Login successful" });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const handleAdminRegisterController = async (
    req: Request,
    res: Response
) => {
    try {
        const { name, email, password } = req.body;
        const user = await registerAdminService(name, email, password);
        res.status(200).json({ user });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const handleUserRegisterController = async (
    req: Request,
    res: Response
) => {
    try {
        const { name, email, password } = req.body;
        // const user = await registerUserService(name, email, password);

        if (!email || !password || !name) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const payload = {
            name: name,
            email: email,
            password: password,
        };

        const jwt = signJWT(payload);
        const link = `${process.env.CLIENT_URL}/auth/verify?token=${jwt}`;
        const sendMagicLink = await sendMagicLinkService(email, link);

        if (sendMagicLink) {
            return res.status(200).json({
                success: true,
                message: "Registration successful",
            });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const handleVerifyTokenController = async (
    req: Request,
    res: Response
) => {
    try {
        const { token } = req.body;
        const verifyuser = verifyJWT(token);
        const decodeUser = decodeJWT(token) as any;

        const user = await registerUserService(
            decodeUser.name,
            decodeUser.email,
            decodeUser.password,
            true
        );

        const payload = {
            user: {
                _id: user?._id,
                name: user?.name,
                role: user?.role,
                email: user?.email,
            },
        };

        const accessToken = signJWT(payload);

        if (verifyuser) {
            return res
                .cookie("access_token", accessToken, {
                    httpOnly: true,
                    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
                    secure: process.env.NODE_ENV === "production",
                })
                .status(200)
                .json({ success: true, message: "Login successful" });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const handleLogoutController = async (req: Request, res: Response) => {
    try {
        res.clearCookie("access_token");
        res.status(200).json({ success: true, message: "Logout successful" });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};


export const updateusePass=async (req: Request, res: Response) => {
    const { id } = req.params;
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const getUser = await getUserUp(id);
    console.log("topup",getUser);
    //     try{  
    //         const response=await users.findByIdAndUpdate(
    //         req.params.id,
    //         {
    //             $set: {
    //               password: hashedPassword,
    //             },
    //           },
    //           {new: true }
    //     )
    //         res.status(200).json({user:response });
    //     } catch (error: any) {
    //         res.status(500).json({ error: error.message,message:"Password Incorrect" });
          
    // }
 
}