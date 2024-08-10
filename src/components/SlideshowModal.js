import React, { useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

const SlideshowModal = ({ isOpen, onClose, images, currentIndex }) => {
  const [currentSlide, setCurrentSlide] = React.useState(currentIndex);

  useEffect(() => {
    if (isOpen) {
      setCurrentSlide(currentIndex);
    }
  }, [isOpen, currentIndex]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-full p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative w-full max-w-4xl h-[80vh] overflow-hidden bg-transparent shadow-xl rounded-2xl">
                <div className="relative flex items-center justify-center h-full">
                  <img src={images[currentSlide]} alt={`Slide ${currentSlide}`} className="object-cover w-full h-full" />
                  <button
                    onClick={prevSlide}
                    className="absolute left-0 p-2 text-white bg-black bg-opacity-50 rounded-full hover:bg-opacity-75"
                    style={{ top: '50%', transform: 'translateY(-50%)' }}
                  >
                    &#9664;
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-0 p-2 text-white bg-black bg-opacity-50 rounded-full hover:bg-opacity-75"
                    style={{ top: '50%', transform: 'translateY(-50%)' }}
                  >
                    &#9654;
                  </button>
                </div>
                <button
                  type="button"
                  className="absolute top-0 right-0 p-2 m-2 text-white bg-black bg-opacity-50 rounded-full hover:bg-opacity-75"
                  onClick={onClose}
                >
                  &#10005;
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default SlideshowModal;
