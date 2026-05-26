import { useState } from "react"

interface CollapsibleProps {
    label: string,
    children: React.ReactNode
}

export default function Collapsible({ label, children }: CollapsibleProps) {
    const [open, setOpen] = useState(false);
    const toggle = () => {
        setOpen(!open);
    }
    return (
        <div>
            <button onClick={toggle}>Press {label}</button>
            {open &&
                (
                    <div>{children}</div>
                )
            }
        </div>
    )
}
