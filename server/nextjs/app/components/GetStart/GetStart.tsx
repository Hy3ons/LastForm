'use client';

import Image from 'next/image';
import styles from './GetStart.module.css';
import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';
import randint from '@/utils/randInt';

interface IPictureFrame {
    difficulty: number;
    left: number;
    bottom: number;
    scale: number;
}

export default function GetStart() {
    const imageRefs = useRef<(HTMLDivElement | null)[]>([]); // 이미지들을 참조할 배열을 선언
    const picturesRefs = useRef<(HTMLDivElement | null)[]>([]);

    const [pictures, setPictures] = useState<IPictureFrame[]>([]);

    useEffect(() => {
        const pictureAmount = randint(5, 30);
        const temp: IPictureFrame[] = [];
        console.log(1);

        for (let i = 0; i < pictureAmount; i++) {
            const element: IPictureFrame = {
                difficulty: randint(6, 30),
                left: randint(0, 100),
                bottom: randint(0, 100),
                scale: 1 - randint(1, Math.min(pictureAmount, 15)) * 0.05,
            };
            temp.push(element);
        }

        setPictures(temp);

        gsap.fromTo(
            imageRefs.current,
            { opacity: 0 },
            {
                opacity: 1,
                stagger: 1.5, // 이미지들이 0.5초 간격으로 순차적으로 나타남
                duration: 1.5, // 각 이미지가 나타나는 데 걸리는 시간
            }
        );

        setTimeout(() => {
            gsap.fromTo(
                picturesRefs.current,
                {
                    opacity: 0,
                },
                {
                    opacity: 0.9,
                    duration: 0.7,
                }
            );
        }, 4500);
    }, []);

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

            <div className={styles.picture}>
                {pictures ? (
                    pictures.map((el: IPictureFrame, idx: number) => {
                        return (
                            <div
                                key={`lv_${idx}`}
                                style={{
                                    left: `${el.left}%`,
                                    bottom: `${el.bottom}%`,
                                    opacity: 0,
                                    scale: el.scale,
                                }}
                                ref={(el) => {
                                    picturesRefs.current[idx] = el;
                                }}
                            >
                                <Image
                                    src={`/tier/lv_${el.difficulty}.svg`}
                                    width={50}
                                    height={50}
                                    alt={`lv_${el.difficulty}_image`}
                                />
                            </div>
                        );
                    })
                ) : (
                    <></>
                )}

                <div
                    ref={(el) => {
                        imageRefs.current[1] = el;
                    }}
                    className={styles.image13}
                >
                    <Image
                        src="/tier/lv_13.svg"
                        width={300}
                        height={300}
                        alt="lv_13.svg"
                    />
                </div>

                <div
                    ref={(el) => {
                        imageRefs.current[0] = el as HTMLDivElement;
                    }}
                    className={styles.image11}
                >
                    <Image
                        src="/tier/lv_11.svg"
                        width={80}
                        height={80}
                        alt="lv_13.svg"
                    />
                </div>

                <div
                    ref={(el) => {
                        imageRefs.current[2] = el as HTMLDivElement;
                    }}
                    className={styles.image17}
                >
                    <Image
                        src="/tier/lv_17.svg"
                        width={300}
                        height={300}
                        alt="lv_13.svg"
                    />
                </div>
            </div>
        </div>
    );
}
