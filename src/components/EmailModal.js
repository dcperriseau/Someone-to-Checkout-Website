import React from 'react';
import Modal from 'react-modal';

const EmailModal = ({ isOpen, onClose, email, name }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Lister's Email"
      className="bg-white p-4 rounded-lg shadow-lg mx-auto my-16 max-w-lg w-full"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div className="flex flex-col items-center">
        <h2 className="text-xl font-semibold mb-4">Contact Lister</h2>
        {name && <p className="text-lg mb-2">Name: {name}</p>}
        {email ? (
          <>
            <p className="text-lg mb-4">If you have any questions, please email: </p>
            <p className="text-lg mb-4">
              <a href={`mailto:${email}`} className="black">{email}</a>
            </p>
          </>
        ) : (
          <p className="text-lg mb-4 text-black">Email not available</p>
        )}
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

export default EmailModal;
