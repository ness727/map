"use client";

import { useRouter } from "next/navigation";
import styles from "./SearchBox.module.css";

export default function SearchBox() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <input
        type="text"
        placeholder="검색어를 입력하세요"
        className={styles.searchBox}
      />
      <input
        className={styles.button}
        type="submit"
        value="검색"
        onClick={() => {
          router.push("/map");
        }}
      />
    </div>
  );
}
