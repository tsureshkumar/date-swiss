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

// status component
export let StatusView = Backbone.View.extend({
    tagName: "div",
    className: "h-16 w-screen",
    initialize: function (options) {
        this.dispatcher = options.dispatcher;
        this.listenTo(this.model, "change", this.render);
    },
    render: function () {
        let msgel = this.$el.find('#msg');
        let msg = this.model.attributes.message || "";
        console.log('got a update status message', msgel);
        if(msgel.length == 0) {
            msgel = $(`<div id='msg'>${msg}</div>`);
            this.$el.append(msgel);
        }
        console.log('!got a update status message', msgel);
        msgel.html(msg);
        msgel.show("fast", function () {
            msgel.hide(3000);
        });
    },
});
