import styles from "./Form.module.css";
import { BigNumber } from "ethers";
import { useState } from "react";

type Props = {
  mining: boolean;
  currentLimits: BigNumber | undefined;
  getLimits: () => void;
  changeLimits: (limits: BigNumber) => void;
};
//TODO: avaxというクラス名を変える
export default function ChangeLimitsForm({
  mining,
  currentLimits,
  getLimits,
  changeLimits,
}: Props) {
  const [limits, setLimits] = useState<string>("0");

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <div className={styles.title}>
          Change number of pending messages limits !
        </div>
        {mining ? (
          <p>mining...</p>
        ) : (
          <p>current limits: {currentLimits?.toNumber()}</p>
        )}

        <input
          type="number"
          name="avax"
          placeholder="limits"
          id="input_avax"
          min={0}
          defaultValue={currentLimits?.toString()}
          className={styles.avax}
          onChange={(e) => setLimits(e.target.value)}
        />

        <div className={styles.button}>
          <button
            onClick={() => {
              changeLimits(BigNumber.from(limits));
              getLimits();
            }}
          >
            change{" "}
          </button>
        </div>
      </div>
    </div>
  );
}
