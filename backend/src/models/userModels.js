import { Schema,model } from "mongoose"

const userSchemaFormat = {
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    profileImage: {
    type: String,
    default: ""
    }

}

const userSchema = new Schema(userSchemaFormat)
export const userModel = model("user",userSchema)