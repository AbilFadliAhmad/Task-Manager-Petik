import { taskModel } from '../models/TaskModel.js';
import { notificationModel } from '../models/notificationModel.js';
import { userModel } from '../models/UserModel.js';
import {v2 as cloudinary} from 'cloudinary';
import _ from 'lodash'
import { historyModel } from '../models/historyModel.js';

const tanggalIndo = (date) => {
  const hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  return `${hari[date.getDay()]} ${String(date.getDate()).padStart(2, '0')} ${bulan[date.getMonth()]} ${date.getFullYear()}`;
};

const createTask = async (req, res) => {
  try {
    const { userId, leader:ustadz } = req.user;
    const { title, team=[], stage, date, priority, leader=[] } = req.body;
    const image = req.file || req.body.image;
    const tanggal = new Date(String(date))
    const user = await userModel.findById(userId);
    if(!image) {
     return res.status(401).json({success: false, message: 'Assets Tidak Boleh Kosong'}) 
    }
    const gambarCloudinary = await cloudinary.uploader.upload(image.path, {resource_type: "image"})

    
    let text = 'Tugas baru dengan judul: ' + title + ' telah Ditetapkan.';
    text = text + ` Prioritas tugas ini disetting di level ${priority}, tugas ini ditetapkan saat ${tanggalIndo(tanggal)}. Terima Kasih!!!`;

    const activity = {
      type: 'assigned',
      activity: text,
      by: userId,
    };

    const task = await taskModel.create({
      title,
      stage: stage.toLowerCase(),
      date:date.slice(0, 10),
      priority: priority.toLowerCase(),
      activities: activity,
      assets: gambarCloudinary?.secure_url ?? [],
      public_id: gambarCloudinary?.public_id ?? '',
    });

    
    const notif = await notificationModel.create({
      task: task._id,
      notiType: 'message',
    });

    if (leader?.length > 0) {
      const text1 = [];
      text1[0] = `Admin telah menunjuk anda untuk memimpin tugas ini. Silakan pilih beberapa anggota tambahan untuk mendukung penyelesaian tugas ini dengan lebih efektif`;
      text1[1] = String(new Date(Date.now()).toLocaleDateString('id').split('/').join("-")); 
      if(leader.length == 1) {
        await task.leader.push(leader);
        await notif.leader.push(leader);
      } else {
        const array = leader.split(',');
        text1[0] = `Admin telah menunjuk anda ${array.length - 1 > 0 ? `dan ${array?.length - 1} User yang lain `  : ''} untuk memimpin tugas ini. Silakan pilih beberapa anggota tambahan untuk mendukung penyelesaian tugas ini dengan lebih efektif`;
        task.leader = [...array]; 
        notif.leader= [...array];
      }
      
      notif.textLeader= text1;
      await task.save();
      await notif.save();
    }

    if (team?.length > 0) {
      
      if(team.length == 1) {
        await task.team.push(team);
        await notif.team.push(team);
      } else {
        const array = team.split(',');
        task.team = [...array];
        notif.team= [...array];
        
      }
      await task.save()
      await notif.save();
    }


    const tugasTerpilih = await taskModel.findById(task._id).populate('leader','name');
    const semuaPemimpin = tugasTerpilih.leader.map(user => user.name);
    await historyModel.create({
      type: 'create',
      textLogDate:String(tanggalIndo(new Date(Date.now()))),
      by: userId,
      rangkuman: `Membuat Tugas baru berjudul ${title}`,
      textLog: `Tugas baru dengan judul: ${title} terlah berhasil dibuat oleh ${user.name}, tugas ini disetting di level ${priority}, tugas ini ditetapkan untuk ditangani pada ${tanggalIndo(tanggal)}. Pemimpin dari tugas ini terdiri dari ${semuaPemimpin.join(', ')}`,
    })

    res.status(200).json({ success: true, task, message: 'Tugas berhasil dibuat.' });
  } catch (error) {
    console.log(error);
    res.status(401).json({ success: false, message: error.message, inti: 'Gagal membuat task, silahkan coba lagi' });
  }
};
const duplicateTask = async (req, res) => {
  try {
    const {userId} = req.user
    const user = await userModel.findById(userId)
    const id  = req.body.id;
    const task = await taskModel.findById(id);
    const tanggal = new Date(String(task.date))

    const newTask = await taskModel.create({
      ...task,
      title: task.title + ' (copy)',
    });
    console.log(newTask, 'sebelum')
    newTask.team = task.team;
    newTask.assets = task.assets;
    newTask.leader = task.leader;
    newTask.priority = task.priority;
    newTask.stage = task.stage;
    newTask.public_id = task.public_id;

    await newTask.save();

    let text = 'Tugas baru telah ditugaskan ke kamu';
    if (task?.team?.length > 1) {
      text = text + ` dan ${task?.team?.length - 1} lagi anggota yang lain.`;
    }

    text = text + ` Prioritas tugas ditetapkan di level ${newTask?.priority} jadi periksa lebih lanjut. tugas ini dibuat saat ${new Date(newTask?.date).toDateString()}. Terima Kasih!!!`;

    await notificationModel.create({
      team: newTask.team,
      text,
      task: newTask._id,
    });

    const tugasTerpilih = await taskModel.findById(newTask._id).populate('leader','name');
    const semuaPemimpin = tugasTerpilih.leader.map(user => user.name);
    await historyModel.create({
      type: 'duplicate',
      textLogDate:String(tanggalIndo(new Date(Date.now()))),
      by: userId,
      rangkuman: `Menduplicate tugas ${task.title}`,
      textLog: `Tugas baru dengan judul: ${newTask.title} terlah berhasil diduplikat oleh ${user.name}, tugas ini disetting di level ${newTask.priority}, tugas ini ditetapkan saat ${tanggalIndo(tanggal)}. Pemimpin dari tugas ini terdiri dari ${semuaPemimpin.join(', ')}`,
    })

    res.status(200).json({ success: true, message: 'Berhasil menduplicate task', data: newTask });
  } catch (error) {
    console.log(error);
    res.status(200).json({ success: false, message: error.message, inti: 'Gagal menduplicate task, silahkan coba lagi' });
  }
};
const postTaskActivity = async (req, res) => {
  try {
    const { userId } = req.user;
    const { type, activity, id } = req.body;
    const user = await userModel.findById(userId);

    const task = await taskModel.findById(id);

    const data = {
      type: type.toLowerCase(),
      activity,
      by: userId,
    };

    task.activities.push(data);

    await task.save();

    await historyModel.create({
      type: 'create',
      textLogDate:String(tanggalIndo(new Date(Date.now()))),
      by: userId,
      rangkuman: `Aktivitas baru dibuat saat ${String(tanggalIndo(new Date(Date.now())))}`,
      textLog: `Aktivitas baru yang dibuat oleh ${user.name} telah ditambahkan di tugas yang berjudul: ${task.title}`,
    })

    res.status(200).json({ success: true, message: 'Aktifitas Telah Dikirim.' });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message, inti: 'Gagal mengirim aktifitas, silahkan coba lagi' });
  }
};

const dashboardStatistics = async (req, res) => {
  try {
    const { userId, isAdmin, isUstadz } = req.user;

    const allTasks = isAdmin
      ? await taskModel.find({
          isTrashed: false,
        })
          .populate({
            path: "team",
            select: "name role title email image",
          })
          .sort({ _id: -1 })
      : isUstadz 
      ? await taskModel.find({
        isTrashed: false,
        leader: { $all: [userId] },
      })
        .populate({
          path: "team",
          select: "name role title email image",
        })
        .sort({ _id: -1 })
      :await taskModel.find({
          isTrashed: false,
          team: { $all: [userId] },
        })
          .populate({
            path: "team",
            select: "name role title email image",
          })
          .sort({ _id: -1 });


    // Group tasks by stage and calculate counts
    const groupTaskks = allTasks.reduce((result, task) => {
      const stage = task.stage;

      if (!result[stage]) {
        result[stage] = 1;
      } else {
        result[stage] += 1;
      }

      return result;
    }, {});


    // Group tasks by priority
    const groupData = Object.entries(
      allTasks.reduce((result, task) => {
        const { priority } = task;

        result[priority] = (result[priority] || 0) + 1;
        return result;
      }, {})
    ).map(([name, total]) => ({ name, total }));

    // Calculate total tasks
    const totalTasks = allTasks?.length;
    const last10Task = allTasks?.slice(0, 11);

    // Menentukan User setiap Ustadz
    let hasilMurid;
    let HasilUstadz;
    if(!isAdmin) {
      const user = await userModel.findById(userId).populate('member');
      
      const admin = await userModel.findById(user.leader);
      const ustadz = await userModel.findById(user.leader);
      const ustadzMember = await userModel.findById(user.leader).populate('member');
      const memberUstadz = user.member
      HasilUstadz = [admin, user, ...memberUstadz]
      hasilMurid = [admin, ustadz, ...ustadzMember.member]
    } 
    const summary = {
      totalTasks,
      last10Task,
      tasks: groupTaskks,
      graphData: groupData,
      users: isAdmin ? await userModel.find() : isUstadz ? HasilUstadz : hasilMurid
    };

    res.status(200).json({
      success: true,
      message: "Successfully",
      ...summary,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

const getTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await taskModel.findById(id)
      .populate({
        path: "team",
        select: "name title role email image",
      })
      .populate({
        path: "activities.by",
        select: "name",
      })
      .populate({
        path: "leader",
        select: "name title role email image",
      });

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message, inti:"Gagal mendapatkan tugas" });
  }
};

const updateTask = async (req, res) => {
  try {
    const { userId, leader:ustadz, isAdmin:isLeader } = req.user;
    const user = await userModel.findById(userId);
    const { title, date, team=[], stage, priority, assets=[], leader=[], id } = req.body;
    const notifArray = await notificationModel.find({task:id})
    const notif = notifArray[0]
    const image = req.file || req.body.image;
    
    const task = await taskModel.findById(id);
    const dataPrevTask = JSON.parse(JSON.stringify(task))
    const dataHasilPopulatePrevTask2 = await taskModel.findById(id).populate('team').populate('leader')
    const dataHasilPopulatePrevTask = JSON.parse(JSON.stringify(dataHasilPopulatePrevTask2)) // fungsi dari syntax seperti ini agar data independen
    let teamNewTask;
    let leaderNewTask;

    if(!task) return res.json({success: false, message: 'Tugas tidak ditemukan'})
      if(image !== task.assets[0]) {
        await cloudinary.uploader.destroy(task.public_id);
        const imageCloudinary = await cloudinary.uploader.upload(image.path, {resource_type: "image"})
        task.assets[0] = imageCloudinary.secure_url
        task.public_id = imageCloudinary.public_id
      }
      
    task.title = title;
    task.date = date;
    task.priority = priority.toLowerCase();
    // task.assets = assets;
    task.stage = stage.toLowerCase();

    await task.save();

    if(!leader.includes('object')) {
      if(leader.length > 0) {
        if(leader.length > 8) {
          const array = leader.split(',')
          if(!array) {
            task.leader.push(leader)
            leaderNewTask = [leader]
            await task.save()
          } else {
            task.leader = [...array]
            leaderNewTask = [...array]
            await task.save()
          }
        } else if(leader.length > 1) {
          task.leader = [...leader]
          leaderNewTask = [...leader]
          await task.save();
        }
      }
    }
      
    if(assets.length > 0) {
      if(assets.length > 8) {
        const array = assets.split(',')
        task.assets = [...array]
        await task.save()
      } else {
        task.assets = [...assets]
        await task.save();
      }
    }

    if(!team.includes('object')) {
      const text1 = [];
      const pemimpin = isLeader ? await userModel.findById(userId) : await userModel.findById(ustadz);
      text1[0] = `Anda telah ditugaskan oleh: ${pemimpin.name} untuk menjadi bagian Dalam mendukung penyelesaian tugas ini.`;
      text1[1] = String(new Date(Date.now()).toLocaleDateString('id').split('/').join("-"));
      if(team.length > 0) {
        if(team.length > 10) {
          const array = team.split(',')
          if(!array) {
            task.team.push(team)
            notif.team.push(team)
            teamNewTask = [team]
          } else {
            task.team = [...array]
            notif.team = [...array]
            text1[0] = `Anda ${array.length - 1 > 0 ? `dan ${array?.length - 1} Anggota yang lain `  : ''} telah ditugaskan oleh: ${pemimpin.name} untuk menjadi bagian Dalam mendukung penyelesaian tugas ini.`;
            teamNewTask = [...array]
          }
        }
      }
      notif.textMember = text1
      await notificationModel.findByIdAndUpdate(notif._id, notif)
      await task.save();
    }

    const taskBaru = await taskModel.findById(task._id).populate('team').populate('leader')
    const dataNewTask = JSON.parse(JSON.stringify(taskBaru))

    await historyModel.create({
      type: 'update',
      textLogDate:String(tanggalIndo(new Date(Date.now()))),
      by: userId,
      rangkuman: `Memperbarui tugas berjudul: ${task.title}`,
      textLog: (`${user.name} telah Memperbarui data didalam tugas yang berjudul: ${task.title}, \nperubahan ini meliputi dari 
      ${dataPrevTask.title !== task.title ? `dari Judul ${dataPrevTask.title} menjadi ${title}, ` : ``} 
      ${dataPrevTask.date !== dataNewTask.date ? `waktu ${dataPrevTask.date} menjadi ${task.date}, ` : ``} 
      ${!_.isEqual(dataHasilPopulatePrevTask.team, dataNewTask.team)  ? `mengubah anggota dari ${dataHasilPopulatePrevTask.team.map(user=>user.name).join(`, `) ?? 'tidak ada'} menjadi ${taskBaru.team.map(user=>user.name).join(`, `)}, ` : ``} 
      ${!_.isEqual(dataHasilPopulatePrevTask.leader, dataNewTask.leader) ? `mengubah pemimpin dari ${dataHasilPopulatePrevTask.leader.map(user=>user.name).join(`, `)?? 'tidak ada'} menjadi ${taskBaru.leader.map(user=>user.name).join(`, `)}, ` : ``} 
      ${dataPrevTask.priority !== priority.toLowerCase() ? `Level ${dataPrevTask.priority} menjadi Level ${priority.toLowerCase()}, ` : ``} 
      ${dataPrevTask.stage !== stage.toLowerCase() ? `Level ${dataPrevTask.stage} menjadi Level ${stage.toLowerCase()}, ` : ``}`).replace(/\n\s*\n/g, '\n').replace(/\s+/g, ' ').trim()
    })

    res
      .status(200)
      .json({ success: true, message: "Tugas berhasil diperbarui." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};


const deleteRestoreTask = async (req, res) => {
  try {
    const { id } = req.params;
    const {userId} = req.user
    const user = await userModel.findById(userId)
    const task = id === String(undefined) ? null : await taskModel.findById(id);
    const tasks = await taskModel.find({ isTrashed: true });
    const { actionType } = req.query;

    if (actionType === "delete") {
      const taskPublic = await taskModel.findById(id);
      console.log(taskPublic?.public_id ?? null, 'taskPublic');
      taskPublic?.public_id ? await cloudinary.uploader.destroy(taskPublic.public_id) : null
      await taskModel.findByIdAndDelete(id);
    } else if (actionType === "deleteAll") {
      const tasks = await taskModel.find({ isTrashed: true });
      tasks.map(async(item)=> item?.public_id ? await cloudinary.uploader.destroy(item.public_id) : null)
      await taskModel.deleteMany({ isTrashed: true });
    } else if (actionType === "restore") {
      const resp = await taskModel.findById(id);

      resp.isTrashed = false;
      resp.save();
    } else if (actionType === "restoreAll") {
      await taskModel.updateMany(
        { isTrashed: true },
        { $set: { isTrashed: false } }
      );
    } else if (actionType == "deleteTemporary") {
      const resp = await taskModel.findById(id);
      resp.isTrashed = true;
      resp.save()
    }

    await historyModel.create({
      type: 'delete',
      textLogDate:String(tanggalIndo(new Date(Date.now()))),
      by: userId,
      rangkuman: `menghapus/mengembalikan tugas`,
      textLog: `${user.name} telah menghapus/mengembalikan ${id !== String(undefined) ? `tugas berjudul: ${task?.title}` : `semua tugas yang terdiri dari ${tasks.map(task=>task.title).join(', ')}` } `,
    })
    

    res.status(200).json({
      success: true,
      message: `Operation performed successfully.`,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

const listTasks = async(req,res)=>{
  const {userId,isUstadz,isAdmin} = req.user
  const {search, isTrashed} = req.body

  const object = {title: {$regex: search, $options: 'i'}, isTrashed}
  
  try {
    if(isAdmin) {
      const response = await taskModel.find(object).populate('team', 'name title role email isActive image isAdmin isUstadz leader').populate('leader', 'name image email role title').sort({ _id: -1 })
      return res.status(200).json({success:true, message: "Berhasil mengambil data Tasks", data: response})
    } else if(isUstadz) {
      const response = await taskModel.find({leader:userId}).populate('team', 'name title role email isActive image isAdmin isUstadz leader').populate('leader', 'name image email role title').sort({ _id: -1 })
      return res.status(200).json({success:true, message: "Berhasil mengambil data Tasks", data: response})
    } else {
      const response = await taskModel.find({team:userId}).populate('team', 'name title role email isActive image isAdmin isUstadz leader').populate('leader', 'name image email role title').sort({ _id: -1 })
      return res.status(200).json({success:true, message: "Berhasil mengambil data Tasks", data: response})
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({success:false, message: error.message, inti:"Gagal mendapatkan tugas"})
    
  }
}

const resetSemua = async(req,res)=>{
  try {
    // await taskModel.deleteMany({})
    await notificationModel.deleteMany({})
    await historyModel.deleteMany({})
    res.status(200).json({success:true, message:'Berhasil mereset ulang keseluruhan data'})
  } catch (error) {
    console.log(error);
    res.status(491).json({success:false, message:error.message, inti: 'Gagal mereset ulang keseluruhan data'})
  }
}

export { createTask, duplicateTask, postTaskActivity, dashboardStatistics, getTask, updateTask, deleteRestoreTask, listTasks, resetSemua };
