import axios from 'axios';

export default async ({query: {proxyRoute}}, res) => {  
  const result = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/${proxyRoute}`, req.body);
  res.json(result.data);
};