export default function Messages({ status, playerName, isZeroTurn }) {
    function renderMessage() {
        if (status === 'playing') {
            return (
                <>
                    <span className="text-xl sm:text-3xl">Vez de:</span>
                    &nbsp;
                    <span className={`font-bold ${isZeroTurn ? 'text-red-500' : 'text-green-400'} text-xl sm:text-3xl`}>{playerName}</span>
                </>
            )
        } else if (status === 'end') {
            return (
                <>
                    <span className="text-xl sm:text-3xl">Vencedor:</span>
                    &nbsp;
                    <span className={`font-bold ${isZeroTurn ? 'text-red-500' : 'text-green-400'} text-xl sm:text-3xl`}>{playerName}</span>
                </>
            )
        } else if (status === 'draw') {
            return <span className="text-xl sm:text-3xl">Empate</span>
        }
    }

    return (
        <>
            {renderMessage()}
        </>
    )
}