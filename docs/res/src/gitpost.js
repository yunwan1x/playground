$(document).ready(function () {
    const options = Object.assign(window.GT_CONFIG, {
        proxy: 'https://cors-anywhere.azm.workers.dev/https://github.com/login/oauth/access_token',
        sha: "",
        saving: false,
        path: "",
        posturl: "",
        editMode: true,
        _accessToke: "",
        user: "",
        content: ""
    })

    const loading = (loading) => {
        if (!loading) {
            $('#spinner-border').hide();
        } else {
            $('#spinner-border').show();
        }
    }

    const queryParse = (search = window.location.search) => {
        if (!search) return {}
        const queryString = search[0] === '?' ? search.substring(1) : search
        const query = {}
        queryString
            .split('&')
            .forEach(queryStr => {
                const [key, value] = queryStr.split('=')
                /* istanbul ignore else */
                if (key) query[decodeURIComponent(key)] = decodeURIComponent(value)
            })

        return query
    }
    const queryHash = (search = window.location.hash) => {
        if (!search) return {}
        const queryString = search[0] === '#' ? search.substring(1) : search
        const query = {}
        queryString
            .split('&')
            .forEach(queryStr => {
                const [key, value] = queryStr.split('=')
                /* istanbul ignore else */
                if (key) query[decodeURIComponent(key)] = decodeURIComponent(value)
            })

        return query
    }
    const dateFormat = function (date, fmt) {
        var o = {
            "M+": date.getMonth() + 1,                 //月份
            "d+": date.getDate(),                    //日
            "h+": date.getHours(),                   //小时
            "m+": date.getMinutes(),                 //分
            "s+": date.getSeconds(),                 //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds()             //毫秒
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    }
    const queryStringify = query => {
        const queryString = Object.keys(query)
            .map(key => `${key}=${encodeURIComponent(query[key] || '')}`)
            .join('&')
        return queryString
    }


    const axiosJSON = axios.create({
        headers: {
            'Accept': 'application/json'
        }
    })
    const axiosGithub = axios.create({
        baseURL: 'https://api.github.com',
        headers: {
            'Accept': 'application/json'
        }
    })

    axiosGithub.interceptors.request.use(function (config) {
        loading(true)
        return config;
    }, function (error) {
        // 对请求错误做些什么

        loading(false)
        return Promise.reject(error);
    });

// 添加响应拦截器
    axiosGithub.interceptors.response.use(function (response) {
        // 对响应数据做点什么
        loading(false)
        return response;
    }, function (error) {
        // 对响应错误做点什么
        loading(false)
        return Promise.reject(error);
    });


    const Base64 = {
        _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;
            input = Base64._utf8_encode(input);
            while (i < input.length) {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }
                output = output +
                    this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                    this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
            }
            return output;
        },
        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
            while (i < input.length) {
                enc1 = this._keyStr.indexOf(input.charAt(i++));
                enc2 = this._keyStr.indexOf(input.charAt(i++));
                enc3 = this._keyStr.indexOf(input.charAt(i++));
                enc4 = this._keyStr.indexOf(input.charAt(i++));
                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;
                output = output + String.fromCharCode(chr1);
                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }
            }
            output = Base64._utf8_decode(output);
            return output;
        },
        // private method for UTF-8 encoding
        _utf8_encode: function (string) {
            string = string.replace(/\r\n/g, "\n");
            var utftext = "";
            for (var n = 0; n < string.length; n++) {
                var c = string.charCodeAt(n);
                if (c < 128) {
                    utftext += String.fromCharCode(c);
                } else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                } else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
            }
            return utftext;
        },
        // private method for UTF-8 decoding
        _utf8_decode: function (utftext) {
            var string = "";
            var i = 0;
            let c2 = 0, c = 0, c1 = 0, c3 = 0;
            while (i < utftext.length) {
                c = utftext.charCodeAt(i);
                if (c < 128) {
                    string += String.fromCharCode(c);
                    i++;
                } else if ((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i + 1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                } else {
                    c2 = utftext.charCodeAt(i + 1);
                    c3 = utftext.charCodeAt(i + 2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }
            }
            return string;
        },

    }
    const defaultText = (type) => {
        return (
            `---
layout: post
title: 
categories: GitHub
description: description
keywords: Jekyll, GitHub Pages
topmost: false
---`)
    }

    const GT_ACCESS_TOKEN = 'GT_ACCESS_TOKEN'
    const GT_COMMENT = 'GT_COMMENT'

    const defaultAvatar = '<svg  viewBox="0 0 1024 1024" width="16" height="16" version="1.1" xmlns="http://www.w3.org/2000/svg"> <path d="M64 524C64 719.602 189.356 885.926 364.113 947.017 387.65799 953 384 936.115 384 924.767L384 847.107C248.118 863.007 242.674 773.052 233.5 758.001 215 726.501 171.5 718.501 184.5 703.501 215.5 687.501 247 707.501 283.5 761.501 309.956 800.642 361.366 794.075 387.658 787.497 393.403 763.997 405.637 743.042 422.353 726.638 281.774 701.609 223 615.67 223 513.5 223 464.053 239.322 418.406 271.465 381.627 251.142 320.928 273.421 269.19 276.337 261.415 334.458 256.131 394.888 302.993 399.549 306.685 432.663 297.835 470.341 293 512.5 293 554.924 293 592.81 297.896 626.075 306.853 637.426 298.219 693.46 258.054 747.5 262.966 750.382 270.652 772.185 321.292 753.058 381.083 785.516 417.956 802 463.809 802 513.5 802 615.874 742.99 701.953 601.803 726.786 625.381 750.003 640 782.295 640 818.008L640 930.653C640.752 939.626 640 948.664978 655.086 948.665 832.344 888.962 960 721.389 960 524 960 276.576 759.424 76 512 76 264.577 76 64 276.576 64 524Z"></path>\n</svg>'
    const isPhone = window.innerWidth < 500
    const loginButton = {
        name: "login",
        icon: "<div id='login'>登录 github</div>",
        click(element, vditor) {
        },
    }
    const cacheState={
        none:"#586069",
        cached:"#d81e06",
    }
    const clearCache = {
        name: "clear",
        tip: "清空缓存",
        hotkey: '⌘D',
        icon:'<svg t="1630746420909" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6134" xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="16"><defs><style type="text/css"></style></defs><path d="M871.9104 240.64v648.1152c0 59.776-54.784 108.0576-122.3424 108.0576H260.5824c-67.584 0-122.3424-48.384-122.3424-108.0576V240.64h733.6704zM390.144 422.912h-61.44v417.92h61.44V422.912z m294.912 0h-61.44v417.92h61.44V422.912zM660.48 25.6l61.4656 58.8032H906.24a30.72 30.72 0 0 1 30.72 30.72v56.192a30.72 30.72 0 0 1-30.72 30.72H107.52a30.72 30.72 0 0 1-30.72-30.72V115.1232a30.72 30.72 0 0 1 30.72-30.72h184.2944L353.2544 25.6H660.48z" p-id="6135" id="wy_cache" fill="#586069"></path></svg>',
        async click(element, vditor) {
            const success=await clearContentFromCache()
            if(success){
                window.location.reload()
            }
        },
    }
    const saveButton = {
        name: "save",
        tip: "保存",
        icon:'<svg t="1629634645921" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12174" width="32" height="32" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><style type="text/css"></style></defs><path d="M959.937 903.937c0 30.913-25.081 55.996-55.996 55.996L119.996 959.933C89.081 959.933 64 934.85 64 903.937l0-783.94C64 89.082 89.081 64 119.996 64l541.293 0c30.915 0 73.49 17.495 95.659 39.662l163.323 163.323c22.169 22.168 39.665 64.744 39.665 95.658L959.936 903.937zM885.273 885.27 885.273 362.644c0-11.079-9.916-34.998-17.494-42.583L703.874 156.157c-8.168-8.167-30.916-17.496-42.585-17.496l0 242.65c0 30.914-25.081 55.996-55.996 55.996L269.318 437.307c-30.915 0-55.996-25.082-55.996-55.996l0-242.65-74.662 0L138.66 885.27l74.662 0L213.322 642.626c0-30.917 25.081-55.996 55.996-55.996l485.3 0c30.913 0 55.996 25.079 55.996 55.996L810.614 885.27 885.273 885.27zM735.951 885.27 735.951 661.29 287.984 661.29 287.984 885.27 735.951 885.27zM586.629 157.328c0-9.918-8.748-18.667-18.666-18.667L455.971 138.661c-9.917 0-18.665 8.748-18.665 18.667l0 186.652c0 9.919 8.748 18.665 18.665 18.665l111.992 0c9.918 0 18.666-8.746 18.666-18.665L586.629 157.328z" p-id="12175" fill="#586069"></path></svg>',
        hotkey: '⌘S',
        async click(element, vditor) {
            if (options.saving) return
            if (isAdmin(options)) {
                options.saving = true;
                try {
                    await savePost(options)
                } catch (e) {
                    showGitHubErrorInfo(e)
                }
            } else {
                options.saving = true;
                error("你不是管理员！")
            }
        },
    }
    const pasterButton={
        name: 'paste url',
        tip: "paster url",
        icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="16" height="16" ><path d="M128 184c0-30.879 25.122-56 56-56h136V56c0-13.255-10.745-24-24-24h-80.61C204.306 12.89 183.637 0 160 0s-44.306 12.89-55.39 32H24C10.745 32 0 42.745 0 56v336c0 13.255 10.745 24 24 24h104V184zm32-144c13.255 0 24 10.745 24 24s-10.745 24-24 24-24-10.745-24-24 10.745-24 24-24zm184 248h104v200c0 13.255-10.745 24-24 24H184c-13.255 0-24-10.745-24-24V184c0-13.255 10.745-24 24-24h136v104c0 13.2 10.8 24 24 24zm104-38.059V256h-96v-96h6.059a24 24 0 0 1 16.97 7.029l65.941 65.941a24.002 24.002 0 0 1 7.03 16.971z" fill="#586069"/></svg>',
        hotkey: '⌘P',

        async click(element){
            let text=""
            try {
                text = await navigator.clipboard.readText();
            } catch (e) {
            }
            if(text.startsWith("http")){
                const title=text.split('.').length>1&&text.split('.')[1]
                vditor.insertValue(`[${title}](${text})`)
            }else {
                text&&vditor.insertValue(text)
            }
        }
    }

    const githubButton = {
        name: '更多',
        tipPosition: "n",
        icon: `<div id="imageLogo">${defaultAvatar}</div>`,
        tip: 'github',
        click(element, vditor) {
        },
        toolbar: [loginButton]
    }
    const toolbars = [ "bold", "italic", "strike", "line", "quote", "list", "ordered-list", "check", "code", "inline-code", "link", "table"]
    const toolbars1=["outdent" ,"indent","undo", "redo", "edit-mode", "both", "preview", "outline", "code-theme", "content-theme", "export"]
    const config = {
        toolbarConfig: {
            pin: true,
        },
        counter: {
            enable: false,
            type: "text"
        },

        height: window.innerHeight,
        outline: {
            enable: true
        },
        hint:{
            emoji:{ "+1":                                   "👍",
                "-1":                                   "👎",
                "100":                                  "💯",
                "1234":                                 "🔢",
                "1st_place_medal":                      "🥇",
                "2nd_place_medal":                      "🥈",
                "3rd_place_medal":                      "🥉",
                "8ball":                                "🎱",
                "a":                                    "🅰️",
                "ab":                                   "🆎",
                "abc":                                  "🔤",
                "abcd":                                 "🔡",
                "Accept":                               "🉑",
                "aerial_tramway":                       "🚡",
                "afghanistan":                          "🇦🇫",
                "airplane":                             "✈️",
                "aland_islands":                        "🇦🇽",
                "alarm_clock":                          "⏰",
                "albania":                              "🇦🇱",
                "alembic":                              "⚗️",
                "algeria":                              "🇩🇿",
                "alien":                                "👽",
                "ambulance":                            "🚑",
                "american_samoa":                       "🇦🇸",
                "amphora":                              "🏺",
                "anchor":                               "⚓️",
                "andorra":                              "🇦🇩",
                "angel":                                "👼",
                "anger":                                "💢",
                "angola":                               "🇦🇴",
                "angry":                                "😠",
                "anguilla":                             "🇦🇮",
                "anguished":                            "😧",
                "ant":                                  "🐜",
                "antarctica":                           "🇦🇶",
                "antigua_barbuda":                      "🇦🇬",
                "apple":                                "🍎",
                "aquarius":                             "♒️",
                "argentina":                            "🇦🇷",
                "aries":                                "♈️",
                "armenia":                              "🇦🇲",
                "arrow_backward":                       "◀️",
                "arrow_double_down":                    "⏬",
                "arrow_double_up":                      "⏫",
                "arrow_down":                           "⬇️",
                "arrow_down_small":                     "🔽",
                "arrow_forward":                        "▶️",
                "arrow_heading_down":                   "⤵️",
                "arrow_heading_up":                     "⤴️",
                "arrow_left":                           "⬅️",
                "arrow_lower_left":                     "↙️",
                "arrow_lower_right":                    "↘️",
                "arrow_right":                          "➡️",
                "arrow_right_hook":                     "↪️",
                "arrow_up":                             "⬆️",
                "arrow_up_down":                        "↕️",
                "arrow_up_small":                       "🔼",
                "arrow_upper_left":                     "↖️",
                "arrow_upper_right":                    "↗️",
                "arrows_clockwise":                     "🔃",
                "arrows_counterclockwise":              "🔄",
                "art":                                  "🎨",
                "articulated_lorry":                    "🚛",
                "artificial_satellite":                 "🛰",
                "aruba":                                "🇦🇼",
                "asterisk":                             "*️⃣",
                "astonished":                           "😲",
                "athletic_shoe":                        "👟",
                "atm":                                  "🏧",
                "atom_symbol":                          "⚛️",
                "australia":                            "🇦🇺",
                "austria":                              "🇦🇹",
                "avocado":                              "🥑",
                "azerbaijan":                           "🇦🇿",
                "b":                                    "🅱️",
                "baby":                                 "👶",
                "baby_bottle":                          "🍼",
                "baby_chick":                           "🐤",
                "baby_symbol":                          "🚼",
                "back":                                 "🔙",
                "bacon":                                "🥓",
                "badminton":                            "🏸",
                "baggage_claim":                        "🛄",
                "baguette_bread":                       "🥖",
                "bahamas":                              "🇧🇸",
                "bahrain":                              "🇧🇭",
                "balance_scale":                        "⚖️",
                "balloon":                              "🎈",
                "ballot_box":                           "🗳",
                "ballot_box_with_check":                "☑️",
                "bamboo":                               "🎍",
                "banana":                               "🍌",
                "bangbang":                             "‼️",
                "bangladesh":                           "🇧🇩",
                "bank":                                 "🏦",
                "bar_chart":                            "📊",
                "barbados":                             "🇧🇧",
                "barber":                               "💈",
                "baseball":                             "⚾️",
                "basketball":                           "🏀",
                "basketball_man":                       "⛹",
                "basketball_woman":                     "⛹️‍♀️",
                "bat":                                  "🦇",
                "bath":                                 "🛀",
                "bathtub":                              "🛁",
                "battery":                              "🔋",
                "beach_umbrella":                       "🏖",
                "bear":                                 "🐻",
                "bed":                                  "🛏",
                "bee":                                  "🐝",
                "beer":                                 "🍺",
                "beers":                                "🍻",
                "beetle":                               "🐞",
                "beginner":                             "🔰",
                "belarus":                              "🇧🇾",
                "belgium":                              "🇧🇪",
                "belize":                               "🇧🇿",
                "bell":                                 "🔔",
                "bellhop_bell":                         "🛎",
                "benin":                                "🇧🇯",
                "bento":                                "🍱",
                "bermuda":                              "🇧🇲",
                "bhutan":                               "🇧🇹",
                "bicyclist":                            "🚴",
                "bike":                                 "🚲",
                "biking_man":                           "🚴",
                "biking_woman":                         "🚴‍♀",
                "bikini":                               "👙",
                "biohazard":                            "☣️",
                "bird":                                 "🐦",
                "birthday":                             "🎂",
                "black_circle":                         "⚫️",
                "black_flag":                           "🏴",
                "black_heart":                          "🖤",
                "black_joker":                          "🃏",
                "black_large_square":                   "⬛️",
                "black_medium_small_square":            "◾️",
                "black_medium_square":                  "◼️",
                "black_nib":                            "✒️",
                "black_small_square":                   "▪️",
                "black_square_button":                  "🔲",
                "blonde_man":                           "👱",
                "blonde_woman":                         "👱‍♀",
                "blossom":                              "🌼",
                "blowfish":                             "🐡",
                "blue_book":                            "📘",
                "blue_car":                             "🚙",
                "blue_heart":                           "💙",
                "blush":                                "😊",
                "boar":                                 "🐗",
                "boat":                                 "⛵️",
                "bolivia":                              "🇧🇴",
                "bomb":                                 "💣",
                "book":                                 "📖",
                "bookmark":                             "🔖",
                "bookmark_tabs":                        "📑",
                "books":                                "📚",
                "boom":                                 "💥",
                "boot":                                 "👢",
                "bosnia_herzegovina":                   "🇧🇦",
                "botswana":                             "🇧🇼",
                "bouquet":                              "💐",
                "bow":                                  "🙇",
                "bow_and_arrow":                        "🏹",
                "bowing_man":                           "🙇",
                "bowing_woman":                         "🙇‍♀",
                "bowling":                              "🎳",
                "boxing_glove":                         "🥊",
                "boy":                                  "👦",
                "brazil":                               "🇧🇷",
                "bread":                                "🍞",
                "bride_with_veil":                      "👰",
                "bridge_at_night":                      "🌉",
                "briefcase":                            "💼",
                "british_indian_ocean_territory":       "🇮🇴",
                "british_virgin_islands":               "🇻🇬",
                "broken_heart":                         "💔",
                "brunei":                               "🇧🇳",
                "bug":                                  "🐛",
                "building_construction":                "🏗",
                "bulb":                                 "💡",
                "bulgaria":                             "🇧🇬",
                "bullettrain_front":                    "🚅",
                "bullettrain_side":                     "🚄",
                "burkina_faso":                         "🇧🇫",
                "burrito":                              "🌯",
                "burundi":                              "🇧🇮",
                "bus":                                  "🚌",
                "business_suit_levitating":             "🕴",
                "busstop":                              "🚏",
                "bust_in_silhouette":                   "👤",
                "busts_in_silhouette":                  "👥",
                "butterfly":                            "🦋",
                "cactus":                               "🌵",
                "cake":                                 "🍰",
                "calendar":                             "📆",
                "call_me_hand":                         "🤙",
                "calling":                              "📲",
                "cambodia":                             "🇰🇭",
                "camel":                                "🐫",
                "camera":                               "📷",
                "camera_flash":                         "📸",
                "cameroon":                             "🇨🇲",
                "camping":                              "🏕",
                "canada":                               "🇨🇦",
                "canary_islands":                       "🇮🇨",
                "cancer":                               "♋️",
                "candle":                               "🕯",
                "candy":                                "🍬",
                "canoe":                                "🛶",
                "cape_verde":                           "🇨🇻",
                "capital_abcd":                         "🔠",
                "capricorn":                            "♑️",
                "car":                                  "🚗",
                "card_file_box":                        "🗃",
                "card_index":                           "📇",
                "card_index_dividers":                  "🗂",
                "caribbean_netherlands":                "🇧🇶",
                "carousel_horse":                       "🎠",
                "carrot":                               "🥕",
                "cat":                                  "🐱",
                "cat2":                                 "🐈",
                "cayman_islands":                       "🇰🇾",
                "cd":                                   "💿",
                "central_african_republic":             "🇨🇫",
                "chad":                                 "🇹🇩",
                "chains":                               "⛓",
                "champagne":                            "🍾",
                "chart":                                "💹",
                "chart_with_downwards_trend":           "📉",
                "chart_with_upwards_trend":             "📈",
                "checkered_flag":                       "🏁",
                "cheese":                               "🧀",
                "cherries":                             "🍒",
                "cherry_blossom":                       "🌸",
                "chestnut":                             "🌰",
                "chicken":                              "🐔",
                "children_crossing":                    "🚸",
                "chile":                                "🇨🇱",
                "chipmunk":                             "🐿",
                "chocolate_bar":                        "🍫",
                "christmas_island":                     "🇨🇽",
                "christmas_tree":                       "🎄",
                "church":                               "⛪️",
                "cinema":                               "🎦",
                "circus_tent":                          "🎪",
                "city_sunrise":                         "🌇",
                "city_sunset":                          "🌆",
                "cityscape":                            "🏙",
                "cl":                                   "🆑",
                "clamp":                                "🗜",
                "clap":                                 "👏",
                "clapper":                              "🎬",
                "classical_building":                   "🏛",
                "clinking_glasses":                     "🥂",
                "clipboard":                            "📋",
                "clock1":                               "🕐",
                "clock10":                              "🕙",
                "clock1030":                            "🕥",
                "clock11":                              "🕚",
                "clock1130":                            "🕦",
                "clock12":                              "🕛",
                "clock1230":                            "🕧",
                "clock130":                             "🕜",
                "clock2":                               "🕑",
                "clock230":                             "🕝",
                "clock3":                               "🕒",
                "clock330":                             "🕞",
                "clock4":                               "🕓",
                "clock430":                             "🕟",
                "clock5":                               "🕔",
                "clock530":                             "🕠",
                "clock6":                               "🕕",
                "clock630":                             "🕡",
                "clock7":                               "🕖",
                "clock730":                             "🕢",
                "clock8":                               "🕗",
                "clock830":                             "🕣",
                "clock9":                               "🕘",
                "clock930":                             "🕤",
                "closed_book":                          "📕",
                "closed_lock_with_key":                 "🔐",
                "closed_umbrella":                      "🌂",
                "cloud":                                "☁️",
                "cloud_with_lightning":                 "🌩",
                "cloud_with_lightning_and_rain":        "⛈",
                "cloud_with_rain":                      "🌧",
                "cloud_with_snow":                      "🌨",
                "clown_face":                           "🤡",
                "clubs":                                "♣️",
                "cn":                                   "🇨🇳",
                "cocktail":                             "🍸",
                "cocos_islands":                        "🇨🇨",
                "coffee":                               "☕️",
                "coffin":                               "⚰️",
                "cold_sweat":                           "😰",
                "collision":                            "💥",
                "colombia":                             "🇨🇴",
                "comet":                                "☄",
                "comoros":                              "🇰🇲",
                "computer":                             "💻",
                "computer_mouse":                       "🖱",
                "confetti_ball":                        "🎊",
                "confounded":                           "😖",
                "confused":                             "😕",
                "congo_brazzaville":                    "🇨🇬",
                "congo_kinshasa":                       "🇨🇩",
                "congratulations":                      "㊗️",
                "construction":                         "🚧",
                "construction_worker":                  "👷",
                "construction_worker_man":              "👷",
                "construction_worker_woman":            "👷‍♀",
                "control_knobs":                        "🎛",
                "convenience_store":                    "🏪",
                "cook_islands":                         "🇨🇰",
                "cookie":                               "🍪",
                "cool":                                 "🆒",
                "cop":                                  "👮",
                "copyright":                            "©️",
                "corn":                                 "🌽",
                "costa_rica":                           "🇨🇷",
                "cote_divoire":                         "🇨🇮",
                "couch_and_lamp":                       "🛋",
                "couple":                               "👫",
                "couple_with_heart":                    "💑",
                "couple_with_heart_man_man":            "👨‍❤️‍👨",
                "couple_with_heart_woman_man":          "💑",
                "couple_with_heart_woman_woman":        "👩‍❤️‍👩",
                "couplekiss_man_man":                   "👨‍❤️‍💋‍👨",
                "couplekiss_man_woman":                 "💏",
                "couplekiss_woman_woman":               "👩‍❤️‍💋‍👩",
                "cow":                                  "🐮",
                "cow2":                                 "🐄",
                "cowboy_hat_face":                      "🤠",
                "crab":                                 "🦀",
                "crayon":                               "🖍",
                "credit_card":                          "💳",
                "crescent_moon":                        "🌙",
                "cricket":                              "🏏",
                "croatia":                              "🇭🇷",
                "crocodile":                            "🐊",
                "croissant":                            "🥐",
                "crossed_fingers":                      "🤞",
                "crossed_flags":                        "🎌",
                "crossed_swords":                       "⚔️",
                "crown":                                "👑",
                "cry":                                  "😢",
                "crying_cat_face":                      "😿",
                "crystal_ball":                         "🔮",
                "cuba":                                 "🇨🇺",
                "cucumber":                             "🥒",
                "cupid":                                "💘",
                "curacao":                              "🇨🇼",
                "curly_loop":                           "➰",
                "currency_exchange":                    "💱",
                "curry":                                "🍛",
                "custard":                              "🍮",
                "customs":                              "🛃",
                "cyclone":                              "🌀",
                "cyprus":                               "🇨🇾",
                "czech_republic":                       "🇨🇿",
                "dagger":                               "🗡",
                "dancer":                               "💃",
                "dancers":                              "👯",
                "dancing_men":                          "👯‍♂",
                "dancing_women":                        "👯",
                "dango":                                "🍡",
                "dark_sunglasses":                      "🕶",
                "dart":                                 "🎯",
                "dash":                                 "💨",
                "date":                                 "📅",
                "de":                                   "🇩🇪",
                "deciduous_tree":                       "🌳",
                "deer":                                 "🦌",
                "denmark":                              "🇩🇰",
                "department_store":                     "🏬",
                "derelict_house":                       "🏚",
                "desert":                               "🏜",
                "desert_island":                        "🏝",
                "desktop_computer":                     "🖥",
                "detective":                            "🕵",
                "diamond_shape_with_a_dot_inside":      "💠",
                "diamonds":                             "♦️",
                "disappointed":                         "😞",
                "disappointed_relieved":                "😥",
                "dizzy":                                "💫",
                "dizzy_face":                           "😵",
                "djibouti":                             "🇩🇯",
                "do_not_litter":                        "🚯",
                "dog":                                  "🐶",
                "dog2":                                 "🐕",
                "dollar":                               "💵",
                "dolls":                                "🎎",
                "dolphin":                              "🐬",
                "dominica":                             "🇩🇲",
                "dominican_republic":                   "🇩🇴",
                "door":                                 "🚪",
                "doughnut":                             "🍩",
                "dove":                                 "🕊",
                "dragon":                               "🐉",
                "dragon_face":                          "🐲",
                "dress":                                "👗",
                "dromedary_camel":                      "🐪",
                "drooling_face":                        "🤤",
                "droplet":                              "💧",
                "drum":                                 "🥁",
                "duck":                                 "🦆",
                "dvd":                                  "📀",
                "e-mail":                               "📧",
                "eagle":                                "🦅",
                "ear":                                  "👂",
                "ear_of_rice":                          "🌾",
                "earth_africa":                         "🌍",
                "earth_americas":                       "🌎",
                "earth_asia":                           "🌏",
                "ecuador":                              "🇪🇨",
                "egg":                                  "🥚",
                "eggplant":                             "🍆",
                "egypt":                                "🇪🇬",
                "eight":                                "8️⃣",
                "eight_pointed_black_star":             "✴️",
                "eight_spoked_asterisk":                "✳️",
                "el_salvador":                          "🇸🇻",
                "electric_plug":                        "🔌",
                "elephant":                             "🐘",
                "email":                                "✉️",
                "end":                                  "🔚",
                "envelope":                             "✉️",
                "envelope_with_arrow":                  "📩",
                "equatorial_guinea":                    "🇬🇶",
                "eritrea":                              "🇪🇷",
                "es":                                   "🇪🇸",
                "estonia":                              "🇪🇪",
                "ethiopia":                             "🇪🇹",
                "eu":                                   "🇪🇺",
                "euro":                                 "💶",
                "european_castle":                      "🏰",
                "european_post_office":                 "🏤",
                "european_union":                       "🇪🇺",
                "evergreen_tree":                       "🌲",
                "exclamation":                          "❗️",
                "expressionless":                       "😑",
                "eye":                                  "👁",
                "eye_speech_bubble":                    "👁‍🗨",
                "eyeglasses":                           "👓",
                "eyes":                                 "👀",
                "face_with_head_bandage":               "🤕",
                "face_with_thermometer":                "🤒",
                "facepunch":                            "👊",
                "factory":                              "🏭",
                "falkland_islands":                     "🇫🇰",
                "fallen_leaf":                          "🍂",
                "family":                               "👪",
                "family_man_boy":                       "👨‍👦",
                "family_man_boy_boy":                   "👨‍👦‍👦",
                "family_man_girl":                      "👨‍👧",
                "family_man_girl_boy":                  "👨‍👧‍👦",
                "family_man_girl_girl":                 "👨‍👧‍👧",
                "family_man_man_boy":                   "👨‍👨‍👦",
                "family_man_man_boy_boy":               "👨‍👨‍👦‍👦",
                "family_man_man_girl":                  "👨‍👨‍👧",
                "family_man_man_girl_boy":              "👨‍👨‍👧‍👦",
                "family_man_man_girl_girl":             "👨‍👨‍👧‍👧",
                "family_man_woman_boy":                 "👪",
                "family_man_woman_boy_boy":             "👨‍👩‍👦‍👦",
                "family_man_woman_girl":                "👨‍👩‍👧",
                "family_man_woman_girl_boy":            "👨‍👩‍👧‍👦",
                "family_man_woman_girl_girl":           "👨‍👩‍👧‍👧",
                "family_woman_boy":                     "👩‍👦",
                "family_woman_boy_boy":                 "👩‍👦‍👦",
                "family_woman_girl":                    "👩‍👧",
                "family_woman_girl_boy":                "👩‍👧‍👦",
                "family_woman_girl_girl":               "👩‍👧‍👧",
                "family_woman_woman_boy":               "👩‍👩‍👦",
                "family_woman_woman_boy_boy":           "👩‍👩‍👦‍👦",
                "family_woman_woman_girl":              "👩‍👩‍👧",
                "family_woman_woman_girl_boy":          "👩‍👩‍👧‍👦",
                "family_woman_woman_girl_girl":         "👩‍👩‍👧‍👧",
                "faroe_islands":                        "🇫🇴",
                "fast_forward":                         "⏩",
                "fax":                                  "📠",
                "fearful":                              "😨",
                "feet":                                 "🐾",
                "female_detective":                     "🕵️‍♀️",
                "ferris_wheel":                         "🎡",
                "ferry":                                "⛴",
                "field_hockey":                         "🏑",
                "fiji":                                 "🇫🇯",
                "file_cabinet":                         "🗄",
                "file_folder":                          "📁",
                "film_projector":                       "📽",
                "film_strip":                           "🎞",
                "finland":                              "🇫🇮",
                "fire":                                 "🔥",
                "fire_engine":                          "🚒",
                "fireworks":                            "🎆",
                "first_quarter_moon":                   "🌓",
                "first_quarter_moon_with_face":         "🌛",
                "fish":                                 "🐟",
                "fish_cake":                            "🍥",
                "fishing_pole_and_fish":                "🎣",
                "fist":                                 "✊",
                "fist_left":                            "🤛",
                "fist_oncoming":                        "👊",
                "fist_raised":                          "✊",
                "fist_right":                           "🤜",
                "five":                                 "5️⃣",
                "flags":                                "🎏",
                "flashlight":                           "🔦",
                "fleur_de_lis":                         "⚜️",
                "flight_arrival":                       "🛬",
                "flight_departure":                     "🛫",
                "flipper":                              "🐬",
                "floppy_disk":                          "💾",
                "flower_playing_cards":                 "🎴",
                "flushed":                              "😳",
                "fog":                                  "🌫",
                "foggy":                                "🌁",
                "football":                             "🏈",
                "footprints":                           "👣",
                "fork_and_knife":                       "🍴",
                "fountain":                             "⛲️",
                "fountain_pen":                         "🖋",
                "four":                                 "4️⃣",
                "four_leaf_clover":                     "🍀",
                "fox_face":                             "🦊",
                "fr":                                   "🇫🇷",
                "framed_picture":                       "🖼",
                "free":                                 "🆓",
                "french_guiana":                        "🇬🇫",
                "french_polynesia":                     "🇵🇫",
                "french_southern_territories":          "🇹🇫",
                "fried_egg":                            "🍳",
                "fried_shrimp":                         "🍤",
                "fries":                                "🍟",
                "frog":                                 "🐸",
                "frowning":                             "😦",
                "frowning_face":                        "☹️",
                "frowning_man":                         "🙍‍♂",
                "frowning_woman":                       "🙍",
                "fu":                                   "🖕",
                "fuelpump":                             "⛽️",
                "full_moon":                            "🌕",
                "full_moon_with_face":                  "🌝",
                "funeral_urn":                          "⚱️",
                "gabon":                                "🇬🇦",
                "gambia":                               "🇬🇲",
                "game_die":                             "🎲",
                "gb":                                   "🇬🇧",
                "gear":                                 "⚙️",
                "gem":                                  "💎",
                "gemini":                               "♊️",
                "georgia":                              "🇬🇪",
                "ghana":                                "🇬🇭",
                "ghost":                                "👻",
                "gibraltar":                            "🇬🇮",
                "gift":                                 "🎁",
                "gift_heart":                           "💝",
                "girl":                                 "👧",
                "globe_with_meridians":                 "🌐",
                "goal_net":                             "🥅",
                "goat":                                 "🐐",
                "golf":                                 "⛳️",
                "golfing_man":                          "🏌",
                "golfing_woman":                        "🏌️‍♀️",
                "gorilla":                              "🦍",
                "grapes":                               "🍇",
                "greece":                               "🇬🇷",
                "green_apple":                          "🍏",
                "green_book":                           "📗",
                "green_heart":                          "💚",
                "green_salad":                          "🥗",
                "greenland":                            "🇬🇱",
                "grenada":                              "🇬🇩",
                "grey_exclamation":                     "❕",
                "grey_question":                        "❔",
                "grimacing":                            "😬",
                "grin":                                 "😁",
                "grinning":                             "😀",
                "guadeloupe":                           "🇬🇵",
                "guam":                                 "🇬🇺",
                "guardsman":                            "💂",
                "guardswoman":                          "💂‍♀",
                "guatemala":                            "🇬🇹",
                "guernsey":                             "🇬🇬",
                "guinea":                               "🇬🇳",
                "guinea_bissau":                        "🇬🇼",
                "guitar":                               "🎸",
                "gun":                                  "🔫",
                "guyana":                               "🇬🇾",
                "haircut":                              "💇",
                "haircut_man":                          "💇‍♂",
                "haircut_woman":                        "💇",
                "haiti":                                "🇭🇹",
                "hamburger":                            "🍔",
                "hammer":                               "🔨",
                "hammer_and_pick":                      "⚒",
                "hammer_and_wrench":                    "🛠",
                "hamster":                              "🐹",
                "hand":                                 "✋",
                "handbag":                              "👜",
                "handshake":                            "🤝",
                "hankey":                               "💩",
                "hash":                                 "#️⃣",
                "hatched_chick":                        "🐥",
                "hatching_chick":                       "🐣",
                "headphones":                           "🎧",
                "hear_no_evil":                         "🙉",
                "heart":                                "❤️",
                "heart_decoration":                     "💟",
                "heart_eyes":                           "😍",
                "heart_eyes_cat":                       "😻",
                "heartbeat":                            "💓",
                "heartpulse":                           "💗",
                "hearts":                               "♥️",
                "heavy_check_mark":                     "✔️",
                "heavy_division_sign":                  "➗",
                "heavy_dollar_sign":                    "💲",
                "heavy_exclamation_mark":               "❗️",
                "heavy_heart_exclamation":              "❣️",
                "heavy_minus_sign":                     "➖",
                "heavy_multiplication_x":               "✖️",
                "heavy_plus_sign":                      "➕",
                "helicopter":                           "🚁",
                "herb":                                 "🌿",
                "hibiscus":                             "🌺",
                "high_brightness":                      "🔆",
                "high_heel":                            "👠",
                "hocho":                                "🔪",
                "hole":                                 "🕳",
                "honduras":                             "🇭🇳",
                "honey_pot":                            "🍯",
                "honeybee":                             "🐝",
                "hong_kong":                            "🇭🇰",
                "horse":                                "🐴",
                "horse_racing":                         "🏇",
                "hospital":                             "🏥",
                "hot_pepper":                           "🌶",
                "hotdog":                               "🌭",
                "hotel":                                "🏨",
                "hotsprings":                           "♨️",
                "hourglass":                            "⌛️",
                "hourglass_flowing_sand":               "⏳",
                "house":                                "🏠",
                "house_with_garden":                    "🏡",
                "houses":                               "🏘",
                "hugs":                                 "🤗",
                "hungary":                              "🇭🇺",
                "hushed":                               "😯",
                "ice_cream":                            "🍨",
                "ice_hockey":                           "🏒",
                "ice_skate":                            "⛸",
                "icecream":                             "🍦",
                "iceland":                              "🇮🇸",
                "id":                                   "🆔",
                "ideograph_advantage":                  "🉐",
                "imp":                                  "👿",
                "inbox_tray":                           "📥",
                "incoming_envelope":                    "📨",
                "india":                                "🇮🇳",
                "indonesia":                            "🇮🇩",
                "information_desk_person":              "💁",
                "information_source":                   "ℹ️",
                "innocent":                             "😇",
                "interrobang":                          "⁉️",
                "iphone":                               "📱",
                "iran":                                 "🇮🇷",
                "iraq":                                 "🇮🇶",
                "ireland":                              "🇮🇪",
                "isle_of_man":                          "🇮🇲",
                "israel":                               "🇮🇱",
                "it":                                   "🇮🇹",
                "izakaya_lantern":                      "🏮",
                "jack_o_lantern":                       "🎃",
                "jamaica":                              "🇯🇲",
                "japan":                                "🗾",
                "japanese_castle":                      "🏯",
                "japanese_goblin":                      "👺",
                "japanese_ogre":                        "👹",
                "jeans":                                "👖",
                "jersey":                               "🇯🇪",
                "jordan":                               "🇯🇴",
                "joy":                                  "😂",
                "joy_cat":                              "😹",
                "joystick":                             "🕹",
                "jp":                                   "🇯🇵",
                "kaaba":                                "🕋",
                "kazakhstan":                           "🇰🇿",
                "kenya":                                "🇰🇪",
                "key":                                  "🔑",
                "keyboard":                             "⌨️",
                "keycap_ten":                           "🔟",
                "kick_scooter":                         "🛴",
                "kimono":                               "👘",
                "kiribati":                             "🇰🇮",
                "kiss":                                 "💋",
                "kissing":                              "😗",
                "kissing_cat":                          "😽",
                "kissing_closed_eyes":                  "😚",
                "kissing_heart":                        "😘",
                "kissing_smiling_eyes":                 "😙",
                "kiwi_fruit":                           "🥝",
                "knife":                                "🔪",
                "koala":                                "🐨",
                "koko":                                 "🈁",
                "kosovo":                               "🇽🇰",
                "kr":                                   "🇰🇷",
                "kuwait":                               "🇰🇼",
                "kyrgyzstan":                           "🇰🇬",
                "label":                                "🏷",
                "lantern":                              "🏮",
                "laos":                                 "🇱🇦",
                "large_blue_circle":                    "🔵",
                "large_blue_diamond":                   "🔷",
                "large_orange_diamond":                 "🔶",
                "last_quarter_moon":                    "🌗",
                "last_quarter_moon_with_face":          "🌜",
                "latin_cross":                          "✝️",
                "latvia":                               "🇱🇻",
                "laughing":                             "😆",
                "leaves":                               "🍃",
                "lebanon":                              "🇱🇧",
                "ledger":                               "📒",
                "left_luggage":                         "🛅",
                "left_right_arrow":                     "↔️",
                "leftwards_arrow_with_hook":            "↩️",
                "lemon":                                "🍋",
                "leo":                                  "♌️",
                "leopard":                              "🐆",
                "lesotho":                              "🇱🇸",
                "level_slider":                         "🎚",
                "liberia":                              "🇱🇷",
                "libra":                                "♎️",
                "libya":                                "🇱🇾",
                "liechtenstein":                        "🇱🇮",
                "light_rail":                           "🚈",
                "link":                                 "🔗",
                "lion":                                 "🦁",
                "lips":                                 "👄",
                "lipstick":                             "💄",
                "lithuania":                            "🇱🇹",
                "lizard":                               "🦎",
                "lock":                                 "🔒",
                "lock_with_ink_pen":                    "🔏",
                "lollipop":                             "🍭",
                "loop":                                 "➿",
                "loud_sound":                           "🔊",
                "loudspeaker":                          "📢",
                "love_hotel":                           "🏩",
                "love_letter":                          "💌",
                "low_brightness":                       "🔅",
                "luxembourg":                           "🇱🇺",
                "lying_face":                           "🤥",
                "m":                                    "Ⓜ️",
                "macau":                                "🇲🇴",
                "macedonia":                            "🇲🇰",
                "madagascar":                           "🇲🇬",
                "mag":                                  "🔍",
                "mag_right":                            "🔎",
                "mahjong":                              "🀄️",
                "mailbox":                              "📫",
                "mailbox_closed":                       "📪",
                "mailbox_with_mail":                    "📬",
                "mailbox_with_no_mail":                 "📭",
                "malawi":                               "🇲🇼",
                "malaysia":                             "🇲🇾",
                "maldives":                             "🇲🇻",
                "male_detective":                       "🕵",
                "mali":                                 "🇲🇱",
                "malta":                                "🇲🇹",
                "man":                                  "👨",
                "man_artist":                           "👨‍🎨",
                "man_astronaut":                        "👨‍🚀",
                "man_cartwheeling":                     "🤸‍♂",
                "man_cook":                             "👨‍🍳",
                "man_dancing":                          "🕺",
                "man_facepalming":                      "🤦‍♂",
                "man_factory_worker":                   "👨‍🏭",
                "man_farmer":                           "👨‍🌾",
                "man_firefighter":                      "👨‍🚒",
                "man_health_worker":                    "👨‍⚕",
                "man_in_tuxedo":                        "🤵",
                "man_judge":                            "👨‍⚖",
                "man_juggling":                         "🤹‍♂",
                "man_mechanic":                         "👨‍🔧",
                "man_office_worker":                    "👨‍💼",
                "man_pilot":                            "👨‍✈",
                "man_playing_handball":                 "🤾‍♂",
                "man_playing_water_polo":               "🤽‍♂",
                "man_scientist":                        "👨‍🔬",
                "man_shrugging":                        "🤷‍♂",
                "man_singer":                           "👨‍🎤",
                "man_student":                          "👨‍🎓",
                "man_teacher":                          "👨‍🏫",
                "man_technologist":                     "👨‍💻",
                "man_with_gua_pi_mao":                  "👲",
                "man_with_turban":                      "👳",
                "mandarin":                             "🍊",
                "mans_shoe":                            "👞",
                "mantelpiece_clock":                    "🕰",
                "maple_leaf":                           "🍁",
                "marshall_islands":                     "🇲🇭",
                "martial_arts_uniform":                 "🥋",
                "martinique":                           "🇲🇶",
                "mask":                                 "😷",
                "massage":                              "💆",
                "massage_man":                          "💆‍♂",
                "massage_woman":                        "💆",
                "mauritania":                           "🇲🇷",
                "mauritius":                            "🇲🇺",
                "mayotte":                              "🇾🇹",
                "meat_on_bone":                         "🍖",
                "medal_military":                       "🎖",
                "medal_sports":                         "🏅",
                "mega":                                 "📣",
                "melon":                                "🍈",
                "memo":                                 "📝",
                "men_wrestling":                        "🤼‍♂",
                "menorah":                              "🕎",
                "mens":                                 "🚹",
                "metal":                                "🤘",
                "metro":                                "🚇",
                "mexico":                               "🇲🇽",
                "micronesia":                           "🇫🇲",
                "microphone":                           "🎤",
                "microscope":                           "🔬",
                "middle_finger":                        "🖕",
                "milk_glass":                           "🥛",
                "milky_way":                            "🌌",
                "minibus":                              "🚐",
                "minidisc":                             "💽",
                "mobile_phone_off":                     "📴",
                "moldova":                              "🇲🇩",
                "monaco":                               "🇲🇨",
                "money_mouth_face":                     "🤑",
                "money_with_wings":                     "💸",
                "moneybag":                             "💰",
                "mongolia":                             "🇲🇳",
                "monkey":                               "🐒",
                "monkey_face":                          "🐵",
                "monorail":                             "🚝",
                "montenegro":                           "🇲🇪",
                "montserrat":                           "🇲🇸",
                "moon":                                 "🌔",
                "morocco":                              "🇲🇦",
                "mortar_board":                         "🎓",
                "mosque":                               "🕌",
                "motor_boat":                           "🛥",
                "motor_scooter":                        "🛵",
                "motorcycle":                           "🏍",
                "motorway":                             "🛣",
                "mount_fuji":                           "🗻",
                "mountain":                             "⛰",
                "mountain_bicyclist":                   "🚵",
                "mountain_biking_man":                  "🚵",
                "mountain_biking_woman":                "🚵‍♀",
                "mountain_cableway":                    "🚠",
                "mountain_railway":                     "🚞",
                "mountain_snow":                        "🏔",
                "mouse":                                "🐭",
                "mouse2":                               "🐁",
                "movie_camera":                         "🎥",
                "moyai":                                "🗿",
                "mozambique":                           "🇲🇿",
                "mrs_claus":                            "🤶",
                "muscle":                               "💪",
                "mushroom":                             "🍄",
                "musical_keyboard":                     "🎹",
                "musical_note":                         "🎵",
                "musical_score":                        "🎼",
                "mute":                                 "🔇",
                "myanmar":                              "🇲🇲",
                "nail_care":                            "💅",
                "name_badge":                           "📛",
                "namibia":                              "🇳🇦",
                "national_park":                        "🏞",
                "nauru":                                "🇳🇷",
                "nauseated_face":                       "🤢",
                "necktie":                              "👔",
                "negative_squared_cross_mark":          "❎",
                "nepal":                                "🇳🇵",
                "nerd_face":                            "🤓",
                "netherlands":                          "🇳🇱",
                "neutral_face":                         "😐",
                "new":                                  "🆕",
                "new_caledonia":                        "🇳🇨",
                "new_moon":                             "🌑",
                "new_moon_with_face":                   "🌚",
                "new_zealand":                          "🇳🇿",
                "newspaper":                            "📰",
                "newspaper_roll":                       "🗞",
                "next_track_button":                    "⏭",
                "ng":                                   "🆖",
                "ng_man":                               "🙅‍♂",
                "ng_woman":                             "🙅",
                "nicaragua":                            "🇳🇮",
                "niger":                                "🇳🇪",
                "nigeria":                              "🇳🇬",
                "night_with_stars":                     "🌃",
                "nine":                                 "9️⃣",
                "niue":                                 "🇳🇺",
                "no_bell":                              "🔕",
                "no_bicycles":                          "🚳",
                "no_entry":                             "⛔️",
                "no_entry_sign":                        "🚫",
                "no_good":                              "🙅",
                "no_good_man":                          "🙅‍♂",
                "no_good_woman":                        "🙅",
                "no_mobile_phones":                     "📵",
                "no_mouth":                             "😶",
                "no_pedestrians":                       "🚷",
                "no_smoking":                           "🚭",
                "non-potable_water":                    "🚱",
                "norfolk_island":                       "🇳🇫",
                "north_korea":                          "🇰🇵",
                "northern_mariana_islands":             "🇲🇵",
                "norway":                               "🇳🇴",
                "nose":                                 "👃",
                "notebook":                             "📓",
                "notebook_with_decorative_cover":       "📔",
                "notes":                                "🎶",
                "nut_and_bolt":                         "🔩",
                "o":                                    "⭕️",
                "o2":                                   "🅾️",
                "ocean":                                "🌊",
                "octopus":                              "🐙",
                "oden":                                 "🍢",
                "office":                               "🏢",
                "oil_drum":                             "🛢",
                "ok":                                   "🆗",
                "ok_hand":                              "👌",
                "ok_man":                               "🙆‍♂",
                "ok_woman":                             "🙆",
                "old_key":                              "🗝",
                "older_man":                            "👴",
                "older_woman":                          "👵",
                "om":                                   "🕉",
                "oman":                                 "🇴🇲",
                "on":                                   "🔛",
                "oncoming_automobile":                  "🚘",
                "oncoming_bus":                         "🚍",
                "oncoming_police_car":                  "🚔",
                "oncoming_taxi":                        "🚖",
                "one":                                  "1️⃣",
                "open_book":                            "📖",
                "open_file_folder":                     "📂",
                "open_hands":                           "👐",
                "open_mouth":                           "😮",
                "open_umbrella":                        "☂️",
                "ophiuchus":                            "⛎",
                "orange":                               "🍊",
                "orange_book":                          "📙",
                "orthodox_cross":                       "☦️",
                "outbox_tray":                          "📤",
                "owl":                                  "🦉",
                "ox":                                   "🐂",
                "package":                              "📦",
                "page_facing_up":                       "📄",
                "page_with_curl":                       "📃",
                "pager":                                "📟",
                "paintbrush":                           "🖌",
                "pakistan":                             "🇵🇰",
                "palau":                                "🇵🇼",
                "palestinian_territories":              "🇵🇸",
                "palm_tree":                            "🌴",
                "panama":                               "🇵🇦",
                "pancakes":                             "🥞",
                "panda_face":                           "🐼",
                "paperclip":                            "📎",
                "paperclips":                           "🖇",
                "papua_new_guinea":                     "🇵🇬",
                "paraguay":                             "🇵🇾",
                "parasol_on_ground":                    "⛱",
                "parking":                              "🅿️",
                "part_alternation_mark":                "〽️",
                "partly_sunny":                         "⛅️",
                "passenger_ship":                       "🛳",
                "passport_control":                     "🛂",
                "pause_button":                         "⏸",
                "paw_prints":                           "🐾",
                "peace_symbol":                         "☮️",
                "peach":                                "🍑",
                "peanuts":                              "🥜",
                "pear":                                 "🍐",
                "pen":                                  "🖊",
                "pencil":                               "📝",
                "pencil2":                              "✏️",
                "penguin":                              "🐧",
                "pensive":                              "😔",
                "performing_arts":                      "🎭",
                "persevere":                            "😣",
                "person_fencing":                       "🤺",
                "person_frowning":                      "🙍",
                "person_with_blond_hair":               "👱",
                "person_with_pouting_face":             "🙎",
                "peru":                                 "🇵🇪",
                "philippines":                          "🇵🇭",
                "phone":                                "☎️",
                "pick":                                 "⛏",
                "pig":                                  "🐷",
                "pig2":                                 "🐖",
                "pig_nose":                             "🐽",
                "pill":                                 "💊",
                "pineapple":                            "🍍",
                "ping_pong":                            "🏓",
                "pisces":                               "♓️",
                "pitcairn_islands":                     "🇵🇳",
                "pizza":                                "🍕",
                "place_of_worship":                     "🛐",
                "plate_with_cutlery":                   "🍽",
                "play_or_pause_button":                 "⏯",
                "point_down":                           "👇",
                "point_left":                           "👈",
                "point_right":                          "👉",
                "point_up":                             "☝️",
                "point_up_2":                           "👆",
                "poland":                               "🇵🇱",
                "police_car":                           "🚓",
                "policeman":                            "👮",
                "policewoman":                          "👮‍♀",
                "poodle":                               "🐩",
                "poop":                                 "💩",
                "popcorn":                              "🍿",
                "portugal":                             "🇵🇹",
                "post_office":                          "🏣",
                "postal_horn":                          "📯",
                "postbox":                              "📮",
                "potable_water":                        "🚰",
                "potato":                               "🥔",
                "pouch":                                "👝",
                "poultry_leg":                          "🍗",
                "pound":                                "💷",
                "pout":                                 "😡",
                "pouting_cat":                          "😾",
                "pouting_man":                          "🙎‍♂",
                "pouting_woman":                        "🙎",
                "pray":                                 "🙏",
                "prayer_beads":                         "📿",
                "pregnant_woman":                       "🤰",
                "previous_track_button":                "⏮",
                "prince":                               "🤴",
                "princess":                             "👸",
                "printer":                              "🖨",
                "puerto_rico":                          "🇵🇷",
                "punch":                                "👊",
                "purple_heart":                         "💜",
                "purse":                                "👛",
                "pushpin":                              "📌",
                "put_litter_in_its_place":              "🚮",
                "qatar":                                "🇶🇦",
                "question":                             "❓",
                "rabbit":                               "🐰",
                "rabbit2":                              "🐇",
                "racehorse":                            "🐎",
                "racing_car":                           "🏎",
                "radio":                                "📻",
                "radio_button":                         "🔘",
                "radioactive":                          "☢️",
                "rage":                                 "😡",
                "railway_car":                          "🚃",
                "railway_track":                        "🛤",
                "rainbow":                              "🌈",
                "rainbow_flag":                         "🏳️‍🌈",
                "raised_back_of_hand":                  "🤚",
                "raised_hand":                          "✋",
                "raised_hand_with_fingers_splayed":     "🖐",
                "raised_hands":                         "🙌",
                "raising_hand":                         "🙋",
                "raising_hand_man":                     "🙋‍♂",
                "raising_hand_woman":                   "🙋",
                "ram":                                  "🐏",
                "ramen":                                "🍜",
                "rat":                                  "🐀",
                "record_button":                        "⏺",
                "recycle":                              "♻️",
                "red_car":                              "🚗",
                "red_circle":                           "🔴",
                "registered":                           "®️",
                "relaxed":                              "☺️",
                "relieved":                             "😌",
                "reminder_ribbon":                      "🎗",
                "repeat":                               "🔁",
                "repeat_one":                           "🔂",
                "rescue_worker_helmet":                 "⛑",
                "restroom":                             "🚻",
                "reunion":                              "🇷🇪",
                "revolving_hearts":                     "💞",
                "rewind":                               "⏪",
                "rhinoceros":                           "🦏",
                "ribbon":                               "🎀",
                "rice":                                 "🍚",
                "rice_ball":                            "🍙",
                "rice_cracker":                         "🍘",
                "rice_scene":                           "🎑",
                "right_anger_bubble":                   "🗯",
                "ring":                                 "💍",
                "robot":                                "🤖",
                "rocket":                               "🚀",
                "rofl":                                 "🤣",
                "roll_eyes":                            "🙄",
                "roller_coaster":                       "🎢",
                "romania":                              "🇷🇴",
                "rooster":                              "🐓",
                "rose":                                 "🌹",
                "rosette":                              "🏵",
                "rotating_light":                       "🚨",
                "round_pushpin":                        "📍",
                "rowboat":                              "🚣",
                "rowing_man":                           "🚣",
                "rowing_woman":                         "🚣‍♀",
                "ru":                                   "🇷🇺",
                "rugby_football":                       "🏉",
                "runner":                               "🏃",
                "running":                              "🏃",
                "running_man":                          "🏃",
                "running_shirt_with_sash":              "🎽",
                "running_woman":                        "🏃‍♀",
                "rwanda":                               "🇷🇼",
                "sa":                                   "🈂️",
                "sagittarius":                          "♐️",
                "sailboat":                             "⛵️",
                "sake":                                 "🍶",
                "samoa":                                "🇼🇸",
                "san_marino":                           "🇸🇲",
                "sandal":                               "👡",
                "santa":                                "🎅",
                "sao_tome_principe":                    "🇸🇹",
                "sassy_man":                            "💁‍♂",
                "sassy_woman":                          "💁",
                "satellite":                            "📡",
                "satisfied":                            "😆",
                "saudi_arabia":                         "🇸🇦",
                "saxophone":                            "🎷",
                "school":                               "🏫",
                "school_satchel":                       "🎒",
                "scissors":                             "✂️",
                "scorpion":                             "🦂",
                "scorpius":                             "♏️",
                "scream":                               "😱",
                "scream_cat":                           "🙀",
                "scroll":                               "📜",
                "seat":                                 "💺",
                "secret":                               "㊙️",
                "see_no_evil":                          "🙈",
                "seedling":                             "🌱",
                "selfie":                               "🤳",
                "senegal":                              "🇸🇳",
                "serbia":                               "🇷🇸",
                "seven":                                "7️⃣",
                "seychelles":                           "🇸🇨",
                "shallow_pan_of_food":                  "🥘",
                "shamrock":                             "☘️",
                "shark":                                "🦈",
                "shaved_ice":                           "🍧",
                "sheep":                                "🐑",
                "shell":                                "🐚",
                "shield":                               "🛡",
                "shinto_shrine":                        "⛩",
                "ship":                                 "🚢",
                "shirt":                                "👕",
                "shit":                                 "💩",
                "shoe":                                 "👞",
                "shopping":                             "🛍",
                "shopping_cart":                        "🛒",
                "shower":                               "🚿",
                "shrimp":                               "🦐",
                "sierra_leone":                         "🇸🇱",
                "signal_strength":                      "📶",
                "singapore":                            "🇸🇬",
                "sint_maarten":                         "🇸🇽",
                "six":                                  "6️⃣",
                "six_pointed_star":                     "🔯",
                "ski":                                  "🎿",
                "skier":                                "⛷",
                "skull":                                "💀",
                "skull_and_crossbones":                 "☠️",
                "sleeping":                             "😴",
                "sleeping_bed":                         "🛌",
                "sleepy":                               "😪",
                "slightly_frowning_face":               "🙁",
                "slightly_smiling_face":                "🙂",
                "slot_machine":                         "🎰",
                "slovakia":                             "🇸🇰",
                "slovenia":                             "🇸🇮",
                "small_airplane":                       "🛩",
                "small_blue_diamond":                   "🔹",
                "small_orange_diamond":                 "🔸",
                "small_red_triangle":                   "🔺",
                "small_red_triangle_down":              "🔻",
                "smile":                                "😄",
                "smile_cat":                            "😸",
                "smiley":                               "😃",
                "smiley_cat":                           "😺",
                "smiling_imp":                          "😈",
                "smirk":                                "😏",
                "smirk_cat":                            "😼",
                "smoking":                              "🚬",
                "snail":                                "🐌",
                "snake":                                "🐍",
                "sneezing_face":                        "🤧",
                "snowboarder":                          "🏂",
                "snowflake":                            "❄️",
                "snowman":                              "⛄️",
                "snowman_with_snow":                    "☃️",
                "sob":                                  "😭",
                "soccer":                               "⚽️",
                "solomon_islands":                      "🇸🇧",
                "somalia":                              "🇸🇴",
                "soon":                                 "🔜",
                "sos":                                  "🆘",
                "sound":                                "🔉",
                "south_africa":                         "🇿🇦",
                "south_georgia_south_sandwich_islands": "🇬🇸",
                "south_sudan":                          "🇸🇸",
                "space_invader":                        "👾",
                "spades":                               "♠️",
                "spaghetti":                            "🍝",
                "sparkle":                              "❇️",
                "sparkler":                             "🎇",
                "sparkles":                             "✨",
                "sparkling_heart":                      "💖",
                "speak_no_evil":                        "🙊",
                "speaker":                              "🔈",
                "speaking_head":                        "🗣",
                "speech_balloon":                       "💬",
                "speedboat":                            "🚤",
                "spider":                               "🕷",
                "spider_web":                           "🕸",
                "spiral_calendar":                      "🗓",
                "spiral_notepad":                       "🗒",
                "spoon":                                "🥄",
                "squid":                                "🦑",
                "sri_lanka":                            "🇱🇰",
                "st_barthelemy":                        "🇧🇱",
                "st_helena":                            "🇸🇭",
                "st_kitts_nevis":                       "🇰🇳",
                "st_lucia":                             "🇱🇨",
                "st_pierre_miquelon":                   "🇵🇲",
                "st_vincent_grenadines":                "🇻🇨",
                "stadium":                              "🏟",
                "star":                                 "⭐️",
                "star2":                                "🌟",
                "star_and_crescent":                    "☪️",
                "star_of_david":                        "✡️",
                "stars":                                "🌠",
                "station":                              "🚉",
                "statue_of_liberty":                    "🗽",
                "steam_locomotive":                     "🚂",
                "stew":                                 "🍲",
                "stop_button":                          "⏹",
                "stop_sign":                            "🛑",
                "stopwatch":                            "⏱",
                "straight_ruler":                       "📏",
                "strawberry":                           "🍓",
                "stuck_out_tongue":                     "😛",
                "stuck_out_tongue_closed_eyes":         "😝",
                "stuck_out_tongue_winking_eye":         "😜",
                "studio_microphone":                    "🎙",
                "stuffed_flatbread":                    "🥙",
                "sudan":                                "🇸🇩",
                "sun_behind_large_cloud":               "🌥",
                "sun_behind_rain_cloud":                "🌦",
                "sun_behind_small_cloud":               "🌤",
                "sun_with_face":                        "🌞",
                "sunflower":                            "🌻",
                "sunglasses":                           "😎",
                "sunny":                                "☀️",
                "sunrise":                              "🌅",
                "sunrise_over_mountains":               "🌄",
                "surfer":                               "🏄",
                "surfing_man":                          "🏄",
                "surfing_woman":                        "🏄‍♀",
                "suriname":                             "🇸🇷",
                "sushi":                                "🍣",
                "suspension_railway":                   "🚟",
                "swaziland":                            "🇸🇿",
                "sweat":                                "😓",
                "sweat_drops":                          "💦",
                "sweat_smile":                          "😅",
                "sweden":                               "🇸🇪",
                "sweet_potato":                         "🍠",
                "swimmer":                              "🏊",
                "swimming_man":                         "🏊",
                "swimming_woman":                       "🏊‍♀",
                "switzerland":                          "🇨🇭",
                "symbols":                              "🔣",
                "synagogue":                            "🕍",
                "syria":                                "🇸🇾",
                "syringe":                              "💉",
                "taco":                                 "🌮",
                "tada":                                 "🎉",
                "taiwan":                               "🇹🇼",
                "tajikistan":                           "🇹🇯",
                "tanabata_tree":                        "🎋",
                "tangerine":                            "🍊",
                "tanzania":                             "🇹🇿",
                "taurus":                               "♉️",
                "taxi":                                 "🚕",
                "tea":                                  "🍵",
                "telephone":                            "☎️",
                "telephone_receiver":                   "📞",
                "telescope":                            "🔭",
                "tennis":                               "🎾",
                "tent":                                 "⛺️",
                "thailand":                             "🇹🇭",
                "thermometer":                          "🌡",
                "thinking":                             "🤔",
                "thought_balloon":                      "💭",
                "three":                                "3️⃣",
                "thumbsdown":                           "👎",
                "thumbsup":                             "👍",
                "ticket":                               "🎫",
                "tickets":                              "🎟",
                "tiger":                                "🐯",
                "tiger2":                               "🐅",
                "timer_clock":                          "⏲",
                "timor_leste":                          "🇹🇱",
                "tipping_hand_man":                     "💁‍♂",
                "tipping_hand_woman":                   "💁",
                "tired_face":                           "😫",
                "tm":                                   "™️",
                "togo":                                 "🇹🇬",
                "toilet":                               "🚽",
                "tokelau":                              "🇹🇰",
                "tokyo_tower":                          "🗼",
                "tomato":                               "🍅",
                "tonga":                                "🇹🇴",
                "tongue":                               "👅",
                "top":                                  "🔝",
                "tophat":                               "🎩",
                "tornado":                              "🌪",
                "tr":                                   "🇹🇷",
                "trackball":                            "🖲",
                "tractor":                              "🚜",
                "traffic_light":                        "🚥",
                "train":                                "🚋",
                "train2":                               "🚆",
                "tram":                                 "🚊",
                "triangular_flag_on_post":              "🚩",
                "triangular_ruler":                     "📐",
                "trident":                              "🔱",
                "trinidad_tobago":                      "🇹🇹",
                "triumph":                              "😤",
                "trolleybus":                           "🚎",
                "trophy":                               "🏆",
                "tropical_drink":                       "🍹",
                "tropical_fish":                        "🐠",
                "truck":                                "🚚",
                "trumpet":                              "🎺",
                "tshirt":                               "👕",
                "tulip":                                "🌷",
                "tumbler_glass":                        "🥃",
                "tunisia":                              "🇹🇳",
                "turkey":                               "🦃",
                "turkmenistan":                         "🇹🇲",
                "turks_caicos_islands":                 "🇹🇨",
                "turtle":                               "🐢",
                "tuvalu":                               "🇹🇻",
                "tv":                                   "📺",
                "twisted_rightwards_arrows":            "🔀",
                "two":                                  "2️⃣",
                "two_hearts":                           "💕",
                "two_men_holding_hands":                "👬",
                "two_women_holding_hands":              "👭",
                "u5272":                                "🈹",
                "u5408":                                "🈴",
                "u55b6":                                "🈺",
                "u6307":                                "🈯️",
                "u6708":                                "🈷️",
                "u6709":                                "🈶",
                "u6e80":                                "🈵",
                "u7121":                                "🈚️",
                "u7533":                                "🈸",
                "u7981":                                "🈲",
                "u7a7a":                                "🈳",
                "uganda":                               "🇺🇬",
                "uk":                                   "🇬🇧",
                "ukraine":                              "🇺🇦",
                "umbrella":                             "☔️",
                "unamused":                             "😒",
                "underage":                             "🔞",
                "unicorn":                              "🦄",
                "united_arab_emirates":                 "🇦🇪",
                "unlock":                               "🔓",
                "up":                                   "🆙",
                "upside_down_face":                     "🙃",
                "uruguay":                              "🇺🇾",
                "us":                                   "🇺🇸",
                "us_virgin_islands":                    "🇻🇮",
                "uzbekistan":                           "🇺🇿",
                "v":                                    "✌️",
                "vanuatu":                              "🇻🇺",
                "vatican_city":                         "🇻🇦",
                "venezuela":                            "🇻🇪",
                "vertical_traffic_light":               "🚦",
                "vhs":                                  "📼",
                "vibration_mode":                       "📳",
                "video_camera":                         "📹",
                "video_game":                           "🎮",
                "vietnam":                              "🇻🇳",
                "violin":                               "🎻",
                "virgo":                                "♍️",
                "volcano":                              "🌋",
                "volleyball":                           "🏐",
                "vs":                                   "🆚",
                "vulcan_salute":                        "🖖",
                "walking":                              "🚶",
                "walking_man":                          "🚶",
                "walking_woman":                        "🚶‍♀",
                "wallis_futuna":                        "🇼🇫",
                "waning_crescent_moon":                 "🌘",
                "waning_gibbous_moon":                  "🌖",
                "warning":                              "⚠️",
                "wastebasket":                          "🗑",
                "watch":                                "⌚️",
                "water_buffalo":                        "🐃",
                "watermelon":                           "🍉",
                "wave":                                 "👋",
                "wavy_dash":                            "〰️",
                "waxing_crescent_moon":                 "🌒",
                "waxing_gibbous_moon":                  "🌔",
                "wc":                                   "🚾",
                "weary":                                "😩",
                "wedding":                              "💒",
                "weight_lifting_man":                   "🏋",
                "weight_lifting_woman":                 "🏋️‍♀️",
                "western_sahara":                       "🇪🇭",
                "whale":                                "🐳",
                "whale2":                               "🐋",
                "wheel_of_dharma":                      "☸️",
                "wheelchair":                           "♿️",
                "white_check_mark":                     "✅",
                "white_circle":                         "⚪️",
                "white_flag":                           "🏳️",
                "white_flower":                         "💮",
                "white_large_square":                   "⬜️",
                "white_medium_small_square":            "◽️",
                "white_medium_square":                  "◻️",
                "white_small_square":                   "▫️",
                "white_square_button":                  "🔳",
                "wilted_flower":                        "🥀",
                "wind_chime":                           "🎐",
                "wind_face":                            "🌬",
                "wine_glass":                           "🍷",
                "wink":                                 "😉",
                "wolf":                                 "🐺",
                "woman":                                "👩",
                "woman_artist":                         "👩‍🎨",
                "woman_astronaut":                      "👩‍🚀",
                "woman_cartwheeling":                   "🤸‍♀",
                "woman_cook":                           "👩‍🍳",
                "woman_facepalming":                    "🤦‍♀",
                "woman_factory_worker":                 "👩‍🏭",
                "woman_farmer":                         "👩‍🌾",
                "woman_firefighter":                    "👩‍🚒",
                "woman_health_worker":                  "👩‍⚕",
                "woman_judge":                          "👩‍⚖",
                "woman_juggling":                       "🤹‍♀",
                "woman_mechanic":                       "👩‍🔧",
                "woman_office_worker":                  "👩‍💼",
                "woman_pilot":                          "👩‍✈",
                "woman_playing_handball":               "🤾‍♀",
                "woman_playing_water_polo":             "🤽‍♀",
                "woman_scientist":                      "👩‍🔬",
                "woman_shrugging":                      "🤷‍♀",
                "woman_singer":                         "👩‍🎤",
                "woman_student":                        "👩‍🎓",
                "woman_teacher":                        "👩‍🏫",
                "woman_technologist":                   "👩‍💻",
                "woman_with_turban":                    "👳‍♀",
                "womans_clothes":                       "👚",
                "womans_hat":                           "👒",
                "women_wrestling":                      "🤼‍♀",
                "womens":                               "🚺",
                "world_map":                            "🗺",
                "worried":                              "😟",
                "wrench":                               "🔧",
                "writing_hand":                         "✍️",
                "x":                                    "❌",
                "yellow_heart":                         "💛",
                "yemen":                                "🇾🇪",
                "yen":                                  "💴",
                "yin_yang":                             "☯️",
                "yum":                                  "😋",
                "zambia":                               "🇿🇲",
                "zap":                                  "⚡️",
                "zero":                                 "0️⃣",
                "zimbabwe":                             "🇿🇼",
                "zipper_mouth_face":                    "🤐",
                "zzz":                                  "💤", }
        },
        input: (value)=>{
            if(value.trim()!=options.content.trim()){
                saveContentToCache(options,value.trim())
            }else {
                clearContentFromCache()
            }
        },
        preview: {
            markdown: {
                codeBlockPreview: false,
                autoSpace: false
            },
            mode: isPhone ? "editor" : "both",
        },
        mode: "ir",
        typewriterMode: true,
        cache: {
            enable: false
        },
        async after() {
            $('#login').on('click', function () {
                login(options)
            })
            if(!isPhone){
                const svg='data:image/png;base64,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'
                $('.vditor-toolbar').prepend(`<a href='https://yunwan1x.github.io'><img width='96px' style='left: 10px;top:0px;position: absolute;' src='${svg}' /></a> `)
            }
            loading(false)
            try {
                await init(options)
            } catch (e) {
                showGitHubErrorInfo(e)
            }
        },
        toolbar: window.screen.width < 500 ? [
            'headings',
            'edit-mode', saveButton,pasterButton, {
                name: "more2",
                icon:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><path d="M5 9h2.31l.32-3h2l-.32 3h2l.32-3h2l-.32 3H15v2h-1.9l-.2 2H15v2h-2.31l-.32 3h-2l.32-3h-2l-.32 3h-2l.32-3H5v-2h1.9l.2-2H5V9m4.1 2-.2 2h2l.2-2M19 6h-2v8h2m0 2h-2v2h2z"/></svg>',
                toolbar: toolbars
            },{
                name: "more1",
                icon:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><path d="M4 2a2 2 0 0 0-2 2v8h2V8h2v4h2V4a2 2 0 0 0-2-2H4m0 2h2v2H4m18 9.5V14a2 2 0 0 0-2-2h-4v10h4a2 2 0 0 0 2-2v-1.5a1.54 1.54 0 0 0-1.5-1.5 1.54 1.54 0 0 0 1.5-1.5M20 20h-2v-2h2v2m0-4h-2v-2h2M5.79 21.61l-1.58-1.22 14-18 1.58 1.22z"/></svg>',
                toolbar: toolbars1
            }, "emoji",clearCache,githubButton] : toolbars.concat(["headings",...toolbars1,"emoji",saveButton, pasterButton,clearCache,githubButton])
    }
    const vditor = new Vditor('vditor', config)

    $(window).resize(function () {
        vditor.vditor.element.style.height = window.innerHeight + "px";
    });


    async function saveContentToCache(options,textValue){
        const key= `${window.location.href}`
        window.localStorage.setItem(key,JSON.stringify({sha:options.sha,content:textValue}))
        options.cache=true
        $('#wy_cache').attr('fill',cacheState.cached)
    }

    async function getContentFromCache(options){
        const key= `${window.location.href}`
        let res=null
        try {
            res = JSON.parse(window.localStorage.getItem(key))
        } catch (e) {
        }
        if(res){
            $('#wy_cache').attr('fill',cacheState.cached)
        }
        return res;
    }

    async function clearContentFromCache(){
        const key= `${window.location.href}`
        if(!window.localStorage.getItem(key))return false
        window.localStorage.removeItem(key)
        options.cache=false
        $('#wy_cache').attr('fill',cacheState.none)
        return true
    }



    async function init(options) {
        const query = queryParse()
        const hash = queryHash();
        const {path, posturl} = hash
        options.path = path
        options.posturl = posturl
        options.editMode = path ? true : false
        if (query.code) {
            const code = query.code
            delete query.code
            const replacedUrl = `${window.location.origin}${window.location.pathname}${queryStringify(query)}${window.location.hash}`
            history.replaceState(null, null, replacedUrl)
            const res = await axiosJSON.post(options.proxy, {
                code,
                client_id: options.clientID,
                client_secret: options.clientSecret,
            });
            if (res.data && res.data.access_token) {
                setAccessToken(res.data.access_token, options)
                await initUserPost(options)
            } else {
                throw new Error("no access_token")
            }
        } else {
            await initUserPost(options)
        }
    }

    async function getPostContent(options) {
        const {owner, repo} = options
        const {path, editMode, type} = options;
        const  auth=getAccessToken(options)
        let  res = await getContentFromCache(options);

        if (editMode) {
            const cached=res?true:false
            options.cache=cached
            !cached&&(res = await axiosGithub.get(`/repos/${owner}/${repo}/contents/${path}`,{
                headers: {
                    Authorization: `token ${auth}`
                }
            }))
            const {content, sha} = cached?res:res.data
            return {content: cached?content:Base64.decode(content), sha}

        } else {
            return res||{content: defaultText(type), sha: ""}
        }
    }

    function userLogin(user) {
        const {avatar_url, login} = user;
        const avatar = `<img src="${avatar_url}" width="16" height="16" />`;
        $('#imageLogo').html(avatar)
        $('#login').text("登出 github").click(function () {
            logout(options)
        });
    }

    async function getUserInfo(options) {
        if (!getAccessToken(options)) {
            return null
        }
        const user = getUser(options);
        if (user.login) {
            userLogin(user);
            return user
        } else {
            const res = await axiosGithub.get('/user', {
                headers: {
                    Authorization: `token ${getAccessToken(options)}`
                }
            });
            setUser(options, res.data)
            userLogin(getUser(options))
            return getUser(options)
        }
    }

    function error(msg, timeout, fn) {
        console.error(msg)
        const html = `<div style="background: #dc3545;color: white;padding: 0.5em 1em;border-radius: 3px">${msg.message && msg.message || msg}</div>`
        $('.vditor-tip__content').html(html)
        const parent = $('.vditor-tip__content').parent();
        parent.show()
        // parent.addClass('vditor-tip--show')
        if (!timeout) {
            timeout = 3000
        }
        setTimeout(() => {
            parent.hide()
            options.saving = false
            fn && fn()
        }, timeout)
    }

    function success(msg, timeout, fn) {
        const html = `<div style="color: white;background: #198754;padding: 0.5em 1em;border-radius: 3px">${msg}</div>`
        $('.vditor-tip__content').html(html)
        const parent = $('.vditor-tip__content').parent();
        parent.show()
        // parent.addClass('vditor-tip--show')
        if (!timeout) {
            timeout = 3000
        }
        setTimeout(() => {
            parent.hide()
            options.saving = false
            fn && fn()
        }, timeout)
    }

    //changhui
    async function savePost(options) {
        const {owner, repo} = options
        var {path, editMode, sha, content,cache} = options
        const comment = vditor.getValue();
        const auth = getAccessToken(options)
        if (comment.trim() == content.trim()&&!cache) {
            throw new Error("内容无变更！")
        }
        let res = ""
        //代表新增
        if (!editMode) {
            var title = ""

            if (/title:\s*(|[^-\s.]+)\s*$/m.test(comment)) {
                title = RegExp.$1
            }
            if (!title) {
                throw new Error("title 不合法！");
            }
            var category = "";
            if (/layout:\s*(\S+)\s*$/m.test(comment)) {
                if (RegExp.$1 == "post") {
                    category = "_posts"
                    path = `${category}/${dateFormat(new Date(), "yyyy-MM-dd")}-${title}.md`
                } else if (RegExp.$1 == "wiki") {
                    category = "_wiki"
                    path = `${category}/${title}.md`
                }
            }
            if (!category) {
                throw new Error("layout: wiki | post");
            }

            if (await getFile(owner, repo, path)) {
                throw new Error(`${path} 已经存在`)
            }
            res = await createFile(owner, repo, path, comment, auth)
            location.replace(`${location.href}#path=${path}`)
            options.editMode = true


        } else {
            if (!sha) throw new Error("文件正在创建中...稍后")
            try {
                res = await saveFile(owner, repo, path, comment, auth, sha)
            } catch (e) {
                const {content = '', sha = ''} = await getFile(owner, repo, path)
                if (sha) {
                    res = await saveFile(owner, repo, path, comment, auth, sha)
                } else {
                    throw e
                }
            }
        }
        if(res.data.content.sha){
            success("保存成功！")
            options.content = comment
            options.sha=res.data.content.sha
            clearContentFromCache()
        }else {
            throw new Error("文件sha没获取到")
        }

    }

    function showGitHubErrorInfo(fail) {
        if (fail.response) {
            error(fail.response.data && fail.response.data.message || fail.response.data)
        } else {
            error(fail)
        }
    }


    async function createFile(owner, repo, path, comment, auth) {
        const dateStr = dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss");
        const res = await axiosGithub.put(`/repos/${owner}/${repo}/contents/${path}`, {
            message: "create by gitpost " + dateStr,
            content: Base64.encode(comment),
        }, {
            headers: {
                Authorization: `token ${auth}`
            }
        });
        return res;
    }

    async function saveFile(owner, repo, path, comment, auth, sha) {
        const dateStr = dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss");
        const res = await axiosGithub.put(`/repos/${owner}/${repo}/contents/${path}`, {
            message: "update by gitpost " + dateStr,
            content: Base64.encode(comment),
            sha: sha
        }, {
            headers: {
                Authorization: `token ${auth}`
            }
        });
        return res;
    }

    async function getFile(owner, repo, path) {
        const  auth=getAccessToken(options)
        try {
            let fileInfo = await axiosGithub.get(`/repos/${owner}/${repo}/contents/${path}`,{
                headers: {
                    Authorization: `token ${auth}`
                }
            })
            const {data: {content, sha}} = fileInfo;
            return {content: Base64.decode(content), sha: sha}
        } catch (e) {
        }
        return null;
    }


    function logout(options) {
        options.user = null;
        options._accessToken = null;
        window.localStorage.removeItem(GT_ACCESS_TOKEN)
        window.localStorage.removeItem("GT_USER")
        location.reload()
    }


    function login(options) {
        const {comment} = options
        window.localStorage.setItem(GT_COMMENT, encodeURIComponent(comment))
        window.location.href = getLoginLink(options)
    }


    function getUser(options) {
        const str = options.user || window.localStorage.getItem("GT_USER")
        let user={}
        if(str){
            user=JSON.parse(str);
            const  timeElapsed=new Date().getTime()-(user.loginTime||0)
            //有效期一天
            if(timeElapsed>24*3600*1000){
                return {}
            }
        }
        return user
    }

    function setUser(options, user) {
        user.loginTime=new Date().getTime()
        var str = JSON.stringify(user);
        window.localStorage.setItem("GT_USER", str)
        options.user = str
    }


    function getAccessToken(options) {
        return options._accessToke || window.localStorage.getItem(GT_ACCESS_TOKEN)
    }

    function setAccessToken(token, options) {
        window.localStorage.setItem(GT_ACCESS_TOKEN, token)
        options._accessToken = token
    }

    function getLoginLink(options) {
        const githubOauthUrl = 'https://github.com/login/oauth/authorize'
        const {clientID} = options
        const query = {
            client_id: clientID,
            redirect_uri: window.location.href,
            scope: 'public_repo',

        }
        return `${githubOauthUrl}?${queryStringify(query)}`
    }

    function isAdmin(options) {
        const {admin} = options
        const user = getUser(options)
        return user.login && admin && admin.toLowerCase().includes(user.login.toLowerCase())
    }

    async function initUserPost(options) {
        const user = await getUserInfo(options);
        const {content, sha} = await getPostContent(options);
        vditor.setValue(content)
        options.content = content
        options.sha = sha
    }
})

