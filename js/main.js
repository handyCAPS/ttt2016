
function get(el) {
    return document['querySelector' + (el.indexOf('#') === 0 ? '' : 'All')](el);
}

var player = true,
    started = false,
    gameOver = false,
    waiting = false,
    singlePlayer = true,
    plyr;

var players = [
    [],
    []
];

var winLines = [
    [1,2,3],
    [4,5,6],
    [7,8,9],
    [1,4,7],
    [2,5,8],
    [3,6,9],
    [1,5,9],
    [3,5,7]
];

var boardMatrix, closingTiles;

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
}

function setTileOnRow(row, tile, owner) {
    if (row.hasOwnProperty(tile)) { row[tile] = owner; }
}

function checkRow(row) {
    var firstOwner = null, nullTiles = [], hasChance = false;
    for (var tileNum in row) {
        var val = row[tileNum];
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
    if (hasChance) {
        if (closingTiles[firstOwner].indexOf(nullTiles[0]) === -1) {
            closingTiles[firstOwner].push(parseInt(nullTiles[0]));
        }
    }
}

function setMatrix(num, owner) {
    var prop = num.toString();
    boardMatrix.forEach(function(row, idx) {
        var first = null;
        setTileOnRow(row, prop, owner);
        checkRow(row);
        console.dir(closingTiles);
    });
    // console.dir(boardMatrix);
}


var tiles = (function() {
    var allTiles = get('.tile');
    return {
        get: function(idx) {
            return allTiles[idx];
        },
        getAll: function() {
            return allTiles;
        },
        getByDataTile: function(no) {
            return get('[data-tile="' + no + '"]');
        },
        reset: function() {
            [].forEach.call(allTiles, function(v) {
                v.isSet = false;
                v.classList.remove('tileX', 'tileY');
            });
            started = false;
            gameOver = false;
            initBoard();
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
            if (!gameOver) {
                var tileNum = parseInt(selected.dataset.tile);
                plyr = player * 1;
                selected.classList.add(['tileX', 'tileY'][plyr]);
                selected.isSet = true;
                selected.playerOwner = plyr;
                player = !player;
                players[plyr].push(tileNum);
                setMatrix(tileNum, plyr);
            }
            // this.check(plyr);
        },
        setRandom: function() {
            waiting = false;
            if (!gameOver) {
                if (closingTiles[player * 1].length > 0) {
                    this.set(this.getByDataTile(closingTiles[!player * 1][0]));
                } else {
                    this.set(this.getRandom());
                }
            }
        },
        check: function(playr) {
            var current, checked, same;
            if (this.getSelected().length > 0) {
                winLines.forEach(function(winLine) {
                    var barrel = [];
                    winLine.some(function(tile) {
                        var idx = tile + 1, target = tiles.get(idx) || {}, owner = target.playerOwner;
                        if (owner === undefined) { return true; }
                        barrel.push(owner);
                        // console.log(owner);
                    });
                    console.log(barrel);
                });
            }
            gameOver = this.getSelected(true).length === 0 || same === true;
        }
    };
}());

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

get('#resetButton').addEventListener('click', tiles.reset);

get('.sliderWrap')[0].addEventListener('click', function(event) {
    get('.slider')[0].classList.toggle('flright');
    [].forEach.call(get('.playerSelection'), function(v) {
        v.classList.toggle('selected');
    });
});