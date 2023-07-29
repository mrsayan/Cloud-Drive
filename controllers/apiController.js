const User = require("./../models/userModel");
const File = require("./../models/fileModel");
const Folder = require("./../models/folderModel");
const path = require("path");
const { unlink } = require('fs');

exports.addFolder = async (req, res, next) => {
  try {
    if (req.files) {
      let img = req.files.img
      console.log(path.extname(img.name))
      req.body.img = path.extname(img.name)
      let newFolder = await Folder.create(req.body)
      // let ext = path.extname(img.name)
      img.mv(
        path.join(__dirname, "../static", "files", "thumbnail/" + newFolder.img),
        async function (err) {
          if (err) {
            return res.json({
              err
            });
          }
        }
      );
      return res.redirect("/dashboard/add-folder")
    }
    return res.redirect("/dashboard/add-folder")

  } catch (error) {
    console.log(error)
    res.json({
      error
    })
  }
};


exports.addUser = async (req, res, next) => {
  try {
    console.log(req.body)
    const newUser = await User.create({
      name: req.body.name,
      username: req.body.username,
      password: req.body.password,
      role: req.body.role
      //   passwordConfirm: req.body.passwordConfirm,
    });
    res.redirect("/dashboard/add-user")
  } catch (err) {
    // let message = `Duplicate value: ${Object.values(err.keyValue)[0]} for ${
    //     Object.keys(err.keyValue)[0]
    //   } field`;
    //   return res.render("error", {
    //     status: 400,
    //     message: message,
    //   });
    console.log(err)
    res.json(err)
  }

};

exports.removeUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.body.id)
    return res.redirect("/dashboard/add-user")
  } catch (err) {
    // let message = `Duplicate value: ${Object.values(err.keyValue)[0]} for ${
    //     Object.keys(err.keyValue)[0]
    //   } field`;
    //   return res.render("error", {
    //     status: 400,
    //     message: message,
    //   });
    console.log(err)
    res.json(err)
  }

};

exports.addFile = async (req, res, next) => {
  try {
    // newFile.addFile(req.body.folder,req.files.file)
    if (req.files) {
      let file = req.files.file
      let img = req.files.img
      // let filename = req.body.name; 
      req.body.path = path.extname(file.name)
      req.body.img = path.extname(img.name)

      //create file
      const newFile = await File.create(req.body)

      //move file
      img.mv(
        path.join(__dirname, "../static", "files", "thumbnail/" + newFile.img),
        async function (err) {
          if (err) {
            return res.json({
              err
            });
          }
        }
      );
      file.mv(
        path.join(__dirname, "../static", "files/" + newFile.path),
        async function (err) {
          if (err) {
            return res.json({
              err
            });
          }
        }
      );

      //push file in folder
      await Folder.findByIdAndUpdate(req.body.folder,
        { $push: { files: newFile } })
      res.redirect(req.get('referer'));
    }
    // console.log(req.files)

  } catch (err) {

    console.log(err)
    res.json(err)
  }

};

exports.removeFile = async (req, res, next) => {
  try {
    let file = await File.findById(req.body.file)
    unlink('./static/files/' + file.path, (err) => {
      if (err) throw err;
      console.log('Deleted');

    })
    unlink('./static/files/thumbnail/' + file.img, (err) => {
      if (err) throw err;
      console.log('Deleted');

    })

    //push file in folder
    await Folder.findByIdAndUpdate(file.folder,
      { $pull: { files: file._id } })


    await File.findByIdAndDelete(req.body.file)

    // redirect to page the file was deleted from
    res.redirect(req.get('referer'));
  } catch (error) {
    console.log(error)
    res.json({
      error
    })
  }
};

exports.download = async (req, res, next) => {
  try {
    let file = await File.findById(req.params.id)
    res.download(path.join(__dirname, "../static/files/", file.path));
  } catch (error) {
    console.log(error)
    res.json({
      error
    })
  }
};


exports.moveFile = async (req, res, next) => {
  try {
    // Extract the file and target folder IDs from the request body
    const { fileId, targetFolderId } = req.body;

    // Find file by id
    let file = await File.findById(fileId);

    if (!file) {
      return res.status(404).json({
        status: 'fail',
        message: 'No file found with that ID'
      });
    }

    // Remove reference to this file in its current Folder's files array
    await Folder.findByIdAndUpdate(file.folder, { $pull: { files: fileId } });

    // Update the folder field for this File document to refer to new Folder
    await File.findByIdAndUpdate(fileId, { folder: targetFolderId });

    // Add reference to this file in new Folder's files array.
    await Folder.findByIdAndUpdate(targetFolderId,
      { $push: { files: fileId } })

    res.redirect(req.get('referer'));

  }

  catch (error) {
    console.log(error)
    res.json({
      error
    })
  }
};

exports.addPermission = async (req, res, next) => {
  try {
    // Extract the file ID and new permission from the request body
    const { fileId, permission } = req.body;

    // Check if provided permission value is valid
    if (!['user', 'admin'].includes(permission)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid permission type'
      });
    }

    // Find File by id and update its permissions
    let file = await File.findByIdAndUpdate(fileId, { permission }, { new: true });

    if (!file) {
      return res.status(404).json({
        status: 'fail',
        message: 'No file found with that ID'
      });
    }

     // redirect to page where permissions were changed 
     res.redirect(req.get('referer'));

  }
  catch (error) {
   console.log(error)
   res.json({
       error
   })
 }
};