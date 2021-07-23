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

const Backbone = require("backbone");
const $ = require("jquery");
const mustache = require("mustache");
import _ from "lodash";

import { format, compareAsc } from "date-fns";
import { getOtherLive, getPreferredLive } from "./config";
import { insertDate } from "./utils";

import { StatusModel, CopyModel, MenuItem, MenuCollection } from "./models";
import { StatusView, CopyView, Page1View, Page2View } from "./views";

const dispatcher = _.clone(Backbone.Events);

let menus = new MenuCollection([]);
let copyModel = new CopyModel();
let statusModel = new StatusModel();

let copyView = new CopyView({ model: copyModel, dispatcher });
let statusView = new StatusView({ model: statusModel, dispatcher });

dispatcher.on("setdate", function (dv) {
    console.log("setting model", dv);
    copyModel.set("date", dv);
});
dispatcher.on("status:message", function (msg) {
    console.log("got status:message on dispatcher");
    statusModel.set("message", msg);
});


let AppRouter = Backbone.Router.extend({
    routes: {
        "": "home",
        home: "home",
        copy_date: "copyDate",
        insert_date: "insertDate",
    },
    home: function () {
        $(".container").empty();
        let page1View = new Page1View({ collection: menus , dispatcher});
        $(".container").append(page1View.el);
        page1View.render();
    },
    copyDate: function () {
        console.log("changed", menus);
        let page2View = new Page2View({ collection: menus, dtype: "copy_date", dispatcher });
        $(".container").empty();
        $(".container").append(page2View.el);
        page2View.render();
    },
    insertDate: function () {
        $(".container").empty();
        let page2View = new Page2View({ collection: menus, dtype: "insert_date", dispatcher });
        $(".container").append(page2View.el);
        page2View.render();
    },
});
let app = new AppRouter();

$(document).ready(function () {
    $("body").append(statusView.el);
    statusView.render();
    $("body").append(copyView.el);
    copyView.render();

    //m.set("children", [{ link: "#insert_date", text: "MM/dd/yyyy", cmdtype: "insert" }]);
    getPreferredLive().then((preferred) => {
        getOtherLive().then((other) => {
            menus.add({
                id: "copy_date",
                link: "copy_date",
                text: "Copy Date",
                preferred: _.map(preferred, (x) => ({ link: "#copy_date", text: x, cmdtype: "copy" })),
                other: _.map(other, (x) => ({ link: "#copy_date", text: x, cmdtype: "copy" })),
            });
            menus.add({
                id: "insert_date",
                link: "insert_date",
                text: "Insert Date",
                preferred: _.map(preferred, (x) => ({ link: "#copy_date", text: x, cmdtype: "copy" })),
                other: _.map(other, (x) => ({ link: "#copy_date", text: x, cmdtype: "copy" })),
            });
        });
    });
    console.log("popup loaded");

    Backbone.history.start();
});
