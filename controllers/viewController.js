const User = require("./../models/userModel");
const File = require("./../models/fileModel");
const Folder = require("./../models/folderModel");

exports.home = async (req, res, next) => {
  res.status(200).render("index");
};

exports.files = async (req, res, next) => {
  let folders = await Folder.find({})

  res.status(200).render("files", {folders});
};

exports.download = async (req, res, next) => {
  let navFolder = await Folder.find()
  let folders = await Folder.findById(req.params.id).populate('files')
  res.status(200).render('download',{navFolder,folders});
};

exports.contact = async (req, res, next) => {
  res.status(200).render("contact");
};

exports.login = async (req, res, next) => {
  res.status(200).render('login');
};

exports.addFile = async (req, res, next) => {
  let folders = await Folder.find()
  let files = await File.find().populate('folder').sort({ date: -1 })
  // console.log(files)
  res.status(200).render('dashboard/add-file', {folders,files,user:req.user});
};

exports.addUser = async (req, res, next) => {
  //find two roles: user and sub-admin
  const users = await User.find({role:{$in:['user','sub-admin']}})
  let folders = await Folder.find()
  res.status(200).render('dashboard/add-user', {folders,users,user:req.user});
};

exports.addFolder = async (req, res, next) => {
  let folders = await Folder.find()

  res.status(200).render('dashboard/add-folder',{folders,user:req.user});
};

exports.folder = async (req, res, next) => {
  let navFolder = await Folder.find()
  let folders = await Folder.findById(req.params.id).populate('files')
  res.status(200).render('dashboard/folder',{navFolder,folders,user:req.user});
}