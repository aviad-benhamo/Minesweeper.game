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


function onInit() {
    gBoard = buildBoard()
    renderBoard(gBoard)
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

            if (board[i][j].isMarked) {
                cellContent = '🏴'
            } else if (board[i][j].isMine) {
                cellContent = '💣'
            } else {
                if (board[i][j].minesAroundCount > 0) {
                    cellContent = board[i][j].minesAroundCount
                }
            }

            const className = `cell cell-${i}-${j}`

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
    if (gGame.isOn === false) {
        gGame.isOn = true
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
    elCell.classList.add('revealed')
}


//In progress

function onCellMarked(elCell, i, j) {
    if (gBoard[i][j].isRevealed) return false

    gBoard[i][j].isMarked = !gBoard[i][j].isMarked

    if (gBoard[i][j].isMarked) {
        gGame.markedCount++
        elCell.classList.add('marked')
        elCell.innerText = '🏴'
    } else {
        gGame.markedCount--
        elCell.classList.remove('marked')

        var cell = gBoard[i][j]
        var originalContent = ''

        if (cell.isMine) {
            originalContent = '💣'
        } else if (cell.minesAroundCount > 0) {
            originalContent = cell.minesAroundCount
        }

        elCell.innerText = originalContent
    }
    return false
}

function checkGameOver() {
    //     The game ends when all mines
    // are marked, and all the other
    // cells are revealed
}


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
