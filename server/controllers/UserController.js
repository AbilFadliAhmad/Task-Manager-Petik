import { userModel } from "../models/UserModel.js"
import { taskModel } from '../models/TaskModel.js'
import { notificationModel } from "../models/notificationModel.js"
import jwt from 'jsonwebtoken'
import {v2 as cloudinary} from 'cloudinary'
import { historyModel } from "../models/historyModel.js"

const tanggalIndo = (date) => {
    const hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  
    return `${hari[date.getDay()]} ${String(date.getDate()).padStart(2, '0')} ${bulan[date.getMonth()]} ${date.getFullYear()}`;
  };

const createAdmin = async(req,res)=>{
    try {
        const {name, email, password, isAdmin} = req.body
        const image = req.file
        console.log(image,'gambar');

        if(!image) return res.status(400).json({success:false, message:'Masukkan Gambar'})
        if(image?.size > 6000000) return res.status(400).json({success:false, message:'Ukuran gambar tidak boleh melebihi 6MB'})
        const include = email.includes("@")
        if(!include) return res.status(400).json({success:false, message:'Masukkan Email yang benar'})

        const exist = await userModel.findOne({email})
        if(exist) return res.status(400).json({success:false, message:'Email Sudah Terdaftar'})

        const gambar = await cloudinary.uploader.upload(image.path, {resource_type: "image"})

        const user = await userModel.create({
            name, 
            email, 
            password, 
            isAdmin:true, 
            role:"Admin", 
            title:"Admin Web",
            image: gambar.secure_url,
            public_id: gambar.public_id,
        })

        if(user) {
            isAdmin ? createJWT(res, user) : null
            user.password=undefined
            res.status(201).json({success:true, message:'Berhasil', data:user})
        } else {
            return res.status(400).json({success:false, message:'Gagal membuat akun, silahkan coba lagi'})
        }
    } catch (error) {
        console.log(error)
        res.status(400).json({success:false, message:error.message, inti: 'Gagal membuat akun, silahkan coba lagi'})
    }
}

const registerUser = async(req,res)=>{
    try {
        const {name, email, password, role, title} = req.body
        const image = req.file || req.body
        const { userId, isAdmin } = req.user;
        const pembuat = await userModel.findById(userId)

        if(image?.size > 6000000) return res.status(400).json({success:false, message:'Ukuran gambar tidak boleh melebihi 6MB'})
        const include = email.includes("@")
        if(!include) return res.status(400).json({success:false, message:'Masukkan Email yang benar'})

        const exist = await userModel.findOne({email})
        if(exist) return res.status(400).json({success:false, message:'Email Sudah Terdaftar'})
        const condition = image?.image?.includes('cloudinary') ?? image.destination == 'uploads'
        let gambar;

        if(condition) {
            gambar = await cloudinary.uploader.upload(image?.path, {resource_type: "image"}) ?? ''
        }
        
        
        const user = await userModel.create({
            name, 
            leader: userId,
            email, 
            password, 
            role, 
            title,
            member:[],
            image: gambar?.secure_url ?? '',
            public_id: gambar?.public_id ?? '',
            isUstadz: isAdmin ? true : false
        })

        
        if(user) {
            await historyModel.create({
                type: 'create',
                textLogDate: String(tanggalIndo(new Date(Date.now()))),
                by: userId,
                rangkuman: `${pembuat.name} menambahkan user baru`,
                textLog: `${pembuat.name} menambahkan user baru dengan email: ${email} dan nama user: ${name}`,
              })
            const pemimpin = await userModel.findById(userId)
            pemimpin.member.push(user._id)
            await pemimpin.save()
            user.password=undefined
            res.status(201).json({success:true, message:'Berhasil', data:user})
        } else {
            return res.status(400).json({success:false, message:'Gagal membuat akun, silahkan coba lagi'})
        }
    } catch (error) {
        console.log(error)
        res.status(400).json({success:false, message:error.message, inti: 'Gagal membuat akun, silahkan coba lagi'})
    }
}

const loginUser = async(req,res)=>{
    try {
        const {email, password} = req.body

        const user = await userModel.findOne({email})
        if(!user) return res.status(400).json({success:false, message:'Email User Tidak Ditemukan'})

        if(!user?.isActive) return res.status(401).json({success:false, message:'Akun telah dinonaktifkan, silahkan hubungi admin'})

        const isMatch = await user.matchPassword(password)
        if(!isMatch) return res.status(401).json({success:false, message:'Password Tidak Sesuai'})

        if(user && isMatch) {
            createJWT(res, user._id)
            user.password = undefined
            // await historyModel.create({
            //     type: 'login',
            //     textLogDate: String(tanggalIndo(new Date(Date.now()))),
            //     by: user._id,
            //     rangkuman: `${user.name} telah login ke akun`,
            //     textLog: `User dengan nama ${user.name} dan id ${user._id} telah login ke akun`,
            //   })
            res.status(200).json({success:true, message:'Berhasil Masuk ke akun', data:user})
        } else {
            return res.status(400).json({success:false, message:'Gagal masuk ke akun'})
        }
    } catch (error) {
        console.log(error)
        res.status(400).json({success:false, message:error.message, inti: 'Gagal Login ke akun, silahkan coba lagi'})   
    }
}

const listUser = async(req,res)=>{
    try {
        const history = await historyModel.find()
        const data = await userModel.find()
        const task = await taskModel.find()
        const notification = await notificationModel.find()
        return res.status(200).json({ history,user:data, task, notification, success:true,message:"User list berhasil ditampilkan" })
    } catch (error) {
        console.log(error)
        res.status(401).json({success:false, message:error.message, inti:"User list gagal ditampilkan"})
    }
}

const logoutUser = async(req,res)=>{
    try {
        const {userId} = req.user
        const user = await userModel.findById(userId)
        res.cookie('token', '', {maxAge: 1, expires: new Date(), httpOnly: true})
        // await historyModel.create({
        //     type: 'logout',
        //     textLogDate: String(tanggalIndo(new Date(Date.now()))),
        //     by: user._id,
        //     rangkuman: `${user.name} telah Logout dari akun`,
        //     textLog: `User dengan nama ${user.name} dan id ${user._id} telah logout dari akun`,
        //   })
        res.status(200).json({success:true, message:'Logout Berhasil'})
    } catch (error) {
        console.log();
        res.status(400).json({success:false, message:error.message, inti: 'Gagal Logout ke akun, silahkan coba lagi'})   
    }
}

const getTeamList = async(req,res)=>{
    try {
        const {userId, isAdmin} = req.user
        if(isAdmin) {
            const users = await userModel.find().select('name title role email isActive image isAdmin isUstadz leader'); 
            return res.status(200).json({success:true, users, message:'Berhasil menampilkan data list user'})
        }

        const users = await userModel.findById(userId).populate('member', 'name title role email isActive image isAdmin isUstadz leader') 
        return res.status(200).json({success:true, users:users.member, message:'Berhasil menampilkan data list user'})
    } catch (error) {
        console.log(error);
        res.status(401).json({success:false, message:error.message, inti: 'Gagal menampilkan data list user, silahkan coba lagi'})
    }
}

const dropdownUser = async(req,res)=>{
    try {
        const users = await userModel.find().select('name title role email isActive image isAdmin isUstadz leader'); 
        res.status(200).json({success:true, users, message:'Berhasil menampilkan data list user'})
    } catch (error) {
        console.log(error);
        res.status(401).json({success:false, message:error.message, inti: 'Gagal menampilkan data list user, silahkan coba lagi'})
    }
}

const updateTeam = async(req,res)=>{
    try {
        const {id, title, role, email, name} = req.body
        const image = req.file || req.body
        const {userId} = req.user
        const pemimpin = await userModel.findById(userId)

        const user = await userModel.findById(id)
        if(!user) return res.status(400).json({success:false, message:'User Tidak Ditemukan'})

        const exist = await userModel.find({email})
        if(exist.length > 1) return res.status(400).json({success:false, message:'Email Sudah Terdaftar'})

        const gambar = user.image
        if(gambar !== image.image) {
            await cloudinary.uploader.destroy(user.public_id)
            const gambarCloudinary = await cloudinary.uploader.upload(image.path, {resource_type: "image"})
            user.image = gambarCloudinary.secure_url
            user.public_id = gambarCloudinary.public_id
        }

        if(user) {
            await historyModel.create({
                type: 'update',
                textLogDate: String(tanggalIndo(new Date(Date.now()))),
                by: userId,
                rangkuman: `${pemimpin.name} mengubah detail user ${user.name}`,
                textLog: `${pemimpin.name} mengubah detail user ${user.id} dengan data berikut: \n - Nama: ${name} \n - Email: ${email} \n - Title: ${title} \n - Role: ${role}`,
              })
            user.name = name
            user.email = email
            user.title = title
            user.role = role
            await user.save()
            res.status(200).json({success:true, message:'Berhasil mengupdate data user', data:user})
        }
    } catch (error) {
        console.log(error);
        res.status(401).json({success:false, message:error.message, inti: 'Gagal mengupdate data user, silahkan coba lagi'})
    }
}


const getNotificationList = async(req,res)=>{
    try {
        const {userId,isUstadz, isAdmin} = req.user

        if(isAdmin || isUstadz) {
            const notification = await notificationModel.find({
                leader:userId, 
                isRead: {$nin: [userId]}
            }).populate('task', 'title')
            return res.status(201).json({success:true, notification})
        }

        const notification = await notificationModel.find({
            team:userId, 
            isRead: {$nin: [userId]}
        }).populate('task', 'title')
        console.log(notification, 'notif')
        res.status(201).json({success:true, notification})
    } catch (error) {
        console.log(error);
        res.status(401).json({success:false, message:error.message, inti: 'Gagal mengambil data dari notifikasi, silahkan coba lagi'})
    }
}

const createAnnouncement = async(req,res)=>{
    try {
        const {users, isi} = req.body;
        const {userId} = req.user
        const user = await userModel.findById(userId)
        const pemimpin = users.filter(user=>user.isAdmin == true || user.isUstadz == true).map(user=>user._id)
        const anggota = users.filter(user=>user.isAdmin == false && user.isUstadz == false).map(user=>user._id)
        const text1 = [];
        text1[0] = isi;
        text1[1] = String(new Date(Date.now()).toLocaleDateString('id').split('/').join("-"));
        
        const notif = await notificationModel.create({
            team: anggota,
            leader: pemimpin,
            textLeader: text1,
            textMember: text1,
        })

        await historyModel.create({
            type: 'create',
            textLogDate: String(tanggalIndo(new Date(Date.now()))),
            by: userId,
            rangkuman: `${user.name} membuat pemberitahuan baru`,
            textLog: `${user.name} membuat pemberitahuan yang ditujukan kepada ${users.map(user=>user.name).join(`, `)}`,
          })
        res.status(200).json({success:true, message:"Kamu Berhasil"})
    } catch (error) {
        console.log(error)
        res.status(401).json({success:false, message:error.message, inti: 'Gagal membuat notifikasi, silahkan coba lagi'})
    }
}
const updateUserProfile = async(req,res)=>{
    try {

        const {userId} = req.user
        const {name, title, role, email, password} = req.body
        const image = req.file || req.body
        const user = await userModel.findById(userId)
        const gambar = user.image
        console.log('password', password)
        if(password.length > 0) {user.password = password}

        if(gambar !== image.image) {
            await cloudinary.uploader.destroy(user.public_id)
            const gambarCloudinary = await cloudinary.uploader.upload(image.path, {resource_type: "image"})
            user.image = gambarCloudinary.secure_url
            user.public_id = gambarCloudinary.public_id
        }

        if (user) {
            await historyModel.create({
                type: 'update',
                textLogDate: String(tanggalIndo(new Date(Date.now()))),
                by: userId,
                rangkuman: `${user.name} mengubah detail dari akunnya`,
                textLog: `${user.name} mengupdate detail akunyya dengan data berikut: \n - Nama: ${name} \n - Email: ${email} \n - Title: ${title} \n - Role: ${role}`,
              })
            user.name = name
            user.title = title
            user.role = role
            user.email = email
            const updateUser = await user.save()
            updateUser.password = undefined
            res.status(200).json({success:true, message:'Berhasil memperbarui data profil', data:updateUser})
        } else {
            res.status(401).json({success:false, message:'Gagal memperbarui data profil, silahkan coba lagi'})
        }
    } catch (error) {
        console.log(error);
        res.status(401).json({success:false, message:error.message, inti: 'Gagal memperbarui data profil, silahkan coba lagi'})
    }
}

const markNotificationRead = async(req,res)=>{
    try {
        console.log(req.body);
        const {userId, isAdmin, isUstadz} = req.user
        const {isReadType, id}  = req.body

        if(isReadType === 'all') {
            if(isAdmin || isUstadz) {
                await notificationModel.updateMany(
                    {leader: userId, isRead: { $nin: [userId] }},
                    { $push: {isRead: userId} },
                    { new: true }
                )
            } else {
                await notificationModel.updateMany(
                    {team: userId, isRead: { $nin: [userId] }},
                    { $push: {isRead: userId} },
                    { new: true }
                )
            }
        } else if(isReadType == 'seen') {
            await notificationModel.updateMany(
                {isSeen: { $nin: [userId] }},
                { $push: {isSeen: userId} },
                { new: true }
            )
        } else {
            await notificationModel.findOneAndUpdate(
                {_id: id, isRead: {$nin: [userId]}},
                { $push: { isRead: userId } },
            )
        }
        res.status(202).json({success:true, message:"Done"})
    } catch (error) {
        console.log(error);
        res.status(401).json({success:false, message:error.message, inti: 'Gagal membaca notifikasi, silahkan coba lagi'})
    }
}

const changeUserPassword = async(req,res)=>{
    try {
        const { userId } = req.user;
    
        const user = await userModel.findById(userId);
        if (user) {
          user.password = req.body.password;
    
          await user.save();
    
          user.password = undefined;
    
          res.status(201).json({
            success: true,
            message: `Sandi berhasil diubah`,
          });
        } else {
          res.status(404).json({ success: false, message: 'User Tidak ditemukan' });
        }
      } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false, message: error.message, inti:"Gagal mengubah sandi, silahkan coba lagi" });
      }
}

const activateUserProfile = async(req,res)=>{
    try {
        const { id } = req.params;
        const {userId} = req.user
        const pemimpin = await userModel.findById(userId)
    
        const user = await userModel.findById(id);
    
        if (user) {
          user.isActive = req.body.isActive; //!user.isActive

          await historyModel.create({
            type: 'update',
            textLogDate: String(tanggalIndo(new Date(Date.now()))),
            by: userId,
            rangkuman: `${pemimpin.name} telah berhasil ${user?.isActive ? 'Mengaktifkan' : 'Menonaktifkan'} user ${user.name}`,
            textLog: `${pemimpin.name} telah berhasil ${user?.isActive ? 'Mengaktifkan' : 'Menonaktifkan'} user dengan id ${user._id} dan nama ${user.name}`,
          })
    
          await user.save();
    
          res.status(201).json({
            success: true,
            message: `User akun dengan ID ${user._id} yang memiliki nama ${user.name} telah berhasil ${user?.isActive ? 'diaktifkan' : 'dinonaktifkan'}`,
          });
        } else {
          res.status(404).json({ success: false, message: 'User Tidak ditemukan' });
        }
      } catch (error) {
        console.log(error);
        return res.status(400).json({ success : false, message: error.message, inti:"Gagal mengaktifkan/menonaktifkan user, silahkan coba lagi" });
      }
}
const deleteUserProfile = async(req,res)=>{
    try {
        const { id } = req.params;
        const {userId} = req.user
        const pemimpin = await userModel.findById(userId)
        const user = await userModel.findById(id);
        if(user.public_id.length > 0) {
            await cloudinary.uploader.destroy(user.public_id)
        }
        await historyModel.create({
            type: 'delete',
            textLogDate: String(tanggalIndo(new Date(Date.now()))),
            by: userId,
            rangkuman: `${pemimpin.name} telah berhasil menghapus user ${user.name}`,
            textLog: `${pemimpin.name} telah berhasil menghapus user dengan id ${user._id} dan nama ${user.name}`,
          })
        await userModel.findByIdAndDelete(id);
        
    
        res.status(200).json({ success: true, message: 'User berhasil dihapus' });
      } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false, message: error.message, inti: 'Gagal menghapus user, silahkan coba lagi' });
      }
}

const createJWT = (res, userId) => {
    const token = jwt.sign({userId}, process.env.TOKEN_SECRET, {expiresIn: '3d'});

    res.cookie('token', token, {
        httpOnly: true, 
        sameSite: 'none', 
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 1000 * 60 * 60 * 24 * 7
    })
}

const listHistory = async(req,res)=>{
    try {
        const {search} = req.body
        const object = {rangkuman: {$regex: search, $options: 'i'}}
        const logs = await historyModel.find(object).populate('by', 'name image').sort({_id: -1});
        res.status(200).json({success:true, message:"Done", logs});
    } catch (error) {
        console.log(error)
        res.status(401).json({success:false, message:error.message, inti: 'Gagal Menampilkan Logs'})
    }
}

const deleteHistory = async(req,res)=>{
    try {
        const { actionType, id } = req.body;
    
        if (actionType === "delete") {
          await historyModel.findByIdAndDelete(id);
        } else if (actionType === "deleteAll") {
          await historyModel.deleteMany();
        } 
        res.status(200).json({
          success: true,
          message: `Operation performed successfully.`,
        });
      } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false, message: error.message });
      }
}

export {registerUser, loginUser, logoutUser, getTeamList, getNotificationList, updateUserProfile, markNotificationRead, changeUserPassword, activateUserProfile, deleteUserProfile, listUser, createAdmin, updateTeam, dropdownUser, createAnnouncement, listHistory, deleteHistory }