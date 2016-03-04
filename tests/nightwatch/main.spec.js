module.exports = {
    'Testing this shit': function(browser) {
        browser
            .url('http://localhost/ttt2016')
            .waitForElementVisible('body', 1000)
            .assert.containsText('body', 'Settings')
            .end();
    },
    'Finding tiles': function(browser) {
        browser
            .url('http://localhost/ttt2016')
            // .expect.element('.tile').to.be.present
            .end();
    }
};