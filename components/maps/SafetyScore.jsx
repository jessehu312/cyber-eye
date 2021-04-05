import React, { useState, useEffect } from "react";
import { PieChart } from "react-minimal-pie-chart";
import SafetyCard from "@/components/maps/SafetyCard";
import Loader from "@/components/shared/Loader";
import axios from "axios";

const SafetyScore = ({ coors }) => {
  const [loading, setLoading] = useState(true);
  const [netScore, setNetScore] = useState();
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const fetchScores = async () => {
      const response = await axios.post("/api/proxy?proxyRoute=cycbereye", {
        action: "getcrimescore",
        lat: coors.lat,
        lon: coors.lng,
      });

      const { results } = response.data;
      setNetScore(100 - results?.overall);

      let tempScores = [];

      for (let key of Object.keys(results)) {
        if (key === "overall") continue;
        tempScores.push({
          name: toTitleCase(key),
          percentage: 100 - results[key],
        });
      }

      setScores(tempScores);
      setLoading(false);
    };

    fetchScores();
  }, [coors.lat, coors.lng]);

  function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  return (
    <div className='text-white px-4 pt-8'>
      {loading ? (
        <div className='flex flex-row justify-center'>
          <Loader />
        </div>
      ) : (
        <>
          <h1 className='text-4xl md:text-xl xl:text-3xl font-extrabold tracking-tight text-center'>
            Safety Score
          </h1>
          <div className='w-full flex flex-row justify-center relative -mt-6'>
            {netScore < 50 ? (
              <PieChart
                style={{ position: "relative" }}
                data={[{ value: netScore, color: "url(#gradient1)" }]}
                lineWidth={20}
                label={({ dataEntry }) => dataEntry.value + "%"}
                labelStyle={{
                  fontSize: "14px",
                  fontFamily: "sans-serif",
                  fill: "#9D1525",
                  fontWeight: 900,
                }}
                labelPosition={0}
                rounded
                animate
                animationDuration={5000}
                startAngle={0}
                endAngle={360}
                radius={30}>
                <defs>
                  <linearGradient id='gradient1'>
                    <stop offset='0%' stopColor='#9D1525' />
                    <stop offset='65%' stopColor='#8A0B21' />
                    <stop offset='100%' stopColor='#560616' />
                  </linearGradient>
                </defs>
              </PieChart>
            ) : (
              <PieChart
                style={{ position: "relative" }}
                data={[{ value: netScore, color: "url(#gradient1)" }]}
                lineWidth={20}
                label={({ dataEntry }) => dataEntry.value + "%"}
                labelStyle={{
                  fontSize: "14px",
                  fontFamily: "sans-serif",
                  fill: netScore < 50 ? "#9D1525" : "#2DB52D",
                  fontWeight: 900,
                }}
                labelPosition={0}
                rounded
                animate
                animationDuration={5000}
                startAngle={0}
                endAngle={360}
                radius={30}>
                <defs>
                  <linearGradient id='gradient1'>
                    <stop offset='0%' stopColor='#57C74D' />
                    <stop offset='65%' stopColor='#2DB52D' />
                    <stop offset='100%' stopColor='#2DB52D' />
                  </linearGradient>
                </defs>
              </PieChart>
            )}
          </div>
          <div className='flex flex-col space-y-2 md:overflow-y-scroll md:h-96 md:pb-0 pb-12'>
            {scores.map((score) => (
              <SafetyCard
                key={score.name}
                crimeLabel={score.name}
                percentage={score.percentage}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SafetyScore;
