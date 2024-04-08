
if (typeof my_JSON !== 'object') {
    my_JSON = {};
}

(function () {
    'use strict';

    function formatNumber(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toMyJSON !== 'function') {

        Date.prototype.toMyJSON = function () {

            return isFinite(this.valueOf())
                ? this.getUTCFullYear()     + '-' +
                    formatNumber(this.getUTCMonth() + 1) + '-' +
                    formatNumber(this.getUTCDate())      + 'T' +
                    formatNumber(this.getUTCHours())     + ':' +
                    formatNumber(this.getUTCMinutes())   + ':' +
                    formatNumber(this.getUTCSeconds())   + 'Z'
                : null;
        };

        String.prototype.toMyJSON      =
            Number.prototype.toMyJSON  =
            Boolean.prototype.toMyJSON = function () {
                return this.valueOf();
            };
    }

    var my_cx,
        my_escapable,
        my_gap,
        my_indent,
        my_meta,
        my_rep;


    function quote(string) {

        my_escapable.lastIndex = 0;
        return my_escapable.test(string) ? '"' + string.replace(my_escapable, function (a) {
            var c = my_meta[a];
            return typeof c === 'string'
                ? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function stringify(key, holder) {

        var i,
            k,
            v,
            length,
            mind = my_gap,
            partial,
            value = holder[key];

        if (value && typeof value === 'object' &&
                typeof value.toMyJSON === 'function') {
            value = value.toMyJSON(key);
        }

        if (typeof my_rep === 'function') {
            value = my_rep.call(holder, key, value);
        }

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':
            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':
            return String(value);

        case 'object':
            if (!value) {
                return 'null';
            }

            my_gap += my_indent;
            partial = [];

            if (Object.prototype.toString.apply(value) === '[object Array]') {
                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = stringify(i, value) || 'null';
                }

                v = partial.length === 0
                    ? '[]'
                    : my_gap
                    ? '[\n' + my_gap + partial.join(',\n' + my_gap) + '\n' + mind + ']'
                    : '[' + partial.join(',') + ']';
                my_gap = mind;
                return v;
            }

            if (my_rep && typeof my_rep === 'object') {
                length = my_rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof my_rep[i] === 'string') {
                        k = my_rep[i];
                        v = stringify(k, value);
                        if (v) {
                            partial.push(quote(k) + (my_gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {
                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = stringify(k, value);
                        if (v) {
                            partial.push(quote(k) + (my_gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

            v = partial.length === 0
                ? '{}'
                : my_gap
                ? '{\n' + my_gap + partial.join(',\n' + my_gap) + '\n' + mind + '}'
                : '{' + partial.join(',') + '}';
            my_gap = mind;
            return v;
        }
    }

    if (typeof my_JSON.stringify !== 'function') {
        my_escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        my_meta = {
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        };
        my_JSON.stringify = function (value, replacer, space) {
            var i;
            my_gap = '';
            my_indent = '';
            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    my_indent += ' ';
                }
            } else if (typeof space === 'string') {
                my_indent = space;
            }
            my_rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('my_JSON.stringify');
            }
            return stringify('', {'': value});
        };
    }

    if (typeof my_JSON.parse !== 'function') {
        my_cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        my_JSON.parse = function (text, reviver) {
            var j;

            function walk(holder, key) {
                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                           

                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }




            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {



                j = eval('(' + text + ')');


                return typeof reviver === 'function'
                    ? walk({'': j}, '')
                    : j;
            }



            throw new SyntaxError('JSON.parse');
        };
    }
}());
