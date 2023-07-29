export default function Messages({ message, player, playerName }) {
    return (
        <>
            <span>{message}</span>
            &nbsp;
            <span className={`font-bold ${player === 'X' ? 'text-red-500' : 'text-green-400'}`}>{playerName}</span>
        </>
    )
}