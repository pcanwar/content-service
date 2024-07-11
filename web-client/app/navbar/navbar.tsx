import Image from "next/image";
import Link from 'next/link';
import styles from './navbar.module.css';

const Navbar = () => {
    return (
        <nav className={styles.nav}>
            <Link href="/">
                <div className={styles.logoContainer}>
                    <Image
                        className={styles.logo}
                        src="/img/nav/log.svg"
                        alt="logo"
                        layout="fill"
                    />
                </div>
            </Link>
            <div>
                <Link href="/">Home</Link>
                <Link href="/about">About</Link>
                <Link href="/courses">Courses</Link>
                <Link href="/contact">Contact</Link>
            </div>
        </nav>
    );
}

export default Navbar;
