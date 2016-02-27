
function get(el) {
    return document['querySelector' + (el.indexOf('#') === 0 ? '' : 'All')](el);
}

var player = true,
    started = false,
    gameOver = false,
    waiting = false,
    singlePlayer = true,
    plyr,
    winningLine;

var pieces = {
    0: 'X',
    1: 'O'
};


var boardMatrix, closingTiles;

function pushUnique(array, value) {
    if (array.indexOf(value) === -1) { array.push(value); }
}

function initBoard() {
    boardMatrix = [
        {
            '1': null,
            '2': null,
            '3': null
        },
        {
            '4': null,
            '5': null,
            '6': null
        },
        {
            '7': null,
            '8': null,
            '9': null
        },
        {
            '1': null,
            '4': null,
            '7': null
        },
        {
            '2': null,
            '5': null,
            '8': null
        },
        {
            '3': null,
            '6': null,
            '9': null
        },
        {
            '1': null,
            '5': null,
            '9': null
        },
        {
            '3': null,
            '5': null,
            '7': null
        }
    ];
    closingTiles = {
        0: [],
        1: []
    };
    winningLine = [];
}

function setTileOnRow(row, tile, owner) {
    if (row.hasOwnProperty(tile)) { row[tile] = owner; }
}

function checkRow(row) {
    var firstOwner = null, nullTiles = [], hasChance = false;
    for (var tileNum in row) {
        var val = row[tileNum];
        if (hasChance && firstOwner === val) {
            winningLine = row;
            gameOver = true;
        }
        if (val !== null) {
            if (firstOwner === null) {
                firstOwner = val;
            } else {
                if (firstOwner === val) {
                    hasChance = true;
                }
            }
        } else {
            nullTiles.push(tileNum);
        }
    }
    if (hasChance && nullTiles.length === 1) {
        var firstTile = parseInt(nullTiles[0]);
        pushUnique(closingTiles[firstOwner], firstTile);
    }
}

function setMatrix(num, owner) {
    var prop = num.toString();
    boardMatrix.forEach(function(row, idx) {
        setTileOnRow(row, prop, owner);
        checkRow(row);
    });
}

function popFromClosing(tl) {
    for (var v in closingTiles) {
        var idx = closingTiles[v].indexOf(tl);
        if (idx !== -1) {
            closingTiles[v].splice(idx, 1);
        }
    }
}


var tiles = (function() {
    var allTiles = get('.tile'),
        totalSet = 0,
        totalTiles = allTiles.length;
    return {
        get: function(idx) {
            return allTiles[idx];
        },
        getAll: function() {
            return allTiles;
        },
        getByDataTile: function(no) {
            return get('[data-tile="' + no + '"]')[0];
        },
        reset: function() {
            [].forEach.call(allTiles, function(v) {
                v.isSet = false;
                v.classList.remove('tileX', 'tileY');
                v.style = null;
            });
            var winMessage = get('.winMessage');
            if (winMessage.length > 0) {
                winMessage[0].remove();
            }
            started = false;
            gameOver = false;
            totalSet = 0;
            initBoard();
            this.flash();
        },
        getSelected: function(other) {
            return [].filter.call(allTiles, function(tile) {
                return tile.isSet !== other;
            });
        },
        getRandom: function(any) {
            var pool = any ? allTiles : this.getSelected(true);
            return pool[Math.floor(Math.random() * pool.length)];
        },
        set: function(selected) {
            if (!gameOver && !selected.isSet) {
                var noWinner = false;
                var tileNum = parseInt(selected.dataset.tile);
                plyr = player * 1;
                selected.classList.add(['tileX', 'tileY'][plyr]);
                selected.isSet = true;
                selected.playerOwner = plyr;
                setMatrix(tileNum, plyr);
                popFromClosing(tileNum);
                player = !player;
                totalSet++;
                if (totalSet === totalTiles) { gameOver = true; noWinner = true; }
                if (gameOver) {
                    showWinner(noWinner);
                }
            }

        },
        setRandom: function() {
            waiting = false;
            if (!gameOver) {
                var otherPlayer = !player * 1,
                    canI = closingTiles[player * 1].length > 0,
                    canHe = closingTiles[otherPlayer].length > 0;
                if (canI || canHe) {
                    var oneWhoKnocks = canI ? player * 1 : otherPlayer;
                    var setTile = closingTiles[oneWhoKnocks][0];
                    this.set(this.getByDataTile(setTile));
                } else {
                    this.set(this.getRandom());
                }
            }
        },
        flash: function(pool, stay) {
            var flashClass = 'tileFlash';
            [].forEach.call(allTiles, function(v, i) {
                if (pool && pool.indexOf(parseInt(v.dataset.tile)) === -1) { return; }
                window.setTimeout(function() {
                    v.classList.add(flashClass);
                    if (stay) { return; }
                    window.setTimeout(function() {
                        v.classList.remove(flashClass);
                    }, 400);
                }, 50 * i || 1);
            });
        }
    };
}());

function showWinner(noWinner) {
    var message = noWinner ? 'Nobody won.' : "Player " + pieces[player*1] + " wins!";
    tiles.flash(Object.keys(winningLine).map(function(v){return parseInt(v);}), true);
    get('.board')[0].insertAdjacentHTML('afterend', "<p class='winMessage'>" + message + " <a href='#' class='resetBoard'>Play again ?</a></p>");
    listenForReplay();
}

[].forEach.call(tiles.getAll(), function(v) {
    v.addEventListener('click', function() {
        if (!started) { started = true; initBoard(); }
        if (!waiting && !this.isSet) {
            tiles.set(this);
            if (singlePlayer) {
                waiting = true;
                window.setTimeout(tiles.setRandom.bind(tiles), 500);
            }
        }
    });
});

get('#resetButton').addEventListener('click', tiles.reset.bind(tiles));

function listenForReplay() {
    get('.resetBoard')[0].addEventListener('click', function(ev) {
        ev.preventDefault();
        tiles.reset();
    });
}

get('.sliderWrap')[0].addEventListener('click', function(event) {
    get('.slider')[0].classList.toggle('flright');
    singlePlayer = !singlePlayer;
    [].forEach.call(get('.playerSelection'), function(v) {
        v.classList.toggle('selected');
    });
});