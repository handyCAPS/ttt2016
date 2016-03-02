/* jshint undef: false, unused: false */


describe('Testing whoAmI', function() {
    it('should set iAmO depended on localStorage', function() {
        var lsMock = "0";
        whoAmI();
        expect(iAmO).toBe(0);
    });
});