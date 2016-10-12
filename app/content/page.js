import Messenger from '../Messenger';

const messenger = new Messenger('content', 'mrs.hudson');

class Page {
    constructor() {
        this.manager = null;
        this.isExtensionManagerOpened = false;
    }

    createExtensionManager(managerSrc, managerData) {
        const managerElement = document.createElement('div');
        const iframeElement =  document.createElement('iframe');

        managerElement.className = 'hudsonManager hudsonManager_hidden hudsonManager_shadowed';
        iframeElement.id = 'hudsonManager__iframe';
        iframeElement.setAttribute('src', managerSrc);

        managerElement.appendChild(iframeElement);

        this.manager = managerElement;

        iframeElement.addEventListener('load', () => {
            messenger.send('content', 'onManagerLoad', managerData);
        });
    }

    openExtensionManager(options) {
        const managerSrc = options.managerUrl;
        const managerData = Object.assign({}, options.data);

        if (!this.manager) {
            this.createExtensionManager(managerSrc, managerData);
            document.body.appendChild(this.manager);
        } else {
            messenger.send('content', 'onManagerLoad', managerData);
        }

        this.manager.className = this.manager.className.replace('hudsonManager_hidden', '');
        this.isExtensionManagerOpened = true;
    }

    closeExtensionManager() {
        const animationEndHandler = (event) => {
            event.target.removeEventListener(event.type, animationEndHandler, false);

            this.manager.className += ' hudsonManager_hidden';
            this.manager.className = this.manager.className.replace('hudsonManager_hide', '');

            this.isExtensionManagerOpened = false;
        };

        this.manager.className += ' hudsonManager_hide';
        this.manager.addEventListener('webkitAnimationEnd', animationEndHandler);
    }
}

const page = new Page();

messenger
    .receive('background', 'onExtensionButtonClicked', (options) => {
        console.log('Page got message: onExtensionButtonClicked');

        page.isExtensionManagerOpened ?
            page.closeExtensionManager() :
            page.openExtensionManager(options);
    })
    .receive('content', 'onCloseIconClicked', (options) => {
        if (page.isExtensionManagerOpened) {
            page.closeExtensionManager();
            messenger.send('background', 'onManagerInternallyClosed');
        }
    });
