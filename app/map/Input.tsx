import styles from "./Input.module.css";

export default function Input({
  id,
  value,
  onChange,
  children,
}: {
  id: string;
  value: string;
  onChange: (event: any) => void;
  children: any;
}) {
  return (
    <div className={styles.container}>
      <span>{children}</span>
      <input
        className={styles.saveInput}
        id={id}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
