export default function Square({ value, onClick }) {
    return (
        <button 
            className={`
            flex items-center justify-center
            p-4 w-28 h-28
            border-2 rounded-lg
            font-black text-6xl ${value === 'X' ? 'text-red-500' : 'text-green-400'}
            
        `}
            onClick={onClick}
        >
            {value}
        </button>
    )
}