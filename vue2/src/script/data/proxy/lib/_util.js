// 根据属性映射生成新对象或数组, propMap: old=>new  new可为属性名，带修饰符%%，普通字符串，普通值
function _gen_by_prop(obj, propMap) {
	if (isEmpty(obj)) {
		return {};
	}
	let newObj = {};
	if (_isArray(obj)) {
		newObj = [];
		obj.forEach(function (o) {
			newObj.push(_map(o));
		});
	} else {
		newObj = _map(obj);
	}

	function _map(cur_obj) {
		let new_obj = {};
		for (let i in propMap) {
			let prop = propMap[i];

			let midVal = _hasProp(cur_obj, propMap[i]) ? cur_obj[propMap[i]] : '';
			let ignore = false;
			if (typeof prop === 'string') {
				if (/\%\%/.test(prop)) {
					let t = ('' + prop).split(/\%\%/),
						realProp = t[0],
						qualifier = t[1],
						value = cur_obj[realProp];
					prop = realProp;
					if (qualifier === 'str') { // 有的需要直接写字符串
						midVal = prop;
						ignore = true;
					}
					if (qualifier === 'intToStr') { // 有的需要数字转字符串
						midVal = value + '';
					}
					var _matchEq = qualifier.match(/eq\((.*)\)/);
					if (_matchEq) { // 有的需要判断相等
						midVal = (value == _matchEq[1]); // 非严格等于
					}
					if (qualifier === 'date') { // 有的需要格式化时间戳
						midVal = _format(value)
					}
					if (qualifier === 'strToArr') { // 有的需要把'1,2'转['1', '2']
						midVal = _strToArr(value);
					}
					if (qualifier === 'exp') { // 复杂的的需要写表达式
						let exp = realProp;
						if (/\_this/.test(exp)) { // 需要当前对象，_this导出
							exp = exp.replace(/\_this/g, 'cur_obj');
						}
						ignore = true;
						midVal = eval(exp);
					}
				}
				if (i.indexOf('\.') > 0) { // {'a.b': c}写法 从{a: {b: b的值 }}映射成 {a: {b: c的值}}
					let tmp = i.split('\.'),
						p = tmp[0],
						n = tmp[1];
					if (!_hasProp(new_obj, p)) {
						new_obj[p] = {};
					}
					new_obj[p][n] = _hasProp(cur_obj, prop) || ignore ?
						midVal : prop;
				} else {
					new_obj[i] = _hasProp(cur_obj, prop) || ignore ?
						midVal : '';
				}
			} else {
				new_obj[i] = prop; // 非字符串 直接求值， 如1 true
			}
		}

		return new_obj;
	}

	return newObj;

	function _isArray(object) {
		return object && typeof object === 'object' && Array == object.constructor;
	}

	function _hasProp(object, p) {
		return Object.prototype.hasOwnProperty.call(object, p);
	}

	function _format(d) {
		return new Date(d).format('yyyy-MM-dd')
	}

	function _strToArr(a) {
		return a.split(',').map(function (i) {
			return i + ''
		});
	}

	function isEmpty(obj) {
		for (var name in obj) {
			return false;
		}
		return true;
	};

}

// 封装fetch成promise 
function _pfetch(url, method, params) {
	return new Promise(function (resolve, reject) {
		fetch(url, {
			method: 'get'
		}, {}).then(function (res) {
			res.json().then(function (obj) {
				//if (obj.code === 200) {
					resolve(obj.data || obj);
				//} else {
					//reject( obj);
				//}
			});
		}, function (err) {
			reject(url+ err);
		});
	})
}
export {
	_gen_by_prop,
	_pfetch
}

Date.prototype.format = function (format) {
	var date = {
		"M+": this.getMonth() + 1,
		"d+": this.getDate(),
		"h+": this.getHours(),
		"m+": this.getMinutes(),
		"s+": this.getSeconds(),
		"q+": Math.floor((this.getMonth() + 3) / 3),
		"S+": this.getMilliseconds()
	};
	if (/(y+)/i.test(format)) {
		format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
	}
	for (var k in date) {
		if (new RegExp("(" + k + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
		}
	}
	return format;
}