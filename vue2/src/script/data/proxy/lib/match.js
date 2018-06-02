let match = function (combineData, keyData) {
    var formateData = {};
    var i = 0;
    var formate = function (str, combineData) {
        var arr = str.split('.');
        var key = arr[0].match(/data\[(\d+)\]/);
        key = key ? key[1] : undefined;
        var value = (key !== undefined) ? combineData[key] : combineData[str];
        for (let i = 1; i < arr.length; i++) {
            if (value === undefined) {
                continue;
            }
            value = value[arr[i]];
        }

        return value;
    };
    var clone = function (obj) {
        function Clone() {}
        Clone.prototype = obj;
        var o = new Clone();
        for (var a in o) {
            if (typeof o[a] === "object") {
                o[a] = clone3(o[a]);
            }
        }
        return o;
    };
    var walk = function (keyData, combineData) {
        for (var k in keyData) {
            if (keyData[k] instanceof Array) {
                var arr = formate(keyData[k][0], combineData);
                var keys = keyData[k][1];
                keyData[k][2] = [];
                if (arr) {
                    for (var i = 0; i < arr.length; i++) {
                        keyData[k][2].push(walk(clone(keys), arr[i]));
                    }
                }
                keyData[k] = keyData[k][2];
            } else if (keyData[k] instanceof Object) {
                walk(keyData[k], combineData);
            } else {
                if (keyData === undefined || keyData[k] === undefined) {
                    continue;
                }
                keyData[k] = formate(keyData[k], combineData);
                if (keyData[k] === undefined) {
                    delete keyData[k];
                }
            }
        }
        return keyData;
    };
    formateData = walk(keyData, combineData);

    return keyData;
};

export default match;
