"use client";

import { useState } from "react";
import styles from "./Login.module.css";

export default function Join({ setClick }: { setClick: () => void }) {
  const [id, setId] = useState("");
  const [pwd, setPwd] = useState("");
  const [nickname, setNickname] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("로그인 시도:", { id, pwd });

    // 회원가입 요청
    await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_PREFIX}/api/v1/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: id,
          userPassword: pwd,
          nickname: nickname,
        }),
        credentials: "include",
      }
    )
      .then((res) => {
        if (res.ok) {
          console.log("가입 성공");
          alert("가입에 성공했습니다!");
          setClick();
        } else {
          alert("입력한 정보를 확인해주세요.");
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
            type="password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="nickname">
            닉네임
          </label>
          <input
            className={styles.input}
            id="nickname"
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
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
