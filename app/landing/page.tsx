"use client";

import Head from "next/head";
import styles from "./Landing.module.css";
import React, { Suspense, useEffect, useState } from "react";
import SearchBox from "../components/SearchBox";
import Login from "./Login";
import Join from "./Join";
import Cookies from "js-cookie";

export default function Home() {
  const [click, setClick] = useState("");
  const [isClient, setIsClient] = useState(false); // 클라이언트에서만 동작하도록 설정

  useEffect(() => {
    setIsClient(true); // 클라이언트에서만 상태 설정
  }, []);

  // 클라이언트에서만 쿠키 확인
  const isLoggedIn = Cookies.get("login") !== undefined;
  if (!isClient) return null;

  const logout = () => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_PREFIX}/api/v1/logout`)
          .then((res) => res.ok ? alert("다음에 또 만나요~") : alert("로그아웃 중 문제가 발생했습니다."))
          .catch((err) => {
            console.error("Logout Error:", err);
          });
    Cookies.remove("login");
    Cookies.remove("JSESSIONID");
  }

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
          style={{ margin: 30 }}
          src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FCOYlE%2FbtsND2B0UHb%2FCX0KSf0CkLUEKkNijUSnWK%2Fimg.png"
        />

        {click === "" ? (
          <>
            <Suspense>
              <SearchBox setName={() => {}} />
            </Suspense>

            {!isLoggedIn ? (
              <>
                <button
                  className={styles.button}
                  onClick={() => {
                    setClick("Login");
                  }}
                  style={{ marginTop: 70 }}
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
            ) : (
              <button
                  className={styles.button}
                  onClick={() => {
                    setClick("");
                    logout();
                  }}
                  style={{ marginTop: 70 }}
                >
                  로그아웃
                </button>
            )}
          </>
        ) : click === "Login" ? (
          <Login setClick={() => setClick("")} />
        ) : (
          <Join setClick={() => setClick("")} />
        )}
      </main>
    </div>
  );
}
