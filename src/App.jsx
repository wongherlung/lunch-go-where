import React, { useState, useRef, useEffect } from 'react';

// --- Confetti Effect Components ---
const ConfettiPiece = ({ style }) => (
    <div className="absolute w-2 h-4" style={style}></div>
);

const Confetti = () => {
    const [pieces, setPieces] = useState([]);

    useEffect(() => {
        // Generate 150 confetti pieces with random properties
        const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'];
        const newPieces = Array.from({ length: 150 }).map((_, i) => ({
            id: i,
            style: {
                left: `${Math.random() * 100}%`,
                top: `${-10 - Math.random() * 10}%`, // Start above the screen
                backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                transform: `rotate(${Math.random() * 360}deg)`,
                animation: `fall ${2 + Math.random() * 3}s ${Math.random() * 2}s linear forwards`,
            }
        }));
        setPieces(newPieces);
    }, []);

    return (
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-50 pointer-events-none">
            {pieces.map(piece => <ConfettiPiece key={piece.id} style={piece.style} />)}
        </div>
    );
};
// --- End Confetti Components ---

// --- Icon Components ---
const SettingsIcon = ({ onClick }) => (
    <button onClick={onClick} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors duration-200 z-10" aria-label="Open settings">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19.14 12.94c.04-.3.06-.61.06-.94s-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94L14.4 2.81c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.44.17-.48.41L9.2 5.77C8.61 6.01 8.08 6.33 7.58 6.71L5.19 5.75c-.22.08-.47 0-.59.22L2.68 9.29c-.11.2.06.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23-.41-.12-.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.44 2.96c.04.24.24.41.48.41h3.84c.24 0 .44-.17-.48.41l.44-2.96c.59-.24 1.12-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.11-.2.06-.47-.12-.61L19.14 12.94z"/>
            <circle cx="12" cy="12" r="3"/>
        </svg>
    </button>
);

const BackIcon = ({ onClick }) => (
    <button onClick={onClick} className="absolute top-4 left-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors duration-200 z-10" aria-label="Go back">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
    </button>
);
// --- End Icon Components ---

// --- Settings Components ---
const DarkModeToggle = ({ isDarkMode, onToggle }) => (
    <div className="flex items-center justify-between w-full p-4">
        <span className="text-slate-700 dark:text-slate-300 font-medium">Dark Mode</span>
        <button onClick={onToggle} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-800 ${isDarkMode ? 'bg-indigo-600' : 'bg-slate-300'}`}>
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-1'}`}/>
        </button>
    </div>
);

const ExportChoices = () => {
    const [buttonText, setButtonText] = useState('Export My List');

    const handleExport = () => {
        const choicesJSON = localStorage.getItem('lunchChoices') || '[]';
        
        const textArea = document.createElement("textarea");
        textArea.value = choicesJSON;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            document.execCommand('copy');
            setButtonText('Copied!');
            setTimeout(() => setButtonText('Export My List'), 2500);
        } catch (err) {
            console.error('Failed to copy choices: ', err);
            setButtonText('Error!');
            setTimeout(() => setButtonText('Export My List'), 2500);
        } finally {
            document.body.removeChild(textArea);
        }
    };

    return (
        <div className="text-left w-full">
            <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">Export Choices</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Copy your current food list to your clipboard.</p>
            <button 
                onClick={handleExport}
                className="w-full bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold py-2 px-4 rounded-lg transition-all duration-200"
            >
                {buttonText}
            </button>
        </div>
    );
};

const ImportChoices = ({ onImport }) => {
    const [importValue, setImportValue] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleImportClick = () => {
        setError('');
        setSuccess('');
        if (!importValue.trim()) {
            setError('Please paste your data first lah.');
            return;
        }
        try {
            const parsedData = JSON.parse(importValue);
            if (!Array.isArray(parsedData) || !parsedData.every(item => typeof item === 'string')) {
                throw new Error('Data not correct format. Must be a list of words.');
            }
            
            const uniqueChoices = [...new Set(parsedData)];

            onImport(uniqueChoices);
            setImportValue('');
            setSuccess(`Success! Imported ${uniqueChoices.length} choices.`);
            setTimeout(() => setSuccess(''), 3000);
        } catch (e) {
            setError(e.message || 'Invalid data. Please check the text you pasted.');
        }
    };
    
    return (
        <div className="text-left w-full">
             <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">Import Choices</h3>
             <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Paste a previously exported list to restore it.</p>
             <textarea
                value={importValue}
                onChange={(e) => setImportValue(e.target.value)}
                className="w-full p-3 h-24 border-2 border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 transition duration-300"
                placeholder="Paste your exported list here..."
             />
             {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
             {success && <p className="text-green-500 text-xs mt-1">{success}</p>}
             <button
                onClick={handleImportClick}
                className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200"
             >
                Import List
             </button>
        </div>
    );
};
// --- End Settings Components ---

// Chip component for individual food choices
const ChoiceChip = ({ text, onRemove }) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        // Trigger animation on mount
        const timer = setTimeout(() => setIsMounted(true), 10);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`
            bg-indigo-100 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200 
            text-sm font-semibold px-4 py-2 rounded-full flex items-center gap-2 
            transform transition-all duration-300 ease-out
            ${isMounted ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}
        `}>
            <span>{text}</span>
            <button
                onClick={onRemove}
                className="text-indigo-400 dark:text-indigo-300 hover:text-indigo-600 dark:hover:text-indigo-100 font-bold text-lg leading-none"
                aria-label={`Remove ${text}`}
            >
                &times;
            </button>
        </div>
    );
};


export default function App() {
    // Load choices from localStorage on initial render
    const [choices, setChoices] = useState(() => {
        try {
            const storedChoices = localStorage.getItem('lunchChoices');
            return storedChoices ? JSON.parse(storedChoices) : [];
        } catch (error) {
            console.error("Error reading choices from localStorage", error);
            return [];
        }
    });

    const [inputValue, setInputValue] = useState('');
    const [result, setResult] = useState('');
    const [tempResult, setTempResult] = useState('');
    const [isChoosing, setIsChoosing] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);
    const [error, setError] = useState('');
    const [showConfetti, setShowConfetti] = useState(false);
    const [isShowingSettings, setIsShowingSettings] = useState(false);
    
    const frontRef = useRef(null);
    const backRef = useRef(null);
    const [cardHeight, setCardHeight] = useState(580); // Default/min height
    
    // Dark mode state and effect
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== 'undefined' && localStorage.getItem('theme') === 'dark') return true;
        if (typeof window !== 'undefined' && localStorage.getItem('theme') === 'light') return false;
        return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);
    
    useEffect(() => {
        const frontHeight = frontRef.current?.scrollHeight || 0;
        const backHeight = backRef.current?.scrollHeight || 0;

        const targetHeight = isShowingSettings ? backHeight : frontHeight;
        
        const newHeight = Math.max(targetHeight, 580);

        setCardHeight(newHeight);
    }, [isShowingSettings, choices]);
    
    const decisionIntervalRef = useRef(null);

    // Save choices to localStorage whenever they change
    useEffect(() => {
        try {
            localStorage.setItem('lunchChoices', JSON.stringify(choices));
        } catch (error) {
            console.error("Error saving choices to localStorage", error);
        }
    }, [choices]);


    // Effect to auto-hide confetti after a few seconds
    useEffect(() => {
        if (showConfetti) {
            const timer = setTimeout(() => setShowConfetti(false), 7000);
            return () => clearTimeout(timer);
        }
    }, [showConfetti]);


    useEffect(() => {
        // Cleanup interval on component unmount
        return () => {
            if (decisionIntervalRef.current) {
                clearInterval(decisionIntervalRef.current);
            }
        };
    }, []);

    const handleAddChoice = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const newChoice = inputValue.trim();
            if (newChoice && !choices.includes(newChoice)) {
                setChoices([...choices, newChoice]);
                setInputValue('');
                setError('');
            }
        }
    };

    const handleRemoveChoice = (indexToRemove) => {
        setChoices(choices.filter((_, index) => index !== indexToRemove));
    };

    const handleDecide = () => {
        setError('');
        setIsFlipped(false);
        setResult('');
        setShowConfetti(false);

        if (choices.length === 0) {
            setError('Aiyo, please add some food choices first!');
            return;
        }

        setIsChoosing(true);
        let iteration = 0;
        
        if (decisionIntervalRef.current) {
            clearInterval(decisionIntervalRef.current);
        }

        decisionIntervalRef.current = setInterval(() => {
            iteration++;
            const randomChoice = choices[Math.floor(Math.random() * choices.length)];
            setTempResult(randomChoice);

            if (iteration > 15) {
                clearInterval(decisionIntervalRef.current);
                const finalChoice = choices[Math.floor(Math.random() * choices.length)];
                setResult(finalChoice);
                
                setTimeout(() => {
                    setIsFlipped(true);
                    setIsChoosing(false);
                    setShowConfetti(true);
                }, 100);
            }
        }, 100);
    };
    
    const handleImport = (importedChoices) => {
        setChoices(importedChoices);
    };

    return (
        <>
            <style>{`
                @keyframes fall { to { transform: translateY(100vh) rotate(720deg); opacity: 0; } }
            `}</style>
            
            {showConfetti && <Confetti />}

            <div className="bg-slate-100 dark:bg-slate-900 flex items-center justify-center min-h-screen font-sans p-4">
                <div
                    className="relative max-w-md w-full [perspective:1000px] transition-[height] duration-700 ease-in-out"
                    style={{ height: `${cardHeight}px` }}
                >
                    <div className={`relative w-full h-full transition-transform duration-700 ease-in-out [transform-style:preserve-3d] ${isShowingSettings ? '[transform:rotateY(180deg)]' : ''}`}>
                        {/* Front Face: Main App */}
                        <div ref={frontRef} className="absolute w-full bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-8 text-center [backface-visibility:hidden] z-10">
                            <SettingsIcon onClick={() => setIsShowingSettings(true)} />
                            <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">What To Eat Ah?</h1>
                            <p className="text-slate-500 dark:text-slate-400 mb-6">Type an option and press Enter to add it.</p>

                            <div className="mb-4">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleAddChoice}
                                    className="w-full p-3 border-2 border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 transition duration-300"
                                    placeholder="e.g., Chicken Rice"
                                    disabled={isChoosing}
                                />
                            </div>

                            <div className="flex flex-wrap justify-center gap-2 mb-6 min-h-[40px]">
                                {choices.map((choice, index) => (
                                    <ChoiceChip key={index} text={choice} onRemove={() => handleRemoveChoice(index)} />
                                ))}
                            </div>
                            
                            <button
                                onClick={handleDecide}
                                disabled={isChoosing}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:-translate-y-0"
                            >
                                {isChoosing ? 'Choosing...' : 'Help Me Choose!'}
                            </button>

                            <div className={`mt-8 h-32 [perspective:1000px] ${result || isChoosing ? 'block' : 'hidden'}`}>
                                <div className={`relative w-full h-full transition-transform duration-700 ease-in-out [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
                                    <div className="absolute w-full h-full flex items-center justify-center bg-slate-200 dark:bg-slate-700 rounded-lg [backface-visibility:hidden]">
                                        <p className="text-slate-500 dark:text-slate-400 text-2xl font-bold">{tempResult || 'Thinking...'}</p>
                                    </div>
                                    <div className="absolute w-full h-full flex flex-col items-center justify-center bg-emerald-400 dark:bg-emerald-500 rounded-lg p-4 [transform:rotateY(180deg)] [backface-visibility:hidden]">
                                        <p className="text-sm font-medium text-emerald-900 dark:text-white">Today you eat:</p>
                                        <h2 className="text-4xl font-extrabold text-white">{result}</h2>
                                    </div>
                                </div>
                            </div>
                            {error && <div className="mt-6 text-red-500 font-medium">{error}</div>}
                        </div>

                        {/* Back Face: Settings */}
                        <div ref={backRef} className="absolute w-full h-full bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-8 text-center [transform:rotateY(180deg)] [backface-visibility:hidden] z-20">
                             <BackIcon onClick={() => setIsShowingSettings(false)} />
                             <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-6">Settings</h2>
                             <div className="divide-y divide-slate-200 dark:divide-slate-700">
                                <DarkModeToggle isDarkMode={isDarkMode} onToggle={() => setIsDarkMode(!isDarkMode)} />
                                <div className="py-4">
                                    <ExportChoices />
                                </div>
                                <div className="py-4">
                                    <ImportChoices onImport={handleImport} />
                                </div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

