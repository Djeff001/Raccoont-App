import axios from "axios";

// Posts
export const GET_POSTS = "GET_POSTS";
export const GET_ALL_POSTS = "GET_ALL_POSTS";
export const ADD_POST = "ADD_POST";
export const LIKE_POST = "LIKE_POST";
export const UNLIKE_POST = "UNLIKE_POST";
export const UPDATE_POST = "UPDATE_POST";
export const DELETE_POST = "DELETE_POST";

// Comments
export const ADD_COMMENT = "ADD_COMMENT";
export const EDIT_COMMENT = "EDIT_COMMENT";
export const DELETE_COMMENT = "DELETE_COMMENT";

// Errors
export const GET_POST_ERRORS = "GET_POST_ERRORS";

// Triends
export const GET_TRENDS = "GET_TRENDS";

export const getPosts = (num) => {
  return (dispatch) => {
    return axios
      .get(process.env.REACT_APP_API_URL + "api/post/")
      .then((res) => {
        const array = res.data.slice(0, num);
        dispatch({ type: GET_POSTS, payload: array });
        dispatch({ type: GET_ALL_POSTS, payload: res.data });
      })
      .then((err) => console.log(err));
  };
};

export const addPost = (data) => {
  return (dispatch) => {
    return axios
      .post(process.env.REACT_APP_API_URL + "api/post/", data)
      .then((res) => {
        if (res.data.errors) {
          dispatch({ type: GET_POST_ERRORS, payload: res.data.errors });
        } else {
          dispatch({ type: GET_POST_ERRORS, payload: "" });
        }
      });
  };
};

export const likePost = (likerPostId, postId) => {
  return (dispatch) => {
    return axios
      .patch(process.env.REACT_APP_API_URL + "api/post/like-post/" + postId, {
        likerPostId,
      })
      .then((res) => {
        dispatch({ type: LIKE_POST, payload: { likerPostId, postId } });
      })
      .then((err) => console.log(err));
  };
};

export const unlikePost = (unlikerPostId, postId) => {
  return (dispatch) => {
    return axios
      .patch(process.env.REACT_APP_API_URL + "api/post/unlike-post/" + postId, {
        unlikerPostId,
      })
      .then((res) => {
        dispatch({ type: UNLIKE_POST, payload: { unlikerPostId, postId } });
      })
      .then((err) => console.log(err));
  };
};

export const updatePost = (postId, message) => {
  return (dispatch) => {
    return axios
      .put(process.env.REACT_APP_API_URL + "api/post/" + postId, {
        message,
      })
      .then((res) => {
        dispatch({ type: UPDATE_POST, payload: { postId, message } });
      })
      .then((err) => console.log(err));
  };
};

export const deletePost = (postId) => {
  return (dispatch) => {
    return axios
      .delete(process.env.REACT_APP_API_URL + "api/post/" + postId)
      .then((res) => {
        dispatch({ type: DELETE_POST, payload: postId });
      })
      .then((err) => console.log(err));
  };
};

export const addComment = (postId, commenterId, text, commenterPseudo) => {
  return (dispatch) => {
    return axios
      .patch(
        process.env.REACT_APP_API_URL + "api/post/comment-post/" + postId,
        {
          commenterId,
          text,
          commenterPseudo,
        }
      )
      .then((res) => {
        dispatch({
          type: ADD_COMMENT,
          payload: { postId },
        });
      })
      .then((err) => console.log(err));
  };
};

export const editComment = (postId, commentId, text) => {
  return (dispatch) => {
    return axios
      .patch(
        process.env.REACT_APP_API_URL + "api/post/edit-comment-post/" + postId,
        {
          commentId,
          text,
        }
      )
      .then((res) => {
        dispatch({
          type: EDIT_COMMENT,
          payload: { postId, commentId, text },
        });
      })
      .then((err) => console.log(err));
  };
};

export const deleteComment = (postId, commentId) => {
  return (dispatch) => {
    return axios
      .patch(
        process.env.REACT_APP_API_URL +
          "api/post/delete-comment-post/" +
          postId,
        { commentId }
      )
      .then((res) => {
        dispatch({ type: DELETE_COMMENT, payload: { postId, commentId } });
      })
      .then((err) => console.log(err));
  };
};

export const getTrends = (sortedArr) => {
  return (dispatch) => {
    return dispatch({ type: GET_TRENDS, payload: sortedArr });
  };
};
