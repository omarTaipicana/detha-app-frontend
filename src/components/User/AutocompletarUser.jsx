import React, { useEffect, useState } from "react";
import Downshift from "downshift";
import "./styles/CreateUsers.css";

const getSuggestions = (value, users, isSubAdmin) => {
  const rolSubAdmin = import.meta.env.VITE_ROL_SUB_ADMIN;
  const inputValue = value.trim().toLowerCase();

  const validUsers = Array.isArray(users) ? users : [];

  const filteredUsers = isSubAdmin
    ? validUsers.filter((user) => user.rol === rolSubAdmin)
    : validUsers;

  return inputValue.length === 0
    ? []
    : filteredUsers.filter((user) => {
        const ciValue = user.cI.toLowerCase();
        const firstNameValue = user.firstName.toLowerCase();
        const lastNameValue = user.lastName.toLowerCase();

        return (
          ciValue.includes(inputValue) ||
          firstNameValue.includes(inputValue) ||
          lastNameValue.includes(inputValue)
        );
      });
};

const renderSuggestion = (user, index, getItemProps, highlightedIndex) => (
  <li
    key={index}
    {...getItemProps({ item: user })}
    style={{
      backgroundColor: highlightedIndex === index ? "#bde4ff" : "white",
      padding: "3px",
      cursor: "pointer",
    }}
  >
    {user.cI} - {user.firstName} {user.lastName}
  </li>
);

const AutocompletarUser = ({ users, setValue, isDisabled, userEdit }) => {
  const rolSubAdmin = import.meta.env.VITE_ROL_SUB_ADMIN;
  const [inputValue, setInputValue] = useState("");
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (userEdit) {
      const selectedUser = users.find(user => user.cI === userEdit.usuarioControl);
      if (selectedUser) {
        const fullName = `${selectedUser.cI} - ${selectedUser.firstName} ${selectedUser.lastName}`;
        setInputValue(fullName);
        setIsValid(true);
      }
    }
  }, [userEdit, users]);

  const userLoggued = JSON.parse(localStorage.getItem("user"));
  const isSubAdmin = userLoggued?.rol === rolSubAdmin;

  return (
    <Downshift
      inputValue={inputValue}
      onChange={(selectedItem) => {
        const fullName = `${selectedItem.cI} - ${selectedItem.firstName} ${selectedItem.lastName}`;
        setInputValue(fullName);
        setIsValid(true);
        setValue("usuarioControl", selectedItem.cI);
      }}
      onInputValueChange={(newValue) => {
        setInputValue(newValue);
        setIsValid(false);
      }}
      itemToString={(item) =>
        item ? `${item.cI} - ${item.firstName} ${item.lastName}` : ""
      }
    >
      {({
        getInputProps,
        getItemProps,
        getMenuProps,
        isOpen,
        highlightedIndex,
        inputValue,
      }) => (
        <div>
          {!isDisabled && (
            <label className="label__create__user__card__control">
              <span className="span__create__user__card">
               Usuario Control:{" "}
              </span>
              <input
                className="input__create__user__card__control"
                required
                {...getInputProps({
                  placeholder: "Busque un nombre, apellido o cédula",
                })}
              />
            </label>
          )}
          <ul
            {...getMenuProps()}
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              fontSize: 12,
            }}
          >
            {isOpen &&
              getSuggestions(inputValue, users, isSubAdmin).map((user, index) =>
                renderSuggestion(user, index, getItemProps, highlightedIndex)
              )}
          </ul>
        </div>
      )}
    </Downshift>
  );
};

export default AutocompletarUser;
