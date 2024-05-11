import bcrypt from "bcrypt";

import UserSchema from "../model/User.js";
import { generateJWT, verifyJWT } from "../lib/auth.js";
import cloudinary from "../utils/cloudinary.js";
// import { deleteSession } from "../utils/sessionUtils.js";

export const registerUser = async (req, res) => {
    try {
        const { email, userName, password } = req.body;
        // const profilePicture = req.file?.path;
        // let profileUrl = "";
        // let publicId = "";

        // if (profilePicture) {
        //     const result = await cloudinary.uploader.upload(profilePicture, {
        //         folder: "uploads",
        //     });
        //     profileUrl = result.secure_url;
        //     publicId = result.public_id;
        // }

        const user = await UserSchema.findOne({
            $or: [{ email: email }, { userName: userName }],
        });
        // Check for unique Email
        if (user?.email === email) {
            return res.status(400).send("Email should be unique");
        }
        // Check for unique userName
        if (user?.userName === userName) {
            return res.status(400).send("Username should be unique");
        }

        // Create User if passed all checks
        await UserSchema.create({
            email,
            userName,
            // profilePicture: profileUrl,
            // publicId,
            password,
        });

        // deleteSession(req, res);
        res.clearCookie("connect.sid");
        res.status(200).send("User registered successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
};

export const loginUser = async (req, res) => {
    const { userNameOrEmail, password } = req.body;

    try {
        const user = await UserSchema.findOne({
            $or: [{ email: userNameOrEmail }, { userName: userNameOrEmail }],
        });

        // Check if User Exist or not
        if (!user) {
            return res.status(401).send("You need to Register First");
        }
        // Check if User has Google Account or Not
        if (!user.password) {
            return res.status(402).send("You need to login via Google");
        }

        // Comapre the Password using bcrypt
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            res.status(501).send("Incorrect Password");
            return;
        } else {
            // Set Token in Cookies if password is correct
            const token = verifyJWT(user);

            res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
            });
            res.status(201).send("Login Successfully");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
};

export const getUser = async (req, res) => {
    const user = req.user;

    try {
        return res.status(200).json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal server error");
    }
};

export const updateUser = async (req, res) => {
    const {
        email,
        userName,
        originalUserName,
        phoneNumber,
        originalPhoneNumber,
    } = req.body;
    const profilePicture = req.file?.path;
    let profileUrl = "";
    let profilePublicId = "";

    if (profilePicture) {
        const result = await cloudinary.uploader.upload(profilePicture, {
            folder: "uploads",
        });
        profileUrl = result.secure_url;
        profilePublicId = result.public_id;
    }

    try {
        const user = await User.findOne({ email: email });
        // Check if User Exist or not
        if (!user) {
            return res.status(404).send("User not found");
        }

        // Check for unique phoneNumber
        if (phoneNumber && phoneNumber !== originalPhoneNumber) {
            const existingUserWithPhone = await User.findOne({ phoneNumber });
            if (existingUserWithPhone) {
                return res.status(400).send("Phone Number must be unique");
            }
            user.phoneNumber = phoneNumber;
        }
        // Check for Unique userName
        if (userName && userName !== originalUserName) {
            const existingUserWithUserName = await User.findOne({ userName });
            if (existingUserWithUserName) {
                return res.status(400).send("User Name must be unique");
            }
            user.userName = userName;
        }

        // Delete the previous profilePicture and then update profilePicture
        if (profilePicture) {
            user.profilePicture = profileUrl;
            if (user.publicId.includes("uploads")) {
                cloudinary.uploader.destroy(user.publicId, (error) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log("Photo Deleted Successfully");
                    }
                });
            }
            user.publicId = profilePublicId;
        }
        await user.save();

        return res.status(200).send("User Updated Successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
};

export const logoutUser = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        res.status(200).send("Logged out successfully");
    } catch (error) {
        console.log(error);
        res.status(501).send("Internal Server Error");
    }
};
