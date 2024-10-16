import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { hideAlert } from "../../store/states/alert.slice";
import "./styles/Alert.css";

const Alert = () => {
  const dispatch = useDispatch();
  const { show, message, alertType } = useSelector((state) => state.alert);
  const getAlertColor = () => {
    switch (alertType) {
      case 1:
        return "var(--red-color)";
      case 2:
        return "var(--green-color)";
      case 3:
        return "var(--orange-color)";
      default:
        return "var(--blue-color)";
    }
  };

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        dispatch(hideAlert());
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [show]);

  return (
    show && (
      <div
        className="alert-message"
        style={{ backgroundColor: getAlertColor() }}
      >
        {message}
      </div>
    )
  );
};

export default Alert;
