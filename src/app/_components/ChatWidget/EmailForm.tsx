type Props = {
    userEmail: string;
    userName: string;
    isLoading: boolean;
    setUserEmail: (email: string) => void;
    setUserName: (name: string) => void;
    onSubmit: () => Promise<void>;
}

export const EmailForm = ({
    userEmail,
    userName,
    isLoading,
    setUserEmail,
    setUserName,
    onSubmit,
}: Props) => (

    <div className="flex flex-1 flex-col justify-center p-4">
        <h4 className="mb-4 text-lg font-medium">¡Hola! 👋</h4>
        <p className="mb-4 text-gray-600">
        Para comenzar, me gustaría saber a quien voy a atender:
        </p>
        <form onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
        }}>
        <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Tu nombre"
            className="mb-4 w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
        />
        <input
            type="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            placeholder="tu@email.com"
            className="mb-4 w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
        />
        <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded bg-gradient-to-r from-[#ff00cc] to-[#3300ff] p-2 text-white hover:bg-blue-600 disabled:opacity-50"
        >
            {isLoading ? "Iniciando..." : "Comenzar Chat"}
        </button>
        </form>
    </div>
);