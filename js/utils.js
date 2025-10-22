'use strict'

/**
 * Gets a random integer between two values (min inclusive, max exclusive).
 * @param {number} min - The minimum value (inclusive)
 * @param {number} max - The maximum value (exclusive)
 * @returns {number} A random integer
 */
function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min)
    const maxFloored = Math.floor(max)
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled) // The maximum is exclusive and the minimum is inclusive
}

/**
 * Gets a random integer between two values (min inclusive, max inclusive).
 * @param {number} min - The minimum value (inclusive)
 * @param {number} max - The maximum value (inclusive)
 * @returns {number} A random integer
 */
function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Generates a random string ID of a specified length.
 * @param {number} [length=6] - The desired length of the ID
 * @returns {string} The generated random ID
 */
function makeId(length = 6) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
}

/**
 * Creates a 2D array (matrix) of specified dimensions,
 * initialized with empty strings.
 * @param {number} rows - The number of rows
 * @param {number} cols - The number of columns
 * @returns {Array<Array<string>>} The new matrix
 */
function createMat(rows, cols) {
    const mat = []

    for (var i = 0; i < rows; i++) {
        const row = []

        for (var j = 0; j < cols; j++) {
            row.push('')
        }
        mat.push(row)
    }
    return mat
}

/**
 * Creates a manual deep copy of a 2D array (matrix).
 * This is useful for simple matrices (containing primitives).
 * @param {Array<Array<any>>} mat - The matrix to copy
 * @returns {Array<Array<any>>} A new, deep-copied matrix
 */
function copyMatManual(mat) {
    const newMat = []
    for (var i = 0; i < mat.length; i++) {
        const row = []
        for (var j = 0; j < mat[i].length; j++) {
            // Copy the specific value from the old board
            row.push(mat[i][j])
        }
        newMat.push(row)
    }
    return newMat
}

/**
 * Generates a random hexadecimal color code.
 * @returns {string} A random color (e.g., "#A3F50C")
 */
function getRandomColor() {
    const letters = '0123456789ABCDEF'
    var color = '#'

    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
    }
    return color
}

/**
 * Gets a random item from an array.
 * @param {Array<any>} arr - The array to pick from
 * @returns {*} A random item from the array
 */
function getRandomItem(arr) {
    const idx = Math.floor(Math.random() * arr.length)
    return arr[idx]
}

/**
 * Shuffles an array in place (using Fisher-Yates algorithm)
 * and returns the shuffled array.
 * @param {Array<any>} arr - The array to shuffle
 * @returns {Array<any>} The shuffled array
 */
function shuffleArray(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1))
        var temp = arr[i]
        arr[i] = arr[j]
        arr[j] = temp
    }
    return arr
}

/**
 * Renders the board model to the DOM.
 * Gets the model (board matrix) and a selector for the <tbody>.
 * Loops over the matrix, builds the HTML for the table rows (tr) and cells (td),
 * and injects it into the selected element's innerHTML.
 * Each cell gets a data-i and data-j attribute for easy selection.
 * @param {Array<Array<any>>} board - The game board matrix
 * @param {string} selector - The selector for the <tbody> element
 */
// function renderBoard(board, selector) {
//     var strHTML = ''
//     for (var i = 0; i < board.length; i++) {
//         strHTML += '<tr>'
//         for (var j = 0; j < board[0].length; j++) {

//             // Get the value for the cell (e.g., '', 'X', 'BOMB')
//             const cellValue = board[i][j]

//             // Define a class for the cell, e.g., 'cell cell-0-0'
//             const className = `cell cell-${i}-${j}`

//             strHTML += `<td class="${className}" 
//                             data-i="${i}" 
//                             data-j="${j}"
//                             onclick="cellClicked(this, ${i}, ${j})" >`

//             // You might want to render different things based on cellValue
//             // For now, let's just put the value inside
//             strHTML += cellValue

//             strHTML += `</td>`
//         }
//         strHTML += '</tr>'
//     }

//     const elBoard = document.querySelector(selector)
//     elBoard.innerHTML = strHTML
// }

/**
 * Renders a single cell in the DOM.
 * Gets a location object {i, j} and a new value.
 * Finds the specific <td> element using its data attributes
 * and updates its innerHTML.
 * @param {object} location - { i: number, j: number }
 * @param {string} value - The new value to render in the cell
 */
function renderCell(location, value) {
    // Uses getSelector to find the right cell
    const cellSelector = getSelector(location)
    const elCell = document.querySelector(cellSelector)

    if (elCell) {
        elCell.innerHTML = value
    }
}

/**
 * Gets a DOM element (e.g., a <td> from a click event)
 * and returns its logical location {i, j} by reading
 * its data-i and data-j attributes.
 * @param {HTMLElement} elCell - The DOM element (td)
 * @returns {object} - { i: number, j: number }
 */
function getCellLocation(elCell) {
    const i = +elCell.dataset.i // Using '+' to convert string to number
    const j = +elCell.dataset.j // Using '+' to convert string to number
    return { i, j }
}

/**
 * Gets a location object {i, j} and returns
 * a CSS selector string for that specific cell.
 * (Assumes cells have data-i and data-j attributes)
 * @param {object} location - { i: number, j: number }
 * @returns {string} - A CSS selector (e.g., '[data-i="2"][data-j="5"]')
 */
function getSelector(location) {
    // This is a robust way to select by data attributes
    return `[data-i="${location.i}"][data-j="${location.j}"]`
}

/**
 * Gets a location {i, j} and a class name.
 * Finds the matching cell in the DOM and toggles (adds/removes)
 * the specified class.
 * @param {object} location - { i: number, j: number }
 * @param {string} className - The class name to toggle
 */
function toggleClass(location, className) {
    const cellSelector = getSelector(location)
    const elCell = document.querySelector(cellSelector)

    if (elCell) {
        elCell.classList.toggle(className)
    }
}

/**
 * Scans the board model (matrix) and returns an array
 * of all empty cell locations ({i, j}).
 * (Assumes an empty cell is represented by '')
 * @param {Array<Array<any>>} board - The game board matrix
 * @returns {Array<object>} - An array of location objects, e.g., [{i:0, j:2}, {i:1, j:0}]
 */
function getEmptyCells(board) {
    const emptyCells = []

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            // Adjust this condition based on what you consider 'empty'
            if (board[i][j] === '') {
                emptyCells.push({ i, j })
            }
        }
    }
    return emptyCells
}

/**
 * Gets an array of valid neighbor locations {i, j} for a given cell.
 * @param {Array<Array<any>>} board - The game board (used for bounds checking)
 * @param {number} cellI - The row index of the cell
 * @param {number} cellJ - The column index of the cell
 * @returns {Array<object>} - An array of location objects {i, j}
 */
function getNeighbors(board, cellI, cellJ) {
    const neighbors = []
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        // Check row bounds
        if (i < 0 || i >= board.length) continue

        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            // Check col bounds
            if (j < 0 || j >= board[0].length) continue
            // Skip self
            if (i === cellI && j === cellJ) continue

            neighbors.push({ i: i, j: j })
        }
    }
    return neighbors
}

/**
 * Opens a modal by removing a 'hidden' class or changing display.
 * @param {string} selector - The CSS selector for the modal element
 */
function openModal(selector) {
    const elModal = document.querySelector(selector)
    // Assuming you use a 'hidden' class to control visibility
    elModal.classList.remove('hidden')

    // Alternative:
    // elModal.style.display = 'block'
}

/**
 * Closes a modal by adding a 'hidden' class or changing display.
 * @param {string} selector - The CSS selector for the modal element
 */
function closeModal(selector) {
    const elModal = document.querySelector(selector)
    // Assuming you use a 'hidden' class to control visibility
    elModal.classList.add('hidden')

    // Alternative:
    // elModal.style.display = 'none'
}

/**
 * Updates the text content of an element, typically within a modal.
 * @param {string} selector - CSS selector for the text element (e.g., '.modal h2')
 * @param {string} txt - The new text to display
 */
function updateModalText(selector, txt) {
    const elText = document.querySelector(selector)
    elText.innerText = txt
}

/**
 * Starts a timer and updates a DOM element with the elapsed time.
 * @param {string} selector - CSS selector for the element to display the time
 * @returns {number} - The interval ID (to be used with stopTimer)
 * CSS EXAMPLE:  .timer {
    /* This font (monospace) makes numbers align nicely */
//     font-family: 'Courier New', Courier, monospace; 

//     font-weight: bold;
//     font-size: 1.2rem;

//     background-color: #f0f0f0;
//     padding: 5px 10px;
//     border-radius: 5px;

//     /* Ensures numbers don't jump around */
//     display: inline-block;
//     min-width: 60px; 
//     text-align: right;
// } */
function startTimer(selector) {
    const elTimer = document.querySelector(selector)
    const startTime = Date.now()

    const intervalId = setInterval(() => {
        const elapsedTime = Date.now() - startTime
        // Format to seconds.milliseconds (e.g., 5.037)
        elTimer.innerText = (elapsedTime / 1000).toFixed(3)
    }, 37) // Update frequently (e.g., ~30fps) for smooth milliseconds

    return intervalId
}

/**
 * Stops a timer created by setInterval.
 * @param {number} intervalId - The ID returned from startTimer
 */
function stopTimer(intervalId) {
    clearInterval(intervalId)
}

/**
 * Plays an audio file by its name.
 * Assumes audio files are in a folder (e.g., 'sounds/') and have an extension (e.g., '.mp3')
 * @param {string} soundName - The name of the sound (e.g., 'pop', 'win')
 */
function playSound(soundName) {
    // Adjust the path and extension as needed for your project structure
    const audio = new Audio(`sounds/${soundName}.mp3`)
    audio.play()
}