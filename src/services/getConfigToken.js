const getConfigToken = () => {
    return {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
  };
  
  export default getConfigToken;
  