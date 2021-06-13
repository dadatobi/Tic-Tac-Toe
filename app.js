
//player constructor (factory function)
const Player = (marker, name) => {
  this.marker = marker;
  this.name = name;

  const playerMarker = () => {
    return marker
  }

  const playerName = () => {
    return name
  }

  return { playerMarker, playerName };
}

// gameboard module 
const gameBoard = (() => {
  const _board =Array(9);

  const getGameElem = (index) => {
    if (index > _board.length) return;
    return _board[index];
  }

  const getPlayedElem = (index, sign) => {
    if (index > _board.length) return;
    _board[index] = sign;
  }

  const findEmptySpace = () => {
    let index = _board.findIndex(x => !x)

    console.log(index)
  }

  const resetBoard = () => {
    for (let i = 0; i < _board.length; i++) {
      _board[i] = "";
    }
  }
  return { getGameElem, getPlayedElem, resetBoard, findEmptySpace };
})();


const uiCtrl = (() => {
  const fieldElem = document.querySelectorAll('.field');
  const restartBtn = document.querySelector('#btn');
  const messageElement = document.querySelector('#message');

  const fieldClickedEvent = (e) => {
    if (e.target.textContent !== "" || gameFlow.getIsOver()) return;
    gameFlow.addMark(parseInt(e.target.dataset.index));
    render();
  };

  restartBtn.addEventListener('click', () => {
    gameBoard.resetBoard();
    gameFlow.reset();
    render();
    setMessage(`Player1's turn`);
  });

  const render = () => {
    for (let i = 0; i < fieldElem.length; i++) {
      fieldElem[i].textContent = gameBoard.getGameElem(i);
    };
  };

  fieldElem.forEach(field => {
    field.addEventListener('click', fieldClickedEvent)
  });

  const message = (input) => {
    if (input === "Draw") {
      setMessage(`Draw Game`);
    } else {
      setMessage(`${input} won`);
    }
  }
  const setMessage = (input) => {
    messageElement.textContent = input;
  };

  return { message, setMessage }


})();



// gameflow module
const gameFlow = (() => {
  const player1 = Player('X', "Player1");
  const player2 = Player('O', 'Player2');
  let round = 1;
  let isOver = false;


  const addMark = (fieldIndex) => {
    gameBoard.getPlayedElem(fieldIndex, getPlayerSign());

    if (resultValidation()) {
      uiCtrl.message(getPlayerName());
      isOver = true;
      return;
    };

    if (round === 9) {
      uiCtrl.message('Draw');
      isOver = true;
      return;
    }
    round++;
    uiCtrl.setMessage(`${getPlayerName()}'s turn`);

  }

  const getPlayerSign = () => {
      return round % 2 === 1 ? player1.playerMarker() : player2.playerMarker();
  };

  const getPlayerName = () => {
      return round % 2 === 1 ? player1.playerName() : player2.playerName();
  }


  const resultValidation = () => {
    const winningCondition = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    // loop over the winningCombination 
    // for each of the combination check if all of the element of our board element are the same 
    return winningCondition.some(combination => {
      return combination.every(index => {
        return gameBoard.getGameElem(index) === getPlayerSign();
      })
    })

  }

  const reset = () => {
    isOver = false;
    round = 1;

  }
  const getIsOver = () => {
    return isOver;
  };


  return { addMark, getIsOver, reset, getPlayerSign, getPlayerName }
})();

