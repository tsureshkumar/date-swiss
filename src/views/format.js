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

export let FormatView = Backbone.View.extend({
    tagName: "div",
    events: {
        "click .btn-delete": "onDelete",
    },
    onDelete: function (evt) {
        let p = $(evt.target).closest(".drag");
        if (p.length > 0) {
            let idx = $(p[0]).data("format");
            //this.model.collection.removeAt(idx);
            console.log("removing", idx);
            this.model.collection.remove(this.model.collection.get(idx));
        }
    },
    initialize: function ({ dispatcher, idx }) {
        this.dispatcher = dispatcher;
        this.idx = idx;
        this.listenTo(this.model, "change", this.render);
    },
    render: function () {
        let dragStartHandler = function (ev) {
            let oe = ev;
            if (ev.originalEvent) oe = ev.originalEvent;
            oe.dataTransfer.setData("format", $(ev.target).data("format"));
            oe.dataTransfer.setData("idx", $(ev.target).data("idx"));
            oe.dataTransfer.setData("collection", $(ev.target).data("collection-name"));
        };
        let dragEnterHandler = function (event) {
            console.log($(event.target).attr("class"));
            if (!$(event.target).hasClass("drag")) return false;
            $(event.target).addClass("bg-purple-200");
            //event.preventDefault();
        };
        let dragOverHandler = function (event) {
            event.preventDefault();
            $(event.target).addClass("bg-gray-200");
        };
        let dragLeaveHandler = function (event) {
            //event.preventDefault();
            $(event.target).removeClass("bg-gray-200");
        };
        let dropHandler = function (event) {
            event.preventDefault();
            let dropOn = $(event.target);
            let otherIdx = event.originalEvent.dataTransfer.getData("format");
            let otherCollection = event.originalEvent.dataTransfer.getData("collection");
            let curIdx = dropOn.data("format");
            let curCollection = dropOn.data("collection-name");
            console.log("moving ", otherIdx, " over ", curIdx);
            if (curCollection && curIdx && otherCollection && otherIdx) {
                this.model.collection.moveItem(curCollection, curIdx, otherCollection, otherIdx);
            }
            $(event.target).removeClass("bg-gray-200");
            $(event.target).removeClass("bg-purple-200");
        };
        let dragEnd = function (ev) {};

        this.$el.empty();
        let el = $(
            `
<div
  class="table drag"
  data-collection-name="${this.model.collection.name}"
  data-idx="${this.idx}"
  data-format="${this.model.attributes.format}"
>
  <div class="table-row">
    <div class="btn-delete table-cell items-end">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      </svg>
    </div>
    <div
      class="tabel-cell"
      id="${this.model.attributes.format}"
      data-collection-name="${this.model.collection.name}"
      data-idx="${this.idx}"
      data-format="${this.model.attributes.format}"
    >
      ${this.model.attributes.format}
    </div>
  </div>
</div>
            `
        );
        this.$el.append(el);
        let dragItem = this.$el.find(".drag");
        //let dragItem = this.$el;
        if (!dragItem) alert("not draggable");
        dragItem.attr("draggable", "true");
        dragItem.bind("dragstart", dragStartHandler.bind(this));
        dragItem.bind("dragover", dragOverHandler.bind(this));
        dragItem.bind("dragenter", dragEnterHandler.bind(this));
        dragItem.bind("dragleave", dragLeaveHandler.bind(this));
        dragItem.bind("drop", dropHandler.bind(this));
        return this;
    },
});
