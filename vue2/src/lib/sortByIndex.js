/**
 * Created by WeiWang on 2016/12/27.
 */
var pySegSort = function (arr, key, empty) {
    if (!String.prototype.localeCompare)
        return null;
    var letters = "*ABCDEFGHJKLMNOPQRSTWXYZ".split('');
    var zh = "阿八嚓哒妸发旮哈讥咔垃痳拏噢妑七呥扨它穵夕丫帀".split('');
    var segs = [];// 存放数据
    var py = [];// 存放首字母
    var res = [];
    var curr;

    for (var i = 0; i < letters.length; i++) {
        curr = {
            letter: letters[i],
            data: []
        };
        arr.forEach(function (item) {
            if ((!zh[i - 1] || zh[i - 1].localeCompare(item[key]) <= 0) && item[key].localeCompare(zh[i]) == -1) {
                curr.data.push(item);
            }
        });
        if (empty || curr.data.length) {
            py.push(letters[i]);
            segs.push(curr);
            res.push({
                label: letters[i],
                data: curr.data
            });
            curr.data.sort(function (a, b) {
                return a[key].localeCompare(b[key]);
            });
        }
    }

    return res;
};

module.exports = pySegSort;
