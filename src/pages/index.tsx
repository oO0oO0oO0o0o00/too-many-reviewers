import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import styles from "@/styles/Home.module.css";
// import TableView from "@/table_view";
import dynamic from "next/dynamic";
const TableView = dynamic(() => import('@/table_view'), { ssr: false })


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <>
      <Head>
        <title>Too Many Reviewers</title>
        <meta name="description" content="A Linkup game making fun of enterprise-level amount of code reviewers." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <main className={styles.main}><TableView/></main>
    </>
  );
}
