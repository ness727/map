import styles from './Select.module.css';

export default function Select({ saveData, onChange, comboData }: { saveData: any, onChange: (param: any) => void, comboData: any[] }) {
    return (
            <select
              id="categoryIdx"
              className={styles.select}
              value={saveData.categoryIdx}
              onChange={onChange}
            >
                <option value="">카테고리 선택</option>
                {
                    comboData.map((data, index) =>
                        <option key={index} value={data.categoryIdx}>{data.name}</option>
                    )
                }
            </select>
    );
}