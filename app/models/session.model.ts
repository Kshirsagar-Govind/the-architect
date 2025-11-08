import mongoose,{Document, Model, Schema} from 'mongoose'
import { generateRowId } from '../utils/generateID'

interface IUserSession extends Document{
    id:string,
    user_id:string,
    refresh_token:string,
    session_log:string
}

const SessionSchema:Schema<IUserSession> = new Schema({
    id:{type:String, default:generateRowId},
    user_id:{type:String, required:true},
    refresh_token:{type:String, required:true},
    session_log:{type:String, required:true}
},
{
    timestamps:true
}) 
// to remove more than 7 days older refresh tokens
SessionSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 7 * 24 * 60 * 60 });

const AuthModel: Model<IUserSession> = mongoose.model<IUserSession>('UserSession', SessionSchema, 'ProjectManagement');
export default AuthModel;


