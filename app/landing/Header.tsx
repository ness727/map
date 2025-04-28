import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>맵플</h1>
      <button className={styles.loginButton}>로그인</button>
    </header>
  );
};
