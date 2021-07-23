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
import _ from "lodash";
const $ = require("jquery");

import { format, compareAsc } from "date-fns";

const api = window.browser || window.chrome;


export function insertDate(datefmt, cmdtype, dispatcher) {
    if(!datefmt || !cmdtype) return;
    console.log(datefmt, cmdtype);
    let dv = format(new Date(), datefmt);
    console.log("at plugin page", dv, datefmt);
    if (cmdtype === "insert_date") {
        const color = "red";
        api.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            api.tabs.executeScript(tabs[0].id, {
                code: `
            function insertTextAtCaret(text) {
                let element = document.activeElement;
                if(element instanceof HTMLInputElement) {
                   element.value += text;
                } else {
                    var sel, range;
                    if (document.selection && document.selection.createRange) {
                        document.selection.createRange().text = text;
                    } else if (window.getSelection) {
                        sel = window.getSelection();
                        if (sel.getRangeAt && sel.rangeCount) {
                            range = sel.getRangeAt(0);
                            range.deleteContents();
                            range.insertNode( document.createTextNode(text) );
                            console.log('inserted');
                        }
                        console.log('finished');
                    }
                }
            }
            insertTextAtCaret("${dv}");
            console.log('at content page', "${dv}");
                `,
            });
        });
        dispatcher.trigger(
            "status:message",
            `date inserted into document at cursor ${dv}`
        );
        console.log("clicked");
    } else {
        console.log("copying text into clipboard");
        dispatcher.trigger("setdate", dv);
    }
    return true;
}
