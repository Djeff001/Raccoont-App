const PostModel = require("../models/post.model");
const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;
const { uploadErrors } = require("../utils/errors.utils");
const path = require("path");
const fs = require("fs");

module.exports.readPost = (req, res) => {
  PostModel.find((err, docs) => {
    if (!err) res.send(docs);
    else console.log("Error to get data " + err);
  }).sort({ createdAt: -1 });
};

module.exports.createPost = async (req, res) => {
  let fileName;
  if (req.file) {
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

    fileName = req.body.posterId + Date.now() + ".jpg";
    fs.renameSync(
      req.file.path,
      req.file.path.replace(req.file.originalname, fileName)
    );
  }
  const newPost = new PostModel({
    posterId: req.body.posterId,
    message: req.body.message,
    picture: req.file ? "./uploads/posts/" + fileName : "",
    video: req.body.video,
    likers: [],
    comments: [],
  });

  try {
    const post = await newPost.save();
    res.status(201).json(post);
  } catch {
    return res.status(400).send(err);
  }
};

module.exports.updatePost = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  const updatedRecord = {
    message: req.body.message,
  };
  PostModel.findByIdAndUpdate(
    req.params.id,
    { $set: updatedRecord },
    { new: true },
    (err, docs) => {
      if (!err) res.send(docs);
      else console.log("update error " + err);
    }
  );
};

module.exports.deletePost = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);
  PostModel.findByIdAndRemove(req.params.id, (err, docs) => {
    if (!err) res.send(docs);
    else console.log("Delete error " + err);
  });
};

module.exports.likePost = async (req, res) => {
  if (
    !ObjectID.isValid(req.params.id) ||
    !ObjectID.isValid(req.body.likerPostId)
  )
    return res.status(400).send("ID unknown ");
  try {
    await new Promise((resolve, reject) => {
      PostModel.findByIdAndUpdate(
        req.params.id,
        { $addToSet: { likers: req.body.likerPostId } },
        { new: true },
        (err, _) => {
          if (err) return res.status(400).send(err);
        }
      );
      UserModel.findByIdAndUpdate(
        req.body.likerPostId,
        { $addToSet: { likes: req.params.id } },
        { new: true },
        (err, docs) => {
          if (!err) res.send(docs);
          else return res.status(400).send(err);
        }
      );
    });
  } catch (err) {
    return res.status(400).send({ message: err });
  }
};

module.exports.unlikePost = async (req, res) => {
  if (
    !ObjectID.isValid(req.params.id) ||
    !ObjectID.isValid(req.body.unlikerPostId)
  )
    return res.status(400).send("ID unknown : " + req.params.id);
  try {
    await new Promise((resolve, reject) => {
      PostModel.findByIdAndUpdate(
        req.params.id,
        { $pull: { likers: req.body.unlikerPostId } },
        { new: true },
        (err, _) => {
          if (err) return res.status(400).send(err);
        }
      );
      UserModel.findByIdAndUpdate(
        req.body.unlikerPostId,
        { $pull: { likes: req.params.id } },
        { new: true, upsert: true },
        (err, docs) => {
          if (!err) res.send(docs);
          else return res.status(400).send(err);
        }
      );
    });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};

module.exports.commentPost = (req, res) => {
  if (
    !ObjectID.isValid(req.params.id) ||
    !ObjectID.isValid(req.body.commenterId)
  )
    return res.status(400).send("ID unknown ");
  try {
    PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          comments: {
            commenterId: req.body.commenterId,
            commenterPseudo: req.body.commenterPseudo,
            text: req.body.text,
            timestamp: new Date().getTime(),
          },
        },
      },
      { new: true },
      (err, docs) => {
        if (!err) res.send(docs);
        else return res.status(400).send(err);
      }
    );
  } catch (err) {
    return res.status(400).send({ message: err });
  }
};

module.exports.editCommentPost = (req, res) => {
  if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.commentId))
    return res.status(400).send("ID unknown ");
  try {
    return PostModel.findById(req.params.id, (err, docs) => {
      if (err) return res.status(400).send(err);
      const theComment = docs.comments.find((comment) =>
        comment._id.equals(req.body.commentId)
      );
      if (!theComment) res.status(404).send("Comment not found");
      theComment.text = req.body.text;
      return docs.save((err) => {
        if (!err) return res.status(200).send(docs);
        return res.status(500).send(err);
      });
    });
  } catch (err) {
    return res.status(400).send({ message: err });
  }
};

module.exports.deleteCommentPost = (req, res) => {
  if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.commentId))
    return res.status(400).send("ID unknown ");
  try {
    PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          comments: { _id: req.body.commentId },
        },
      },
      { new: true },
      (err, docs) => {
        if (!err) res.send(docs);
        else return res.status(400).send(err);
      }
    );
  } catch (err) {
    return res.status(400).send({ message: err });
  }
};
