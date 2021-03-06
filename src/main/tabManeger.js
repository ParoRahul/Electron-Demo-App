/**
 * coding: utf-8 
 * Created on sun Aug 25 07:59:00 PM 2019
 * author: Rahul
 * Description: Tabbar Class
 * 
 */

const EventEmitter = require("events");

class tabScheduler extends EventEmitter {
    constructor(args = {}) {
        super();
        let options = this.options = {
            tabContainerSelector: args.tabContainerSelector || ".tabContainer",
            viewContainerSelector: args.viewContainerSelector || ".viewContainer",
            tabClass: args.tabClass || "tab-head",
            viewClass: args.viewClass || "tab-view",
            closeButtonText: args.closeButtonText || "&#10006;",
            newTabButtonText: args.newTabButtonText || "&#65291;",
            ready: args.ready
        };
        this.tabContainer = document.querySelector(this.options.tabContainerSelector);
        this.viewContainer = document.querySelector(this.options.viewContainer);
        this.tabs = [];
        this.newTabId = 0;
        if (typeof this.options.ready === "function") {
            this.options.ready(this);
        }
    }

    addTab(args) {
        let id = this.newTabId;
        this.newTabId++;
        let tab = new Tab(this, id, args);
        this.tabs.push(tab);
        // Don't call tab.activate() before a tab is referenced in this.tabs
        if (args.active === true) {
            tab.activate();
        }
        this.emit("tab-added", tab, this);
        return tab;
    }

    getTab(id) {
        for (let i in this.tabs) {
            if (this.tabs[i].id === id) {
                return this.tabs[i];
            }
        }
        return null;
    }

    getTabByPosition(position) {
        let fromRight = position < 0;
        for (let i in this.tabs) {
            if (this.tabs[i].getPosition(fromRight) === position) {
                return this.tabs[i];
            }
        }
        return null;
    }

    getTabByRelPosition(position) {
        position = this.getActiveTab().getPosition() + position;
        if (position <= 0) {
            return null;
        }
        return this.getTabByPosition(position);
    }

    getNextTab() {
        return this.getTabByRelPosition(1);
    }

    getPreviousTab() {
        return this.getTabByRelPosition(-1);
    }

    getTabs() {
        return this.tabs.slice();
    }

    eachTab(fn) {
        this.getTabs().forEach(fn);
        return this;
    }

    getActiveTab() {
        if (this.tabs.length === 0) return null;
        return this.tabs[0];
    }
}

const TabGroupPrivate = {

    removeTab: function(tab, triggerEvent) {
        let id = tab.id;
        for (let i in this.tabs) {
            if (this.tabs[i].id === id) {
                this.tabs.splice(i, 1);
                break;
            }
        }
        if (triggerEvent) {
            this.emit("tab-removed", tab, this);
        }
        return this;
    },

    setActiveTab: function(tab) {
        TabGroupPrivate.removeTab.bind(this)(tab);
        this.tabs.unshift(tab);
        this.emit("tab-active", tab, this);
        return this;
    },

    activateRecentTab: function(tab) {
        if (this.tabs.length > 0) {
            this.tabs[0].activate();
        }
        return this;
    }
};

class Tab extends EventEmitter {
    constructor(tabGroup, id, args) {
        super();
        this.tabGroup = tabGroup;
        this.id = id;
        this.title = args.title;
        this.badge = args.badge;
        this.iconURL = args.iconURL;
        this.icon = args.icon;
        this.closable = args.closable === false ? false : true;
        this.innerhtml = args.innerhtml === false ? false : true;
        this.divattibute = args.divattibute || {};
        this.tabElements = {};
        TabPrivate.initTab.bind(this)();
        TabPrivate.initWebview.bind(this)();
        if (args.visible !== false) {
            this.show();
        }
        if (typeof args.ready === "function") {
            args.ready(this);
        }
    }

    setTitle(title) {
        if (this.isClosed) return;
        let span = this.tabElements.title;
        span.innerHTML = title;
        this.title = title;
        this.emit("title-changed", title, this);
        return this;
    }

    getTitle() {
        if (this.isClosed) return;
        return this.title;
    }

    setBadge(badge) {
        if (this.isClosed) return;
        let span = this.tabElements.badge;
        this.badge = badge;

        if (badge) {
            span.innerHTML = badge;
            span.classList.remove('hidden');
        } else {
            span.classList.add('hidden');
        }

        this.emit("badge-changed", badge, this);
    }

    getBadge() {
        if (this.isClosed) return;
        return this.badge;
    }

    setIcon(iconURL, icon) {
        if (this.isClosed) return;
        this.iconURL = iconURL;
        this.icon = icon;
        let span = this.tabElements.icon;
        if (iconURL) {
            span.innerHTML = `<img src="${iconURL}" />`;
            this.emit("icon-changed", iconURL, this);
        } else if (icon) {
            span.innerHTML = `<i class="${icon}"></i>`;
            this.emit("icon-changed", icon, this);
        }
        return this;
    }

    getIcon() {
        if (this.isClosed) return;
        if (this.iconURL) return this.iconURL;
        return this.icon;
    }

    setPosition(newPosition) {
        let tabContainer = this.tabGroup.tabContainer;
        let tabs = tabContainer.children;
        let oldPosition = this.getPosition() - 1;

        if (newPosition < 0) {
            newPosition += tabContainer.childElementCount;

            if (newPosition < 0) {
                newPosition = 0;
            }
        } else {
            if (newPosition > tabContainer.childElementCount) {
                newPosition = tabContainer.childElementCount;
            }

            // Make 1 be leftmost position
            newPosition--;
        }

        if (newPosition > oldPosition) {
            newPosition++;
        }

        tabContainer.insertBefore(tabs[oldPosition], tabs[newPosition]);

        return this;
    }

    getPosition(fromRight) {
        let position = 0;
        let tab = this.tab;
        while ((tab = tab.previousSibling) != null) position++;

        if (fromRight === true) {
            position -= this.tabGroup.tabContainer.childElementCount;
        }

        if (position >= 0) {
            position++;
        }

        return position;
    }

    activate() {
        if (this.isClosed) return;
        let activeTab = this.tabGroup.getActiveTab();
        if (activeTab) {
            activeTab.tab.classList.remove("active");
            activeTab.webview.classList.remove("visible");
        }
        TabGroupPrivate.setActiveTab.bind(this.tabGroup)(this);
        this.tab.classList.add("active");
        this.webview.classList.add("visible");
        this.webview.focus();
        this.emit("active", this);
        return this;
    }

    show(flag) {
        if (this.isClosed) return;
        if (flag !== false) {
            this.tab.classList.add("visible");
            this.emit("visible", this);
        } else {
            this.tab.classList.remove("visible");
            this.emit("hidden", this);
        }
        return this;
    }

    hide() {
        return this.show(false);
    }

    flash(flag) {
        if (this.isClosed) return;
        if (flag !== false) {
            this.tab.classList.add("flash");
            this.emit("flash", this);
        } else {
            this.tab.classList.remove("flash");
            this.emit("unflash", this);
        }
        return this;
    }

    unflash() {
        return this.flash(false);
    }

    close(force) {
        this.emit("closing", this);
        if (this.isClosed || (!this.closable && !force)) return;
        this.isClosed = true;
        let tabGroup = this.tabGroup;
        tabGroup.tabContainer.removeChild(this.tab);
        tabGroup.viewContainer.removeChild(this.webview);
        let activeTab = this.tabGroup.getActiveTab();
        TabGroupPrivate.removeTab.bind(tabGroup)(this, true);
        this.emit("close", this);

        if (activeTab.id === this.id) {
            TabGroupPrivate.activateRecentTab.bind(tabGroup)();
        }
    }
}

const TabPrivate = {
    initTab: function() {
        let tabClass = this.tabGroup.options.tabClass;
        // Create tab element
        let tab = this.tab = document.createElement("li");
        tab.classList.add(tabClass);
        for (let el of["icon", "title", "buttons", "badge"]) {
            let span = tab.appendChild(document.createElement("span"));
            span.classList.add(`${tabClass}-${el}`);
            this.tabElements[el] = span;
        }
        this.setTitle(this.title);
        this.setBadge(this.badge);
        this.setIcon(this.iconURL, this.icon);
        TabPrivate.initTabButtons.bind(this)();
        TabPrivate.initTabClickHandler.bind(this)();
        this.tabGroup.tabContainer.appendChild(this.tab);
    },

    initTabButtons: function() {
        let container = this.tabElements.buttons;
        let tabClass = this.tabGroup.options.tabClass;
        if (this.closable) {
            let button = container.appendChild(document.createElement("button"));
            button.classList.add(`${tabClass}-button-close`);
            button.innerHTML = this.tabGroup.options.closeButtonText;
            button.addEventListener("click", this.close.bind(this, false), false);
        }
    },

    initTabClickHandler: function() {
        const tabClickHandler = function(e) {
            if (this.isClosed) return;
            if (e.which === 2) {
                this.close();
            }
        };
        this.tab.addEventListener("mouseup", tabClickHandler.bind(this), false);
        // Mouse down
        const tabMouseDownHandler = function(e) {
            if (this.isClosed) return;
            if (e.which === 1) {
                if (e.target.matches("button")) return;
                this.activate();
            }
        };
        this.tab.addEventListener("mousedown", tabMouseDownHandler.bind(this), false);
    },

    initWebview: function() {
        this.webview = document.createElement("li");
        /* const tabWebviewDidFinishLoadHandler = function (e) {

            this.emit("tabDiv-ready", this);
        };
        this.webview.addEventListener("finish-loading", tabWebviewDidFinishLoadHandler.bind(this), false); */
        this.webview.classList.add(this.tabGroup.options.viewClass);
        if (this.divattibute) {
            let attrs = this.divattibute;
            for (let key in attrs) {
                this.webview.setAttribute(key, attrs[key]);
            }
        }
        if (this.innerhtml) {
            this.webview.innerHTML = this.innerhtml;
        }
        this.tabGroup.viewContainer.appendChild(this.webview);
    }
};

(function() {
    var tabGroup = new TabGroup({
        ready: (tabGroup) => {
            let homeTab = tabGroup.addTab({
                title: "Home",
                icon: "icon icofont-home icofont-lg",
                divattibute: {
                    id: "Home",
                },
                visible: true,
                closable: false,
                ready: (homeTab) => {
                    let webview = homeTab.webview;
                    webview.innerHTML = `<section id ="Home"><h1>My First Heading</h1><p>My first paragraph.</p></section>`;
                    homeTab.activate();
                }
            });
            console.log(' Tab Group Is ready ');
        }
    });

})()

//module.exports = tabScheduler;