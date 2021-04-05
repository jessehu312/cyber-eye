import axios from "axios";

export default async (req, res) => {
  console.log('Init Blockchain', process.env.NEXT_PUBLIC_BLOCKCHAIN_ENDPOINT)
  
  const { proxyRoute } = req.query;
  const result = await axios.post(
    `${"http://45.79.199.42:8000"}/${proxyRoute}`,
    req.body
  );
  console.log(result.status, result.statusText);
  res.json(result.data);
};
