interface CardProps {
    mainText: string,
    subText: string
}

export default function Card({ mainText, subText }: CardProps) {
    return (
        <div className="rounded-2xl bg-orange-100 border-2 aspect-square flex flex-col place-items-center w-fill justify-center">
            <h1 className="h-4/6 w-fill text-9xl">{mainText}</h1>
            <div className="w-full border-t">
                <p className="w-full p-4 text-center font-bold">{subText}</p>
            </div>
        </div>
    )
}
