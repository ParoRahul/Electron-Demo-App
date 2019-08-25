class menubar extends events{
constructor(args-(})
super()
let option-this.option=
menuContainerSelector: args.menuContainerSelector || ".menubar"
menuClass: args. menuClass || "parent",
subMenuClass: args.subMenuclass || "child".
menuDataFile: args.menuDataFile| | "D:/nodejs/Groot/src/menuitems.json",
this.menuContainer-document.querySelector (option . menuContainerSelector);
this.items-[]:
this.focused Item undefined;
let parent_container-document.createElement ('ul');
parent_ container.className 'menuitems'
fs.readFile (optiion . menuDataFile).then ( menuitems =>
JSON.parse (menuitems)
).then(menuitems = >{
console. log (menuitems.menu);
let menulist-menuitems.menu;
menulist.forEach (mitem -> {
this.createMenu (mitem, parent_container)
I
).then ()=> {
this.menuContainer.appendChild (parent_container):
this.emit('menubar-ready' , this) ;

).catch((err)->{
console.log(err)
createMenu (menuitems, parent_container) {
let itemElement document.createElement( "1i');
let label = document.createElement (' label ');
label.innerHTML menuitems.label;
itemElement.className = this.option.menuclass;
itemElement.setAttribute( 'role', menuitems.role);
itemElement.appendChild (label);
if (menuitems. hasOwnProperty("submenu")) {
let child_container-document.createElement( 'ul');
child container.className this..option. subMenuClass;
itemElement.appendChild (child_container)
menuitems.submenu.forEach (menu =>
this.createMenu(menu, child_container)
else {
itemElement.onclick = function (menuitems, focusedwindow, event){
this.menuContainer. trigger ("menuitem-clicked". [menuitems.role]):
parent_container.appendChild (itemElement) ;
this.items.push(itemE lement);

