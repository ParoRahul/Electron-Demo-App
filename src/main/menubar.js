/**
 * coding: utf-8 
 * Created on sun Aug 25 07:59:00 PM 2019
 * author: Rahul
 * Description: Tabbar Class
 * 
 */

const EventEmitter = require("events");

class menubar extends events {
    constructor(args) {
        super()
        let option = this.option = {
            menuContainerSelector: args.menuContainerSelector || ".menubar",
            menuClass: args.menuClass || "parent",
            subMenuClass: args.subMenuclass || "child",
        }
        this.menuContainer = document.querySelector(option.menuContainerSelector);
        this.items = [];
        this.focusedItem = undefined;
        let parentContainer = document.createElement('ul');
        parentContainer.className = 'menuitems';
        option.menu.forEach(function(mitem) {
            this.createMenu(mitem, parent_container);
            this.menuContainer.appendChild(parent_container);
            this.emit('menubar-ready', this);
        });
    }

    createMenu(menuitems, parent_container) {
        let itemElement = document.createElement('li');
        let label = document.createElement('label');
        label.innerHTML = menuitems.label;
        itemElement.className = this.option.menuclass;
        itemElement.setAttribute('role', menuitems.role);
        itemElement.appendChild(label);
        if (menuitems.hasOwnProperty("submenu")) {
            let childContainer = document.createElement('ul');
            childContainer.className = this.option.subMenuClass;
            itemElement.appendChild(childContainer)
            menuitems.submenu.forEach(menu =>
                this.createMenu(menu, childContainer))
        } else {
            itemElement.onclick = function(menuitems, focusedwindow, event) {
                this.menuContainer.trigger("menuitem-clicked", [menuitems.role]);
                parent_container.appendChild(itemElement);
                this.items.push(itemElement);
            }
        }
    }
}