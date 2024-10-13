import { useCallback, useEffect, useState } from 'react'
import './App.css'
import { Player } from './model/Player';
import { GameModeSelector } from './components/GameModeSelector';
import { GameMode } from './model/GameMode';

const EMPTY = undefined;
enum PageState {
  selectMode,
  game
}

function App() {
  const [pageState, setPageState] = useState(PageState.selectMode)
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.threeXThree)
  const [nextPlayer, setNextPlayer] = useState(Player.x)
  const [matrix, setMatrix] = useState<Player[][] | undefined[][]>([])
  const [movesCount, setMovesCount] = useState(0)
  const [maxMoves, setMaxMoves] = useState(0)
  const [winner, setWinner] = useState<Player | undefined>(EMPTY)

  const handleMatrixCreation = useCallback(() => {
    const matrix = new Array(gameMode)
    for (let i = 0; i < matrix.length; i++) {
      matrix[i] = new Array(matrix.length).fill(EMPTY)
       
    }
    return matrix
  }, [gameMode])

  useEffect(() => {
    setMatrix(handleMatrixCreation())
    setMaxMoves(gameMode * gameMode)
  },[gameMode, handleMatrixCreation])

  const handleChangeNextPlayer = () => {
    setNextPlayer(current => current === Player.x ? Player.o : Player.x)
  }

  const handlePlay = (i:number, j: number) => {
    if (matrix?.[i][j] || winner !== EMPTY) return
    matrix[i][j] = nextPlayer
    setMovesCount(current => current + 1)
    handleChangeNextPlayer()
    checkWinner(i, j)
  }

  const handleReset = () => {
    setMatrix(handleMatrixCreation())
    setNextPlayer(Player.x)
    setWinner(EMPTY)
    setMovesCount(0)
  }

  const checkWinner = (i: number, j: number) => {
    if (checkRow(i) || checkColumn(j) || checkDiagonal()) {
      setWinner(matrix[i][j]);
    }
  };
  
  const checkRow = (row: number): boolean => {
    return matrix[row].every((current) => current === matrix[row][0] && current !== EMPTY);
  };
  
  const checkColumn = (col: number): boolean => {
    return matrix.every((row) => row[col] === matrix[0][col] && row[col] !== EMPTY);
  };

  const checkDiagonal = () => {
    let isX: boolean = false;
    let isO: boolean = false;
    const diagonal = []
    const reverseDiagonal = []
    let reverseIndex = matrix.length - 1;
    for (let i = 0; i < matrix.length; i++) {
      diagonal.push(matrix[i][i])
      reverseDiagonal.push(matrix[i][reverseIndex])
      reverseIndex--
    }

    isX = diagonal.every((current) => current === Player.x) || reverseDiagonal.every((current) => current === Player.x)
    isO = diagonal.every((current) => current === Player.o) || reverseDiagonal.every((current) => current === Player.o)

    if (isX) return Player.x;
    if (isO) return Player.o;

    return undefined
  }

  const handleGameModeSelection = (gameMode: GameMode) => {
    setGameMode(gameMode)
    setPageState(PageState.game)
  }

  const handleChangePageState = () => {
    setPageState(PageState.selectMode)
    handleReset()
  }


  return (
    <>
      <h1>Tic-Tac-Toe</h1>

      {pageState == PageState.selectMode && <GameModeSelector onSelect={handleGameModeSelection} />}
      {pageState == PageState.game &&  
        <div className="card">
          <div className="flex">
            <button onClick={handleReset}>Reset</button>
            <button onClick={handleChangePageState}>Change mode</button>
          </div>
          {!winner && movesCount !== maxMoves && <p>Next player: <b>{nextPlayer}</b></p>}
          {winner && <p>Winner: <b>{winner}</b></p>}
          {movesCount === maxMoves && !winner && <p>It's a tie! Click on reset to play again!</p>}
          
          <div className="board">
            {matrix && matrix.map((row, i) => (
              <div className="row" key={i}>
                {row.map((square, j) => (
                  <button key={j} onClick={() => handlePlay(i,j)}>
                    {square}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      }
      
      <p className="footer">
        Developed by Nicolas Zwierzykowski
      </p>
    </>
  )
}

export default App
