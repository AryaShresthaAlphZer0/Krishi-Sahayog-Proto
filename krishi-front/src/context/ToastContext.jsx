import {
  useCallback,
  useState,
} from "react";

import Toast from "../components/Toast";
import { ToastContext } from "./toastContextInstance";

import styles from "./ToastContext.module.css";


let nextId = 0;


export function ToastProvider({ children }) {

  const [toasts, setToasts] = useState([]);


  const removeToast = useCallback((id) => {

    setToasts((current) =>
      current.filter((toast) => toast.id !== id)
    );

  }, []);


  const showToast = useCallback(
    (message, type = "info", duration = 3800) => {

      const id = ++nextId;

      setToasts((current) => [
        ...current,
        { id, message, type, duration },
      ]);

    },
    []
  );


  return (
    <ToastContext.Provider value={{ showToast }}>

      {children}

      <div
        className={styles.toastLayer}
        aria-live="polite"
        aria-atomic="true"
      >

        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onDone={() => removeToast(toast.id)}
          />
        ))}

      </div>

    </ToastContext.Provider>
  );
}