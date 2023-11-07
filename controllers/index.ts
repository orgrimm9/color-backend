import { Request, Response } from "express";

const jwt = require("jsonwebtoken");
const User = require("../models/user");

const signin = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({
      userName: req.body.userName,
    });

    if (!user) {
      return res.status(404).send({
        message: "User Not found.",
      });
    }

    //signing token with user id
    const token = jwt.sign(
      {
        id: user._id,
        userName: user.userName,
        color: user.color,
      },
      process.env.API_SECRET ?? "Secret",
      {
        expiresIn: 86400,
      }
    );

    //responding to client request with user profile success message and  access token .
    res
      .cookie("access_token", token, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: 'none'
      })
      .status(200)
      .send({
        user: {
          id: user._id,
          userName: user.userName,
          color: user.color,
        },
        message: "Login successfull",
        accessToken: token,
      });
  } catch (error) {
    res.status(500).send({
      message: error,
    });
    return;
  }
};

const getColor = async (req: RequestObj, res: Response) => {
  try {
    const user = await User.findOne({
      userName: req.user
    });

    res
      .status(200)
      .send({
        userName: user.userName,
        color: user.color
      });
  } catch (error) {
    res.status(500).send({
      message: error,
    });
    return;
  }
}

interface RequestObj extends Request {
  user?: object;
}

const verifyToken = (req: RequestObj, res: Response, next: () => void) => {
  if (req.cookies["access_token"]) {
    jwt.verify(
      req.cookies["access_token"],
      process.env.API_SECRET ?? "Secret",
      function (err : object, decode: any) {
        if (err) {
          return res.status(403).send({
            message: "Invalid JWT token",
          });
        }

        req.user = decode.userName;
      }
    );
  } else {
    return res.status(400).send({
      message: "No JWT token found",
    });
  }

  next();
};

const updateColor = async (req: Request, res: Response) => {
  try {
    const user = await User.findOneAndUpdate(
      {
        userName: req.body.userName,
      },
      { $set: { "color.code": req.body.color.code, "color.name" : req.body.color.code} },
      { new: true }
    );

    if (!user) {
      return res.status(404).send({
        message: "User Not found.",
      });
    }

    //signing token with user id
    const token = jwt.sign(
      {
        id: user._id,
        userName: user.userName,
        color: user.color,
      },
      process.env.API_SECRET ?? "Secret",
      {
        expiresIn: 86400,
      }
    );

    //responding to client request with user profile success message and  access token .
    res
      .cookie("access_token", token, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: 'none'
      })
      .status(200)
      .send({
        user: {
          id: user._id,
          userName: user.userName,
          color: user.color,
        },
        message: "Login successfull",
        accessToken: token,
      });
  } catch (error) {
    res.status(500).send({
      message: error,
    });
    return;
  }
};

module.exports = { signin, updateColor, verifyToken, getColor };
