/**
 * Usage:
 * var messaging = new Messaging({source: 'background', channel: 'mrs.hudson'});
 *
 * // to send message
 * messaging.send(tabId, message, data);
 *
 * // when message come from the channel
 * messaging.receive('background', 'message', function(options) {});
 */

/**
 * Instead of interface
 */
class Messenger {
    receive() {
        console.log('This method is not implemented, but must be');
    }

    send() {
        console.log('This method is not implemented, but must be');
    }

    broadcast() {
        console.log('This method is not implemented, but must be');
    }
}

class ContentMessenger extends Messenger {
    constructor(channel, origin) {
        super(channel);

        this.origin = origin || '*';
        this.channel = channel;
        this.listeners = {
            content: {},
            background: {}
        };

        // Message listeners for background and content
        window.addEventListener('message', (event) => {
            // ToDo: check origin
            // event.origin: 'chrome-extension://extension-id'

            const message = event && event.data && event.data.message;

            if (this.listeners.content[message]) {
                // console.log('Content cought message from content:', message);
                this.listeners.content[message].forEach(callback =>
                    callback.call(this, event.data.data));
            }
        }, false);

        chrome.runtime.onMessage.addListener((request) => {
            const message = request.message;

            if (this.listeners.background[message]) {
                // console.log('Content cought message from background:', message, request);
                this.listeners.background[message].forEach(callback =>
                    callback.call(this, request));
            }
        });
    }

    receive(from, message, callback) {
        if (!this.listeners[from]) {
            // unknown source
            // console.error('WARNING: adding message listener for unknown source', from);
            return this;
        }

        if (!this.listeners[from][message]) {
            this.listeners[from][message] = [];
        }

        this.listeners[from][message].push(callback);

        return this;
    }

    send2content(message, data) {
        const winList = window.frames;

        for (let i = 0; i < winList.length; i += 1) {
            winList[i].postMessage({
                message,
                data
            }, this.origin);
        }
    }

    send2background(message, data, callback) {
        data = data || {};
        data.message = message;

        chrome.runtime.sendMessage(data, (response) => {
            if (typeof callback === 'function') {
                callback.call(this, response);
            }
        });
    }

    send(to, message, data) {
        if (to === 'content') {
            return this.send2content(message, data);
        } else if (to === 'background') {
            return this.send2background(message, data);
        }

        return this;
    }
}

class BackgroundMessenger extends Messenger {
    constructor(channel) {
        super(channel);

        this.channel = channel;
        this.listeners = {};

        // add common message listener
        chrome.runtime.onMessage.addListener((request) => {
            const args = Array.prototype.slice.call(arguments);
            const message = request.message;

            if (this.listeners[message]) {
                this.listeners[message].forEach(callback => callback.apply(this, args));
            }
        });
    }

    receive(message, callback) {
        if (!this.listeners[message]) {
            this.listeners[message] = [];
        }

        this.listeners[message].push(callback);

        return this;
    }

    /**
     *
     * @param  {Intenger} tabId
     * @param  {String} message
     * @param  {Object} data
     * @return {*}
     */
    send(tabId, message, data) {
        return chrome.tabs.sendMessage(tabId, Object.assign({ message }, data));
    }
}

class MessengerFactory {
    constructor(source, channel = false) {
        switch (source) {
        case 'background':
            return new BackgroundMessenger(channel);
        case 'content':
            return new ContentMessenger(channel);
        default:
            // console.error('Unknown source for messanging');
        }

        return null;
    }
}

export default MessengerFactory;
