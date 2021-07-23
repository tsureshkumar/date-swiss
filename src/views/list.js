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

import {FormatView} from './format';

export let ListView = Backbone.View.extend({
    tagName: "div",
    initialize: function ({title, dispatcher}) {
        this.listenTo(this.collection, "add", _.debounce(this.render.bind(this), 127));
        this.listenTo(this.collection, "remove", _.debounce(this.render.bind(this), 127));
        this.listenTo(this.collection, "reset", _.debounce(this.render.bind(this), 127));
        this.listenTo(this.collection, "change", _.debounce(this.render.bind(this), 127));
        this.title = title;
        this.dispatcher = dispatcher;
    },
    render: function () {
        this.$el.empty();
        let div = this.$el.append(`<div class="flex flex-col space-2 pt-5"></div>`);
        if(this.title) {
           div.append($(`<h2 class="text-black-300 bg-gray-300">${this.title}</h2>`));
        }
        this.collection.models.forEach((m, i) => {
            console.log('adding');
            let v = new FormatView({ model: m, idx: i, dispatcher: this.dispatcher });
            div.append(v.render().el);
        });
        //this.$el.html(this.template({models: this.collection.models, mkView: (m) => new FormatView({model:m})}));
        return this;
    },
});
