import mongoose from "mongoose";

type connectionObject = {
    isConnected? : number
}

const connection: connectionObject ={} 

async function dbConnect(): Promise<void>  {
    if(connection.isConnected){
        console.log("Already connected to database");
        return
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "" ,{})
        // console.log(db.connections);
        // console.log(
            // "db object ://////////////"+db);
        
        connection.isConnected = db.connections[0].readyState

        console.log("DB connected Succesfully");
        
    } catch (error) {
        
        console.log("database Connection failed");
        process.exit(1)
    }
}

export default dbConnect;