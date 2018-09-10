/**
 * Created by jiachenpan on 16/11/18.
 */

/* 是否是公司邮箱*/
export function isWscnEmail(str) {
    const reg = /^[a-z0-9](?:[-_.+]?[a-z0-9]+)*@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/i;
    if (str) {
        return reg.test($.trim(str));
    }
    return true;
}

/* 合法uri*/
// export function validateURL(textval) {
//   const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
//   return urlregex.test(textval);
// }

/* 小写字母*/
export function validateLowerCase(str) {
    const reg = /^[a-z]+$/;
    return reg.test(str);
}

/* 验证key*/
// export function validateKey(str) {
//     var reg = /^[a-z_\-:]+$/;
//     return reg.test(str);
// }

/* 大写字母*/
export function validateUpperCase(str) {
    const reg = /^[A-Z]+$/;
    return reg.test(str);
}

//验证手机号和固定电话
export function validateTel(rule, value, callback) {
    var reg = /^[1][358]\d{9}$/;  //验证手机号码 13,15,18开头的是一位电话号
    var m = /^\d{3}-\d{8}|\d{4}-\d{7}$/;//验证电话号码为7-8位数字并带有区号
    if (value === '') {
        callback()
    } else {
        if (!reg.test(value) && !m.test(value)) {
            callback(new Error('请输入正确号码'));
        } else {
            callback()
        }

    }
}

/* 大小写字母*/
export function validatAlphabets(str) {
    const reg = /^[A-Za-z]+$/;
    return reg.test(str);
}

export function ValidateEmail(rule, value, callback) {
    if (value === '') {
        callback()
    } else {
        if (!isWscnEmail(value)) {
            callback(new Error('请输入正确的合法邮箱'));
        } else {
            callback();
        }
    }
}

export function ValidatePass(rule, value, callback) {
    var regex = new RegExp('(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{6,30}');
    if (!regex.test(value)) {
        callback(new Error('同时包含字母、数字、特殊字符，且长度为6~30字符'));
    } else {
        callback();
    }
}

export function ValidateName(rule, value, callback) {
    value = value.trim()
    if (value.length < 1) {
        callback(new Error('请输入名称，名称不能为纯空格'));
    } else {
        callback();
    }
}

export function ValWcMenuName(rule, value, callback) {
    value = value.trim()
    if (value.length < 1) {
        callback(new Error('请输入名称，名称不能为纯空格'));
    } else if (strActLength(value) > 16) {
        callback(new Error('长度不可超过8字符'));
    } else {
        callback();
    }
}

function strActLength(str) {
    ///<summary>获得字符串实际长度，中文2，英文1</summary>
    ///<param name="str">要获得长度的字符串</param>
    var realLength = 0, len = str.length, charCode = -1;
    for (var i = 0; i < len; i++) {
        charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128) realLength += 1;
        else realLength += 2;
    }
    return realLength;
};

export function ValidateNumber(rule, value, callback) {
    const reg = /^[0-9]\d*$/
    if (value.length < 1) {
        callback(new Error('请输入名称，名称不能为纯空格'));
    } else if (!reg.test(value) || value < 0) {
        callback(new Error('请输入一个非负整数'));
    } else {
        callback();
    }
};

export function ValidatePercentage(rule, value, callback) {
    const reg = /^\d+(\.\d+)?$/

    if (value.length < 1) {
        callback(new Error('请输入名称，名称不能为纯空格'));
    } else if (!reg.test(value) || value < 0) {
        callback(new Error('请输入一个0-100之间的数'));
    }
    if (value > 100) {
        callback(new Error('百分比不可超过100'));
    } else {
        callback();
    }

};

export function ValidateSkuNum(rule, value, callback) {
    value = value.trim()
    var num = Number.parseInt(value)
    const reg = /^[0-9]\d*$/
    if (value.length < 1) {
        callback(new Error('请输入名称，名称不能为纯空格'));
    } else if (!reg.test(value) || typeof(num) !== 'number' || num < 1) {
        callback(new Error('请输入一个1-100000000之间的正整数'));
    } else if (num > 100000000) {
        callback(new Error('不可超过100000000'));
    } else {
        callback();
    }

};

export function ValidateIP(rule, value, callback) {
    const reg = /^(([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))\.)(([0-9]|([0-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))\.){2}([0-9]|([0-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))$/;
    if (value.length < 1) {
        callback(new Error('请输入名称，名称不能为纯空格'));
    } else if (!reg.test(value)) {
        callback(new Error('请输入正确的IP地址'));
    } else {
        callback()
    }
};

export function ValidatePort(rule, value, callback) {
    const reg = /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;
    if (value.length < 1) {
        callback(new Error('请输入名称，名称不能为纯空格'));
    } else if (!reg.test(value)) {
        callback(new Error('请输入正确的端口号'));
    } else {
        callback()
    }
};

export function validateURL(rule, value, callback) {
    const reg = /^(https?|ftp|http):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
    value = value.trim()
    if (value.length < 1) {
        callback();
    } else if (!reg.test(value)) {
        callback(new Error('请输入正确的链接地址'));
    } else {
        callback()
    }
}