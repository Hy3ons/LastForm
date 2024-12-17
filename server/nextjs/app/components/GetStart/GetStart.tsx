import styles from './GetStart.module.css';

export default function GetStart() {
    return (
        <div className={styles['start-wrapper']}>
            <div className={styles['text-wrapper']}>
                <span className={styles.title}>Show your Progress</span>
                <span className={styles.description}>
                    Visualize your recent problem-solving performance on the
                    Site
                    <br /> Review others performance and convert it into an SVG
                    image!
                </span>
            </div>

            <div className={styles.picture}></div>
        </div>
    );
}
