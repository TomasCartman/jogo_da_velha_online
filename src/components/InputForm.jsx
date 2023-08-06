export default function InputForm({ value, changeValue }) {
    return (
        <div>
            <label
                className={`
                px-2 text-2xl text-white
                `}
            >Você é?</label>
            <input
                className={`
                text-white p-1 mx-2 bg-zinc-700
                rounded-md text-2xl
            `}
                type="text"
                value={value}
                onChange={e => changeValue(e.target.value)}
            />
        </div>
    )
}