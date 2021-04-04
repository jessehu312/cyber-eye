import axios from "axios";

export default async ({query: {type}}, res) => {
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
  res.json(result.data);
};
