$(document).ready(function (){

    const loading=(loading)=>{
        if(!loading){
            $('#spinner-border').hide();
        }else {
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
    const dateFormat = function(date,fmt) {
        var o = {
            "M+" : date.getMonth()+1,                 //月份
            "d+" : date.getDate(),                    //日
            "h+" : date.getHours(),                   //小时
            "m+" : date.getMinutes(),                 //分
            "s+" : date.getSeconds(),                 //秒
            "q+" : Math.floor((date.getMonth()+3)/3), //季度
            "S" : date.getMilliseconds()             //毫秒
        };
        if(/(y+)/.test(fmt)) {
            fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
        }
        for(var k in o) {
            if(new RegExp("("+ k +")").test(fmt)){
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
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
        _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        encode : function (input) {
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
        decode : function (input) {
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
        _utf8_encode : function (string) {
            string = string.replace(/\r\n/g,"\n");
            var utftext = "";
            for (var n = 0; n < string.length; n++) {
                var c = string.charCodeAt(n);
                if (c < 128) {
                    utftext += String.fromCharCode(c);
                }
                else if((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
                else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
            }
            return utftext;
        },
        // private method for UTF-8 decoding
        _utf8_decode : function (utftext) {
            var string = "";
            var i = 0;
            let c2=0,c=0,c1=0 ,c3=0;
            while ( i < utftext.length ) {
                c = utftext.charCodeAt(i);
                if (c < 128) {
                    string += String.fromCharCode(c);
                    i++;
                }
                else if((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i+1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                }
                else {
                    c2 = utftext.charCodeAt(i+1);
                    c3 = utftext.charCodeAt(i+2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }
            }
            return string;
        },

    }
    const  defaultText=(type)=>{
        return(
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

    const defaultAvatar='<svg  viewBox="0 0 1024 1024" width="16" height="16" version="1.1" xmlns="http://www.w3.org/2000/svg">\n  <path d="M64 524C64 719.602 189.356 885.926 364.113 947.017 387.65799 953 384 936.115 384 924.767L384 847.107C248.118 863.007 242.674 773.052 233.5 758.001 215 726.501 171.5 718.501 184.5 703.501 215.5 687.501 247 707.501 283.5 761.501 309.956 800.642 361.366 794.075 387.658 787.497 393.403 763.997 405.637 743.042 422.353 726.638 281.774 701.609 223 615.67 223 513.5 223 464.053 239.322 418.406 271.465 381.627 251.142 320.928 273.421 269.19 276.337 261.415 334.458 256.131 394.888 302.993 399.549 306.685 432.663 297.835 470.341 293 512.5 293 554.924 293 592.81 297.896 626.075 306.853 637.426 298.219 693.46 258.054 747.5 262.966 750.382 270.652 772.185 321.292 753.058 381.083 785.516 417.956 802 463.809 802 513.5 802 615.874 742.99 701.953 601.803 726.786 625.381 750.003 640 782.295 640 818.008L640 930.653C640.752 939.626 640 948.664978 655.086 948.665 832.344 888.962 960 721.389 960 524 960 276.576 759.424 76 512 76 264.577 76 64 276.576 64 524Z"></path>\n</svg>'
    const isPhone=window.innerWidth<500
    const loginButton={
        name:"login",
        icon:"<div id='login'>登录 github</div>",
        click (element,vditor) {
        },
    }
    const saveButton={
        name:"save",
        tip:"保存",
        tipPosition:"n",
        icon:'<svg t="1628696907346" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3054" width="32" height="32" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><style type="text/css"></style></defs><path d="M617.63 322.96c-11.04-0.05-19.97-10.81-19.97-24.08V197.12c0.65-13.28 10.14-23.4 21.18-22.62 10.13 0.72 18.22 10.44 18.82 22.62v101.75c0 13.3-8.97 24.09-20.03 24.09z"  p-id="3055"></path><path d="M870 64H154c-49.71 0-90 40.29-90 90v716c0 49.71 40.29 90 90 90h716c49.71 0 90-40.29 90-90V154c0-49.71-40.29-90-90-90z m50 796c0 33.14-26.86 60-60 60H164c-33.14 0-60-26.86-60-60V164c0-33.14 26.86-60 60-60h696c33.14 0 60 26.86 60 60v696z"  p-id="3056"></path><path d="M703.88 591.29H320.12c-49.71 0-90 40.29-90 90V960h563.75V681.29c0.01-49.71-40.29-90-89.99-90z m50 328.71H270.12V691.29c0-33.14 26.86-60 60-60h363.75c33.14 0 60 26.86 60 60V920zM350.12 434.71h323.75c49.71 0 90-40.29 90-90V64H260.12v280.71c0 49.71 40.3 90 90 90z m-50-330.71h423.75v230.71c0 33.14-26.86 60-60 60H360.12c-33.14 0-60-26.86-60-60V104z"  p-id="3057"></path></svg>',
        hotkey: '⌘S',
        click (element,vditor) {
            if(options.saving)return
            if(isAdmin(options)){
                options.saving=true;
                savePost(options).catch(e=>{
                    error(e)
                })
            }else {
                options.saving=true;
                error("你不是管理员！")
            }
        },
    }
    const githubButton={
        name:'更多',
        tipPosition:"n",
        icon:`<div id="imageLogo">${defaultAvatar}</div>`,
        tip: 'github',
        click (element,vditor) {
        },
        toolbar:[loginButton]
    }
    const toolbars=["headings" , "bold" , "italic" , "strike" , "line" , "quote" , "list" , "ordered-list" , "check" ,"outdent" ,"indent" , "code" , "inline-code","undo" , "redo","link" , "table" , "edit-mode" , "both" , "preview"  , "outline" , "code-theme" , "content-theme","export"]
    const config={
        toolbarConfig: {
            pin: true,
        },
        resize:{
            enable:false,
            position:"bottom",
            after(number){

            }
        },

        counter:{
            enable:false,
            type:"text"
        },

        height: window.innerHeight,
        outline:{
            enable:true
        },
        preview: {
            markdown: {
                "codeBlockPreview": true,
                autoSpace:false
            },
            mode:isPhone?"editor":"both",
            hljs:{
                lineNumber:true
            }
        },
        mode: "ir",
        typewriterMode:true,
        cache:{
            enable:false
        },
        after () {
            $('#login').on('click',function (){
                login(options)
            })
            loading(false)
            init(options)
        },
        toolbar: window.screen.width<500?[
            'preview',
            'edit-mode',"both",saveButton,githubButton,{name:"more",toolbar: toolbars}]:toolbars.concat([saveButton,githubButton])
    }
    const vditor = new Vditor('vditor',config )

    $(window).resize(function(){
        vditor.vditor.element.style.height=window.innerHeight+"px";
    });

    const options=Object.assign(window.GT_CONFIG,{
        proxy: 'https://cors-anywhere.azm.workers.dev/https://github.com/login/oauth/access_token',
    })


    function init(options){
        const query = queryParse()
        const hash=queryHash();
        const {path,posturl}=hash
        options.path=path
        options.posturl=posturl
        options.editMode=path?true:false
        if (query.code) {
            const code = query.code
            delete query.code
            const replacedUrl = `${window.location.origin}${window.location.pathname}${queryStringify(query)}${window.location.hash}`
            history.replaceState(null, null, replacedUrl)
            axiosJSON.post(options.proxy, {
                code,
                client_id: options.clientID,
                client_secret: options.clientSecret,
            }).then(res => {
                if (res.data && res.data.access_token) {
                    setAccessToken( res.data.access_token,options)
                    getInit(options)
                } else {
                    console.log('res.data err:', res.data)
                    error("no access_token")
                }
            }).catch(err => {
                error(err)
                console.log(err)
            })
        } else {
            getInit(options)
                .catch(err => {
                    error(err)
                    console.log(err)
                })
        }
    }

    function getPostContent (options){
        const { owner, repo } = options
        const {comment,path,editMode,type}=options;
        const failRet={status:404,data:{content:editMode?"":Base64.encode(defaultText(type))
                ,sha:""}};
        if(editMode){
            return axiosGithub.get(`/repos/${owner}/${repo}/contents/${path}`).then(fileinfo=>fileinfo,fail=>error(fail)).catch(fail=>error(fail))
        }else {
            return Promise.resolve(failRet)
        }
    }

    function userLogin(user){
        const {avatar_url,login}=user;
        const avatar=`<img src="${avatar_url}" width="16" height="16" />`;
        $('#imageLogo').html(avatar)
        $('#login').text("登出 github").click(function () {
            logout(options)
        });
    }

    function getUserInfo (options) {
        if (!getAccessToken(options)) {
            return new Promise(resolve => {
                resolve()
            })
        }
        const user=getUser(options);
        if(user.login){
            userLogin(user);
            return Promise.resolve(user)
        }else {
            return axiosGithub.get('/user', {
                headers: {
                    Authorization: `token ${getAccessToken(options)}`
                }
            }).then(res => {
                setUser(options,res.data)
                userLogin(getUser(options))
            }).catch(err => {
                console.error(err)
                error(err)
            })
        }

    }

    function error(msg,timeout,fn){
        const html=`<div style="background: #dc3545;color: white;padding: 0.5em 1em;border-radius: 3px">${msg.message&&msg.message||msg}</div>`
        $('.vditor-tip__content').html(html)
        const parent=$('.vditor-tip__content').parent();
        parent.show()
        // parent.addClass('vditor-tip--show')
        if(!timeout){
            timeout=3000
        }
        setTimeout(()=>{
            parent.hide()
            options.saving=false
            fn&&fn()
        },timeout)
    }

    function success(msg,timeout,fn){
        const html=`<div style="color: white;background: #198754;padding: 0.5em 1em;border-radius: 3px">${msg}</div>`
        $('.vditor-tip__content').html(html)
        const parent=$('.vditor-tip__content').parent();
        parent.show()
        // parent.addClass('vditor-tip--show')
        if(!timeout){
            timeout=3000
        }
        setTimeout(()=>{
            parent.hide()
            options.saving=false
            fn&&fn()
        },timeout)
    }

    //changhui
    async function savePost (options) {
        const { owner, repo } = options
        var {path,editMode}=options
        const comment=vditor.getValue();
        //代表新增
        if(!editMode){
            var title=""

            if(/title:\s*(|[^-\s.]+)\s*$/m.test(comment)){
                title=RegExp.$1
            }
            if(!title){
                throw new Error("title 不合法！");
            }
            var category="";
            if(/layout:\s*(\S+)\s*$/m.test(comment)){
                if(RegExp.$1=="post"){
                    category="_posts"
                    path=`${category}/${dateFormat(new Date(),"yyyy-MM-dd")}-${title}.md`
                }else if(RegExp.$1=="wiki"){
                    category="_wiki"
                    path=`${category}/${title}.md`
                }
            }
            if(!category){
                throw new Error("layout: wiki | post");
            }


            try {
                const fileInfo=await axiosGithub.get(`/repos/${owner}/${repo}/contents/${path}`)
                if(fileInfo) {
                    const  msg=`${path} 已经存在`
                    return Promise.reject(msg)
                }
            } catch (e) {
            }
            axiosGithub.put(`/repos/${owner}/${repo}/contents/${path}`, {
                message: "create by gitpost "+ dateFormat(new Date(),"yyyy-MM-dd hh:mm:ss"),
                content: Base64.encode(comment),
            }, {
                headers: {
                    Authorization: `token ${getAccessToken(options)}`
                }
            }).then(res => {
                location.replace(`${location.href}#path=${path}`)
                options.editMode=true
                success("保存成功！")
            },(fail)=>{
                if(fail.response){
                    error(fail.response.data&&fail.response.data.message||fail.response.data)
                }else {
                    error(fail)
                }
            }).catch(e=>{
                error(e)
            })

        }else {
            let fileInfo;
            try {
                fileInfo=await axiosGithub.get(`/repos/${owner}/${repo}/contents/${path}`)
            } catch (e) {
            }
            const {data:{content,sha}}=fileInfo?fileInfo:{status:404,data:{content:"",sha:""}}
            if(!sha)throw new Error("文件正在创建中...稍后")
            const dateStr=dateFormat(new Date(),"yyyy-MM-dd hh:mm:ss");
            axiosGithub.put(`/repos/${owner}/${repo}/contents/${path}`, {
                message: "update by gitpost "+dateStr ,
                content: Base64.encode(comment),
                sha:sha
            }, {
                headers: {
                    Authorization: `token ${getAccessToken(options)}`
                }
            }).then(res => {
                success("保存成功！")
                return res.data
            },fail=>{
                if(fail.response){
                    error(fail.response.data&&fail.response.data.message||fail.response.data)
                }else {
                    error(fail)
                }
            }).catch(e=>{
                error(fail)
            })
        }
    }


    function logout (options) {
        options.user=null;
        options._accessToken=null;
        window.localStorage.removeItem(GT_ACCESS_TOKEN)
        window.localStorage.removeItem("GT_USER")
        location.reload()
    }




    function login (options)  {
        const { comment } = options
        window.localStorage.setItem(GT_COMMENT, encodeURIComponent(comment))
        window.location.href = getLoginLink(options)
    }


    function getUser(options){
        const str=options.user || window.localStorage.getItem("GT_USER")
        return str&&JSON.parse(str)||{}
    }

    function setUser(options,user){
        var str=JSON.stringify(user);
        window.localStorage.setItem("GT_USER", str)
        options.user = str
    }


    function getAccessToken (options) {
        return options._accessToke || window.localStorage.getItem(GT_ACCESS_TOKEN)
    }
    function setAccessToken (token,options) {
        window.localStorage.setItem(GT_ACCESS_TOKEN, token)
        options._accessToken = token
    }

    function getLoginLink (options) {
        const githubOauthUrl = 'https://github.com/login/oauth/authorize'
        const { clientID } = options
        const query = {
            client_id: clientID,
            redirect_uri: window.location.href,
            scope: 'public_repo',

        }
        return `${githubOauthUrl}?${queryStringify(query)}`
    }
    function isAdmin (options) {
        const { admin } = options
        const user=getUser(options)
        return user.login && admin&&admin.toLowerCase().includes(user.login.toLowerCase())
    }

    function getInit (options) {
        return getUserInfo(options).then(user=>getPostContent(options)).then(({status,data:{content,sha}}) =>{
            vditor.setValue(Base64.decode(content))
        })
    }



})

