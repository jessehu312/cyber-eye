import React, { useState } from "react";
import { motion } from "framer-motion";
import { createNotificationInstance } from "@/lib/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const AlertModal = ({ setOpen, initialViewState, address }) => {
  const [radius, setRadius] = useState();
  const [phone, setPhone] = useState("");

  const createNotification = async (e) => {
    e.preventDefault();

    try {
      const coordinates = {
        lat: initialViewState.latitude,
        lng: initialViewState.longitude,
      };
      await createNotificationInstance({ phone, radius, coordinates })
        .then(() => {
          axios.post("http://localhost:3000/api/message", {
            phone,
            radius,
            address,
          });
        })
        .then(() => setOpen(false))
        .then(() =>
          toast.dark("🚨 Alert Added!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          })
        );
    } catch (error) {
      console.log(error);
    }
  };

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
          <svg
            className='w-6 h-6 absolute top-4 right-4 text-gray-300 cursor-pointer'
            onClick={() => setOpen(false)}
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M6 18L18 6M6 6l12 12'
            />
          </svg>
          <div className='flex flex-col pb-3 items-center justify-center'>
            <div className='text-gray-600 dark:text-gray-400'>
              <img className='h-12' src='/images/logo.png' alt='Logo' />
            </div>
            <p className='text-2xl mt-4 text-primary font-extrabold tracking-tight'>
              Get Alerts
            </p>
          </div>
          <p className='text-white text-left'>
            Get Alerts for <span className='font-bold'>{address}</span>
          </p>
          <div className='flex flex-col items-start sm:items-center space-y-4 mt-4'>
            <div className='relative w-full flex flex-col'>
              <div className='absolute text-gray-600 dark:text-gray-400 flex items-center px-4 border-r border-gray-300 dark:border-gray-700 h-full'>
                <svg
                  className='w-6 h-6 text-white'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
                  />
                </svg>
              </div>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                id='email'
                className='py-3 text-white font-bold dark:text-gray-400 bg-transparent focus:outline-none focus:border focus:border-secondary font-normal w-full pl-16 text-sm border-gray-300 dark:border-gray-700 rounded border shadow'
                placeholder='+14085555555'
              />
            </div>
            <div className='relative w-full'>
              <div className='absolute text-gray-600 dark:text-gray-400 flex items-center px-4 border-r border-gray-300 dark:border-gray-700 h-full'>
                <svg
                  className='w-6 h-6 text-white'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
              </div>
              <input
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                id='number'
                className='py-3 text-white font-bold dark:text-gray-400 bg-transparent focus:outline-none focus:border focus:border-secondary font-normal w-full pl-16 text-sm border-gray-300 dark:border-gray-700 rounded border shadow'
                placeholder='Radius (in miles)'
              />
            </div>
          </div>
          <button
            onClick={createNotification}
            className='bg-primary inline-block rounded-lg shadow-sm bg-red-500 px-3 py-2 text-white text-md font-semibold mt-4'>
            Submit
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default AlertModal;
