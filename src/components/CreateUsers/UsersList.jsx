import React, { useEffect, useState } from "react";
import CardUser from "./CardUser";
import useAuth from "../../hooks/useAuth";
import "./styles/CardUsers.css";

const UsersList = ({ userUpdated, setUserEdit, setFormIsClouse }) => {
  const [, , , , err, isLoading, users, getUsers] = useAuth();
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    getUsers();
  }, [userUpdated]);

  // console.log(users);

  return (
    <div className="card__users__content">
      {users
        ?.slice()
        .reverse()
        .map((user) => (
          <CardUser
            user={user}
            key={user.cI}
            setUserEdit={setUserEdit}
            setFormIsClouse={setFormIsClouse}
          />
        ))}
    </div>
  );
};

export default UsersList;
