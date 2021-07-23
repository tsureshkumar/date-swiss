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

import { insertDate } from "../utils";

let page2 = `<div class="flex-grow flex flex-col ">
 <h2>Choose a format</h2>
 {{#preferred}}
  <div class="bg-gray-400 hover:bg-gray-200 flex-grow p-1">
   <a class="rounded-t" data-datefmt="{{text}}">{{text}}</a>
   </div>
 {{/preferred}}
 <hr/>
 {{#other}}
  <div class="bg-gray-400 hover:bg-gray-200 flex-grow p-1">
   <a class="rounded-t" data-datefmt="{{text}}">{{text}}</a>
   </div>
 {{/other}}
</div>`;

export let Page2View = Backbone.View.extend({
    tagName: "div",
    events: {
        "click a": "onClick",
    },
    initialize: function ({ dtype, dispatcher }) {
        this.dtype = dtype;
        this.dispatcher = dispatcher;
        this.listenTo(this.collection, "change", this.render);
        this.listenTo(this.collection, "add", this.render);
    },
    render: function () {
        let m = this.collection.get(this.dtype);
        console.log(this.dtype, m);
        if (m) {
            let html = mustache.render(page2, m.attributes);
            this.$el.html(html);
        }
        return this;
    },
    onClick: function (ev) {
        let item = $(ev.target);
        insertDate(item.data("datefmt"), this.dtype, this.dispatcher);
        console.log("inserted");
    },
});
