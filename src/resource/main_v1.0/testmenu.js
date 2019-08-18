//const fs = require('fs');
//const Handlebars = require('Handlebars');
///const path =require('path');

let menutemp = { 
    submenu : [{
        label:"item1",
        role:"file",
        submenu:[
            {
                label:"item11",
                role:"new"
            },
            {
                type:"separator"
            },
            {
                label:"item12",
                role:"importList",
                indicator:true,
                submenu:[
                    {
                        label:"item121",    
                        role:"import_file",
                        submenu:[
                            {
                                label:"item1211",    
                                role:"import_file"
                            },
                            {
                                label:"item1212",    
                                role:"import_folder"
                            }
                        ]
                    },
                    {
                        label:"item122",    
                        role:"import_folder"
                    }
                ]
            },
            {
                label:"item13",
                role:"export",
                iconfont:"icofont-sign-out  icofont-md",
                submenu:[
                    {
                        label:"item131",    
                        role:"import_file"
                    },
                    {
                        label:"item132",    
                        role:"import_folder"
                    }
                ]
            },
            {
                label:"item14",
                role:"project_settings",
                iconfont:"icofont-options  icofont-md",
                enabled:false
            },
        ]
    },
    {
        label:"item2",
        role:"tool",
        submenu:[
            {
                label:"item21",
                indicator:true,
                submenu:[
                    {
                        label:"item211",
                        role:"captcha"
                    }
                ]
            },
            {
                label:"item22",
                indicator:true,
                submenu:[
                    {
                        label:"item221",
                        role:"loadMnist"
                    }
                ]
            },
        ]
    },
    {
        label:"settings",
        role:"help",
        submenu:[
            {
                label:"menu_help_visit",
                iconfont:"icofont-github icofont-md",
                role:"homepage"
            },
            {
                label:"menu_help_contact",
                iconfont:"icofont-contacts   icofont-md", 
                role:"service",
                visible: "lang"
                    },
            {
                label:"menu_help_about",
                iconfont:"icofont-info-circle   icofont-md", 
                role:"version"
            }
        ]
    }
    ]
    
}

//var template=document.getElementBy("menubar").outerHTML;
//console.log(template);
document.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');
    var main = Handlebars.compile( `<ul class="menuitems">{{> menulist}}</ul>`);
    console.log(document.getElementById("menubar").innerHTML);
    var data = `{{#each submenu}}{{#if label}}
    <li class="parent">
        <label role="{{role}}">{{label}}
        {{#if submenu}} 
        <i class='icofont-caret-right icofont-lg'></i></label>
        <ul class="child">
            {{> menulist}}
        </ul>
        {{else}}
        </label>
        {{/if}}       
    </li>
    {{/if}}{{/each}}`
    Handlebars.registerPartial( "menulist", data );
    document.getElementById("menubar").innerHTML=main(menutemp);
});

/*
document.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');
    var main = Handlebars.compile( `<ul class="menuitems">{{> menulist}}</ul>`);
    console.log(document.getElementById("menubar").innerHTML);
    var data = `{{#each submenu}}{{#if type}}
    <li class={{type}}></li> 
    {{/if}}{{#if label}}
    <li>
        <label role="{{role}}">
            <span class="menuname">{{label}}</span>
            {{#if indicator}}
            <i class="indicator fs fs-angel-right"></i>
            {{/if}}
        </label>
        {{#if submenu}} 
        <ul>
            {{> menulist}}
        </ul>
        {{/if}}       
    </li>
    {{/if}}{{/each}}`
    Handlebars.registerPartial( "menulist", data );
    document.getElementById("menubar").innerHTML=main(menutemp);
});

const html_path ='menubar_h.html'

let temp =`<ul>{{> recursive_partial}}</ul>`

fs.readFile(path.join(__dirname,html_path), 'utf-8', (err, data) =>{
    if (err){
        console.log('error while opetaion');
        return;
    }
    var main = Handlebars.compile( "<ul>{{> menulist}}</ul>" );
    Handlebars.registerPartial( "menulist", data );
    var newcontent = main(  menutemp );
    console.log(newcontent);
});
 */
/* 
fs.readFile(path.join(__dirname,html_path), 'utf-8', (err, data) =>{
    if (err){
        console.log('error while opetaion');
        return;
    }
    //console.log(data);
    let newcontent = Mustache.render(temp, menutemp, { recursive_partial: data });
    //let newcontent = Mustache.render(data, menutemp,{"recurse": recurse});
    setTimeout(() => {
        console.log(newcontent);    
    }, 10);
}); */