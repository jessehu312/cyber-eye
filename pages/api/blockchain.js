import axios from "axios";

export default async (req, res) => {
  console.log('Init Blockchain', process.env.NEXT_PUBLIC_BLOCKCHAIN_ENDPOINT)

  const { proxyRoute } = req.query;
  const result = await axios.post(
    `${process.env.NEXT_PUBLIC_BLOCKCHAIN_ENDPOINT}/${proxyRoute}`,
    req.body
  );
  console.log(result.status, result.statusText);
  res.json(result.data);
};
