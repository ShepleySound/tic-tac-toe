'use strict'

const gameBoard = (() => {
    const _boardArray = ["", "", "", 
                       "", "", "", 
                       "", "", ""]
    const get = () => _boardArray
    const changeBoard = function(position, token){
        _boardArray[position] = token
    }

    const clearBoard = () => {
        for (position in _boardArray){
            position = ""
        }
    }

    const checkDraw = () => {
        if (!_boardArray.includes("")){
            return true
        }
    }
    const checkWin = (player) => {
        const rows = [0, 3, 6]
        const columns = [0, 1, 2]
        for (let row of rows){
            if (_boardArray[row] === _boardArray[row + 1] && _boardArray[row] === _boardArray[row + 2] && _boardArray[row] === player.getToken()){
                gameStatus.disableTurn()
                displayController.winGame([row, row + 1, row + 2], player)
                return true
            }
        }
        for (let column of columns){
            if (_boardArray[column] === _boardArray[column + 3] && _boardArray[column] === _boardArray[column + 6] && _boardArray[column] === player.getToken()){
                gameStatus.disableTurn()
                displayController.winGame([column, column + 3, column + 6], player)
                return true
            }
        }
        if (_boardArray[0] === _boardArray[4] && _boardArray[0] === _boardArray[8] && _boardArray[0] === player.getToken()){
            gameStatus.disableTurn()
            displayController.winGame([0, 4, 8], player)
            return true
            
        }
        if (_boardArray[2] === _boardArray[4] && _boardArray[2] === _boardArray[6] && _boardArray[2] === player.getToken()){
            gameStatus.disableTurn()
            displayController.winGame([2, 4, 6], player)
            return true
        }
        if (checkDraw()){
            displayController.drawGame()
        }
        return false
    }

    return {
        get,
        changeBoard,
        checkWin,
        clearBoard
    }
})()

const player = function createPlayer(name, token){
    let _score = 0
    const addPoint = function(){
        _score++
    }
    const getScore = () => _score
    const getName = () => name
    const getToken = () => token
    return {
        getName,
        getToken,
        addPoint,
        getScore,
    }
}

const cpuPlayer = (name, token) => {
    const prototype = player(name, token)
    const autoPlay = () => {
        const availableMoves = []
        gameBoard.get().forEach((position, index) => {
            if (position === ""){
                availableMoves.push(index)
            }
        })
        const randomIndex = Math.floor(Math.random() * availableMoves.length)

        gameBoard.changeBoard(availableMoves[randomIndex], prototype.getToken())
        gameStatus.passTurn()
        displayController.updateDisplay()
    }
    return Object.assign({}, prototype, {
        autoPlay
    })
}

const gameStatus = (() => {
    let _isPlayerTurn = true
    const getTurn = () => _isPlayerTurn
    const passTurn = () => {
        _isPlayerTurn = !_isPlayerTurn
    }
    const disableTurn = () => {
        _isPlayerTurn = false
    }
    return {
        getTurn,
        passTurn,
        disableTurn,
    }
})()

const displayController = (() => {
    const _displayBoard = document.querySelector('#game-board')
    const _gridSquares = document.querySelectorAll('.board-square')
    const _turnStatus = document.querySelector('#turn-status')

    const _clickSquare = function(){
        _gridSquares.forEach(square => {
            square.addEventListener('click', (e) => {
                if (!gameStatus.getTurn()){
                    return
                }
                gameFlow.makeMove(e.target.dataset.position)
            })
        })
    }()

    const updateDisplay = function(){
        gameBoard.get().forEach((token, index) => {
            _gridSquares.item(index).innerText = token
        })
        if (gameStatus.getTurn()){
            _turnStatus.innerText = `${gameFlow.pc.getName()}'s Turn`
        }
        else {
            _turnStatus.innerText = `${gameFlow.cpu.getName()}'s Turn`
        }
    }

    const winGame = function(winSquares, player){
        for (let square of winSquares){
            _gridSquares[square].classList.add("win-square")
        }

        _turnStatus.innerText = `${player.getName()} Wins!`
    }

    const drawGame = function(){
        _gridSquares.forEach(square => {
            square.classList.add("win-square")
        })

        _turnStatus.innerText = "DRAW"
    }

    return {
        updateDisplay,
        winGame,
        drawGame,
    }
})()

const gameSetup = (() => {
   const initDisplay = function(){
       displayController.updateDisplay()
    }

   return {
       initDisplay
   }
})()

const gameFlow = (() => {
    const _setName = function(){
        while (true){
            let name = prompt("Enter your name:")
            if (name === null || name === ""){
                continue
            }
            if (name.length > 40){
                continue
            }
            return name
        }
    }
    const _pcName = _setName()
    const pc = player(_pcName, 'X')
    const cpu = cpuPlayer("Computer", 'O')
    const makeMove = (position) => {
        if (gameBoard.get()[position] === ""){
            gameBoard.changeBoard(position, pc.getToken())
            gameStatus.passTurn()
            displayController.updateDisplay()
            if(!gameBoard.checkWin(pc)){
                setTimeout(() => {
                    cpu.autoPlay()
                    gameBoard.checkWin(cpu)
                }, 1500)
            }
        }
    }
    return {
        makeMove,
        pc,
        cpu,
    }
})()

gameSetup.initDisplay()