import React, { useState } from "react";
import CreateUsers from "./CreateUsers";
import UsersList from "./UsersList";

export const UsersContent = () => {
  const [userEdit, setUserEdit] = useState();
  const [formIsClouse, setFormIsClouse] = useState(true);
  const [newUser, setNewUser] = useState();
  return (
    <div>
      <CreateUsers
        userEdit={userEdit}
        setUserEdit={setUserEdit}
        formIsClouse={formIsClouse}
        setFormIsClouse={setFormIsClouse}
        setNewUser={setNewUser}
      />
      <UsersList
        userEdit={userEdit}
        setUserEdit={setUserEdit}
        setFormIsClouse={setFormIsClouse}
        newUser={newUser}
      />
    </div>
  );
};
