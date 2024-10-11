import { FC, ReactNode } from "react";
import { Navigation } from "../../Molecule/Navigation";
import styles from "./styles.module.css";

type Props = {
  children: ReactNode;
  title: string;
};

export const BaseLayout: FC<Props> = ({ children, title }) => (
  <div className={styles.container}>
    <section className={styles.common}>
      <Navigation />
    </section>
    <h1 className={styles.title}>{title}</h1>
    {children}
  </div>
);
