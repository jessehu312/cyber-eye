import axios from "axios";

export default async (req, res) => {
  const { proxyRoute } = req.query;
  console.log('Init Proxy', process.env.NEXT_PUBLIC_BACKEND_ENDPOINT)
  const result = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/${proxyRoute}`,
    req.body
  );
  console.log(result.status, result.statusText);
  res.json(result.data);
};
