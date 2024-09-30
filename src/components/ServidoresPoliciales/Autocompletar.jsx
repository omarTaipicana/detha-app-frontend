import React, { useState } from 'react';
import Downshift from 'downshift';
import { useForm } from 'react-hook-form';

const getSuggestions = (value, servidores) => {
  const inputValue = value.trim().toLowerCase();
  return inputValue.length === 0
    ? []
    : servidores.filter(ppnn => {
        const fullName = `${ppnn.nombres.toLowerCase()} ${ppnn.apellidos.toLowerCase()}`;
        return fullName.includes(inputValue);
      });
};

const renderSuggestion = (ppnn, index, getItemProps, highlightedIndex) => (
  <li
    key={index}
    {...getItemProps({ item: ppnn })}
    style={{
      backgroundColor: highlightedIndex === index ? '#bde4ff' : 'white',
      padding: '3px',
      cursor: 'pointer',
    }}
  >
    {ppnn.nombres} {ppnn.apellidos}
  </li>
);

const Autocompletar = ({ servidores, setValue }) => {
  const [inputValue, setInputValue] = useState('');
  const [isValid, setIsValid] = useState(false);

  return (
    <Downshift
      inputValue={inputValue}
      onChange={(selectedItem) => {
        const fullName = `${selectedItem.nombres} ${selectedItem.apellidos}`;
        setInputValue(fullName);
        setIsValid(true);
        setValue('personalRelevo', fullName); 
      }}
      onInputValueChange={(newValue) => {
        setInputValue(newValue);
        setIsValid(false);
      }}
      itemToString={(item) => (item ? `${item.nombres} ${item.apellidos}` : '')}
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
          <label className="label__form">
            <span>Personal a quien releva</span>
            <input required
              {...getInputProps({
                placeholder: 'Escribe el nombre o apellido...',
              })}
            />
          </label>
          <ul
            {...getMenuProps()}
            style={{
              border: '1px solid #ccc',
              listStyle: 'none',
              margin: 0,
              padding: 0,
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
