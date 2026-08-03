import { useState } from "react"

interface ModalProps {
    isOpen: boolean,
    children: React.ReactNode
}

export default function Modal({ isOpen, children }: ModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/75">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative opacity-100 border-2">
                {children}
            </div>
        </div>
    )
}
