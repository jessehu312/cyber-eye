import { useState, useEffect } from "react";
import Navbar from "@/components/home/Navbar";
import SocialSignIn from "./SocialSignIn";
import Loader from "../shared/Loader";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import Router from "next/router";

const Header = () => {
  const [loaded, setLoaded] = useState(true);
  const [address, setAddress] = useState("");
  const [open, setOpen] = useState(false);

  const handleSelect = async (address) => {
    setAddress(address);
    await geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => {
        console.log(latLng);
        const { lat, lng } = latLng;
        Router.push({
          pathname: "/maps",
          query: { lat, lng, address },
        });
      })
      .catch((error) => console.error("Error", error));
  };

  useEffect(() => {
    if (!!document.getElementById("maps-api") === true) {
      setLoaded(false);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_MAPS_API_KEY}&libraries=places`;
    script.setAttribute("id", "maps-api");

    script.addEventListener("load", () => {
      setTimeout(() => {
        setLoaded(false);
      }, 800);
    });
    document.body.append(script);
  }, []);

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
            <div className='flex flex-col justify-center items-center md:py-12 py-16'>
              <div class='max-w-lg mx-auto'>
                <img className='w-full' src='/images/logo.gif' />
                <h1 className='text-white text-center text-4xl md:text-5xl font-extrabold tracking-tight mt-8'>
                  Beware, Everywhere!
                </h1>
                <div className='group w-full relative mt-12'>
                  <form>
                    <PlacesAutocomplete
                      value={address}
                      onChange={(address) => setAddress(address)}
                      onSelect={handleSelect}>
                      {({
                        getInputProps,
                        suggestions,
                        getSuggestionItemProps,
                        loading,
                      }) => (
                        <div>
                          <input
                            {...getInputProps({
                              placeholder:
                                "Enter Address, City, State or Zip Code",
                              className:
                                "transition-all w-full mx-auto focus:w-full focus:ring-2 focus:ring-primary pl-12 py-3 text-md text-gray-700 rounded-sm outline-none",
                            })}
                          />
                          <div className='outline-none border-none autocomplete-dropdown-container'>
                            {suggestions.map((suggestion) => {
                              const isActive = suggestion.active;
                              const className = isActive
                                ? "cursor-pointer border-b p-2 text-white bg-blue-500"
                                : "cursor-pointer border-b p-2 text-black bg-white";

                              return (
                                <div
                                  {...getSuggestionItemProps(suggestion, {
                                    className,
                                  })}>
                                  <span>{suggestion.description}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </PlacesAutocomplete>
                  </form>
                  <svg
                    className='absolute w-8 h-8 top-2 left-2 text-secondary'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          {open && <SocialSignIn setOpen={setOpen} />}
          {/* <embed
            src='/audio/rain.mp3'
            loop={true}
            autostart={true}
            width='2'
            height='0'
          /> */}
        </div>
      )}
    </>
  );
};

export default Header;
