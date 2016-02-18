
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

var tiles = (function() {
    var allTiles = get('.tile');
    return {
        get: function(idx) {
            return allTiles[idx];
        },
        getAll: function() {
            return allTiles;
        },
        reset: function() {
            [].forEach.call(allTiles, function(v) {
                v.style.backgroundColor = null;
                v.isSet = false;
            });
            started = false;
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
                plyr = player * 1;
                selected.style.backgroundColor = ['red', 'blue'][plyr];
                selected.isSet = true;
                selected.playerOwner = plyr;
                player = !player;
                players[plyr].push(parseInt(selected.dataset.tile));
            }
            this.check(plyr);
        },
        setRandom: function() {
            waiting = false;
            if (!gameOver) { this.set(this.getRandom()); }
        },
        check: function(playr) {
            var current, checked, same;
            if (this.getSelected().length > 0) {
                winLines.forEach(function(winLine) {
                    winLine.forEach(function(tile) {
                        current = tiles.get(tile - 1).playerOwner;
                        if (checked !== undefined) {
                            same = checked === current;
                        }
                        checked = current;
                        console.log(current);
                    });
                });
            }
            gameOver = this.getSelected(true).length === 0 || same === true;
        }
    };
}());

[].forEach.call(tiles.getAll(), function(v) {
    v.addEventListener('click', function() {
        if (!started) { started = true; }
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