import Head from "next/head";
import Header from "@/components/home/Header";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Cyber.Eye</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
    </div>
  );
}
