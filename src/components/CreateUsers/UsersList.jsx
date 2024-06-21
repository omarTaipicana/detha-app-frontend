import React, { useEffect, useState } from "react";
import CardUser from "./CardUser";
import useAuth from "../../hooks/useAuth";
import "./styles/CardUsers.css"

const UsersList = () => {
  const [, , , , err, isLoading, users, getUsers] = useAuth();
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    if (!fetched) {
      getUsers();
      setFetched(true);
    }
  }, [fetched, getUsers]);

  // console.log(users);

  return (
    <div className="card__users__content">
      {users?.map((user) => (
        <CardUser user={user} key={user.cI} />
      ))}
    </div>
  );
};

export default UsersList;
