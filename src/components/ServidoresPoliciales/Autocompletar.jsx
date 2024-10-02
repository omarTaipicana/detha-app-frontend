import React, { useEffect, useState } from "react";
import Downshift from "downshift";
import { useForm } from "react-hook-form";

// Función para obtener el último ascenso basado en la fecha de creación
const getLatestAscenso = (ascensos) => {
  if (!ascensos || ascensos.length === 0) return null;
  return ascensos.reduce((latest, current) =>
    new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest
  );
};

const getSuggestions = (value, servidores) => {
  const inputValue = value.trim().toLowerCase();
  return inputValue.length === 0
    ? []
    : servidores.filter((ppnn) => {
        const latestAscenso = getLatestAscenso(ppnn.ascensos);
        const fullName = `${latestAscenso?.grado ?? ""} ${ppnn.nombres.toLowerCase()} ${ppnn.apellidos.toLowerCase()}`;
        return fullName.includes(inputValue);
      });
};

const renderSuggestion = (ppnn, index, getItemProps, highlightedIndex) => {
  const latestAscenso = getLatestAscenso(ppnn.ascensos);
  return (
    <li
      key={index}
      {...getItemProps({ item: ppnn })}
      style={{
        backgroundColor: highlightedIndex === index ? "#bde4ff" : "white",
        padding: "3px",
        cursor: "pointer",
      }}
    >
      {latestAscenso?.grado ?? ""} {ppnn.nombres} {ppnn.apellidos}
    </li>
  );
};

const Autocompletar = ({ servidores, setValue, desplazamientoEdit, isDisabled }) => {
  const [inputValue, setInputValue] = useState("");
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (desplazamientoEdit) {
      setInputValue(desplazamientoEdit.personalRelevo);
      setIsValid(true);
    }
  }, [desplazamientoEdit]);

  return (
    <Downshift
      inputValue={inputValue}
      onChange={(selectedItem) => {
        const latestAscenso = getLatestAscenso(selectedItem.ascensos);
        const fullName = `${latestAscenso?.grado ?? ""} ${selectedItem.nombres} ${selectedItem.apellidos}`;
        setInputValue(fullName);
        setIsValid(true);
        setValue("personalRelevo", fullName);
      }}
      onInputValueChange={(newValue) => {
        setInputValue(newValue);
        setIsValid(false);
      }}
      itemToString={(item) =>
        item
          ? `${getLatestAscenso(item.ascensos)?.grado ?? ""} ${item.nombres} ${item.apellidos}`
          : ""
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
          <label className="label__form__relevo">
            <span className="span__form__info">Servidor a quién releva: </span>
            <input disabled={isDisabled}
              className="input__form__info"
              required
              {...getInputProps({
                placeholder: "Escribe el nombre o apellido...",
              })}
            />
          </label>
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
              getSuggestions(inputValue, servidores).map((ppnn, index) =>
                renderSuggestion(ppnn, index, getItemProps, highlightedIndex)
              )}
          </ul>
        </div>
      )}
    </Downshift>
  );
};

export default Autocompletar;
