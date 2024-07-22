const DetailsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative p-4 bg-white rounded-lg shadow-lg">
        <div className="flex flex-col space-y-4">
          <button onClick={onClose} className="flex items-center space-x-2 text-gray-700">
            <div className="p-2 bg-gray-300 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold">Hide Listing</span>
              <span className="text-sm text-gray-500">You'll see less listings like this</span>
            </div>
          </button>
          <button onClick={onClose} className="flex items-center space-x-2 text-gray-700">
            <div className="p-2 bg-gray-300 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.366-.446 1.07-.446 1.436 0l7 8.5c.386.468.027 1.1-.558 1.1H3.865c-.585 0-.944-.632-.558-1.1l7-8.5zM10 12a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold">Report Listing</span>
              <span className="text-sm text-gray-500">Report this listing for review</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailsModal;
