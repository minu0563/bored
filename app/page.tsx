"use client";
import React, { useState, useEffect, useRef } from 'react';
import './globals.css';
import { useRouter } from 'next/navigation';

const Terminal = () => {
    const router = useRouter();
    const [logs, setLogs] = useState<{ type: string; text: string }[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [status, setStatus] = useState('INTERCEPTING...');
    const [isAlert, setIsAlert] = useState(false);
    const [cpuTemp, setCpuTemp] = useState(42);
    const [fileStream, setFileStream] = useState<string[]>([]);
    const [time, setTime] = useState('');
    const [enabled, setEnabled] = useState(false);
    const [failed, setFailed] = useState(0);

    const scrollRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const fullLog = [
        "BOOT_SEQ: SUCCESS", "LOADING_KERNEL... DONE", "MTU_SET: 1500",
        "SCANNING_OPEN_PORTS...", "PORT_80: CLOSED", "PORT_443: OPEN",
        "ATTEMPTING_EXPLOIT_0x442...", "PAYLOAD_SENT.", "STAGGER_ACTIVE.",
        "ACCESS_GRANTED_BY_ROOT.", "DOWNLOADING_SENSITIVE_DATA...", "DOWNLOADING_SENSITIVE_DATA... [■□□□□□□□□□] 10%",
        "DOWNLOADING_SENSITIVE_DATA... [■■■■□□□□□□] 40%", "DOWNLOADING_SENSITIVE_DATA... [■■■■■■■□□□] 60%",
        "DOWNLOADING_SENSITIVE_DATA... [■■■■■■■■■■] 100%", "EXTRACTING_DATA... DONE",
        "COVERING_TRACKS... DONE", "Security Disabled"
    ];

    // 토글 스위치 상태 유지 및 초기 로그 처리
    useEffect(() => {
        const savedEnabled = localStorage.getItem('securityEnabled') === 'true';
        setEnabled(savedEnabled);

        const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);

        let logIdx = 0;
        const addLogInterval = () => {
            if (logIdx < fullLog.length) {
                if (!savedEnabled) { // 토글 ON이면 초기 로그 스킵
                    setLogs(prev => [...prev, { type: 'SYS_LOG', text: fullLog[logIdx] }]);
                    if (logIdx === 7) {
                        setIsAlert(true);
                        setStatus('DANGER!');
                        setTimeout(() => setIsAlert(false), 3000);
                    }
                }
                else {
                    setStatus('DANGER!');
                }
                logIdx++;
                setTimeout(addLogInterval, Math.random() * 1500 + 500);
            }
        };
        addLogInterval();

        // Canvas 신호 차트
        const ctx = canvasRef.current?.getContext('2d');
        const drawSignal = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, 250, 100);
            ctx.strokeStyle = '#00ff41';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, 50);
            for (let i = 0; i < 250; i += 10) {
                ctx.lineTo(i, 50 + (Math.random() - 0.5) * 40);
            }
            ctx.stroke();
        };
        const signalInterval = setInterval(drawSignal, 200);

        // 하드웨어 스트림 & 온도
        const hardwareInterval = setInterval(() => {
            setFileStream(prev => [
                `0x${Math.random().toString(16).substring(2, 10).toUpperCase()} FETCHED...`,
                ...prev.slice(0, 14)
            ]);
            setCpuTemp(Math.floor(Math.random() * 20 + 40));
        }, 500);

        return () => {
            clearInterval(timer);
            clearInterval(signalInterval);
            clearInterval(hardwareInterval);
        };
    }, []);

    // 스크롤 하단 고정
    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [logs]);

    //  토글 스위치 함수
    const toggleSwitch = () => {
        setEnabled(prev => {
            const newState = !prev;
            localStorage.setItem('securityEnabled', newState.toString());
            setLogs(prevLogs => [
                ...prevLogs,
                { type: 'SYS', text: `SECURITY ${newState ? 'ON' : 'OFF'}` }
            ]);
            return newState;
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            const cmd = inputValue.trim();
            if (cmd) {
                setLogs(prev => [...prev, { type: 'USER', text: cmd }]);
                processCommand(cmd);
            }
            setInputValue('');
        }
    };

    const processCommand = (cmd: string) => {
        let response = "";
        let type = "";
        const lowerCmd = cmd.toLowerCase();
        const isValid = /^[a-zA-Z0-9]+$/.test(lowerCmd);

        if (lowerCmd.includes("sudo") || lowerCmd.includes("rm") || lowerCmd.includes("format") ||
            lowerCmd.includes("ddos") || lowerCmd.includes("hack") || lowerCmd.includes("exploit") || !isValid) {

            // response = "ACCESS_DENIED: PERMISSION_REQUIRED.";
            // setFailed(prev => prev + 1);

            // if (failed >= 5) {
            //     response = "ACCESS_DENIED: PERMISSION_REQUIRED.";
            //     response = "Stop?";
            //     setFailed(0);
            // }

            setFailed(prev => {
                const newFailed = prev + 1;
                if (newFailed >= 5) {
                    type = 'Admin';
                    response = "We are not vulnerable like you think. Stop trying.";
                    return 0;
                } else {
                    response = "ACCESS_DENIED: PERMISSION_REQUIRED.";
                    return newFailed;
                }
            });
        } else {
            if (isValid) {
                switch (lowerCmd) {
                    case "help": response = "AVAILABLE_CMDS: help, clear(or cls), status, \n trace, birthday, tree, hello, coconut, project1, extension(1~3)"; break;
                    case "clear": case "cls": setLogs([]); return;
                    case "status": response = "SYS_STATUS: ONLINE / ALL_SYSTEMS_STABLE."; break;
                    case "trace": response = "TRACE_SIGNAL: ACTIVE... NO HOSTILES DETECTED."; break;
                    case "birthday": response = "My_BIRTHDAY_IS: 09/08"; break;
                    case "tree": response = "Selected Tree..";
                        setTimeout(() => {
                            router.push('/tree');
                        }, 1000);
                        break;
                    case "hello": response = "Hello there!"; break;
                    case "coconut": response = "CoCoNuT is a website project team."; break;
                    case "project1":
                        response = "Selected Project: Project1 / Go project1 ...";
                        setTimeout(() => router.push('/bored1'), 1000);
                        break;
                    case "extension1": response = "Selected Extension: Extension1 / Go extension1 ...";
                        setTimeout(() => window.open('https://chromewebstore.google.com/detail/coconut-%EB%8B%B9%EC%8B%A0%EC%9D%98-%ED%8E%B8%EB%A6%AC%ED%95%9C-%EC%9C%A0%ED%8A%9C%EB%B8%8C-%EC%8B%9C%EC%B2%AD%EC%9D%84-%EC%9C%84/ckdkiedamneebnodcphbohikgccaheon?hl=ko&utm_source=ext_sidebar', "_blank"), 1000);
                        break;
                    case "extension2": response = "Selected Extension: Extension2 / Go extension2 ...";
                        setTimeout(() => window.open('https://chromewebstore.google.com/detail/get-coconut/hebdcmlfkpcjgjkaeifikhpnkbndalla?hl=ko&utm_source=ext_sidebar', "_blank"), 1000);
                        break;
                    case "extension3": response = "Selected Extension: Extension3 / Go extension3 ...";
                        setTimeout(() => window.open('https://chromewebstore.google.com/detail/coconut-shopping-blocker/ecmicbpebdeoalccgamighmbmjhdhbca?hl=ko&utm_source=ext_sidebar', "_blank"), 1000);
                        break;
                    default:
                        response = `UNKNOWN_CMD: ${cmd} / type 'help' for available commands`;
                        break;
                }
            }

        }

        setTimeout(() => setLogs(prev => [...prev, { type: (type || 'SYS'), text: response }]), 100);
    };

    return (
        <div className="bg-[#020a02] text-[#00ff41] font-mono h-screen w-screen overflow-hidden flex justify-center items-center relative selection:bg-[#00ff41] selection:text-black">

            {isAlert && (
                <div className="absolute top-[20%] left-1/2 -translate-x-1/2 bg-[#ff003c] text-white p-5 font-bold border-4 border-double border-white z-50 animate-pulse">
                    !! INTRUSION DETECTED !!
                </div>
            )}

            <div className="grid grid-cols-[300px_1fr_300px] grid-rows-[60px_1fr_100px] gap-3.75 w-[95vw] h-[90vh] my-auto relative z-10">

                {/* Header */}
                <header className="col-span-3 border border-[#00ff41] bg-[rgba(0,15,0,0.9)] p-3.75 flex justify-between items-center border-b-2 shadow-[inset_0_0_15px_rgba(0,255,65,0.1)]">
                    <div className="text-2xl font-bold animate-[glitch_2s_infinite]">CoCoNuT_Main_os</div>
                    <div className={status === 'DANGER!' ? 'text-[#ff003c]' : ''}>STATUS: <span>{status}</span></div>
                    <div>{time}</div>
                </header>

                {/* Left Side */}
                <aside className="border border-[#00ff41] bg-[rgba(0,15,0,0.9)] p-3.75 shadow-[inset_0_0_15px_rgba(0,255,65,0.1)]">
                    <h3 className="text-[12px] mb-4">HARDWARE_CORE</h3>
                    <div className="flex justify-between text-[0.8rem] mb-1">
                        <span>CPU_TEMP</span><span>{cpuTemp}°C</span>
                    </div>
                    <div className="w-full h-1 bg-[#002200] mb-5">
                        <div className="h-full bg-[#00ff41] transition-all duration-300" style={{ width: `${cpuTemp}%` }}></div>
                    </div>
                    <div className="text-[0.8rem] mb-2">SIGNAL_STRENGTH</div>
                    <canvas ref={canvasRef} width="250" height="100" className="w-full h-25" />
                    <div className="text-[9px] mt-5 text-[#006600] leading-tight">
                        {fileStream.map((line, i) => <div key={i}>{line}</div>)}
                    </div>
                </aside>

                {/* Main Terminal */}
                <main ref={scrollRef} className="relative border-2 border-[#00ff41] bg-[rgba(0,15,0,0.9)] p-3.75 overflow-y-auto scrollbar-hide shadow-[inset_0_0_15px_rgba(0,255,65,0.1)]">
                    <div className="absolute top-1 right-2 text-[10px] opacity-50">ENCRYPTED_SESSION</div>
                    <div className="space-y-2">
                        {logs.map((log, i) => (
                            <div key={i}>
                                <span className="text-[#888] mr-2.5">[{log.type}]</span>
                                {(log.text ?? "").split('\n').map((line, idx) => (
                                    <React.Fragment key={idx}>
                                        {line}
                                        <br />
                                    </React.Fragment>
                                ))}
                            </div>
                        ))}
                    </div>
                    <div className="mt-2 flex items-center">
                        <span className="text-white mr-2">{'>'}</span>
                        <input
                            type="text"
                            className="bg-transparent border-none outline-none text-[#00ff41] flex-1 font-mono"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            autoFocus
                        />
                        <span className="w-2 h-4 bg-[#00ff41] animate-bounce"></span>
                    </div>
                </main>

                {/* Right Side */}
                <aside className="border border-[#00ff41] bg-[rgba(0,15,0,0.9)] p-3.75 shadow-[inset_0_0_15px_rgba(0,255,65,0.1)]">
                    <h3 className="text-[12px] mb-4">TRACE_LOCATION</h3>
                    <div className="relative h-37.5 border border-[#004400] overflow-hidden bg-[radial-gradient(circle,rgba(0,50,0,0.4)_0%,rgba(0,10,0,1)_70%)] flex flex-wrap content-start">
                        <div className="absolute inset-[-50%] bg-[conic-gradient(rgba(0,255,65,0.4),rgba(0,255,65,0)_40%)] animate-[spin_3s_linear_infinite]"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-[rgba(0,255,65,0.4)] rounded-full animate-[ping_2.2s_ease-out_infinite]"></div>
                        {Array.from({ length: 100 }).map((_, i) => (
                            <div key={i} className="w-[10%] h-[10%] border-[0.1px] border-[#002200]"></div>
                        ))}
                    </div>
                    <p className="text-[10px] mt-2.5 leading-relaxed">
                        TARGET_IP: 192.168.0.254<br />
                        LAT: 37.5665 / LON: 126.9780
                    </p>

                    {/* 토글 스위치 */}
                    <label className="inline-flex items-center cursor-pointer select-none mt-4">
                        <span className="mr-2 text-sm">{enabled ? 'SECURITY OFF' : 'SECURITY ON'}</span>
                        <div className="relative">
                            <input type="checkbox" className="sr-only peer" checked={enabled} onChange={toggleSwitch} />
                            <div className="w-12 h-6 bg-[#002200] rounded-full transition-colors"></div>
                            <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-[#003300] rounded-full shadow-md transform peer-checked:translate-x-full peer-checked:bg-[#00ff00] transition-transform"></div>
                        </div>
                    </label>
                </aside>

                {/* Footer */}
                <footer className="col-span-3 border border-[#00ff41] bg-[rgba(0,15,0,0.9)] p-2 flex justify-around items-center text-[10px] opacity-60 shadow-[inset_0_0_15px_rgba(0,255,65,0.1)]">
                    <span>ENCRYPTION: AES-256</span>
                    <span>GATEWAY: ACTIVE</span>
                    <span>X-SERVER: CONNECTED</span>
                    <span>ROOT@INTERNAL_SRV:~#</span>
                </footer>
            </div>

            <style jsx global>{`
                @keyframes glitch {
                    0%, 100% { transform: translate(0); }
                    20% { transform: translate(-2px, 2px); }
                    40% { transform: translate(-2px, -2px); }
                    60% { transform: translate(2px, 2px); }
                    80% { transform: translate(2px, -2px); }
                }
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
};

export default Terminal;