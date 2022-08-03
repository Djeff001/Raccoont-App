import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTrends } from "../actions/post.actions";
import { isEmpty } from "./utils";
import { NavLink } from "react-router-dom";

const Trends = () => {
  const posts = useSelector((state) => state.allPostsReducer);
  const usersData = useSelector((state) => state.usersReducer);
  const trendList = useSelector((state) => state.trendingReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isEmpty(posts[0])) {
      let sortedArr = posts.sort((a, b) => {
        return b.likers.length - a.likers.length;
      });
      sortedArr.length = 3;
      dispatch(getTrends(sortedArr));
    }
  }, [posts, dispatch]);

  return (
    <div className="trending-container">
      <h4>Trending</h4>
      <NavLink end to="/trending">
        <ul>
          {!isEmpty(trendList) &&
            trendList.map((post) => {
              return (
                <li key={post._id}>
                  <div>
                    {post.picture && <img src={post.picture} alt="post-pic" />}
                    {post.video && (
                      <iframe
                        src={post.video}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media;
                        gyroscope; picture-in-picture"
                        allowFullScreen
                        title={post._id}
                      ></iframe>
                    )}
                    {isEmpty(post.picture) && isEmpty(post.video) && (
                      <img
                        src={
                          usersData[0] &&
                          usersData
                            .map((user) => {
                              if (user._id === post.posterId)
                                return user.picture;
                              return null;
                            })
                            .join("")
                        }
                        alt="profil-pic"
                      />
                    )}
                  </div>
                  <div className="trend-content">
                    <p>{post.message}</p>
                    <span>Lire</span>
                  </div>
                </li>
              );
            })}
        </ul>
      </NavLink>
    </div>
  );
};

export default Trends;
