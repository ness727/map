"use client";

import { useState } from "react";
import styles from "./Login.module.css";
import Cookies from "js-cookie";

export default function Login({ setClick, setIsLoggedIn }: { setClick: () => void, setIsLoggedIn: () => void }) {
  const [id, setId] = useState("");
  const [pwd, setPwd] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("로그인 시도:", { id, pwd });

    // 로그인 요청
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_PREFIX}/api/v1/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: id, userPassword: pwd }),
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          console.log("로그인 성공");
          Cookies.set("login", "good");
          setIsLoggedIn();
          setClick();
        } else {
          console.log("로그인 실패");
          setId("");
          setPwd("");
        }
      })
      .catch((error) => {
        console.log("요청 실패");
      });
  };

  return (
    <div className={styles.container}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <div className={styles.title}>로그인</div>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="id">
            아이디
          </label>
          <input
            className={styles.input}
            id="id"
            type="id"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="pwd">
            비밀번호
          </label>
          <input
            className={styles.input}
            id="pwd"
            type="password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            required
          />
        </div>

        <div>
          <button type="submit" className={styles.button}>
            로그인
          </button>
          <button type="button" className={styles.button} onClick={setClick}>
            뒤로 가기
          </button>
        </div>
      </form>
    </div>
  );
}
