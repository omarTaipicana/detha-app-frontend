import "./styles/HomePage.css";
import FromServidorP from "../components/ServidoresPoliciales/FromServidorP";
import ServidoresPolicialesList from "../components/ServidoresPoliciales/ServidoresPolicialesList";
import { useState } from "react";

const ServidoresPoliciales = () => {
  const [formIsClouse, setFormIsClouse] = useState(true);
  const [servidorEdit, setServidorEdit] = useState();

  return (
    <div>
      <FromServidorP
        formIsClouse={formIsClouse}
        setFormIsClouse={setFormIsClouse}
        servidorEdit={servidorEdit}
        setServidorEdit={setServidorEdit}
      />
      <ServidoresPolicialesList
        setFormIsClouse={setFormIsClouse}
        formIsClouse={formIsClouse}
        setServidorEdit={setServidorEdit}
        servidorEdit={servidorEdit}
      />
    </div>
  );
};

export default ServidoresPoliciales;
