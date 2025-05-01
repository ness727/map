import React from 'react';
import styles from './RouteSaveModal.module.css';

const Modal = ({ isOpen, onClose, children } : { isOpen: boolean, onClose: () => void, children: any }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button onClick={onClose} className={styles.closeButton}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
