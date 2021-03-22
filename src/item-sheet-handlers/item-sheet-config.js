import { AUTOANIM } from "./config.js";
import { AnimateItem } from "./animateitem.js";
const animationTabs = [];
import getNameColor from "./name-color-checks.js";
//import mergeDamnObject from "./mergeDamnObject.js";

export class AnimationTab {

    static bind(app, html, data) {
        let acceptedTypes = ['weapon', 'spell', 'consumable', 'feat'];
        if (acceptedTypes.includes(data.entity.type)) {
            let tab = animationTabs[app.id];
            if (!tab) {
                tab = new AnimationTab(app);
                animationTabs[app.id] = tab;
            }
            tab.init(html, data);
        }
    }


    constructor(app) {
        this.app = app;
        this.item = app.item;
        this.hack(this.app);
        this.activate = false;
    }


    //itemName = app.item.name;S

    init(html, data) {

        if (html[0].localName !== "div") {
            html = $(html[0].parentElement.parentElement);
        }

        let tabs = html.find('form nav.sheet-navigation.tabs');
        if (tabs.find('a[data-tab=autoanimations]').length > 0) {
            return;
        }

        tabs.append($(
            '<a class="item" data-tab="autoanimations">Animate</a>'
        ));

        $(html.find(`.sheet-body`)).append($(
            '<div class="tab animate-items" data-group="primary" data-tab="autoanimations"></div>'
        ));

        this.html = html;
        this.editable = data.editable;


        let itemData = getNameColor(data);

        this.animateItem = new AnimateItem(this.item.data.flags.autoanimations, itemData);

        this.render();
    }

    hack(app) {
        let tab = this;
        app.setPosition = function (position = {}) {
            position.height = tab.isActive() && !position.height ? "auto" : position.height;
            return this.__proto__.__proto__.setPosition.apply(this, [position])
        };
    }

    async render() {


        let template = await renderTemplate('modules/automated-jb2a-animations/src/templates/animatetab.html', this.animateItem);
        let el = this.html.find('animation-tab-contents');
        if (el.length) {
            el.replaceWith(template);
        } else {
            this.html.find('.tab.animate-items').append(template);
        }

        //let animateType = this.html.find(`.animation-type`);
        //if(this.)

        let animateType = this.html.find('.animation-type');
        let animateName = this.html.find('.animation-name');
        let animateColor = this.html.find('.animation-color');
        let animateEnabled = this.html.find('.animation-not-disabled');
        let animateExplosion = this.html.find('.animate-explosion');
        let explosionOptions = this.html.find('.animate-explosion-options');

        //let animateColor = this.html.find('.animate-color');

        if (this.animateItem.killAnim) {
            animateEnabled.hide();
        } else {
            animateEnabled.show();
        }
        if (this.animateItem.override) {
            animateType.show();
            animateName.show();
        } else {
            animateType.hide();
            animateName.hide();
            //animateName.hide();
        }


        switch (true) {
            case (this.animateItem.explosion && ((this.animateItem.animName === "Arrow") || this.item.name.includes("bow"))):
                explosionOptions.show();
                break;
            case ((this.animateItem.animType === "t8") && (this.animateItem.override === true)):
            case ((this.animateItem.animType === "t9") && (this.animateItem.override === true)):
                explosionOptions.show();
                animateName.hide();
                animateColor.hide();
                break;
            case ((this.animateItem.animType === "t3") && (this.animateItem.override === true)):
                animateColor.hide();
            default:
                explosionOptions.hide();
                break;
        }
        /*
        if ((this.animateItem.explosion) && (this.animateItem.animName === "Arrow")) {
            explosionOptions.show();
        } else {
            explosionOptions.hide();
        }
        */
        switch (true) {
            case (this.animateItem.animName === "Arrow"):
            case (this.item.name.includes("bow")):
                animateExplosion.show();
                break;
            default:
                animateExplosion.hide();
        }
        /*
        if(this.animateItem.animName === "Arrow") {
            animateExplosion.show();
        } else {
            animateExplosion.hide();
        }
        
        if((this.animateItem.animType === "Explosives (Template)") || (this.animateItem.animType === "Explosives (Target)")) {

        }
        */


        /*
        if((this.animateItem.animType === 't1') && (this.animateItem.override)) {
            animateName.show();
        } else {
            animateName.hide();
        }
        */
        /*
        // duplicate this, then use a switch to set color HTML
        let animateColor = this.html.find('.animation-color');
        if(this.animateItem.enabled) {
            animateColor.show();
        } else {
            animateColor.hide();
        }
        */

        if (this.editable) {
            this.handleEvents();
        } else {
            this.html.find('input').prop("disabled", true);
            this.html.find('select').prop("disabled", true);
        }

        this.app.setPosition();

        if (this.activate && !this.isActive()) {
            this.app._tabs[0].activate("autoanimations");
            this.activate = false;
        }
    }

    handleEvents() {
        
        this.html.find('.animation-tab-contents input[type="checkbox"]').change(evt => {
            this.activate = true;
        });
        
        this.html.find('.animation-tab-contents select').change(evt => {
            this.activate = true;
        });
        
        this.html.find('input[name="flags.autoanimations.killAnim"]').click(evt => {
            this.animateItem.toggleEnabled(evt.target.checked);
            //this.render();
            //mergeDamnObject(this.item);
        });
        this.html.find('select[name="flags.autoanimations.animName"]').change(evt => {
            //this.animateItem.animName = evt.target.value;
            //this.activate = true;
        });

        this.html.find('select[name="flags.autoanimations.animType"]').change(evt => {
            //this.activate = true;
        })

        this.html.find('select[name="flags.autoanimations.color"]').change(evt => {
            //this.animateItem.color = evt.target.value;
            //this.activate = true;
        });

        this.html.find('input[name="flags.autoanimations.override"]').click(evt => {
            //this.animateItem.toggleEnabled(evt.target.unchecked);
            //this.activate = true;
        });

        this.html.find('input[name="flags.autoanimations.explosion"]').click(evt => {
            //this.animateItem.toggleEnabled(evt.target.value);
            //this.activate = true;
        });

        this.html.find('select[name="flags.autoanimations.explodeVariant"]').change(evt => {
            //this.animateItem.color = evt.target.value;
            //this.activate = true;
        });

        this.html.find('select[name="flags.autoanimations.explodeColor"]').change(evt => {
            //this.animateItem.color = evt.target.value;
            //this.activate = true;
        });

        this.html.find('select[name="flags.autoanimations.explodeRadius"]').change(evt => {
            //this.animateItem.color = evt.target.value;
            //this.activate = true;
        });


    }

    isActive() {
        return $(this.html).find('a.item[data-tab="autoanimations"]').hasClass("active");
    }
}