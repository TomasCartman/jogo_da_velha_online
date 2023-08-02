export default function Button({ text, onClick, children }) {
    return (
        <div className='flex items-center justify-between
            bg-zinc-700 p-3 rounded-md 
            cursor-pointer select-none text-white
            shadow-sm shadow-black
            hover:bg-zinc-600'
            onClick={onClick}
            >
            {text}
            <span className='text-white'>
                {children}
            </span>
        </div>
    )
}