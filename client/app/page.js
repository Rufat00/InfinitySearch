import Seacrh from "@/components/Search/Search";
import styles from "./page.module.scss";
import Logo from "@/components/Logo/Logo";

export default function Home() {
    return (
        <main className={styles.main}>
            <Logo text className={styles.logo} />
            <Seacrh />
        </main>
    );
}
