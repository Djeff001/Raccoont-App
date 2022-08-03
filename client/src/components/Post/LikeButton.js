import React from "react";
import { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { UidContext } from "../AppContext";
import { Popup } from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { useDispatch } from "react-redux";
import { likePost, unlikePost } from "../../actions/post.actions";

const LikeButton = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const uid = useContext(UidContext);
  const dispatch = useDispatch();

  const like = () => {
    console.log("avant : " + post.likers);
    dispatch(likePost(uid, post._id));

    console.log("apres : " + post.likers);
    setLiked(true);
  };
  const unlike = () => {
    dispatch(unlikePost(uid, post._id));
    setLiked(false);
  };

  useEffect(() => {
    post.likers.includes(uid) ? setLiked(true) : setLiked(false);
  }, [uid, post.likers, liked]);

  return (
    <div className="like-container">
      {uid === null && (
        <Popup
          trigger={<img src="./img/icons/heart.svg" alt="like" />}
          position={["bottom center", "bottom right", "bottom left"]}
          closeOnDocumentClick
        >
          <div>Connectez-vous pour aimer un post !</div>
        </Popup>
      )}
      {uid && liked === false && (
        <img src="./img/icons/heart.svg" alt="like" onClick={like} />
      )}

      {uid && liked && (
        <img src="./img/icons/heart-filled.svg" alt="liked" onClick={unlike} />
      )}
      <span>{post.likers.length}</span>
    </div>
  );
};

export default LikeButton;
