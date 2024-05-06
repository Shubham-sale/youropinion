import dbConnect from "@/lib/dbConnect";
import { z } from "zod";
import UserModel from "@/model/User";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    };
    // vaildate with zod
    const result = UsernameQuerySchema.safeParse(queryParam);

    console.log(result); // remove
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(", ")
              : "invalid query params",
        },
        { status: 400 }
      );
    }

    const { username } = result.data;
    const exstingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if(exstingVerifiedUser){
        return Response.json(
            {
              success: false,
              message: "username already taken"
            },
            { status: 400 }
          );
    }

    return Response.json(
        {
          success: true,
          message:"Username is available" 
               },
        { status: 200 }
      );
  } catch (error) {
    console.error("error in checking username", error);
    return Response.json(
      {
        sucess: false,
        message: "Error checking username",
      },
      { status: 500 }
    );
  }
}
