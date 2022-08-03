import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { getPosts } from "../actions/post.actions";
import { isEmpty } from "./utils";
import Card from "./Post/Card";

const Thread = () => {
  const [loadPost, setLoadPost] = useState(true);
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.postReducer);
  const [count, setCount] = useState(5);

  const loadMore = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >
      document.scrollingElement.scrollHeight
    ) {
      setLoadPost(true);
    }
  };
  useEffect(() => {
    if (loadPost) {
      dispatch(getPosts(count));
      setLoadPost(false);
      setCount(count + 5);
    }

    window.addEventListener("scroll", loadMore);
    return () => window.removeEventListener("scroll", loadMore);
  }, [loadPost, dispatch, count]);
  return (
    <div className="thread-container">
      <ul>
        {!isEmpty(posts) &&
          posts.map((post) => {
            return <Card post={post} key={post._id} />;
          })}
      </ul>
    </div>
  );
};

export default Thread;
