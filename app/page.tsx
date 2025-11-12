import './globals.css';
import AnimatedSection from './AnimatedSection';
import TextShuffle from './textshuffle';

export default function Home() {
    return (
        <div className='flex flex-col items-center justify-center'>
            <AnimatedSection delay={50} mode='fade-in'>
                <TextShuffle speed={120} className='text-xl'>
                    <p>Welcome</p>
                </TextShuffle>
            </AnimatedSection>
            <AnimatedSection delay={80} mode='fade-in'>
                <TextShuffle speed={15} className='text-l'>
                    <p>"This website is a portfolio of projects I’ve created whenever I had some free time."</p>
                </TextShuffle>
            </AnimatedSection>
        </div>
    );
}