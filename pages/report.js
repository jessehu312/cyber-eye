import { useEffect } from "react";
import Navbar from "@/components/home/Navbar";
import { useState } from "react";
import Head from "next/head";
import axios from "axios";
import { useAuth } from "@/lib/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CRIMETYPES = [
  'DECEPTIVE PRACTICE',
  'THEFT',
  'BURGLARY',
  'CRIMINAL TRESPASS',
  'CRIMINAL DAMAGE',
  'BATTERY',
  'ASSAULT',
  'MOTOR VEHICLE THEFT',
  'ROBBERY',
  'NARCOTICS',
  'WEAPONS VIOLATION',
  'OTHER OFFENSE',
  'HOMICIDE',
  'PUBLIC PEACE VIOLATION',
  'OFFENSE INVOLVING CHILDREN',
  'SEX OFFENSE',
  'STALKING',
  'PROSTITUTION',
  'INTERFERENCE WITH PUBLIC OFFICER',
  'INTIMIDATION',
  'CRIMINAL SEXUAL ASSAULT',
  'CONCEALED CARRY LICENSE VIOLATION',
  'KIDNAPPING',
  'ARSON',
  'LIQUOR LAW VIOLATION',
  'OBSCENITY',
  'PUBLIC INDECENCY',
  'HUMAN TRAFFICKING',
  'OTHER NARCOTIC VIOLATION',
  'GAMBLING',
  'NON-CRIMINAL',
  'RITUALISM'
];

const Report = () => {
  const [address, setAddress] = useState();
  const [report, setReport] = useState();
  const [crimeType, setCrimeType] = useState();
  const [anonymous, setAnonymous] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!!document.getElementById("maps-api") === true) return;

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_MAPS_API_KEY}&libraries=places`;
    script.setAttribute("id", "maps-api");
    document.body.append(script);
  }, []);

  const Submit = () => {
    axios.put('api/blockchain?proxyRoute=add2chain', {
        "address": address,
        "type": crimeType,
        "description": report,
        "date": Date.now(),
        "uid": (!anonymous && user?.uid) || "-1"
    })
    .then(({data: {incidentblockid}}) => {
      console.log(incidentblockid);
      toast.dark(`🚔 Incident Reported! ID:${incidentblockid}`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    });
  }

  return (
    <div className='min-h-screen bg-black'>
      <Head>
        <title>Cyber.Eye</title>
        <link rel='icon' href='/eye.png' />
      </Head>
      <ToastContainer/>
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
          Type of crime
        </h2>
        <input
            list="crimes"
            className="md:w-5/12 rounded-md mb-4 pl-2 py-2"
            placeholder="CrimeType"
            onChange={(e) => setCrimeType(e.target.value)}
          />
          <datalist id="crimes">
            {CRIMETYPES.map((description, idx) => <option key={idx} value={description}/>)}
          </datalist>
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
        <div className='mb-2'>
          <input type="checkbox" className="transform scale-150" checked={anonymous} onChange={() => setAnonymous(!anonymous)}/>
          <span className='text-white text-lg ml-4 mb-2 font-medium'>
            Anonymous
          </span>
        </div>
        <button className='bg-primary py-2 px-6 text-white rounded-lg font-bold text-md mt-4' onClick={Submit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default Report;
