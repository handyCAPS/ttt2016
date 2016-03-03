/* jshint undef: false, unused: false */


describe('Testing whoAmI', function() {
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
    it('should tell me if I am playing with the circle or the cross', function() {
        expect(iAmO).toBe(false);
    });
    it('should set iAmO depended on localStorage', function() {
        var lsMock = "0";
        whoAmI();
        expect(iAmO).toBe(0);
    });
});