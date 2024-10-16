import { FC } from "react";
import { NavigationLink } from "../../Atom/NavigationLink";
import { NAVIGATION_PATH } from "../../../constants/navigation";
import styles from "./styles.module.css";

export const Navigation: FC = () => (
  <nav>
    <ul className={styles.ul}>
      <NavigationLink title={"Top"} linkPath={NAVIGATION_PATH.TOP} />
      <NavigationLink title={"Create"} linkPath={NAVIGATION_PATH.CREATE} />
    </ul>
  </nav>
);
