import React, { useEffect, useState } from "react";
import useCrud from "../../hooks/useCrud";
import { useForm } from "react-hook-form";

export const Contactos = ({ servidor }) => {
  const superAdmin = import.meta.env.VITE_CI_SUPERADMIN;
  const diasEdicion = import.meta.env.VITE_DIAS_EDICION;
  const userCI = JSON.parse(localStorage.user ? localStorage.user : 0).cI;
  const userLoggued = JSON.parse(localStorage.user ? localStorage.user : 0);
  const [hide, setHide] = useState(true);
  const [hideDelete, setHideDelete] = useState(true);
  const [idDelete, setIdDelete] = useState("");
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
    setHide(true);
    reset({
      tipoContacto: "",
      contacto: "",
      servidorPolicialId: "",
    });
  };

  const handleHideDelete = (contacto) => {
    setHideDelete(false);
    setIdDelete(contacto);
  };

  const handleDelete = () => {
    deleteContacto(PATH_CONTACTOS, idDelete.id);
    setHideDelete(true);
    alert(`Se elimino el registro"  ${idDelete.contacto}`);
    setIdDelete("");
  };

  const handleEditContacto = (contacto) => {
    setContactoEdit(contacto);
    setHide(false);
  };

  useEffect(() => {
    reset(contactoEdit);
  }, [contactoEdit]);
  return (
    <div>
      <article>
        <section
          className={`form__container__info ${
            hide && "form__container__info__close"
          }`}
        >
          <form className="form__info" onSubmit={handleSubmit(submit)}>
            <div
              onClick={() => {
                setContactoEdit("");
                setHide(true);
                reset({
                  tipoContacto: "",
                  contacto: "",
                  servidorPolicialId: "",
                });
              }}
              className="btn__exit__form__info"
            >
              ❌
            </div>
            <label className="label__form">
              <span className="span__form__info">Tipo de Contacto:</span>
              <select
                className="select__form__info"
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
              <span className="span__form__info">Contacto: </span>
              <input
                className="input__form__info"
                {...register("contacto")}
                type={watch("tipoContacto") === "EMAIL" ? "email" : "text"}
                required
              />
            </label>
            <button>{contactoEdit ? "Actualizar" : "Guardar"}</button>
          </form>
        </section>
        <section>
          <table>
            <thead>
              <tr>
                <th style={{ border: "none", backgroundColor: "transparent" }}>
                  <img
                    src="../../../new.png"
                    className="btn__table"
                    onClick={() => setHide(false)}
                  />
                </th>
                <th>TIPO</th>
                <th>CONTACTO</th>
              </tr>
            </thead>
            <tbody>
              {contacto
                ?.slice()
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .filter(
                  (contacto) => contacto.servidorPolicialId === servidor.id
                )
                .map((contacto) => (
                  <tr key={contacto.id}>
                    <td style={{ border: "none", backgroundColor: "transparent" }}>
                      {(new Date() - new Date(contacto.createdAt) <
                        diasEdicion * 24 * 60 * 60 * 1000 ||
                        userCI === superAdmin) && (
                        <img
                          src="../../../edit.png"
                          className="btn__table"
                          onClick={() => handleEditContacto(contacto)}
                        />
                      )}
                      {userLoggued.cI === superAdmin && (
                        <img
                          src="../../../delete.png"
                          className="btn__table"
                          onClick={() => handleHideDelete(contacto)}
                        />
                      )}
                    </td>
                    <td className="table__td">{contacto?.tipoContacto}: </td>
                    <td className="table__td">{contacto?.contacto}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </section>
        <section
          className={`form__container__info ${
            hideDelete && "form__container__info__close"
          }`}
        >
          <div className="form__info">
            <span className="delete__card">
              Esta seguro de eliminar el Registro
            </span>
            <div className="btn__delete__content">
              <button onClick={handleDelete} className="btn__form__info">
                SI
              </button>
              <button
                onClick={() => setHideDelete(true)}
                className="btn__form__info"
              >
                NO
              </button>
            </div>
          </div>
        </section>
      </article>
    </div>
  );
};
