interface CardProps {
    mainText: string,
    subText: string
}

export default function Card({mainText, subText}: CardProps) {
    return (
        <div>
            <center>
                <h1>{mainText}</h1>
            </center>
            <center>
                <p>{subText}</p>
            </center>
        </div>
    )
}
