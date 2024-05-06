import dbConnect from "@/lib/dbConnect";
import { z } from "zod";
import UserModel from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      return Response.json(
        {
          sucess: false,
          message: "user not found",
        },
        { status: 500 }
      );
    }
    console.log("user verify code"+user.verifyCode);
    
    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();
    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();

      return Response.json(
        {
          sucess: true,
          message: "Account verified Sucessfully",
        },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          sucess: false,
          message:
            "Verification code is expired please signup again to get anew code",
        },
        { status: 400 }
      );
    } else {
      return Response.json(
        {
          sucess: false,
          message:
            "Incorrect verification code",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("error in verifying user", error);
    return Response.json(
      {
        sucess: false,
        message: "Error in verifying user",
      },
      { status: 500 }
    );
  }
}
