import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: {type:String, required:true},
    leader:{type:String, default:''},
    member: [{type:mongoose.Schema.Types.ObjectId, ref:'user'}],
    image: String,
    public_id: String,
    title: {type:String, required:true},
    role: {type:String, required:true},
    email: {type:String, required:true, unique:true},
    password: {type:String, required:true},
    isAdmin: {type:Boolean, required:true, default:false},
    isUstadz: {type:Boolean, required:true, default:false},
    tasks: [{type:mongoose.Schema.Types.ObjectId, ref:'task'}],
    isActive: {type:Boolean, required:true, default:true},
}, {timestamps:true})

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.matchPassword = async function(enteredPassword) { 
    return await bcrypt.compare(enteredPassword, this.password)
} 

export const userModel = mongoose.models.user || mongoose.model('user', userSchema)