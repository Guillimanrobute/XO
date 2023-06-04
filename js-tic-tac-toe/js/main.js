import { getCellElementList, getCurrentTurnElement, getCellElementAtIdx, getGameStatusElement, getReplayButtonElement } from "./selectors.js";
import { CELL_VALUE, GAME_STATUS, TURN } from './constants.js';
import { checkGameStatus } from './utils.js';


console.log(getCellElementList());
console.log(getCurrentTurnElement());
console.log(getCellElementAtIdx(4));
console.log(getGameStatusElement());

console.log(checkGameStatus(['X', 'O', 'O', '', 'X', '', '', 'O', 'X']));



/**
 * Global variables
 */
let currentTurn = TURN.CROSS;
let isGameEnded = false;
let gameStatus = GAME_STATUS.PLAYING;
let cellValues = new Array(9).fill("");

function toggleTurn() {
    //toggle turn
    currentTurn = currentTurn === TURN.CIRCLE ? TURN.CROSS : TURN.CIRCLE;
    //update turn on DOM element
    const currentTurnElement = getCurrentTurnElement();
    if (currentTurnElement) {
        currentTurnElement.classList.remove(TURN.CIRCLE, TURN.CROSS);
        currentTurnElement.classList.add(currentTurn)
    }
}
function updateGamesStatus(newGameStatus) {
    gameStatus = newGameStatus;

    const gameStatusElement = getGameStatusElement();
    if (gameStatusElement) gameStatusElement.textContent = newGameStatus;
}
function showReplayButton() {
    const replayButton = getReplayButtonElement();
    if (replayButton) replayButton.classList.add("show")
}
function hideReplayButton() {
    const replayButton = getGameStatusElement();
    if (replayButton) replayButton.classList.remove("show")
}
function highlightWinCell(winPositions) {
    if (!Array.isArray(winPositions) || winPositions.length !== 3) {
        throw new Error("Invalid win positions")
    };
    for (const position of winPositions) {
        const cell = getCellElementAtIdx(position);
        if (cell) {
            cell.classList?.add("win")
        }
    }
}


function handleCellClick(cell, index) {

    const isClicked = cell.classList.contains(TURN.CIRCLE) || cell.classList.contains(TURN.CROSS);
    if (isClicked || gameStatus !== GAME_STATUS.PLAYING) return;

    //set selected cell
    cell.classList.add(currentTurn)
    //update cellValues
    cellValues[index] = currentTurn === TURN.CIRCLE ? CELL_VALUE.CIRCLE : CELL_VALUE.CROSS;

    //toggle turn
    toggleTurn();

    //check game status
    const game = checkGameStatus(cellValues);
    switch (game.status) {
        case GAME_STATUS.ENDED: {
            updateGamesStatus(game.status)
            showReplayButton();
            break;
        }

        case GAME_STATUS.X_WIN:
        case GAME_STATUS.O_WIN: {
            //update game status
            //show replay button
            updateGamesStatus(game.status)
            showReplayButton();
            //hightlight win cells
            highlightWinCell(game.winPositions)
            break;
        }

        default:
        //playing
    }
    console.log("click", cell, index);
}
function initCellElementList() {
    const cellElementList = getCellElementList();
    cellElementList.forEach((cell, index) => {
        cell.addEventListener('click', () => handleCellClick(cell, index))
    })
}

function resetGame() {
    // reset temp global vars
    currentTurn = TURN.CROSS;
    gameStatus = GAME_STATUS.PLAYING;
    cellValues = cellValues.map(() => "")
    //reset dom elements
    //reset current status
    updateGamesStatus(GAME_STATUS.PLAYING)
    //reset current turn
    const currentTurnElement = getCurrentTurnElement();
    if (currentTurnElement) {
        currentTurnElement.classList.remove(TURN.CIRCLE, TURN.CROSS);
        currentTurnElement.classList.add(TURN.CROSS)
    }
    //reset game board
    const cellElementList = getCellElementList();
    for (const cellElement of cellElementList) {
        cellElement.classList.remove(TURN.CIRCLE, TURN.CROSS)
    }
    //hide replay button
    hideReplayButton();
}
function initReplayButton() {
    const replayButton = getReplayButtonElement();
    if (replayButton) {
        console.log("Click button replay");
        replayButton.addEventListener('click', resetGame);
    }
}

/**
 * TODOs
 *
 * 1. Bind click event for all cells
 * 2. On cell click, do the following:
 *    - Toggle current turn
 *    - Mark current turn to the selected cell
 *    - Check game state: win, ended or playing
 *    - If game is win, highlight win cells
 *    - Not allow to re-click the cell having value.
 *
 * 3. If game is win or ended --> show replay button.
 * 4. On replay button click --> reset game to play again.
 *
 */

(() => {
    //Bind click event for all li element
    initCellElementList();
    //Bind click event for replay button
    initReplayButton();
})()