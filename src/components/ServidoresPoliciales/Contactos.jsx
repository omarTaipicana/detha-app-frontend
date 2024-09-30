import React, { useEffect, useState } from "react";
import useCrud from "../../hooks/useCrud";
import { useForm } from "react-hook-form";

export const Contactos = ({ servidor }) => {
  const [contactoEdit, setContactoEdit] = useState("");
  const PATH_CONTACTOS = "/contactos";
  const PATH_VARIABLES = "/variables";
  const [
    contacto,
    getContacto,
    postContacto,
    deleteContacto,
    updateContacto,
    hasError,
    isLoading,
  ] = useCrud();

  const [variables, getVariables] = useCrud();
  const { register, handleSubmit, reset, value, setValue, watch } = useForm();

  useEffect(() => {
    getContacto(PATH_CONTACTOS);
    getVariables(PATH_VARIABLES);
  }, []);

  const submit = (data) => {
    const body = { ...data, servidorPolicialId: servidor.id };

    if (contactoEdit) {
      updateContacto(PATH_CONTACTOS, contactoEdit.id, body);
    } else {
      postContacto(PATH_CONTACTOS, body);
    }

    setContactoEdit("");
    reset({
      tipoContacto: "",
      contacto: "",
      servidorPolicialId: "",
    });
  };

  const handleEditContacto = (contactoEdit) => {
    setContactoEdit(contactoEdit);
  };
  useEffect(() => {
    reset(contactoEdit);
  }, [contactoEdit]);
  return (
    <div>
      <article>
        <span>CONTACTOS</span>
        <form onSubmit={handleSubmit(submit)}>
          <label className="label__form">
            <span>Tipo de Contacto:</span>
            <select
              required
              {...register("tipoContacto")}
            >
              <option value="">Seleccione el Tipo</option>
              {variables
                ?.filter((e) => e.tipoContacto)
                .map((variable) => (
                  <option key={variable.id} value={variable.tipoContacto}>
                    {variable.tipoContacto}
                  </option>
                ))}
            </select>
          </label>
          <label className="label__form">
            <span>Contacto: </span>
            <input
              {...register("contacto")}
              type={watch("tipoContacto") === "EMAIL" ? "email" : "text"}
              required
            />
          </label>
          <button>{contactoEdit ? "Actualizar" : "Guardar"}</button>
        </form>
        <section>
          <table>
            <thead>
              <tr>
                <th>TIPO</th>
                <th>CONTACTO</th>
              </tr>
            </thead>
            <tbody>
              {contacto
                ?.filter(
                  (contacto) => contacto.servidorPolicialId === servidor.id
                )
                .map((contactoFiltrado) => (
                  <tr key={contactoFiltrado.id}>
                    <td>{contactoFiltrado?.tipoContacto}: </td>
                    <td>{contactoFiltrado?.contacto}</td>
                    <td style={{ border: "none" }}>
                      <img
                        src="../../../edit.png"
                        className="btn__expand"
                        onClick={() => handleEditContacto(contactoFiltrado)}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </section>
      </article>
    </div>
  );
};
