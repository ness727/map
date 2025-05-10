"use client";

import { useState } from "react";
import styles from "./Login.module.css";

export default function Join({ setClick }: { setClick: () => void }) {
  const [id, setId] = useState("");
  const [pwd, setPwd] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("로그인 시도:", { id, pwd });

    // 회원가입 요청
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_PREFIX}/api/v1/join`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: JSON.stringify({ id: id, pwd: pwd }),
    })
      .then((res) => {
        if (res.ok) {
          console.log("가입 성공");
          setClick();
        } else {
          console.log("가입 실패");
        }
      })
      .catch((error) => {
        console.log("가입 요청 실패");
      });
  };

  return (
    <div className={styles.container}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <div className={styles.title}>회원가입</div>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="id">
            아이디
          </label>
          <input
            className={styles.input}
            id="id"
            type="text"
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
            type="text"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            required
          />
        </div>

        <div>
          <button type="submit" className={styles.button}>
            가입하기
          </button>
          <button className={styles.button} onClick={setClick}>
            뒤로 가기
          </button>
        </div>
      </form>
    </div>
  );
}
