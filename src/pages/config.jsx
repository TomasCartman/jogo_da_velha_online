import '@/styles/globals.css'

import { useState } from 'react'
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'

import InputForm from "@/components/InputForm"
import Button from '@/components/Button'
import useSettings from '@/hooks/useSettings'
import { useRouter } from 'next/router'

export default function config() {
    const [name, setName] = useState('')
    const { createPlayer } = useSettings()
    const router = useRouter()

    function changeName(newName) {
        setName(newName)
    }

    function onContinueClick() {
        createPlayer(name)
        router.replace('/')
    }

    return (
        <main className={`
            w-full bg-zinc-900 h-screen
            flex justify-center items-center flex-col gap-16
        `}>
            <span className='text-4xl text-white align-middle'>Parece que é sua primeira vez aqui...</span>
            <InputForm value={name} changeValue={changeName} />
            <Button text='Continuar' onClick={onContinueClick}>
                <MdOutlineKeyboardArrowRight size={24} />
            </Button>
        </main>
    )
}