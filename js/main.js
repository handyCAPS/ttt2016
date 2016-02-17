
function get(el) {
    return document['querySelector' + (el.indexOf('#') === 0 ? '' : 'All')](el);
}

var tiles = {
    get: function() {
        return get('.tile');
    },
    reset: function() {
        [].forEach.call(tiles.get(), function(v) {
            v.style.backgroundColor = null;
            v.isSet = false;
        });
    }
};

[].forEach.call(tiles.get(), function(v) {
    v.addEventListener('click', function() {
        if (!this.isSet) {
            this.style.backgroundColor = 'red';
            this.isSet = true;
        } else {
            this.style.backgroundColor = 'blue';
            this.isSet = false;
        }
    });
});

get('#resetButton').addEventListener('click', tiles.reset);