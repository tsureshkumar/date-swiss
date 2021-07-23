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

export let CopyView = Backbone.View.extend({
    tagName: "div",
    className: "block absolute bg-gray-300",
    initialize: function (options) {
        this.dispatcher = options.dispatcher;
        this.listenTo(this.model, "change", this.copy);
    },
    render: function () {
        $(this.el).html(
            `<input type='text' id='copy' style="position: absolute; left: -1000px; top: -1000px" value='${this.model.attributes.date}'/>`
        );
    },
    copy: function () {
        let el = $(this.el);
        if (el) {
            el = el.find("#copy");
            if (el) {
                console.log("copying item", this.model.attributes.date, this.model);
                el.val(this.model.attributes.date);
                el.show();
                el.select();
                document.execCommand("copy");
                console.log(`date copied into clipboard: ${this.model.attributes.date}`);
                this.dispatcher.trigger("status:message", `date copied into clipboard ${this.model.attributes.date}`);
            }
        }
    },
});
