import { useState } from "react";
import axios from "axios";
import getConfigToken from "../services/getConfigToken";

const useCrud = () => {
  const BASEURL = import.meta.env.VITE_API_URL;
  const [response, setResponse] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getApi = (path) => {
    setIsLoading(true);
    const url = `${BASEURL}${path}`;
    axios
      .get(url, getConfigToken())
      .then((res) => setResponse(res.data))
      .catch((err) => {
        setHasError(err);
        console.log(err);
      })
      .finally(() => setIsLoading(false));
  };

  const postApi = (path, data) => {
    setIsLoading(true);
    const url = `${BASEURL}${path}`;
    axios
      .post(url, data, getConfigToken())
      .then((res) => {
        // console.log(res.data);
        setResponse([...response, res.data]);
      })
      .finally(() => setIsLoading(false))
      .catch((err) => {
        setHasError(err);
        console.log(err);
      });
  };

  const deleteApi = (path, id) => {
    setIsLoading(true);
    const url = `${BASEURL}${path}/${id}`;
    axios
      .delete(url, getConfigToken())
      .then((res) => {
        console.log(res.data);
        setResponse(response.filter((e) => e.id !== id));
      })
      .finally(() => setIsLoading(false))
      .catch((err) => {
        setHasError(err);
        console.log(err);
      });
  };

  const updateApi = (path, id, data) => {
    setIsLoading(true);
    const url = `${BASEURL}${path}/${id}`;
    axios
      .put(url, data, getConfigToken())
      .then((res) =>
        setResponse(response.map((e) => (e.id === id ? res.data : e)))
      )
      .finally(() => setIsLoading(false))
      .catch((err) => {
        setHasError(err);
        console.log(err);
      });
  };

  return [response, getApi, postApi, deleteApi, updateApi, hasError, isLoading];
};

export default useCrud;
