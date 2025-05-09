"use client";

import Head from "next/head";
import styles from "./Landing.module.css";
import React, { Suspense, useState } from "react";
import SearchBox from "../components/SearchBox";
import Login from "../components/Login";
import Join from "../components/Join";

export default function Home() {
  const [click, setClick] = useState("");

  return (
    <div className={styles.container}>
      <Head>
        <title>맵플 랜딩 페이지</title>
        <meta name="description" content="원하는 경로를 입력하세요" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* <Header /> */}

      <main className={styles.main}>
        {/* <h1 className={styles.title}>맵플</h1> */}
        <img
          alt=""
          height={200}
          width={300}
          src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FCOYlE%2FbtsND2B0UHb%2FCX0KSf0CkLUEKkNijUSnWK%2Fimg.png"
        />

        {click === "" ? (
          <>
            <Suspense>
              <SearchBox setName={() => {}} />
            </Suspense>
            <button
              className={styles.button}
              onClick={() => {
                setClick("Login");
              }}
            >
              로그인
            </button>
            <button
              className={styles.button}
              onClick={() => {
                setClick("Join");
              }}
            >
              회원가입
            </button>
          </>
        ) : click === "Login" ? (
          <Login setClick={() => setClick("")} />
        ) : (
          <Join setClick={() => setClick("")} />
        )}
      </main>

      <footer className={styles.footer}>그냥 잘하자</footer>
    </div>
  );
}
