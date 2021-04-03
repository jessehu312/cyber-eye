import React, { useState, useEffect } from "react";
import Navbar from "@/components/home/Navbar";
import { useRouter } from "next/router";

import DeckGL, {
  HexagonLayer,
  ScatterplotLayer,
  HeatmapLayer,
  FlyToInterpolator,
} from "deck.gl";
import { NavigationControl, StaticMap, MapContext } from "react-map-gl";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import sourceData from "../data/gundata.json";
import Loader from "@/components/shared/Loader";

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const Maps = () => {
  const router = useRouter();
  const { lat, lng, address } = router.query;
  const [initialViewState, setInitialViewState] = useState();

  const [hoverInfo, setHoverInfo] = useState();
  const [mapLoading, setMapLoading] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState(address);

  const [viewport, setViewport] = useState({
    height: "100%",
    width: "100%",
  });

  const scatterplot = () =>
    new ScatterplotLayer({
      id: "scatter",
      data: sourceData,
      opacity: 0.8,
      filled: true,
      radiusMinPixels: 2,
      radiusMaxPixels: 8,
      getPosition: (d) => [d.longitude, d.latitude],
      getFillColor: (d) =>
        d.n_killed > 0 ? [200, 0, 40, 150] : [255, 140, 0, 100],

      pickable: true,
      onClick: (info) => {
        setHoverInfo(info);
      },
    });

  const heatmap = () =>
    new HeatmapLayer({
      id: "heat",
      data: sourceData,
      getPosition: (d) => [d.longitude, d.latitude],
      getWeight: (d) => d.n_killed + d.n_injured * 0.5,
      radiusPixels: 60,
    });

  const hexagon = () =>
    new HexagonLayer({
      id: "hex",
      data: sourceData,
      getPosition: (d) => [d.longitude, d.latitude],
      getElevationWeight: (d) => d.n_killed * 2 + d.n_injured,
      elevationScale: 100,
      extruded: true,
      radius: 1609,
      opacity: 0.6,
      coverage: 0.88,
      lowerPercentile: 50,
      colorRange: [
        [176, 0, 255],
        [253, 1, 255],
        [137, 0, 255],
        [255, 6, 119],
        [3, 81, 255],
        [169, 221, 214],
      ],
    });

  //scatterplot(), heatmap(),
  const layers = [scatterplot(), hexagon(), heatmap()];

  const goHome = () => {
    setInitialViewState({
      ...initialViewState,
      latitude: parseInt(lat),
      longitude: parseInt(lng),
      zoom: 7,
      pitch: 0,
      bearing: 0,
      transitionDuration: 5000,
      transitionInterpolator: new FlyToInterpolator(),
    });
  };

  const updateAddress = async () => {
    await geocodeByAddress(selectedAddress)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => {
        console.log(latLng);
        const { lat, lng } = latLng;
        setInitialViewState({
          ...initialViewState,
          latitude: parseInt(lat),
          longitude: parseInt(lng),
          zoom: 7,
          pitch: 0,
          bearing: 0,
          transitionDuration: 5000,
          transitionInterpolator: new FlyToInterpolator(),
        });
      })
      .catch((error) => console.error("Error", error));
  };

  useEffect(() => {
    if (!lat || !lng || !address) router.push("/");
    const selectedLocation = {
      latitude: parseInt(lat),
      longitude: parseInt(lng),
      zoom: 5,
      bearing: 0,
      pitch: 30,
    };

    setInitialViewState(selectedLocation);
    setMapLoading(false);
  }, []);

  return (
    <div className='min-h-screen bg-black'>
      <Navbar />
      <div className='max-w-screen-lg mx-auto relative px-6 xl:px-0'>
        <div className='relative mb-4'>
          <div className='flex flex-row items-stretch justify-between space-x-4'>
            <input
              onChange={(e) => setSelectedAddress(e.target.value)}
              value={selectedAddress}
              placeholder='Enter Address, City, State or Zip Code'
              className='transition-all w-full mx-auto focus:w-full focus:ring-2 focus:ring-primary pl-12 py-3 text-md text-gray-700 rounded-sm outline-none'
            />
            <button
              onClick={updateAddress}
              className='bg-secondary py-2 px-4 text-white rounded-lg focus:ring-2 focus:outline-none border-none focus:ring-cyan-800'>
              Search
            </button>
          </div>
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
        <div className='text-white py-8 text-2xl font-semibold tracking-tight'>
          tabs
        </div>
      </div>
      {mapLoading ? (
        <div className='w-full flex justify-center'>
          <Loader />
        </div>
      ) : (
        <div style={{ height: "75vh", width: "100vw", position: "relative" }}>
          <DeckGL
            viewport={viewport}
            viewState={initialViewState}
            onViewStateChange={(e) => setInitialViewState(e.viewState)}
            controller={true}
            layers={layers}
            ContextProvider={MapContext.Provider}>
            <StaticMap
              mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
              mapStyle='mapbox://styles/mapbox/dark-v9'
            />
            {hoverInfo && (
              <div
                className='bg-white p-2 rounded-sm border-primary border-2 max-w-sm'
                style={{
                  position: "absolute",
                  zIndex: 1,
                  pointerEvents: "none",
                  left: hoverInfo.x,
                  top: hoverInfo.y,
                }}>
                <h1 className='font-bold tracking-tight'>
                  Incident #{hoverInfo?.object?.incident_id}
                  <span className='ml-2 font-normal text-xs tracking-wide'>
                    {hoverInfo?.object?.date}
                  </span>
                </h1>
                <p className='text-sm'>{hoverInfo?.object?.notes}</p>
                <div className='flex flex-row space-x-2 mt-2 border-b pb-2'>
                  <p className='text-xs border-r pr-2'>
                    # Killed: {hoverInfo?.object?.n_killed} 💀
                  </p>
                  <p className='text-xs'>
                    # Injured: {hoverInfo?.object?.n_injured} 🤕
                  </p>
                </div>
                <div className='flex flex-row space-x-2 mt-2 pb-2'>
                  <p className='text-xs border-r pr-2'>
                    Lat: {hoverInfo?.object?.latitude}
                  </p>
                  <p className='text-xs'>Lng: {hoverInfo?.object?.longitude}</p>
                </div>
              </div>
            )}
            <NavigationControl
              style={{
                position: "absolute",
                top: 10,
                left: 10,
              }}
            />
            <div className='absolute right-0 top-0'>
              <div
                onClick={goHome}
                className='bg-white text-gray-800 p-2 rounded-lg m-4'>
                🏠 Go home
              </div>
              <div
                onClick={() => setHoverInfo(null)}
                className='bg-white text-gray-800 p-2 text-center rounded-lg m-4'>
                Clear Popup
              </div>
            </div>
          </DeckGL>
        </div>
      )}
    </div>
  );
};

export default Maps;