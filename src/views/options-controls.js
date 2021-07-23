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
const mustache = require("mustache");
import _ from "lodash";

let controlsTemplate = `
<div class="flex flex-row p-2 space-x-2">
  <input class="border-2 border-gray-300" type="text" value="" id="newFormt" placeholder="dd/MM/YYYY"/>
  <button class="btn-blue" id="btnnewfmt">Add Custom Format</button>
  <button class="btn-blue" id="save">Save Config</button>
  <button class="btn-blue" id="reset">Reset Config</button>
</div>
`;

export let SaveControls = Backbone.View.extend({
    tagName: "div",
    initialize: function ({ dispatcher }) {
        this.dispatcher = dispatcher;
    },
    events: {
        "click #save": "onSave",
        "click #reset": "onReset",
        "click #btnnewfmt": "onAddNewFmt",
    },
    render: function () {
        this.$el.html(mustache.render(controlsTemplate, null));
        return this;
    },
    onSave: function () {
        this.dispatcher.trigger("options:save:clicked");
    },
    onReset: function () {
        this.dispatcher.trigger("options:reset:clicked");
    },
    onAddNewFmt: function () {
        this.dispatcher.trigger("options:newfmt", this.$el.find('#newFormt').val());
    }
});
