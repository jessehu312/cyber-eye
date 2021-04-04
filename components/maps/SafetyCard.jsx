import React from "react";

const SafetyCard = ({ crimeLabel, percentage }) => {
  return (
    <>
      <div className='bg-dark-gray-secondary shadow-lg rounded-md p-4 transform duration-200 hover:-translate-y-1'>
        <div className='flex flex-row items-center justify-between'>
          <h3 className='font-bold text-md xl:text-xl'>{crimeLabel}</h3>
          <div
            className={`w-10 h-10 rounded-full ${
              percentage < 50 ? "bg-dark-red" : "bg-dark-green"
            } flex flex-row items-center justify-center text-xs font-bold`}>
            {percentage}%
          </div>
        </div>
      </div>
    </>
  );
};

export default SafetyCard;
