import axios from "axios";
import cache from "memory-cache";

const dataCache = new cache.Cache();

export default async ({ query: { type } }, res) => {
  const cachedResult = dataCache.get(type);
  if (cachedResult) {
    return res.json(cachedResult);
  }

  let result = null;

  switch (type) {
    case "gun":
      result = await axios.get(`${process.env.NEXT_PUBLIC_GUNDATA_ENDPOINT}`);
      break;
    case "crime":
      result = await axios.get(`${process.env.NEXT_PUBLIC_CRIMEDATA_ENDPOINT}`);
      break;
    default:
      return res.status(404);
  }

  console.log(type, result.status, result.statusText);
  dataCache.put(type, result.data);
  res.json(result.data);
};
