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

import { preferred, formats } from "./dateutils";

const api = window.browser || window.chrome;

let config = {
    "date-swiss-config": {
        pref: preferred,
        other: formats,
    },
};

export function getPreferred() {
    return config["date-swiss-config"].pref;
}
export function getOther() {
    return config["date-swiss-config"].other;
}
export function getPreferredLive() {
    return new Promise((resolve, reject) => {
        if(!api || !api.storage) {
            resolve(getPreferred());
            return;
        }
        api.storage.sync.get("date-swiss-config", function (result) {
            if (api.runtime.lastError !== undefined) {
                reject(api.runtime.lastError);
            } else {
                if(!result || !result["date-swiss-config"]) resolve(getPreferred());
                else {
                    config = result;
                    resolve(result["date-swiss-config"].pref);
                }
            }
        });
    });
}
export function getOtherLive() {
    return new Promise((resolve, reject) => {
        if(!api || !api.storage) {
            resolve(getOther());
            return;
        }
        api.storage.sync.get("date-swiss-config", function (result) {
            if (api.runtime.lastError !== undefined) {
                reject(api.runtime.lastError);
            } else {
                if(!result || !result["date-swiss-config"]) resolve(getOther());
                else {
                    config = result;
                    resolve(result["date-swiss-config"].other);
                }
            }
        });
    });
}

export function loadConfig(dispatcher) {
    api.storage.sync.get("date-swiss-config", function (result) {
        config = result;
        dispatcher.trigger("config:loaded");
    });
}

export function saveConfig(dispatcher, pref, all) {
    api.storage.sync.set({ "date-swiss-config": { pref: pref, other: all } }, function () {
        dispatcher.trigger("status:message", "configuration saved!");
    });
}
