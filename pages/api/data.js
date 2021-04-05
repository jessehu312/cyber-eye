import axios from "axios";
import cache from "memory-cache";

const dataCache = new cache.Cache();

export default async ({ query: { type } }, res) => {
  console.log('Init Data', process.env.NEXT_PUBLIC_GUNDATA_ENDPOINT, process.env.NEXT_PUBLIC_CRIMEDATA_ENDPOINT)
  console.log('env', process.env.NEXT_PUBLIC_VERCEL_ENV)

  const cachedResult = dataCache.get(type);
  if (cachedResult) {
    console.log('Using Cache')
    return res.json(cachedResult);
  }

  // Hack to save bandwidth and display full dataset locally
  if (!process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.NEXT_PUBLIC_VERCEL_ENV === 'development') {
    if (type === "gun") {
      const gunData = require("../../data/gundata_matrix_trim.json");
      return res.json(gunData)
    }
    else {
      const crimeData = require("../../data/crimes_matrix_trim.json");
      return res.json(crimeData)
    }
  }

  console.log('Using Cash')
  let result = null;
  switch (type) {
    case "gun":
      result = await axios.get(
        `${process.env.NEXT_PUBLIC_GUNDATA_ENDPOINT}`
      );
      break;
    case "crime":
      result = await axios.get(
        `${process.env.NEXT_PUBLIC_CRIMEDATA_ENDPOINT}`
      );
      break;
    default:
      return res.status(404);
  }

  console.log('Using Cash', type, result.status, result.statusText);
  dataCache.put(type, result.data);
  res.json(result.data);
};
