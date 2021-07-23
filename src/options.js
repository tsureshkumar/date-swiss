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

import css from "./app.css";

const mustache = require("mustache");

const Backbone = require("backbone");
const $ = require("jquery");
import _ from "lodash";

import { format, compareAsc } from "date-fns";

import { getOtherLive, getPreferredLive } from "./config";

import { StatusModel, FormatModel, ListCollection } from "./models";
import { StatusView, FormatView, ListView, SaveControls } from "./views";

const api = window.browser || window.chrome;
const debug = console.debug;

const dispatcher = _.clone(Backbone.Events);

let listCollection = new ListCollection(null, { name: "all", dispatcher });
let preferredCollection = new ListCollection(null, { name: "preferred", dispatcher });
let statusModel = new StatusModel();

let listView = new ListView({ collection: listCollection, title: "Other Formats" });
let preferredFormatsView = new ListView({
    collection: preferredCollection,
    title: "Preferred Formats (drag and drop to re-order)",
});
let saveControls = new SaveControls({ dispatcher });
let statusView = new StatusView({ model: statusModel, dispatcher });

dispatcher.on("move:item:collection", function (curCol, cur, otherCol, other) {
    let a = curCol === "all" ? listCollection : preferredCollection;
    let b = otherCol === "all" ? listCollection : preferredCollection;

    let m = b.get(other);
    m = b.remove(m);
    let t = a.get(cur);
    a.add(m, { at: a.indexOf(t) });
});

dispatcher.on("options:save:clicked", function () {
    let pref = preferredCollection.map((x) => x.attributes.format);
    let all = listCollection.map((x) => x.attributes.format);
    api.storage.sync.set({ "date-swiss-config": { pref: pref, other: all } }, function () {
        dispatcher.trigger("status:message", "configuration saved!");
    });
});

function reload() {
    getPreferredLive()
        .then((formats) => {
            for (let v of formats) {
                preferredCollection.add({ id: v, format: v });
            }
        })
        .catch(() => {});
    getOtherLive()
        .then((other) => {
            for (let v of other) {
                listCollection.add({ id: v, format: v });
            }
        })
        .catch(() => {});
}

dispatcher.on("options:newfmt", function (fmt) {
    preferredCollection.add({ format: fmt });
});

dispatcher.on("options:reset:clicked", function () {
    api.storage.sync.remove("date-swiss-config");
    listCollection.reset();
    preferredCollection.reset();
    reload();
    dispatcher.trigger("status:message", "configuration reset!");
});

dispatcher.on("status:message", function (msg) {
    console.log("got status:message on dispatcher");
    statusModel.set("message", msg);
});

$(document).ready(function () {
    $(".container").append(statusView.el);
    statusView.render();

    $(".container").append(saveControls.el);
    saveControls.render();

    $(".container").append(preferredFormatsView.el);
    preferredFormatsView.render();

    $(".container").append(listView.el);
    listView.render();


    reload();

});
