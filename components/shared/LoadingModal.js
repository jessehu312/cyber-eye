import React from "react";
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";
import Loader from "./Loader";

const LoadingModal = ({ children }) => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        end={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
        style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
        id='overlay'
        className='fixed inset-0 z-50 overflow-auto h-screen w-full flex flex-row items-center justify-center md:px-0 px-12'>
        <div className='relative w-11/12 mx-auto mb-4 my-6 md:w-1/3 shadow sm:px-10 sm:py-12 py-4 px-4 bg-black dark:bg-gray-800 rounded-md'>
          <div className='flex flex-row justify-center items-center'>
            <div className=''>
              <Loader />
            </div>
            <div className=''>{children}</div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default LoadingModal;
