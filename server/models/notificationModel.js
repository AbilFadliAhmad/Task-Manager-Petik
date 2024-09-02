import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    team: [{type: mongoose.Schema.Types.ObjectId, ref: 'user'}],
    leader: [{type: mongoose.Schema.Types.ObjectId, ref: 'user'}],
    textLeader: [String],
    textMember: [String],
    text: [String],
    task: {type: mongoose.Schema.Types.ObjectId, ref: 'task'},
    notiType: {type:String, default:'alert', enum:['alert', 'message']},
    isRead: [{type: mongoose.Schema.Types.ObjectId, ref: 'user'}],
    isSeen: [{type: mongoose.Schema.Types.ObjectId, ref: 'user'}],
}, {timestamps:true})

export const notificationModel = mongoose.models.notification || mongoose.model('notification', notificationSchema)