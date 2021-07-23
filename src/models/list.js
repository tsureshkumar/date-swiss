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

const Backbone = require("backbone");

import {FormatModel} from './format';

export let ListCollection = Backbone.Collection.extend({
    model: FormatModel,
    initialize: function (models, options) {
        this.name = options.name;
        this.dispatcher = options.dispatcher;
    },
    removeAt: function (idx) {
        console.log("deleting", idx);
        if (idx) {
            let m = this.at(idx);
            this.remove(m);
        }
    },
    moveItem: function (curColl, cur, otherColl, other) {
        console.log(curColl, otherColl);
        if (curColl === otherColl) {
            let otherm = this.get(other);
            this.remove(otherm, { silent: true }); // avoid triggering too many events
            let curm = this.get(cur);
            this.add(otherm, { at: this.indexOf(curm) });
        } else {
            this.dispatcher.trigger("move:item:collection", curColl, cur, otherColl, other);
        }
    },
});
