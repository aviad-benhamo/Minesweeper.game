'use strict'

var gGame = {
    isOn: false,
    revealedCount: 0,
    markedCount: 0,
}

var gLevel = {
    SIZE: 4,
    MINES: 2,
}

var gBoard
var gTimerInterval
var gLives


function onInit() {
    if (gTimerInterval) stopTimer(gTimerInterval)
    gBoard = buildBoard()
    renderBoard(gBoard)
    gLives = Math.min((Math.floor(gLevel.MINES / 2)), 3)
    lives()
    //resets
    gGame = {
        isOn: false,
        revealedCount: 0,
        markedCount: 0,
    }
    //reset DOM
    const elTimer = document.querySelector(".timer")
    elTimer.innerText = "0.00"
    const elSmiley = document.querySelector(".smiley")
    elSmiley.innerText = `😊`

    resetHintButtons()

    minesCounter()

}

function buildBoard() {
    var board = createMat(gLevel.SIZE, gLevel.SIZE)
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isRevealed: false,
                isMine: false,
                isMarked: false,
                isMistake: false
            }
        }
    }
    //print for testing
    // console.table(board)
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
    //scan all cells
    for (var cellI = 0; cellI < board.length; cellI++) {
        for (var cellJ = 0; cellJ < board[0].length; cellJ++) {
            //start counting neighbors
            var minesAroundThisCell = 0
            for (var i = cellI - 1; i <= cellI + 1; i++) {
                //exit if out of range
                if (i < 0 || i >= board.length) continue
                for (var j = cellJ - 1; j <= cellJ + 1; j++) {
                    //exit if out of range & skip current cell
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
    if (gBoard[i][j].isRevealed) return
    if (gBoard[i][j].isMistake) return

    if (gGame.isOn === false) {
        gGame.isOn = true
        gTimerInterval = startTimer(".timer")
        //Create mines in rand location
        for (var c = 0; c < gLevel.MINES; c++) {
            var randI = getRandomInt(0, gBoard.length - 1)
            var randj = getRandomInt(0, gBoard.length - 1)
            if ((randI === i && randj === j) ||
                gBoard[randI][randj].isMine) {
                //if it is true it will skip and try again
                c--
                continue
            }
            gBoard[randI][randj].isMine = true
        }

        setMinesNegsCount(gBoard)
        renderBoard(gBoard)
        elCell = document.querySelector(`.cell-${i}-${j}`)
    }

    //user lost if opened a mine
    if (gBoard[i][j].isMine) {

        if (gLives > 0) {
            gLives--
            lives()
            gBoard[i][j].isMistake = true
            //color the cell and the counter in red
            var liveCount = document.querySelector(".lives-count")
            liveCount.classList.add('mistake')
            elCell.classList.add('mistake')
            setTimeout(() => {
                liveCount.classList.remove('mistake')
                elCell.classList.remove('mistake')
            }, 850)
            return
        } else {
            gGame.isOn = false
            stopTimer(gTimerInterval)
            //reveal all mines:
            for (var row = 0; row < gBoard.length; row++) {
                for (var col = 0; col < gBoard[0].length; col++) {
                    if (gBoard[row][col].isMine) {
                        var elMineCell = document.querySelector(`.cell-${row}-${col}`)
                        //force change flags icons to mines
                        elMineCell.innerText = '💣'
                        elMineCell.classList.add('revealed')
                    }
                }
            }
            console.log("USER LOST")
            playSound("lose")
            //sad smiley
            const elSmiley = document.querySelector(".smiley")
            elSmiley.innerText = `😒`
            return
        }

    }

    //change to isRevealed
    gBoard[i][j].isRevealed = true
    elCell.classList.add('revealed')
    gGame.revealedCount++

    //If empty cell is clicked, expandReveal > empty cells + cells with neighbors
    if (gBoard[i][j].minesAroundCount === 0) {
        expandReveal(gBoard, i, j)
    }

    //check victory
    checkGameOver()

}

function onCellMarked(elCell, i, j) {
    if (gBoard[i][j].isRevealed) return false //false to make sure right-click will work
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

        var originalContent = '' //restore prev cell content [mine/count of mines around / empry cell]
        if (cell.isMine) {
            originalContent = '💣'
        } else if (cell.minesAroundCount > 0) {
            originalContent = cell.minesAroundCount
        }
        elCell.innerText = originalContent
    }
    minesCounter() //update mines counter
    checkGameOver() //check victory
    return false
}

function checkGameOver() {
    //check victory function
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            var cell = gBoard[i][j]
            //mine without flag:
            if (cell.isMine && !cell.isMarked) return
            //safe hidden cell:
            if (!cell.isMine && !cell.isRevealed) return
        }
    }
    //end the game
    console.log("VICTORY")
    playSound("victory_sound")
    gGame.isOn = false
    stopTimer(gTimerInterval)
    const elSmiley = document.querySelector(".smiley")
    elSmiley.innerText = `😎`
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
    //Countdown of mines relative to marked flags, must be 0 to win
    const elCounter = document.querySelector(".counter")
    var remainingMines = gLevel.MINES - gGame.markedCount
    elCounter.innerText = "Mines: " + remainingMines
}

function expandReveal(board, i, j) {
    //Neighbors loop to the clicked cell
    for (var row = i - 1; row <= i + 1; row++) {
        for (var col = j - 1; col <= j + 1; col++) {
            //making sure we are scaning the range
            if (row < 0 || row >= board.length || col < 0 || col >= board[0].length) {
                continue
            }
            //skip the cell itself
            if (row === i && col === j) {
                continue
            }

            //skip marked/revealed cells
            var neighborCell = board[row][col]
            if (neighborCell.isMarked) continue
            if (neighborCell.isRevealed) continue
            //change status for new opened cells
            neighborCell.isRevealed = true
            gGame.revealedCount++
            //update DOM
            var elNeighborCell = document.querySelector(`.cell-${row}-${col}`)
            elNeighborCell.classList.add('revealed')

            //Recursion - run the function over again for the empty Neighbor's cells
            if (neighborCell.minesAroundCount === 0) {
                expandReveal(board, row, col)
            }
        }
    }
}

function lives() {

    const elLives = document.querySelector(".lives")
    elLives.innerHTML = `Lives: <span class="lives-count">${gLives}</span>`
}

function toggleTheme() {
    document.body.classList.toggle('light-mode')
}

function onHintClick(elem) {
    if (!gGame.isOn) return
    //combined with safe-click feat
    elem.classList.add('disabled')
    elem.disabled = true
    var safeCells = []
    //find safe cells and add them to safecell array
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j].isMarked) continue
            if (gBoard[i][j].isMine) continue
            if (gBoard[i][j].isRevealed) continue
            if (gBoard[i][j].isMistake) continue
            var safe = { i, j }
            safeCells.push(safe)
        }
    }
    //Ignore empty array
    if (safeCells.length > 0) {
        var randSafeCell = safeCells[getRandomInt(0, safeCells.length - 1)]
        var elCell = document.querySelector(`.cell-${randSafeCell.i}-${randSafeCell.j}`)
        elCell.classList.add('safecell')
        setTimeout(() => {
            elCell.classList.remove('safecell')
        }, 1000)
    }
}

function resetHintButtons() {
    const elHintBtns = document.querySelectorAll('.safe-cell-btns button')
    for (var i = 0; i < elHintBtns.length; i++) {
        var btn = elHintBtns[i]
        btn.classList.remove('disabled')
        btn.disabled = false
    }
}