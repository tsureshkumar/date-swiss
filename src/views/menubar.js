/*

 Copyright 2021 tsureshkumar2000@gmail.com

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
     http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.

*/

import css from "../app.css";

const Backbone = require("backbone");
const $ = require("jquery");
import _ from "lodash";

import { format, compareAsc } from "date-fns";

const api = window.browser || window.chrome;

export let MenuBar = Backbone.View.extend({
    tagName: "div",
    className: "",
    initialize: function (options) {
        //this.listenTo(this.model, "change", this.render);
        this.collection.forEach((m) => {
            this.listenTo(m, "change", this.render);
        });
        this.dispatcher = options.dispatcher;
    },
    events: {
        "click .dateitem": "insertDate",
    },
    render: function () {
        console.log(this.collection);
        let items = [];
        function dfs(item, arr) {
            arr.push(
                `<li ${
                    item.children === undefined ? "" : "class='dropdown'"
                }><a class="dateitem rounded-t bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap ml-5 pl-5" data-datefmt="${
                    item.text
                }" data-cmdtype="${item.cmdtype}" href='${item.link}'>${item.text}</a>`
            );
            if (item.children !== undefined) {
                let sub = ['<ul class="dropdown-content absolute hidden text-gray-700 pt-1 pl-5 ml-5 -mt-10">'];
                _.each(item.children, (x) => dfs(x, sub));
                sub.push("</ul>");
                arr.push(_.join(sub, ""));
            }
            arr.push("</li>");
        }
        _.each(this.collection.models, (x) => {
            let sub = ['<ul class="dropdown-content block text-gray-700 pt-1">'];
            dfs({ link: x.attributes.link, text: x.attributes.text, children: x.attributes.children }, sub);
            sub.push("</ul>");
            items.push(_.join(sub, ""));
        });
        $(this.el).html(
            `
                  <div class='dropdown inline-flex relative'>
                  ${_.join(items, "")}
                  </div>
                  `
        );
    },
    insertDate(e) {
        console.log(e);
        let datefmt = $(e.currentTarget).data("datefmt");
        let cmdtype = $(e.currentTarget).data("cmdtype");
        let dv = format(new Date(), datefmt);
        console.log("at plugin page", dv);
        if (cmdtype === "insert") {
            const color = "red";
            api.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                api.tabs.executeScript(tabs[0].id, {
                    code: `
            function insertTextAtCaret(text) {
                let element = document.activeElement;
                if(element instanceof HTMLInputElement) {
                   element.value += text;
                } else {
                    var sel, range;
                    if (document.selection && document.selection.createRange) {
                        document.selection.createRange().text = text;
                    } else if (window.getSelection) {
                        sel = window.getSelection();
                        if (sel.getRangeAt && sel.rangeCount) {
                            range = sel.getRangeAt(0);
                            range.deleteContents();
                            range.insertNode( document.createTextNode(text) );
                            console.log('inserted');
                        }
                        console.log('finished');
                    }
                }
            }
            insertTextAtCaret("${dv}");
            console.log('at content page', "${dv}");
                `,
                });
            });
            this.dispatcher.trigger("status:message", `date inserted into document at cursor ${this.model.attributes.date}`);
            console.log("clicked");
        } else {
            console.log("copying text into clipboard");
            this.dispatcher.trigger("setdate", dv);
        }
        return false;
    },
});
