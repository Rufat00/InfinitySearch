import logoImage from "@/assets/images/logo.png";
import styles from "./Logo.module.scss";
import Image from "next/image";

const Logo = ({ className, imageClassName, text }) => {
    return (
        <a href="/" className={`${styles.logo} ${className}`}>
            <Image alt="logo" src={logoImage} className={`${styles.image} ${imageClassName}`} />
            {text && <div className={`${styles.text}`}>InfinitySearch</div>}
        </a>
    );
};

export default Logo;
