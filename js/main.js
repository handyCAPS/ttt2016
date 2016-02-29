
function get(el) {
    return document['querySelector' + (el.indexOf('#') === 0 ? '' : 'All')](el);
}

var player = false,
    started = false,
    gameOver = false,
    waiting = false,
    singlePlayer = true,
    iAmO = false,
    winningLine,
    boardMatrix,
    closingTiles;

var pieces = [
    'X',
    'O'
];


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
    winningLine = false;
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
                v.classList.remove('tileX', 'tileO');
                v.style = null;
            });
            var winMessage = get('.winMessage');
            if (winMessage.length > 0) {
                winMessage[0].remove();
            }
            started = false;
            gameOver = false;
            totalSet = 0;
            checkForSetPiece();
            showPieceIsSet(true);
            whoAmI();
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
                var plyr = player * 1;
                selected.classList.add(['tileX', 'tileO'][plyr]);
                selected.isSet = true;
                selected.playerOwner = plyr;
                setMatrix(tileNum, plyr);
                popFromClosing(tileNum);
                totalSet++;
                if (winningLine === false && totalSet === totalTiles) { gameOver = true; noWinner = true; }
                if (gameOver) {
                    showWinner(noWinner);
                }
                player = !player;
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
    var winner, winLine = [];
    if (!noWinner) {
        for (var x in winningLine) {
            winLine.push(x);
            winner = winningLine[x];
        }
    }
    var message = noWinner ? 'Nobody won.' : ["You won!", "The damn computer won!!"][!iAmO * 1];
    var flashPool = winningLine !== false ? Object.keys(winningLine).map(function(v){return parseInt(v);}) : false;
    tiles.flash(flashPool, true);
    get('.board')[0].insertAdjacentHTML('afterend', "<p class='winMessage'>" + message + " <a href='#' class='resetBoard'>Play again ?</a></p>");
    listenForReplay();
}

[].forEach.call(tiles.getAll(), function(v) {
    v.addEventListener('click', function() {
        if (!started) { startGame(); }
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


function checkForSetPiece() {
    var ppiece = window.localStorage.getItem('playerPiece');
    if (ppiece !== undefined) {
        player = !!pieces.indexOf(pieces[ppiece]);
        setPieceClass();
    }
}


function setPieceClass() {
    var notThisOne = get('.notThisOne');
    if (notThisOne.length) {
        notThisOne[0].classList.remove('notThisOne');
    }
    get('.piece' + pieces[!player * 1])[0].classList.add('notThisOne');
}

function listenForSetPiece() {
    var piecesEls = get('.piece');
    [].forEach.call(piecesEls, function(p, idx) {
        p.addEventListener('click', function(ev) {
            if (started) { return; }
            player = !!pieces.indexOf(ev.currentTarget.dataset.piece);
            setPieceClass();
            setPiecePersistance();
            setFavicon();
            whoAmI();
        });
    });
}

function setPiecePersistance(get) {
    var key = 'playerPiece';
    if (get) {
        return window.localStorage.getItem(key);
    }
    window.localStorage.setItem(key, player * 1);
}

function showPieceIsSet(unhide) {
    get('.notThisOne')[0].classList[['add', 'remove'][!!unhide * 1]]('hidden');
}

function setFavicon() {
    var imgIdx = setPiecePersistance(true) === undefined ? 0 : setPiecePersistance(true) * 1;
    var img = ['cross', 'circle'][imgIdx];
    var favLink = "<link rel='mask-icon' href='img/" + img + ".svg?v=" + Date.now() + "' class='favLink'>";
    var favLinkPng = "<link rel='shortcut icon' type='image/png' href='img/" + img + ".png?v=" + Date.now() + "' class='favLink'>";
    var setFav = get('.favLink');
    if (setFav.length) {
        [].forEach.call(setFav, function(f) {
            f.remove();
        });
    }
    get('head')[0].insertAdjacentHTML('beforeend', favLink + favLinkPng);
}

function whoAmI() {
    var p = setPiecePersistance(true);
    iAmO = p !== undefined ? !!parseInt(p) : true;
}



function startGame() {
    started = true;
    showPieceIsSet();
    initBoard();
}

checkForSetPiece();
setPieceClass();
setPiecePersistance();
whoAmI();
setFavicon();
listenForSetPiece();