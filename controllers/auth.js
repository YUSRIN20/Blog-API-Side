// import { db } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from 'dotenv'

dotenv.config()

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // HASH PASSWORD AND CREATE A USER
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        const emailid = await User.findOne({ email });
        const name = await User.findOne({ username });

        const newUser = new User({
            username,
            email,
            password: hash,
        });

        if (emailid || name) {
            return res.status(400).json({ message: "user already exists" });
        }
        await newUser.save();
        res.status(200).json("User has been created");
    } catch (err) {
        res.status(500).json(err)
    }

    // CHECk EXISTNG USER

    //  const q = "SELECT * FROM users WHERE email = ? OR username = ?";

    //  db.query(q, [req.body.email, req.body.name], (err, data) => {
    //      if (err) return res.json(err);
    //      if (data.length) return res.status(409).json("User already exists!");

    //      // HASH PASSWORD AND CREATE A USER
    //      const salt = bcrypt.genSaltSync(10);
    //      const hash = bcrypt.hashSync(req.body.password, salt);

    //      const q = "INSERT INTO users(`username`,`email`,`password`)VALUES (?)";
    //      const values = [
    //          req.body.username,
    //          req.body.email,
    //          hash
    //      ]

    //      db.query(q, [values], (err, data) => {
    //          if (err) return res.json(err)
    //          return res.status(200).json("User has been created")
    //      })
    //  });
};
export const login = async (req, res) => {
   
    try {
        const user  = await User.findOne({username:req.body.username})
        if (!user)
        return res.status(404).json("User not found!")
        
        const isPasswordCorrect =  await bcrypt.compareSync(req.body.password, user.password);
        if(!isPasswordCorrect)
          return res.status(400).json("Wrong username or password!");

        const token = jwt.sign({ id: user._id },process.env.JWT);

        const { password, ...other } = user._doc;

        res
            .cookie("access_token", token, {
                httpOnly: true,
            })
            .status(200)
            .json(other);
    } catch (err) {
        res.status(500).json(err)
    }



    // // CHECK USER

    // const q = "SELECT * FROM users WHERE username = ?";

    // db.query(q, [req.body.username], (err, data) => {
    //     if (err) return res.json(err);
    //     if (data.length === 0) return res.status(404).json("User not found!");

    //     // Check password
    //     const isPasswordCorrect = bcrypt.compareSync(
    //         req.body.password,
    //         data[0].password
    //     );

    //     if (!isPasswordCorrect)
    //         return res.status(400).json("Wrong username or password!");

    //     const token = jwt.sign({ id: data[0].id }, "JWTKEY");

    //     const { password, ...other } = data[0];

    //     res
    //         .cookie("access_token", token, {
    //             httpOnly: true,
    //         })
    //         .status(200)
    //         .json(other);
    // });
};
export const logout = (req, res) => {
    res
        .clearCookie("access_token", {
            sameSite: "none",
            secure: true,
        })
        .status(200)
        .json("User has been logged out");
};
