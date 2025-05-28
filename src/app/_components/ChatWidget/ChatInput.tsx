type Props = {
    value: string;
    setValue: (val: string) => void;
    isLoading: boolean;
    onSubmit: () => Promise<void>;
}

export const ChatInput = ({ value, setValue, isLoading, onSubmit }: Props) => (
    <form onSubmit={(e)=>{
        e.preventDefault();
        onSubmit();
    }} className="border-t p-2">
        <div className="flex items-end gap-2">
            <textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={async (
                    e: React.KeyboardEvent<HTMLTextAreaElement>,
                ) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        if (value.trim() && !isLoading) {
                            await onSubmit();
                        }
                    }
                }}
                placeholder="Escribe tu mensaje..."
                className="flex-1 resize-none rounded border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                disabled={isLoading}
                rows={2}
                style={{maxHeight:"120px", overflowY: "auto"}}
            />
            {!isLoading ?
                <button
                    type="submit"
                    disabled={isLoading || !value.trim()}
                    className="rounded bg-gradient-to-b from-[#ff00cc] to-[#3300ff] px-3 py-1 text-sm text-white hover:opacity-80 disabled:opacity-50"
                >
                    Enviar
                </button>
                :
                <svg className="h-5 w-5 animate-spin text-gradient" viewBox="0 0 24 24" fill="none">
                    <defs>
                        <linearGradient id="spinner-gradient" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#ff00cc" />
                            <stop offset="100%" stopColor="#3300ff" />
                        </linearGradient>
                    </defs>
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="url(#spinner-gradient)"
                        strokeWidth="4"
                        fill="none"
                    />
                    <path
                        className="opacity-75"
                        fill="url(#spinner-gradient)"
                        d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z"
                    />
                </svg>

            }
        </div>
    </form>
);