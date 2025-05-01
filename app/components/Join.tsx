"use client";

import { useState } from "react";
import styles from "./Login.module.css";

export default function Join({ goToMain }: { goToMain: () => void }) {
  const [id, setId] = useState("");
  const [pwd, setPwd] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("로그인 시도:", { id, pwd });
    // TODO: 로그인 처리 로직 추가
  };

  async function join() {
    const response = await fetch("http://localhost:8080/join", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: JSON.stringify({ id: id, pwd: pwd }),
    })
      .then((res) => {
        console.log("가입 성공");
      })
      .catch((error) => {
        console.log("가입 실패");
      });
  }

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
            type="pwd"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            required
          />
        </div>

        <div>
          <button type="submit" className={styles.button}>
            회원가입
          </button>
          <button className={styles.button} onClick={goToMain}>
            뒤로 가기
          </button>
        </div>
      </form>
    </div>
  );
}
