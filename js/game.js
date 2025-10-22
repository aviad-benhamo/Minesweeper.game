'use strict'

var gGame = {
    isOn: false,
    revealedCount: 0,
    markedCount: 0,
    secsPassed: 0
}

var gLevel = {
    SIZE: 4,
    MINES: 2
}

var gBoard
var gTimerInterval

function onInit() {
    if (gTimerInterval) stopTimer(gTimerInterval)
    gBoard = buildBoard()
    renderBoard(gBoard)
    gGame = {
        isOn: false,
        revealedCount: 0,
        markedCount: 0,
        secsPassed: 0
    }
    const elTimer = document.querySelector(".timer")
    elTimer.innerText = "0.00"

}

function buildBoard() {
    var board = createMat(gLevel.SIZE, gLevel.SIZE)
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isRevealed: false,
                isMine: false,
                isMarked: false
            }
        }
    }
    //print for testing
    console.table(board)
    return board
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {

            var cellContent = ''
            var className = `cell cell-${i}-${j}`
            if (board[i][j].isMarked) {
                cellContent = '🏴'
                className += ' marked'
            } else if (board[i][j].isMine) {
                cellContent = '💣'
            } else {
                if (board[i][j].minesAroundCount > 0) {
                    cellContent = board[i][j].minesAroundCount
                }
            }
            strHTML += `<td class="${className}" onclick="cellClicked(this, ${i}, ${j})" 
            oncontextmenu="return onCellMarked(this, ${i}, ${j})">${cellContent}</td>`
        }
        strHTML += '</tr>'
    }

    const elBoard = document.querySelector(".game-board")
    elBoard.innerHTML = strHTML
}

function setMinesNegsCount(board) {
    for (var cellI = 0; cellI < board.length; cellI++) {
        for (var cellJ = 0; cellJ < board[0].length; cellJ++) {
            var minesAroundThisCell = 0
            for (var i = cellI - 1; i <= cellI + 1; i++) {
                if (i < 0 || i >= board.length) continue
                for (var j = cellJ - 1; j <= cellJ + 1; j++) {
                    if (j < 0 || j >= board[0].length) continue
                    if (i === cellI && j === cellJ) continue
                    if (board[i][j].isMine) {
                        minesAroundThisCell++
                    }
                }
            }
            board[cellI][cellJ].minesAroundCount = minesAroundThisCell
        }
    }
}

function cellClicked(elCell, i, j) {
    if (gGame.isOn === false && gGame.revealedCount > 0) return
    if (gBoard[i][j].isMarked) return false

    if (gGame.isOn === false) {
        gGame.isOn = true
        gTimerInterval = startTimer(".timer")
        //Create mines in rand location
        // for (var c = 0; c < gLevel.MINES; c++) {
        //     var randI = getRandomInt(0, gBoard.length - 1)
        //     var randj = getRandomInt(0, gBoard.length - 1)
        //     if ((randI === i && randj === j) ||
        //         gBoard[randI][randj].isMine) {
        //         //if it true it will skip and try again
        //         c--
        //         continue
        //     }
        //     gBoard[randI][randj].isMine = true
        // }


        //Fixed mines location for testing
        gBoard[0][0].isMine = true
        gBoard[0][1].isMine = true
        setMinesNegsCount(gBoard)
        renderBoard(gBoard)
        elCell = document.querySelector(`.cell-${i}-${j}`)
    }
    gBoard[i][j].isRevealed = true
    gGame.revealedCount++
    elCell.classList.add('revealed')

    if (gBoard[i][j].isMine) {
        gGame.isOn = false
        stopTimer(gTimerInterval)
        //reveal all mines:
        for (var row = 0; row < gBoard.length; row++) {
            for (var col = 0; col < gBoard[0].length; col++) {
                if (gBoard[row][col].isMine) {
                    var elMineCell = document.querySelector(`.cell-${row}-${col}`)
                    elMineCell.classList.add('revealed')
                }
            }
        }
        console.log("USER LOST")
        return
    }

    checkGameOver()
}

function onCellMarked(elCell, i, j) {
    if (gBoard[i][j].isRevealed) return false
    if (gGame.isOn === false) return
    var cell = gBoard[i][j]
    //toggle flags
    cell.isMarked = !cell.isMarked

    if (cell.isMarked) {
        gGame.markedCount++
        elCell.classList.add('marked')
        elCell.innerText = '🏴'
    } else {
        gGame.markedCount--
        elCell.classList.remove('marked')
        var originalContent = ''

        if (cell.isMine) {
            originalContent = '💣'
        } else if (cell.minesAroundCount > 0) {
            originalContent = cell.minesAroundCount
        }

        elCell.innerText = originalContent
    }
    minesCounter()
    checkGameOver()
    return false
}

function checkGameOver() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            var cell = gBoard[i][j]
            //mine without flag:
            if (cell.isMine && !cell.isMarked) return
            //safe hidden cell:
            if (!cell.isMine && !cell.isRevealed) return
        }
    }
    console.log("VICTORY")
    playSound("victory_sound")
    gGame.isOn = false
    stopTimer(gTimerInterval)
}

function beginnerLevel() {
    gLevel = {
        SIZE: 4,
        MINES: 2
    }
    return onInit()
}
function mediumLevel() {
    gLevel = {
        SIZE: 8,
        MINES: 14
    }
    return onInit()
}
function expertLevel() {
    gLevel = {
        SIZE: 12,
        MINES: 32
    }
    return onInit()
}

function minesCounter() {
    const elCounter = document.querySelector(".counter")
    var remainingMines = gLevel.MINES - gGame.markedCount
    elCounter.innerText = remainingMines
}


//In progress
function expandReveal(board, elCell, i, j) {
    // When the user clicks a cell with
    // no mines around, reveal not
    // only that cell, but also its
    // neighbors.
    // NOTE: start with a basic
    // implementation that only
    // reveals the non-mine 1st degree
    // neighbors
    // BONUS: Do it like the real
    // algorithm (see description at
    // the Bonuses section below)
}
