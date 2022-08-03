import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FollowHandler from "./FollowHandler";

const FriendsHint = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [playOne, setplayOne] = useState(true);
  const [friendsHint, setfriendsHint] = useState([]);
  const userData = useSelector((state) => state.userReducer);
  const usersData = useSelector((state) => state.usersReducer);

  useEffect(() => {
    const notFriendlist = () => {
      let array = [];
      usersData.map((user) => {
        if (userData._id !== user._id && !user.followers.includes(userData._id))
          return array.push(user._id);
      });
      array.sort(() => 0.5 - Math.random());
      if (window.innerHeight > 780) array.length = 5;
      else if (window.innerHeight > 720) array.length = 4;
      else if (window.innerHeight > 615) array.length = 3;
      else if (window.innerHeight > 540) array.length = 1;
      else array.length = 0;
      setfriendsHint(array);
    };
    if (playOne && usersData[0] && userData._id) {
      notFriendlist();
      setIsLoading(false);
      setplayOne(false);
    }
  }, [userData, usersData]);

  return (
    <div className="get-friends-container">
      <h4>Suggestions</h4>
      {isLoading ? (
        <div className="icon">
          <i className="fas fa-spinner fa-pulse"></i>
        </div>
      ) : (
        <ul>
          {friendsHint &&
            friendsHint.map((user) => {
              for (let u of usersData) {
                if (user === u._id) {
                  return (
                    <li className="user-hint" key={user}>
                      <img src={u.picture} alt="user-pic" />
                      <p>{u.pseudo}</p>
                      <FollowHandler idToFollow={u._id} type="suggestion" />
                    </li>
                  );
                }
              }
            })}
        </ul>
      )}
    </div>
  );
};

export default FriendsHint;
