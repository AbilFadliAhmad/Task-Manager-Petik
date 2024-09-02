import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: {type:String, required:true},
    date: {type:Date, default:new Date()},
    priority: {type:String, default:'normal', enum:['low', 'normal', 'high', 'medium']},
    stage: {type:String, default:'todo', enum:['todo', 'in progress', 'completed']},
    activities: [{
        type:{type:String, default:'assigned', enum:['started', 'commented', 'completed', 'bug', 'in progress', 'assigned']},
        activity: String,
        date: {type:Date, default:new Date()},
        by:{type: mongoose.Schema.Types.ObjectId, ref:'user'}
    }],
    assets: [String],
    public_id: String,
    leader: [{type: mongoose.Schema.Types.ObjectId, ref: 'user'}],
    team: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    isTrashed: {type: Boolean, default: false},

}, {timestamps:true})

export const taskModel = mongoose.models.task || mongoose.model('task', taskSchema)