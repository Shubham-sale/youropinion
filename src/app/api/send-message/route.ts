import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";

export async function POST(request :Request){
    dbConnect();

    const {username, content} = await request.json()
    try {
        const user = await UserModel.findOne({username})

        console.log("user" , user);
        
        if(!user){
            return Response.json(
                {
                  sucess: false,
                  message: "user not found",
                },
                { status: 404 }
              );  
        }
        // is user accepting messages
        if(!user.isAcceptingMessages){
            return Response.json(
                {
                  sucess: false,
                  message: "user is not accepting messages",
                },
                { status: 403 }
              );
        }

        const newMessage = {content, createdAt: new Date()}
        user.messages.push(newMessage as Message)
        await user.save()

        return Response.json(
            {
              sucess: true,
              message: "Message send sucessfully",
            },
            { status: 200 }
          );
    } catch (error) {
      console.error("error", error);
      
        return Response.json(
            {
              sucess: false,
              message: "Internal server error",
            },
            { status: 500 }
          );
    }
}