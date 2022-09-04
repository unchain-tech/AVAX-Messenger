import styles from "./Form.module.css";
import { BigNumber } from "ethers";
import { useState } from "react";

type Props = {
  mining: boolean;
  currentValue: BigNumber | undefined;
  getValue: () => void;
  changeValue: (limits: BigNumber) => void;
};

export default function ChangeOwnerValueForm({
  mining,
  currentValue: currentLimits,
  getValue: getLimits,
  changeValue: changeValue,
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
          name="limits_number"
          placeholder="limits"
          id="input_limits"
          min={0}
          defaultValue={currentLimits?.toString()}
          className={styles.number}
          onChange={(e) => setLimits(e.target.value)}
        />

        <div className={styles.button}>
          <button
            onClick={() => {
              changeValue(BigNumber.from(limits));
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
