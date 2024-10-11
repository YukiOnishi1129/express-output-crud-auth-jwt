import { FC } from "react";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";

type Props = {
  title: string;
  linkPath: string;
};

export const NavigationLink: FC<Props> = ({ title, linkPath }) => (
  <li className={styles.li}>
    <Link to={linkPath}>{title}</Link>
  </li>
);
