const UserModel = require("../models/user.model");
const fs = require("fs");
const { promisify } = require("util");
const { uploadErrors } = require("../utils/errors.utils");
const stream = require("stream");
const pipeline = promisify(stream.pipeline);
const path = require("path");

module.exports.uploadProfil = async (req, res) => {
  try {
    if (
      req.file.mimetype !== "image/jpg" &&
      req.file.mimetype !== "image/jpeg" &&
      req.file.mimetype !== "image/png"
    )
      throw Error("Invalid file");
    if (req.file.size > 500000) throw Error("Max size");
  } catch (err) {
    fs.unlinkSync(req.file.path);
    const errors = uploadErrors(err);
    return res.status(201).json({ errors });
  }
  const fileName = req.body.name + ".jpg";

  fs.renameSync(
    req.file.path,
    req.file.path.replace(req.file.originalname, fileName)
  );

  try {
    await new Promise((resolve, reject) => {
      UserModel.findByIdAndUpdate(
        req.body.userId,
        { $set: { picture: "./uploads/profil/" + fileName } },
        { new: true, upsert: true, setDefaultsOnInsert: true },
        (err, docs) => {
          if (!err) return res.send(docs);
          return res.status(500).send({ message: err });
        }
      );
    });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};
