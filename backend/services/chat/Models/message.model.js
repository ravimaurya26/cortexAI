import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
   name:String,
   content:String
},{
   _id:false
}
)
const artifactSchema = new mongoose.Schema({
    id:String,
    type:String,
    title:String,
    files:[]
},{
   _id:false
})




const messageSchema = new mongoose.Schema({
   conversationId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Conversation"

    },
 role:{
    type:String,
    enum:["user","assistant"],  

 },
 content : String,
 images:[String],
 artifacts:[artifactSchema]

},{

    timestamps:true
}
)
const Message = mongoose.model("Message",messageSchema)
export default Message