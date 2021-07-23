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

let page1 = `<div class="flex-grow flex flex-col ">
 {{#.}}
  <div class="bg-gray-400 hover:bg-gray-200 flex-grow p-1">
   <a class="rounded-t" href="#{{link}}" data-link={{link}}>{{text}}</a>
   </div>
 {{/.}}
</div>`;

export let Page1View = Backbone.View.extend({
    tagName: "div",
    initialize: function () {
        this.listenTo(this.collection, 'change', this.render);
        this.listenTo(this.collection, 'add', this.render);
    },
    render: function () {
        let items = this.collection.map((x) => ({ link: x.attributes.link, text: x.attributes.text }));
        console.log(items);
        let html = mustache.render(page1, items);
        this.$el.html(html);
        return this;
    },
});
