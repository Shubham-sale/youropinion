import { Message } from "@/model/User";

export interface ApiResponse {
    success: boolean,
    message: string,
    isAceeptingMessages?: boolean,
    messages?: Array<Message>
}