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
    const toolbars = [ "bold", "italic", "strike", "line", "quote", "list", "ordered-list", "check", "code", "inline-code", "link", "table",]
    const toolbars1=["undo", "redo", "edit-mode", "both", "preview", "outline", "code-theme", "content-theme", "export"]
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
                "b3log":                                "${emojiSite}/b3log.png",
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
                "chainbook":                            "${emojiSite}/chainbook.png",
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
                "doge":                                 "${emojiSite}/doge.png",
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
                "hacpai":                               "${emojiSite}/hacpai.png",
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
                "huaji":                                "${emojiSite}/huaji.gif",
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
                "latke":                                "${emojiSite}/latke.png",
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
                "liandi":                               "${emojiSite}/liandi.png",
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
                "lute":                                 "${emojiSite}/lute.png",
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
                "octocat":                              "${emojiSite}/octocat.png",
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
                "pipe":                                 "${emojiSite}/pipe.png",
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
                "siyuan":                               "${emojiSite}/siyuan.svg",
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
                "solo":                                 "${emojiSite}/solo.png",
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
                "sym":                                  "${emojiSite}/sym.png",
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
                "trollface":                            "${emojiSite}/trollface.png",
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
                "vditor":                               "${emojiSite}/vditor.png",
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
                "wide":                                 "${emojiSite}/wide.png",
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
                "wulian":                               "${emojiSite}/wulian.png",
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
                const svg='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NTMuNjk2IDIwMC40OTQiPjxwYXRoIGQ9Ik01OC4xMyA1My45NjJjNy4wMiAwIDE1LjEzNS0xLjc1NCAyNC4zNDktNS4yNjR2MjIuNTkzYy0yLjA0OC43MzEtNC45NzIgMS41MzYtOC43NzQgMi40MTQgMS4xNjkgMy4zNjMgMS43NTUgNi41MDcgMS43NTUgOS40MzIgMCA5LjM1OS0yLjgxNCAxNy41MTItOC40NDUgMjQuNDU4LTUuNjMgNi45NDYtMTIuOTA2IDExLjA3OS0yMS44MjcgMTIuMzk0LTUuODQ4Ljg3OC04Ljc3MyA0LjAyMi04Ljc3MyA5LjQzMyAwIDEuOTAxLjk1IDMuODAzIDIuODUyIDUuNzAzIDIuNDg2IDIuNzc5IDYuMTQyIDQuNTM1IDEwLjk2OCA1LjI2NiAyMC45MTMgMy4yMTcgMzEuMzY4IDExLjkxOCAzMS4zNjggMjYuMTAzIDAgMjIuNjY5LTEzLjUyNiAzNC4wMDItNDAuNTgxIDM0LjAwMi0xMS4xMTQgMC0yMC4yNTUtMS45NzQtMjcuNDE5LTUuOTIzQzQuNTMyIDE4OS42IDAgMTgxLjc3NiAwIDE3MS4wOTljMC0xMi4yODMgNi44LTIwLjY5MSAyMC4zOTktMjUuMjI1di0uNDM4Yy00Ljk3Mi0zLjA3MS03LjQ1Ny03Ljc1MS03LjQ1Ny0xNC4wNCAwLTguMTg5IDIuMzQtMTMuMzA5IDcuMDItMTUuMzU0di0uNDM5Yy00LjY4LTEuNjA4LTguODQ5LTUuMjY2LTEyLjUwNC0xMC45NjktNC4wOTUtNi4xNDItNi4xNDMtMTIuNzIzLTYuMTQzLTE5Ljc0MiAwLTEwLjUyOSAzLjcyOS0xOS4zMDMgMTEuMTg4LTI2LjMyMiA3LjE2Ni02LjU4MSAxNS43MjEtOS44NzEgMjUuNjY1LTkuODcxIDcuMTY2LS4wMDEgMTMuODE5IDEuNzU0IDE5Ljk2MiA1LjI2M3ptLjg3NyAxMTUuMzgzYzAtNy40NTktNi4xNDItMTEuMTg4LTE4LjQyNy0xMS4xODgtMTEuODQ1IDAtMTcuNzY4IDMuODc1LTE3Ljc2OCAxMS42MjcgMCA3LjYwMyA2LjQzNiAxMS40MDUgMTkuMzA0IDExLjQwNSAxMS4yNjEuMDAxIDE2Ljg5MS0zLjk0NyAxNi44OTEtMTEuODQ0ek0yNS4yMjYgODUuMTEyYzAgMTAuMDkxIDQuNjA2IDE1LjEzNiAxMy44MTggMTUuMTM2IDguOTIxIDAgMTMuMzgxLTUuMTE5IDEzLjM4MS0xNS4zNTUgMC00LjI0MS0xLjAyMy03Ljg5Ni0zLjA3LTEwLjk2OC0yLjQ4Ni0zLjM2My01LjkyMy01LjA0Ni0xMC4zMTEtNS4wNDYtOS4yMTEtLjAwMS0xMy44MTggNS40MTEtMTMuODE4IDE2LjIzM3pNMTA1LjczOCAzMi42ODRjLTQuMjQgMC03Ljg1OS0xLjYwNy0xMC44NTctNC44MjVzLTQuNDk3LTcuMDE5LTQuNDk3LTExLjQwNmMwLTQuNTM0IDEuNDk5LTguNDA4IDQuNDk3LTExLjYyNlMxMDEuNDk4IDAgMTA1LjczOCAwYzQuMDk1IDAgNy42NDIgMS42MDggMTAuNjQgNC44MjZzNC40OTYgNy4wOTIgNC40OTYgMTEuNjI2YzAgNC4zODgtMS40OTggOC4xODgtNC40OTYgMTEuNDA2cy02LjU0NSA0LjgyNi0xMC42NCA0LjgyNnpNOTMuMjM1IDE0Ny4xOWMuMjkzLTIuOTI0LjQzOC03Ljg5Ni40MzgtMTQuOTE2VjY0LjA1MmMwLTYuODcyLS4xNDYtMTEuNjI1LS40MzgtMTQuMjU4aDI0Ljc4OGMtLjI5MyAyLjc3OS0uNDM5IDcuMzg2LS40MzkgMTMuODJ2NjcuMzQzYzAgNy40NTkuMTQ2IDEyLjg2OS40MzkgMTYuMjMySDkzLjIzNXpNMTYzLjQxMyA0OS43OTRoMTkuMDg0djIxLjI3N2MtLjczMSAwLTIuMDg0LS4wNzItNC4wNTktLjIxOWE3Ni4wMzYgNzYuMDM2IDAgMCAwLTUuNTk0LS4yMmgtOS40MzJ2NDAuODAxYzAgOS43OTkgMy4yMTcgMTQuNjk3IDkuNjUxIDE0LjY5NyA0LjUzNCAwIDguNjI4LTEuMjQyIDEyLjI4NS0zLjcyOXYyMS45MzZjLTUuNDExIDIuOTI2LTExLjkxOSA0LjM4OC0xOS41MjQgNC4zODgtMTAuNjc1IDAtMTguMDU5LTMuODAyLTIyLjE1NC0xMS40MDUtMy4wNy01LjcwNS00LjYwNi0xNC42OTctNC42MDYtMjYuOTgyVjcxLjA3MmguMjJ2LS40MzhsLTMuMjkxLS4yMTljLTEuOTAxIDAtNC4zODcuMjE5LTcuNDU4LjY1N1Y0OS43OTRoMTAuNzQ5VjQxLjI0YzAtNC4wOTUtLjIyLTcuMzg2LS42NTgtOS44NzFoMjUuNDQ1Yy0uNDM4IDIuNzc4LS42NTggNS45MjMtLjY1OCA5LjQzMnY4Ljk5M3pNMjQwLjQ2NCA0OS4xMzZjLTYuMjg4IDAtMTIuODY5IDIuMTk0LTE5Ljc0MiA2LjU4VjE3LjMyOWMwLTguMzM1LjE0Ni0xMy44MTkuNDM4LTE2LjQ1MWgtMjUuMDA3Yy40MzkgMi4zNC42NTggNy44MjMuNjU4IDE2LjQ1MVYxMzMuMzdjMCA2LjcyNi0uMjE5IDExLjMzNC0uNjU4IDEzLjgxOWgyNS40NDVjMC0uNDM5LS4xNDYtMi4yMjktLjQzOC01LjM3NC0uMjkyLTMuMTQ1LS40MzgtNS45Ni0uNDM4LTguNDQ1Vjc5LjQwN2M1LjExOC00LjgyNSAxMC4wOS03LjIzNyAxNC45MTYtNy4yMzcgNS41NTggMCA5Ljc5OSAyLjc3NyAxMi43MjQgOC4zMzQgMi4xOTIgNC4zODggMy4yOSA5Ljg3MiAzLjI5IDE2LjQ1M2wtLjIyIDI5LjYxMmMwIDQuOTc0LS4zNjUgMTEuODQ3LTEuMDk2IDIwLjYyaDI2LjU0MWMtLjU4NC0zLjY1NS0uODc3LTEwLjM4My0uODc3LTIwLjE4MnYtMzAuMDVjMC0xMi43MjQtMi44NTItMjMuNTQ1LTguNTU1LTMyLjQ2Ni02LjQzNS0xMC4yMzctMTUuNDI5LTE1LjM1NS0yNi45ODEtMTUuMzU1ek0zMTguMTI0IDE0OC4wNjhjLTExLjU1NCAwLTIwLjEwNy01LjExOS0yNS42NjUtMTUuMzU2LTQuMzg3LTguMzM1LTYuNTgxLTE5LjIzLTYuNTgxLTMyLjY4NFY2OS45NzZjMC05Ljk0NC0uMjkyLTE2LjY3Mi0uODc3LTIwLjE4MmgyNi4zMjNjLS40MzkgMy4yMTgtLjczMSAxMC4wOTEtLjg3OCAyMC42MmwtLjIxOSAyOS42MTNjMCA4LjMzNS45NSAxNC4zMzIgMi44NTEgMTcuOTg2IDIuMTk1IDQuNTM1IDYuMjE2IDYuODAyIDEyLjA2NSA2LjgwMiA0LjA5NSAwIDguNzAyLTIuNDE0IDEzLjgyLTcuMjM4VjYzLjYxNWMwLTIuNDg2LS4xNDctNS4zMzktLjQzOS04LjU1Ni0uMjk0LTMuMjE4LS40MzgtNC45NzItLjQzOC01LjI2NWgyNS40NDRjLS4yOTEgMi40ODYtLjQzOCA3LjA5My0uNDM4IDEzLjgydjY3LjEyNGMwIDguNjI3LjE0NyAxNC4xMTEuNDM4IDE2LjQ1MWgtMjMuOTA5di03Ljg5NmMtNi43MjggNS44NDktMTMuODkzIDguNzc1LTIxLjQ5NyA4Ljc3NXpNNDE2Ljg0NCAxNDcuODQ3Yy03Ljg5NiAwLTE0LjQ3Ny0yLjg1MS0xOS43NDItOC41NTN2Ny44OTZIMzczLjg1Yy40MzktMi40ODUuNjU5LTcuMDk0LjY1OS0xMy44MTlWMTcuMzI5YzAtOC42MjgtLjIyLTE0LjExMS0uNjU5LTE2LjQ1MWgyNS4wMDdjLS4yOTMgMi42MzItLjQzOCA4LjExNi0uNDM4IDE2LjQ1MXYzOC4xNjljNi43MjYtNC4yNDEgMTMuMzA5LTYuMzYyIDE5Ljc0Mi02LjM2MiAxMS41NTMgMCAyMC42MjEgNS4xMTggMjcuMjAxIDE1LjM1NSA1LjU1NyA4LjkyMSA4LjMzNSAxOS43NDIgOC4zMzUgMzIuNDY2IDAgMTMuMDE1LTIuOTI1IDI0LjM0OC04Ljc3MyAzNC03LjAyMiAxMS4yNjEtMTYuMzgxIDE2Ljg5LTI4LjA4IDE2Ljg5em0tMy4yOTEtNzUuNjc3Yy00LjgyNyAwLTkuODcxIDIuNDEyLTE1LjEzNiA3LjIzN3YzNy45NDljNC42OCA0LjUzMyA5LjI4NiA2LjgwMiAxMy44MTkgNi44MDIgNS43MDIgMCAxMC4wMTgtMy4xNDUgMTIuOTQyLTkuNDM0IDIuMzQxLTQuOTcyIDMuNTEtMTAuODk2IDMuNTEtMTcuNzY4LjAwMS0xNi41MjQtNS4wNDQtMjQuNzg2LTE1LjEzNS0yNC43ODZ6TTExMC4zMjUgMTY4LjIxNmMtMS4zOTItMS44ODktMy4xODItMy4wODItNS42MTYtMy4wODItMi4zMzcgMC00LjU3MyAxLjc5LTQuNTczIDQuMjI2IDAgNi4zMTIgMTQuODYxIDMuNjc3IDE0Ljg2MSAxNi4yNTMgMCA3LjUwNi00LjY3MiAxMi44MjMtMTIuMzI2IDEyLjgyMy01LjE3IDAtOC45NDctMi45ODEtMTEuNTMyLTcuMzA3bDQuNzIzLTQuNjIzYy45OTMgMi44ODQgMy42MjggNS40NjggNi43NiA1LjQ2OCAyLjk4MSAwIDQuODIxLTIuNTM0IDQuODIxLTUuNDE4IDAtMy44NzctMy41NzktNC45Ny02LjUxMS02LjExMi00LjgyMi0xLjk4OC04LjM1Mi00LjQyNC04LjM1Mi0xMC4yMzkgMC02LjIxMyA0LjYyMy0xMS4yMzMgMTAuOTM2LTExLjIzMyAzLjMzIDAgNy45NTIgMS42NDEgMTAuMjM5IDQuMTc1bC0zLjQzIDUuMDY5ek0xMzUuNTcgMTk4LjQzNmMtMTEuNDM0IDAtMTguNTQxLTguNzQ4LTE4LjU0MS0xOS43ODMgMC0xMS4xMzMgNy4zNTctMTkuNjgyIDE4LjU0MS0xOS42ODIgMTEuMTgzIDAgMTguNTM5IDguNTQ5IDE4LjUzOSAxOS42ODIgMCAxMS4wMzUtNy4xMDcgMTkuNzgzLTE4LjUzOSAxOS43ODN6bTAtMzIuMjU3Yy02LjkwOSAwLTEwLjk4NiA2LjExMi0xMC45ODYgMTIuMTc3IDAgNS43NjUgMi44ODQgMTIuODczIDEwLjk4NiAxMi44NzMgOC4xMDEgMCAxMC45ODMtNy4xMDggMTAuOTgzLTEyLjg3MyAwLTYuMDY1LTQuMDc1LTEyLjE3Ny0xMC45ODMtMTIuMTc3ek0xODIuNzMyIDE2OS45MDZjLTIuMDM4LTIuNDg1LTUuMTItMy45NzctOC4yNTItMy45NzctNy4wMDggMC0xMS4wMzQgNi40NjEtMTEuMDM0IDEyLjkyNSAwIDYuMzEyIDQuMTc2IDEyLjYyMyAxMC45ODUgMTIuNjIzIDMuMTMxIDAgNi4yNjMtMS42NDEgOC4zMDEtMy45NzV2OC42OTZjLTIuNzM0IDEuMjk0LTUuNDY4IDIuMjM3LTguNTAxIDIuMjM3LTEwLjUzNiAwLTE4LjM0LTkuMDk2LTE4LjM0LTE5LjQzNCAwLTEwLjYzOCA3LjUwNS0yMC4wMzEgMTguNDktMjAuMDMxIDIuOTMyIDAgNS44MTQuNzk2IDguMzUxIDIuMTg3djguNzQ5ek0xOTQuODU1IDE5Ny40NDJoLTcuMzA2di0zNy40NzdoNy4zMDZ6TTIwNy44MjUgMTg5LjUzOWwtMy4wODIgNy45MDJoLTcuNzA0bDE0LjYxNC0zOC40NzFoNS42NjZsMTQuMjE2IDM4LjQ3MWgtNy44MDVsLTIuODgzLTcuOTAyaC0xMy4wMjJ6bTYuMzEyLTE5LjU4NWgtLjA5OWwtNC4xMjYgMTMuNjIxaDguODk3bC00LjY3Mi0xMy42MjF6TTI0MS4wNzEgMTkxLjA4aDEwLjMzOXY2LjM2MmgtMTcuNjQ1di0zNy40NzdoNy4zMDZ6TTI5My4xNTMgMTY5LjkwNmMtMi4wMzctMi40ODUtNS4xMTktMy45NzctOC4yNTEtMy45NzctNy4wMDggMC0xMS4wMzQgNi40NjEtMTEuMDM0IDEyLjkyNSAwIDYuMzEyIDQuMTc1IDEyLjYyMyAxMC45ODQgMTIuNjIzIDMuMTMyIDAgNi4yNjQtMS42NDEgOC4zMDEtMy45NzV2OC42OTZjLTIuNzMzIDEuMjk0LTUuNDY4IDIuMjM3LTguNDk5IDIuMjM3LTEwLjUzNyAwLTE4LjM0MS05LjA5Ni0xOC4zNDEtMTkuNDM0IDAtMTAuNjM4IDcuNTA1LTIwLjAzMSAxOC40OS0yMC4wMzEgMi45MzIgMCA1LjgxNS43OTYgOC4zNSAyLjE4N3Y4Ljc0OXpNMzE0LjcyMiAxOTguNDM2Yy0xMS40MzMgMC0xOC41NC04Ljc0OC0xOC41NC0xOS43ODMgMC0xMS4xMzMgNy4zNTYtMTkuNjgyIDE4LjU0LTE5LjY4MnMxOC41MzkgOC41NDkgMTguNTM5IDE5LjY4MmMwIDExLjAzNS03LjEwOCAxOS43ODMtMTguNTM5IDE5Ljc4M3ptMC0zMi4yNTdjLTYuOTEgMC0xMC45ODUgNi4xMTItMTAuOTg1IDEyLjE3NyAwIDUuNzY1IDIuODg0IDEyLjg3MyAxMC45ODUgMTIuODczczEwLjk4NS03LjEwOCAxMC45ODUtMTIuODczYy4wMDEtNi4wNjUtNC4wNzYtMTIuMTc3LTEwLjk4NS0xMi4xNzd6TTMzNi44MzMgMTU5Ljk2NWgxMC40MzljMTAuODM0IDAgMTguMDkxIDguMTAyIDE4LjA5MSAxOC43ODcgMCAxMC41MzktNy40NTUgMTguNjg5LTE4LjE0MyAxOC42ODloLTEwLjM4OHYtMzcuNDc2em03LjMwNyAzMS4xMTVoMS4xOTJjOC45OTUgMCAxMi40NzctNC45NzEgMTIuNDc3LTEyLjM3OCAwLTguMTUtNC4xNzUtMTIuMzc1LTEyLjQ3Ny0xMi4zNzVoLTEuMTkydjI0Ljc1M3pNMzc2LjI0MyAxOTcuNDQyaC03LjMwOHYtMzcuNDc3aDcuMzA4ek0zODEuNTU3IDE1OC45NzFoNS4yN2wxOS43MzIgMjYuMTk0aC4wOTl2LTI1LjJoNy4zMDh2MzguMjIzaC01LjI3bC0xOS43MzEtMjYuMTk1aC0uMXYyNS40NDloLTcuMzA4ek00NTIuMzgyIDE3Ny41MTF2Ljk0NGMwIDEwLjU4Ni01LjQxOSAxOS45OC0xNy4wNDggMTkuOTgtMTAuOTM2IDAtMTcuODQ2LTkuMjQ0LTE3Ljg0Ni0xOS41ODIgMC0xMC42ODggNy4xMDgtMTkuODgzIDE4LjI5Mi0xOS44ODMgNi4zNjIgMCAxMS45MjkgMy4yMzEgMTQuODEyIDguOTQ2bC02LjQ2MiAzLjQ3OWMtMS40OTEtMy4zNzktNC42NzItNS45NjQtOC41NDktNS45NjQtNy4wNTkgMC0xMC41MzcgNy4yMDctMTAuNTM3IDEzLjQyMSAwIDYuMjExIDMuNTI4IDEzLjEyIDEwLjU4NiAxMy4xMiA0LjU3MyAwIDguNDAxLTMuOTc2IDguNTUtOC41aC03Ljk1M3YtNS45NjNoMTYuMTU1eiIvPjwvc3ZnPgo='
                $('.vditor-toolbar').prepend(`<a href='https://yunwan1x.github.io'><img width='64px' style='left: 10px;top:5px;position: absolute;' src='${svg}' /></a> `)
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

