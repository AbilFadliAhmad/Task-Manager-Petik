import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
    type:{type:String, default:'create', enum:['create', 'update', 'delete', 'duplicate', 'login', 'logout']},
    textLog: {type:String, default:''},
    textLogDate: {type:String, default:''},
    by:{type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    rangkuman: {type: String},
    date: {type: String, default: new Date(Date.now()).toLocaleString('id-ID', {timeZone: 'Asia/Jakarta'}).replace('/', '-').replace('/', '-')},
},{timestamps:true},{collection:'histories'})

export const historyModel = mongoose.models.histories || mongoose.model('histories', historySchema)