import '@/styles/globals.css'
import Game from "@/components/Game"
import useSettings from '@/hooks/useSettings'

import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function Index() {
    const { id } = useSettings()
    const router = useRouter()

    useEffect(() => {
       id || router.replace('/config')
    }, [id, router])

    return (
        <main className={`
            w-full bg-zinc-900 h-screen
            flex justify-center items-center
        `}
        >
            {id ? <Game /> : ''} 
        </main>
    )
}