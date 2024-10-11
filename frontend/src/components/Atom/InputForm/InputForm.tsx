import { FC } from "react";
import styles from "./styles.module.css";

type Props = JSX.IntrinsicElements["input"];

export const InputForm: FC<Props> = ({
  disabled = false,
  value,
  placeholder,
  onChange,
  onKeyDown,
}) => (
  <input
    disabled={disabled}
    className={styles.input}
    type="text"
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    onKeyDown={onKeyDown}
  />
);
