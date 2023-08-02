export default function PlayingNowBox({ players }) {

    function renderPlayers() {
        return players.map((player, index) => {
            return <span
                key={player.id}
                className={`${index ? 'text-green-400' : 'text-red-500'} text-base sm:text-xl`}
            >{player.name}
            </span>
        })
    }

    return (
        <div className={`
            w-full h-fit flex flex-col
            border bg-zinc-800 rounded-md
            py-2 px-4
        `}>
            <span className="text-base sm:text-lg mb-4 text-white">Jogando</span>
            {renderPlayers()}
        </div>
    )
}