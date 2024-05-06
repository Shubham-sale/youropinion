import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
 
  // console.log("user from session",user);
  
  if (!session || !session.user) {
    return Response.json(
      {
        sucess: false,
        message: "Not Authenticated user",
      },
      { status: 401 }
    );
  }
  const userId = user._id;
  const { acceptMessages } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessages: acceptMessages },
      { new: true }
    );
    if (!updatedUser) {
      return Response.json(
        {
          sucess: false,
          message: 'Unable to find user to update message acceptance status',
        },
        { status: 401 }
      );
    }

    return Response.json(
      {
        sucess: true,
        message: "message acceptance status updated sucessfully",
        updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in update user status to accept messages");
    return Response.json(
      {
        sucess: false,
        message: "Error in update user status to accept messages",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  console.log("get accept message", user);
  
  if (!session || !user) {
    return Response.json(
      {
        sucess: false,
        message: "Not Authenticated user",
      },
      { status: 401 }
    );
  }
  const userId = user._id;

  try {
    const foundUser = await UserModel.findById(userId);
    console.log("found user" , foundUser);
    
    if (!foundUser) {
      return Response.json(
        {
          sucess: false,
          message: "user not found",
        },
        { status: 404 }
      );
    }
    return Response.json(
      {
        sucess: true,
        isAcceptingMesseges: foundUser.isAcceptingMessages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in getting message acceptance status",error);
    return Response.json(
      {
        sucess: false,
        message: "Error in getting message acceptance status",
      },
      { status: 500 }
    );
  }
}
