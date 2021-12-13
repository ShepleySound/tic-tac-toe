'use strict'

const gameBoard = (() => {
    let _boardArray = [" ", " ", " ", 
                       " ", " ", " ", 
                       " ", " ", " "]
    const get = () => _boardArray
    const changeBoard = function(position, token){
        _boardArray[position] = token
    }
    return {
        get,
        changeBoard
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