import axios from "axios";

export default async (req, res) => {
  const { proxyRoute } = req.query;
  const result = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/${proxyRoute}`,
    req.body
  );
  res.json(result.data);
};
