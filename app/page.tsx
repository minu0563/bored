import './globals.css';
import AnimatedSection from './AnimatedSection';
import TextShuffle from './textshuffle';
import "./globals.css";
import Link from 'next/link';

export default function Home() {
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

            <div className='flex items-center justify-center absolute top-120 space-x-30'>
                <AnimatedSection delay={1500} mode='slide-top-to-bottom'>
                    <p className="textani">
                        <Link href="/bored1">
                            Project 1
                        </Link>
                    </p>
                </AnimatedSection>
                <AnimatedSection delay={1650} mode='slide-top-to-bottom'>
                    <p className="textani">
                    Project 2
                    </p>                
                </AnimatedSection>
                <AnimatedSection delay={1800} mode='slide-top-to-bottom'>
                    <p className="textani">
                    Project 3
                    </p>                
                </AnimatedSection>
            </div>
        </div>
    );
}