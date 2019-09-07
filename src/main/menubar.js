/**
 * coding: utf-8 
 * Created on sun Aug 25 07:59:00 PM 2019
 * author: Rahul
 * Description: Menubar Class
 * 
 */
'use strict';

class menubar  {
    constructor(args) {
        let option = this.option = {
            menuContainerSelector: args.menuContainerSelector || ".menubar",
            menuClass: args.menuClass || "parent",
            subMenuClass: args.subMenuclass || "child",
            menu: args.menu||[]
        }
        this.menuContainer = document.querySelector(option.menuContainerSelector);
        this.items = [];
        this.focusedItem = undefined;
        option.menu.forEach(function(mitem) {
            this.createMenu(mitem, this.menuContainer);
        }.bind(this));
        let customeEvent = new CustomEvent('menubar-ready');
        document.dispatchEvent(customeEvent);
    }

    createMenu(menuitems, parent_container) {
        let itemElement = document.createElement('li');
        let label = document.createElement('label');
        label.innerHTML = menuitems.label;
        itemElement.className = this.option.menuClass;
        itemElement.setAttribute('role', menuitems.role);
        itemElement.appendChild(label);
        if (menuitems.hasOwnProperty("submenu")) {
            let childContainer = document.createElement('ul');
            childContainer.className = this.option.subMenuClass;
            itemElement.appendChild(childContainer)
            menuitems.submenu.forEach(menu =>{
                this.createMenu(menu, childContainer)})
        } 
        itemElement.addEventListener("click",function(event){
            event.stopImmediatePropagation();
            let customeEvent = new CustomEvent('menuitem-clicked', 
                                               { detail: {role: menuitems.role} });
            this.menuContainer.dispatchEvent(customeEvent);
        }.bind(this));
        parent_container.appendChild(itemElement);
    }
}

module.exports = menubar;