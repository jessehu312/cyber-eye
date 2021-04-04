import { useEffect } from "react";
import Navbar from "@/components/home/Navbar";
import { useState } from "react";

const Report = () => {
  const [address, setAddress] = useState();
  const [report, setReport] = useState();
  const [personalInfo, setPersonalInfo] = useState();

  useEffect(() => {
    if (!!document.getElementById("maps-api") === true) return;

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_MAPS_API_KEY}&libraries=places`;
    script.setAttribute("id", "maps-api");
    document.body.append(script);
  }, []);

  return (
    <div className='min-h-screen bg-black'>
      <Navbar />
      <div className='mx-auto max-w-screen-lg relative px-6 xl:px-0'>
        <h1 className='text-primary text-3xl mb-4 font-semibold'>
          Be our eye witness of crimes
        </h1>
        <h2 className='text-white text-2xl mb-2 font-medium'>Address</h2>
        <input
          className='mb-4 rounded-sm w-full p-2'
          placeholder='338 North Hollywood Avenue'
          type='text'
          onInput={(e) => setAddress(e.target.value)}
        />
        <h2 className='text-white text-2xl mb-2 font-medium'>
          What's Happening?
        </h2>
        <textarea
          onInput={(e) => setReport(e.target.value)}
          placeholder='Desribe the scene. The more details the better.'
          className='w-full p-2'
          cols='40'
          rows='5'
        />
        <p className='text-white text-xs mb-4'>
          Please include details like location, date, time, and descriptions of
          people involved
        </p>
        <h2 className='text-white  text-2xl mb-2 font-medium'>
          Would you like to provide personal information?
        </h2>
        <textarea
          onInput={(e) => setPersonalInfo(e.target.value)}
          placeholder='Please add any additional details.'
          className='w-full p-2'
          cols='40'
          rows='5'
        />
        <button className='bg-primary py-2 px-6 text-white rounded-lg font-bold text-md mt-4'>
          Submit
        </button>
      </div>
    </div>
  );
};

export default Report;
