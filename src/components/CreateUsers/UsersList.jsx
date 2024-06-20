import React, { useEffect } from "react";
import CardUser from "./CardUser";
import useAuth from "../../hooks/useAuth";
import "./styles/CardUsers.css"

const UsersList = () => {
  const [, , , , err, isLoading, users, getUsers] = useAuth();
  useEffect(() => {
    getUsers();
  }, [users]);

  return (
    <div className="card__users__content">
      {users?.map((user) => (
        <CardUser user={user} key={user.cI} />
      ))}
    </div>
  );
};

export default UsersList;
