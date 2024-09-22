import { GameMode } from "../model/GameMode"

export function GameModeSelector({onSelect}) {

  return (
    <>
      <p>Select a game mode</p>
      <div className="flex">
        <button onClick={()=>onSelect(GameMode.threeXThree)}>3x3</button>
        <button onClick={()=>onSelect(GameMode.fourXFour)}>4x4</button>
        <button onClick={()=>onSelect(GameMode.fiveXfive)}>5x5</button>
      </div>
    </>
  )
}