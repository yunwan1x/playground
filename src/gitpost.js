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

    const logoSVG=`<svg style="position: absolute;left: 10px;top:5px" t="1629627295270" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3374" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24"><defs><style type="text/css"></style></defs><path d="M970.752 811.008H93.184c-29.696 0-53.248-23.552-53.248-53.248V121.856c0-31.744 25.6-58.368 58.368-58.368h867.328c31.744 0 58.368 25.6 58.368 58.368V757.76c0 29.696-23.552 53.248-53.248 53.248z" fill="#1651E5" opacity=".3" p-id="3375"></path><path d="M935.936 787.456H63.488c-34.816 0-63.488-28.672-63.488-63.488V87.04C0 51.2 28.672 22.528 63.488 22.528h872.448c34.816 0 63.488 28.672 63.488 63.488v635.904c0 36.864-28.672 65.536-63.488 65.536zM63.488 38.912c-26.624 0-48.128 21.504-48.128 48.128v635.904c0 26.624 21.504 48.128 48.128 48.128h872.448c26.624 0 48.128-21.504 48.128-48.128V87.04c0-26.624-21.504-48.128-48.128-48.128H63.488z" fill="#1651E5" p-id="3376"></path><path d="M901.12 646.144H98.304c-9.216 0-16.384-7.168-16.384-16.384V122.88c0-9.216 7.168-16.384 16.384-16.384H901.12c9.216 0 16.384 7.168 16.384 16.384v505.856c0 9.216-7.168 17.408-16.384 17.408z" fill="#FFFFFF" p-id="3377"></path><path d="M901.12 653.312H98.304c-13.312 0-24.576-11.264-24.576-24.576V122.88c0-13.312 11.264-24.576 24.576-24.576H901.12c13.312 0 24.576 11.264 24.576 24.576v505.856c0 14.336-11.264 24.576-24.576 24.576zM98.304 113.664c-5.12 0-9.216 4.096-9.216 9.216v505.856c0 5.12 4.096 9.216 9.216 9.216H901.12c5.12 0 9.216-4.096 9.216-9.216V122.88c0-5.12-4.096-9.216-9.216-9.216H98.304z" fill="#1651E5" p-id="3378"></path><path d="M901.12 646.144H98.304c-9.216 0-16.384-7.168-16.384-16.384V122.88c0-9.216 7.168-16.384 16.384-16.384H901.12c9.216 0 16.384 7.168 16.384 16.384v505.856c0 9.216-7.168 17.408-16.384 17.408z" fill="#FFFFFF" p-id="3379"></path><path d="M8.192 637.952h984.064v16.384H8.192z" fill="#1651E5" p-id="3380"></path><path d="M564.224 720.896H436.224c-4.096 0-8.192-4.096-8.192-8.192s4.096-8.192 8.192-8.192h128c4.096 0 8.192 4.096 8.192 8.192s-4.096 8.192-8.192 8.192z" p-id="3381"></path><path d="M348.16 924.672c-3.072 0-5.12-1.024-7.168-4.096-2.048-4.096-1.024-9.216 3.072-11.264 37.888-21.504 62.464-61.44 62.464-105.472 0-8.192-1.024-16.384-2.048-24.576-1.024-4.096 2.048-8.192 6.144-9.216 4.096-1.024 8.192 2.048 9.216 6.144 2.048 9.216 3.072 18.432 3.072 27.648 0 49.152-26.624 95.232-70.656 119.808-2.048 1.024-3.072 1.024-4.096 1.024zM652.288 924.672c-1.024 0-3.072 0-4.096-1.024-43.008-24.576-70.656-69.632-70.656-119.808 0-9.216 1.024-18.432 3.072-27.648 1.024-4.096 5.12-7.168 9.216-6.144 4.096 1.024 7.168 5.12 6.144 9.216-2.048 8.192-2.048 16.384-2.048 24.576 0 44.032 23.552 83.968 62.464 105.472 4.096 2.048 5.12 7.168 3.072 11.264-2.048 2.048-4.096 4.096-7.168 4.096zM702.464 460.8H297.984c-19.456 0-35.84-16.384-35.84-35.84V308.224c0-19.456 16.384-35.84 35.84-35.84h46.08c4.096 0 8.192 4.096 8.192 8.192s-4.096 8.192-8.192 8.192h-46.08c-11.264 0-19.456 9.216-19.456 19.456v116.736c0 11.264 9.216 19.456 19.456 19.456h404.48c11.264 0 19.456-9.216 19.456-19.456V308.224c0-11.264-9.216-19.456-19.456-19.456H413.696c-4.096 0-8.192-4.096-8.192-8.192s4.096-8.192 8.192-8.192h288.768c19.456 0 35.84 16.384 35.84 35.84v116.736c0 19.456-16.384 35.84-35.84 35.84z" fill="#1651E5" p-id="3382"></path><path d="M381.952 288.768h-7.168c-4.096 0-8.192-4.096-8.192-8.192s4.096-8.192 8.192-8.192h7.168c4.096 0 8.192 4.096 8.192 8.192s-3.072 8.192-8.192 8.192z" fill="#1651E5" p-id="3383"></path><path d="M356.352 401.408l-23.552-71.68h13.312l12.288 40.96 5.12 15.36c0-1.024 2.048-6.144 4.096-14.336l12.288-41.984h13.312l11.264 40.96 4.096 13.312 4.096-13.312 13.312-40.96H440.32l-24.576 71.68h-13.312L389.12 359.424l-3.072-12.288-16.384 55.296h-13.312zM465.92 401.408l-23.552-71.68h13.312l12.288 40.96 5.12 15.36c0-1.024 2.048-6.144 4.096-14.336l12.288-41.984h13.312l11.264 40.96 4.096 13.312 4.096-13.312 13.312-40.96h13.312l-24.576 71.68h-13.312L498.688 358.4l-3.072-12.288-16.384 55.296h-13.312zM574.464 401.408l-23.552-71.68h13.312l12.288 40.96 5.12 15.36c0-1.024 2.048-6.144 4.096-14.336l12.288-41.984h13.312l11.264 40.96 4.096 13.312 4.096-13.312 13.312-40.96h13.312l-24.576 71.68h-13.312L607.232 358.4l-3.072-11.264-16.384 55.296h-13.312z" fill="#058007" p-id="3384"></path><path d="M736.256 1001.472h-430.08c-17.408 0-31.744-14.336-31.744-31.744 0-17.408 14.336-31.744 31.744-31.744h430.08c17.408 0 31.744 14.336 31.744 31.744 0 17.408-14.336 31.744-31.744 31.744z" fill="#1651E5" opacity=".1" p-id="3385"></path><path d="M714.752 987.136h-430.08c-21.504 0-39.936-17.408-39.936-39.936 0-21.504 17.408-39.936 39.936-39.936h430.08c21.504 0 39.936 17.408 39.936 39.936s-17.408 39.936-39.936 39.936z m-430.08-62.464c-13.312 0-23.552 10.24-23.552 23.552s10.24 23.552 23.552 23.552h430.08c13.312 0 23.552-10.24 23.552-23.552s-10.24-23.552-23.552-23.552h-430.08z" fill="#1651E5" p-id="3386"></path></svg>`
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

    const defaultAvatar = '<svg  viewBox="0 0 1024 1024" width="16" height="16" version="1.1" xmlns="http://www.w3.org/2000/svg">\n  <path d="M64 524C64 719.602 189.356 885.926 364.113 947.017 387.65799 953 384 936.115 384 924.767L384 847.107C248.118 863.007 242.674 773.052 233.5 758.001 215 726.501 171.5 718.501 184.5 703.501 215.5 687.501 247 707.501 283.5 761.501 309.956 800.642 361.366 794.075 387.658 787.497 393.403 763.997 405.637 743.042 422.353 726.638 281.774 701.609 223 615.67 223 513.5 223 464.053 239.322 418.406 271.465 381.627 251.142 320.928 273.421 269.19 276.337 261.415 334.458 256.131 394.888 302.993 399.549 306.685 432.663 297.835 470.341 293 512.5 293 554.924 293 592.81 297.896 626.075 306.853 637.426 298.219 693.46 258.054 747.5 262.966 750.382 270.652 772.185 321.292 753.058 381.083 785.516 417.956 802 463.809 802 513.5 802 615.874 742.99 701.953 601.803 726.786 625.381 750.003 640 782.295 640 818.008L640 930.653C640.752 939.626 640 948.664978 655.086 948.665 832.344 888.962 960 721.389 960 524 960 276.576 759.424 76 512 76 264.577 76 64 276.576 64 524Z"></path>\n</svg>'
    const isPhone = window.innerWidth < 500
    const loginButton = {
        name: "login",
        icon: "<div id='login'>登录 github</div>",
        click(element, vditor) {
        },
    }
    const saveButton = {
        name: "save",
        tip: "保存",
        tipPosition: "n",
        icon: '<svg t="1629628751644" class="icon"  viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10843" xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="16"><defs><style type="text/css"></style></defs><path d="M870.826667 273.493333l-120.32-120.32A85.333333 85.333333 0 0 0 689.92 128H213.333333a85.333333 85.333333 0 0 0-85.333333 85.333333v597.333334a85.333333 85.333333 0 0 0 85.333333 85.333333h597.333334a85.333333 85.333333 0 0 0 85.333333-85.333333V334.08a85.333333 85.333333 0 0 0-25.173333-60.586667zM384 277.333333V213.333333h256v64a21.333333 21.333333 0 0 1-21.333333 21.333334h-213.333334a21.333333 21.333333 0 0 1-21.333333-21.333334zM725.333333 810.666667H298.666667v-320a21.333333 21.333333 0 0 1 21.333333-21.333334h384a21.333333 21.333333 0 0 1 21.333333 21.333334z m-106.666666-170.666667h-213.333334a21.333333 21.333333 0 0 0-21.333333 21.333333v42.666667a21.333333 21.333333 0 0 0 21.333333 21.333333h213.333334a21.333333 21.333333 0 0 0 21.333333-21.333333v-42.666667a21.333333 21.333333 0 0 0-21.333333-21.333333z" p-id="10844"></path></svg>',
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
        tip: "paste",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="16" height="16" ><path d="M128 184c0-30.879 25.122-56 56-56h136V56c0-13.255-10.745-24-24-24h-80.61C204.306 12.89 183.637 0 160 0s-44.306 12.89-55.39 32H24C10.745 32 0 42.745 0 56v336c0 13.255 10.745 24 24 24h104V184zm32-144c13.255 0 24 10.745 24 24s-10.745 24-24 24-24-10.745-24-24 10.745-24 24-24zm184 248h104v200c0 13.255-10.745 24-24 24H184c-13.255 0-24-10.745-24-24V184c0-13.255 10.745-24 24-24h136v104c0 13.2 10.8 24 24 24zm104-38.059V256h-96v-96h6.059a24 24 0 0 1 16.97 7.029l65.941 65.941a24.002 24.002 0 0 1 7.03 16.971z"/></svg>`,
        tipPosition: "n",
        async click(element){
            let text="https://www.baidu.com"
            try {
                 text = await navigator.clipboard.readText();
            } catch (e) {
            }
            if(text.startsWith("http")){
                vditor.insertValue(`[链接](${text})`)
            }else {
                vditor.insertValue(text)
            }
            console.log(text);
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
        preview: {
            markdown: {
                codeBlockPreview: true,
                autoSpace: false
            },
            mode: isPhone ? "editor" : "both",
        },
        mode: "ir",
        typewriterMode: true,
        cache: {
            enable: true
        },
        async after() {
            $('#login').on('click', function () {
                login(options)
            })
            // $('.vditor-toolbar').prepend(`${logoSVG}`)
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
                icon:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><path d="M5 9h2.31l.32-3h2l-.32 3h2l.32-3h2l-.32 3H15v2h-1.9l-.2 2H15v2h-2.31l-.32 3h-2l.32-3h-2l-.32 3h-2l.32-3H5v-2h1.9l.2-2H5V9m4.1 2-.2 2h2l.2-2M19 6h-2v8h2m0 2h-2v2h2z"/></svg>`,
                toolbar: toolbars
            },{
                name: "more1",
                icon:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><path d="M4 2a2 2 0 0 0-2 2v8h2V8h2v4h2V4a2 2 0 0 0-2-2H4m0 2h2v2H4m18 9.5V14a2 2 0 0 0-2-2h-4v10h4a2 2 0 0 0 2-2v-1.5a1.54 1.54 0 0 0-1.5-1.5 1.54 1.54 0 0 0 1.5-1.5M20 20h-2v-2h2v2m0-4h-2v-2h2M5.79 21.61l-1.58-1.22 14-18 1.58 1.22z"/></svg>`,
                toolbar: toolbars1
            }, githubButton] : toolbars.concat(["headings",...toolbars1,saveButton, pasterButton,githubButton])
    }
    const vditor = new Vditor('vditor', config)

    $(window).resize(function () {
        vditor.vditor.element.style.height = window.innerHeight + "px";
    });


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
        if (editMode) {
            const res = await axiosGithub.get(`/repos/${owner}/${repo}/contents/${path}`);
            const {data: {content, sha}} = res
            return {content: Base64.decode(content), sha}

        } else {
            return {content: defaultText(type), sha: ""}
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
        var {path, editMode, sha, content} = options
        const comment = vditor.getValue();
        const auth = getAccessToken(options)
        if (comment.trim() == content.trim()) {
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
        try {
            let fileInfo = await axiosGithub.get(`/repos/${owner}/${repo}/contents/${path}`)
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
        return str && JSON.parse(str) || {}
    }

    function setUser(options, user) {
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

