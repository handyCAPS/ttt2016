module.exports = {
    before: function(browser) {
        browser.url('http://localhost/ttt2016');
    },
    // 'Testing this shit': function(browser) {
    //     return browser
    //         .waitForElementVisible('body', 1000)
    //         .assert.containsText('body', 'Settings');
    // },
    'Finding tiles': function(browser) {
        return browser
            .waitForElementVisible('.settingsHeader', 1000)
            .assert.containsText('.settingsHeader', 'Settings')
            .click('.tileX')
            .assert.cssClassPresent('.tileO', 'notThisOne')
            .assert.cssClassNotPresent('.tileX', 'notThisOne')
            ;
    },
    after: function(browser) {
        browser.end();
    }
};