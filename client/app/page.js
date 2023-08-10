import styles from "./page.module.scss";
import Logo from "@/components/Logo/Logo";
import Search from "@/components/Search/Search";

export default function Home() {
    return (
        <main className={styles.main}>
            <Logo text className={styles.logo} />
            <Search />
        </main>
    );
}
