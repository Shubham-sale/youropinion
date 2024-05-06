import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmails";
import { ApiResponse } from "@/types/ApiResponse";
import { log } from "console";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode:string
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Mistry Message Verification Code',
            react: VerificationEmail({username,otp:verifyCode})

        })
        return {success: true, message: "verification email send sucessfully"}
    } catch (emailError) {
        console.log("Error sending verification email", emailError);
        return {success: false, message: 'failed to send verification email'}
    }
}