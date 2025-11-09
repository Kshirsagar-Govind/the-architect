import mongoose,{ Document,Model,Schema } from "mongoose";
interface IActivityLog extends Document{
url:string;
email:string;
ip:string;
body:string;
method:string;
}

const ActivityLogSchema:Schema<IActivityLog> = new Schema({
url:{type:String,default:''},
email:{type:String,default:''},
ip:{type:String,default:''},
body:{type:String,default:''},
method:{type:String,default:''}
}, {
    timestamps:true
}) 
const ActivityLogModel:Model<IActivityLog> =  mongoose.model<IActivityLog>('ActivityLogs', ActivityLogSchema);
export default ActivityLogModel;

