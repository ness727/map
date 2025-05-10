"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import styles from "./SearchBox.module.css";
import { useEffect, useState } from "react";

export default function SearchBox({
  setName,
}: {
  setName: (name: string) => void;
}) {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    const searchKeyword = searchParams.get("name");

    if (searchKeyword != null && searchKeyword !== "") {
      setKeyword(searchKeyword);
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (pathName === "/") {
        if (keyword === "") router.push("/map");
        else router.push("/map?name=" + keyword);
      } else {
        // 맵 내부에서
        setName(keyword);
      }
    }
  };

  return (
    <div className={styles.container}>
      <input
        type="text"
        placeholder="검색어를 입력하세요"
        className={styles.searchBox}
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <input
        className={styles.button}
        type="submit"
        value="검색"
        onClick={() => {
          if (pathName === "/") {
            if (keyword === "") router.push("/map");
            else router.push("/map?name=" + keyword);
          } else {
            // 맵 내부에서
            setName(keyword);
          }
        }}
      />
    </div>
  );
}
