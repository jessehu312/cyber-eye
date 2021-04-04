import Navbar from "@/components/home/Navbar";
import Loader from "@/components/shared/Loader";
import { useAuth } from "@/lib/auth";
import { getUserZones } from "@/lib/firestore";
import React, { useState, useEffect } from "react";

const Zones = () => {
  const { user } = useAuth();
  const [loaded, setLoaded] = useState(true);
  const [zones, setZones] = useState([]);

  useEffect(() => {
    if (user === null) return;

    const fetchZones = async () => {
      const zones = await getUserZones({ uid: user?.uid });
      setZones(zones);
      setLoaded(false);
    };

    fetchZones();
  }, [user]);
  return (
    <>
      {loaded ? (
        <div className='center min-h-screen'>
          <Loader large />
        </div>
      ) : (
        <div className='bg-hero-pattern min-h-screen'>
          <Navbar />
          <div className='container mx-auto px-4 xl:px-0'>
            <div className='flex flex-col justify-center items-center pt-24'>
              <div class='max-w-lg mx-auto'>
                <h1 className='text-primary text-center text-4xl md:text-5xl font-extrabold tracking-tight mt-8'>
                  My Zones
                </h1>
              </div>
              <div className='w-full flex flex-row justify-center space-x-12 mt-12'>
                {zones.map((zone) => (
                  <div
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(/images/map.png)",
                    }}
                    className='w-64 h-64 object-cover bg-no-repeat rounded-lg text-white px-2'>
                    <div className='flex flex-col justify-center items-center h-full'>
                      <h3 className='text-2xl text-secondary font-extrabold tracking-right'>
                        {zone.address}
                      </h3>
                      <p className='text-lg text-secondary font-bold'>
                        {zone.radius}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Zones;
