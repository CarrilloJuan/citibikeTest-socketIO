import React from "react";
import styles from "./style.module.css";

export default function Footer({
  stats = {},
  city,
  handleOnSelectChange,
  selectedValue,
}) {
  const { emptySlots, freeBikes } = stats;
  return (
    <div className={styles.container}>
      <h1 className={styles.title}> City Bikes in {city} </h1>

      <div style={{ marginTop: 16 }}>
        <select value={selectedValue} onChange={handleOnSelectChange}>
          <option value="current">current</option>
          <option value="3">Last four hours</option>
          <option value="2">Last eight hours</option>
          <option value="1">Last twelve hours</option>
        </select>
      </div>

      <div className={styles.stats}>
        <p>
          Empty slots <span className={styles.stat}>{emptySlots}</span>
        </p>
        <p>
          Free bikes <span className={styles.stat}>{freeBikes}</span>
        </p>
      </div>
    </div>
  );
}
