type Props = {
    onClose : () => void;
}

export const ChatHeader = ({ onClose }: Props) => (
    <div className="flex items-center justify-between rounded-t-lg bg-gradient-to-r from-[#ff00cc] to-[#3300ff] p-4 text-white">
        <h3 className="font-semibold">EBAC IA te responderá</h3>
        <button
            onClick={onClose}
            className="text-white hover:text-gray-200"
            aria-label="Cerrar chat"
        >
            ✕
        </button>
    </div>
);