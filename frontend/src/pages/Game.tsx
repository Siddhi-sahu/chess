import { Button } from "../components/Button"

export const Game = () => {
    const handleClick = () => {

    }
    return (
        <div className="flex w-full max-h-screen items-center justify-center">

            <div className="grid grid-cols-1 md:grid-cols-8 ">
                <div className="bg-red-100 col-span-6 m-5 ">
                    board

                </div>
                <div className="bg-green-200 col-span-2 m-5 ">
                    <div className="p-10">

                        <Button onClick={handleClick}>
                            Play Now
                        </Button>
                    </div>

                </div>

            </div>
        </div>

    )
}