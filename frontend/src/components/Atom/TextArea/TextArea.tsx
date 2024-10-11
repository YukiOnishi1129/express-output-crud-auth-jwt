import { FC } from "react";
import styles from "./styles.module.css";

type Props = JSX.IntrinsicElements["textarea"];

export const TextArea: FC<Props> = ({
  disabled,
  value,
  placeholder,
  onChange,
}) => (
  <textarea
    disabled={disabled}
    className={styles.text}
    value={value}
    placeholder={placeholder}
    onChange={onChange}
  />
);
