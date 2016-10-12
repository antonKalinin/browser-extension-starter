import Messenger from '../Messenger';

const messenger = new Messenger('background', 'mrs.hudson');

class App {
    constructor(config) {
        this.config = config;
        this.user = null;

        console.log('BACKGROUND APP CREATED', config);
    }

    /* PUBLIC METHODS */

    toggleManager(tab) {
        messenger.send(tab.id, 'onExtensionButtonClicked', {
            managerUrl: chrome.extension.getURL('/manager.html'),
            managerData: {}
        });
    }
}

const app = new App({});

/**
 * EXTENSION BUTTON CLICK
 */
chrome.browserAction.onClicked.addListener(app.toggleManager);
