type Props = {
    onClick : () => void;
}

export const ChatButton = ({ onClick }: Props) => (
    <button
        onClick={onClick}
        className="rounded-full bg-green-500 p-4 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-blue-600 group"
    >
        <div className="flex items-center">
            <svg width="40" height="40" viewBox="0 0 64 64" fill="none" className="animate-pulse drop-shadow-glow" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#ff00cc" />
                        <stop offset="100%" stopColor="#3300ff" />
                    </linearGradient>
                </defs>
                <path d="M8 12C8 8.68629 10.6863 6 14 6H50C53.3137 6 56 8.68629 56 12V42C56 45.3137 53.3137 48 50 48H24L14 58V48H14C10.6863 48 8 45.3137 8 42V12Z" stroke="url(#grad)" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M24 30a8 8 0 0116 0Z" fill="#3300ff" />
                <circle cx="29" cy="26" r="2" fill="white" />
                <circle cx="35" cy="26" r="2" fill="white" />
                <line x1="32" y1="18" x2="32" y2="14" stroke="#3300ff" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <span className="text-sm font-medium">Chatea con EBAC IA</span>
        </div>
    </button>
);