/* jshint undef: false, unused: false */


describe('Testing utility functions', function() {
    it('should add only unique values to an array', function() {
        var testArray = [];
        var testValue = 1;
        pushUnique(testArray, testValue);
        expect(testArray.length).toBe(1);
        pushUnique(testArray, testValue);
        expect(testArray.length).toBe(1);
        pushUnique(testArray, testValue + 1);
        expect(testArray.length).toBe(2);
    });
});

describe('Testing winline functions', function() {
    it('should split a winLine object into a winner and lineArray object', function() {
        var wline = {
            '1': 0,
            '2': 0,
            '3': 0
        };
        var expectedOb = {
            lineArray: [1,2,3],
            winner: 0
        };
        expect(splitWinLine(wline)).toEqual(expectedOb);
    });
});

describe('Testing boardMatrix', function() {
    this.tile, this.tile2, this.owner, this.row;
    beforeEach(function() {
        initBoard();
        this.row   = boardMatrix[0];
        this.tile  = '1';
        this.tile2 = '2';
        this.owner = 0;
        setTileOnRow(this.row, this.tile, this.owner);
        setTileOnRow(this.row, this.tile2, this.owner);
    });
    it('should start with an empty board, winLine and closingTiles', function() {
        initBoard();
        expect(boardMatrix[0]['1']).toBe(null);
        expect(winningLine).toBe(false);
        expect(Object.keys(closingTiles).length).toBe(2);
        expect(closingTiles[0].length).toBe(0);
    });
    it('should set the owner for a tile on the matrix', function() {
        expect(boardMatrix[0][this.tile]).toBe(this.owner);
        expect(boardMatrix[0][this.tile2]).toBe(this.owner);
    });
    it('should spot a closing tile when a row gets checked', function() {
        checkRow(this.row);
        expect(closingTiles[this.owner].length).toBe(1);
    });
    it('should remove a tile from closingTiles', function() {
        var cTile = 3;
        checkRow(this.row);
        expect(closingTiles[this.owner].length).toBe(1);
        expect(closingTiles[this.owner][0]).toBe(cTile);
        popFromClosing(cTile);
        expect(closingTiles[this.owner].length).toBe(0);
    });
});


describe('Testing piece persistance', function() {
    beforeEach(function() {
        var store = {};
        spyOn(localStorage, 'getItem').and.callFake(function(key) {
            return store[key];
        });
        spyOn(localStorage, 'setItem').and.callFake(function(key, value) {
            return store[key] = value + '';
        });
        spyOn(localStorage, 'clear').and.callFake(function() {
            store = {};
        });
    });
    it('should set playerItem in localStorage based on player', function() {
        player = true;
        setPiecePersistance();
        expect(setPiecePersistance(true)).toBe('1');
    });
});