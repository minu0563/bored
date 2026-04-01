'use client';
import AnimatedSection from '../AnimatedSection';
import TextShuffle from '../textshuffle';
import "../globals.css";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
    const router = useRouter();
    setTimeout(() => {
        router.push('/bored1/aim');
    }, 3000);

    return (
        <div className='flex flex-col items-center justify-center'>
            <AnimatedSection delay={50} mode='fade-in'>
                <TextShuffle speed={120} className='text-xl'>
                    <p>Welcome</p>
                </TextShuffle>
            </AnimatedSection>
            <AnimatedSection delay={80} mode='fade-in'>
                <TextShuffle speed={15} className='text-l hidden md:block'>
                    <p>"This website is a portfolio of projects I’ve created whenever I had some free time."</p>
                </TextShuffle>
                <p className='text-l text-center block md:hidden leading-relaxed'>"This website is a portfolio of projects <br /> I’ve created whenever I had some free time."</p>
            </AnimatedSection>
        </div>
    );
}