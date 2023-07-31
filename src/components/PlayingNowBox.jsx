export default function PlayingNowBox({ players }) {

    function renderPlayers() {
        console.log(players)
        return players.map(player => {
            return <span key={player.id}>{player.name}</span>
        })
    }

    return (
        <div className={`
            w-full h-fit flex flex-col
            border bg-zinc-800 rounded-md
            py-2 px-4
        `}>
            <span className="text-2xl mb-4">Jogando:</span>
            {renderPlayers()}
        </div>
    )
}