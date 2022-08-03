import React from "react";
import { useDispatch } from "react-redux";
import { deletePost } from "../../actions/post.actions";

const DeleteCard = ({ postId }) => {
  const dispatch = useDispatch();

  const deleteQuote = () => {
    dispatch(deletePost(postId));
  };

  return (
    <div
      onClick={() => {
        if (window.confirm("Voulez-vous supprimer ce post ?")) deleteQuote();
      }}
    >
      <img src="./img/icons/trash.svg" alt="trash" />
    </div>
  );
};

export default DeleteCard;
