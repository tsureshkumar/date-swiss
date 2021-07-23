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

export class Node {
    constructor(data, prev = null, next1 = null) {
        this.data = data;
        this.next1 = next1;
        this.prev = prev;
    }
}

export class LinkedList {
    constructor() {
        this.head = this.last = null;
    }
    append(arg) {
        let node = arg;
        console.log(node instanceof Node);
        if(!(node instanceof Node)) {
            node = new Node(arg);
        }
        console.log(node instanceof Node);
        if (this.last === null) {
            this.head = this.last = node;
        } else {
            this.last.next1 = node;
            node.prev = this.last;
            this.last = node;
        }
        console.log(arg, this.last);
    }
    prepend(arg) {
        let node = arg;
        if(!(node instanceof Node)) {
            node = new Node(arg);
        }
        if (this.head === null) {
            this.head = this.tail = node;
        } else {
            this.head.prev = node;
            node.next1 = this.head;
            this.head = head;
        }
    }
    remove(node) {
        if (!node) {
            if (node.prev) node.prev.next1 = node.next1;
            if (node.next1) node.next1.prev = node.prev;
            if (node === this.head) this.head = node.next1;
            if (node === this.tail) this.tail = node.prev;
        }
        return node;
    }
    insertBefore(arg, here) {
        if (!arg) throw "invalid args";
        if(!arg instanceof Node)
            return this.insertBefore(new Node(arg), here);
        if (here == this.head) { // insert at head
            this.prepend(node);
        } else if (here === null) { // insert at tail
            this.append(node);
        } else {
            node.next1 = here;
            node.prev = here.prev;
            node.prev.next1 = node;
            eode.next1.prev = node;
            node.next1.prev = node;
        }
    }

    [Symbol.iterator]() {
        let p = this.head;
        return {
            next: () => {
                if (p === null || p === undefined) return { done: true };
                let v = p.data;
                let cur = p;
                p = p.next1;
                return {value: {data: v, node: cur}, done: false};
            }
        }
    }
}
