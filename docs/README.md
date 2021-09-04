## PWA进阶
1. manifest 文件

```json
{
  "name": "playground",
  "short_name": "playground",
  "start_url": ".",
  "display": "standalone",
  "background_color": "#0e932e",
  "description": "A readable Hacker News app.",
  "icons": [{
    "src": "images/微软_icon48.png",
    "sizes": "48x48",
    "type": "image/png"
  }, {
    "src": "images/微软_icon72.png",
    "sizes": "72x72",
    "type": "image/png"
  }, {
    "src": "images/微软_icon96.png",
    "sizes": "96x96",
    "type": "image/png"
  }, {
    "src": "images/微软_icon144.png",
    "sizes": "144x144",
    "type": "image/png"
  }, {
    "src": "images/微软_icon168.png",
    "sizes": "168x168",
    "type": "image/png"
  }, {
    "src": "images/微软_icon192.png",
    "sizes": "192x192",
    "type": "image/png"
  },{
    "src": "images/微软_icon256.png",
    "sizes": "256x256",
    "type": "image/png"
  }],
  "related_applications": [{
    "platform": "play",
    "url": "https://play.google.com/store/apps/details?id=cheeaun.hackerweb"
  }]
}
```

2. 安装sw.js

```javascript
if (typeof navigator.serviceWorker !== 'undefined') {
    navigator.serviceWorker.register('sw.js')
}
```

3. sw.js内容

```javascript
/* ===========================================================
 * docsify sw.js
 * ===========================================================
 * Copyright 2016 @huxpro
 * Licensed under Apache 2.0
 * Register service worker.
 * ========================================================== */

const RUNTIME = 'docsify'
const HOSTNAME_WHITELIST = [
    self.location.hostname,
    'fonts.gstatic.com',
    'fonts.googleapis.com',
    'cdn.jsdelivr.net'
]

// The Util Function to hack URLs of intercepted requests
const getFixedUrl = (req) => {
    var now = Date.now()
    var url = new URL(req.url)

    // 1. fixed http URL
    // Just keep syncing with location.protocol
    // fetch(httpURL) belongs to active mixed content.
    // And fetch(httpRequest) is not supported yet.
    url.protocol = self.location.protocol

    // 2. add query for caching-busting.
    // Github Pages served with Cache-Control: max-age=600
    // max-age on mutable content is error-prone, with SW life of bugs can even extend.
    // Until cache mode of Fetch API landed, we have to workaround cache-busting with query string.
    // Cache-Control-Bug: https://bugs.chromium.org/p/chromium/issues/detail?id=453190
    if (url.hostname === self.location.hostname) {
        url.search += (url.search ? '&' : '?') + 'cache-bust=' + now
    }
    return url.href
}

/**
 *  @Lifecycle Activate
 *  New one activated when old isnt being used.
 *
 *  waitUntil(): activating ====> activated
 */
self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim())
})

/**
 *  @Functional Fetch
 *  All network requests are being intercepted here.
 *
 *  void respondWith(Promise<Response> r)
 */
self.addEventListener('fetch', event => {
    // Skip some of cross-origin requests, like those for Google Analytics.
    if (HOSTNAME_WHITELIST.indexOf(new URL(event.request.url).hostname) > -1) {
        // Stale-while-revalidate
        // similar to HTTP's stale-while-revalidate: https://www.mnot.net/blog/2007/12/12/stale
        // Upgrade from Jake's to Surma's: https://gist.github.com/surma/eb441223daaedf880801ad80006389f1
        const cached = caches.match(event.request)
        const fixedUrl = getFixedUrl(event.request)
        const fetched = fetch(fixedUrl, { cache: 'no-store' })
        const fetchedCopy = fetched.then(resp => resp.clone())

        // Call respondWith() with whatever we get first.
        // If the fetch fails (e.g disconnected), wait for the cache.
        // If there’s nothing in cache, wait for the fetch.
        // If neither yields a response, return offline pages.
        event.respondWith(
            Promise.race([fetched.catch(_ => cached), cached])
                .then(resp => resp || fetched)
                .catch(_ => { /* eat any errors */ })
        )

        // Update the cache with the version we fetched (only for ok status)
        event.waitUntil(
            Promise.all([fetchedCopy, caches.open(RUNTIME)])
                .then(([response, cache]) => response.ok && cache.put(event.request, response))
                .catch(_ => { /* eat any errors */ })
        )
    }
})
```
> 参考：
> 
>  1. [MDN](https://developer.mozilla.org/zh-CN/docs/Web/Manifest)    
>  1. [service worker api](https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API)
>  3. [service worker使用](https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API/Using_Service_Workers)

## 资源
1. [unicode参考](https://unicode-table.com/cn/emoji/)

## 参考
1. [docsify参考](https://docsify.js.org/#/zh-cn/markdown)

## markdown 参考
1. [docsify awesome](https://docsify.js.org/#/zh-cn/awesome)
2. [docsify code](https://github.com/docsifyjs/docsify/blob/develop/index.html)


## 运行+
```bash
echo "hello"
python3 -m http.server --bind 127.0.0.1 3010
docsify serve docs
npm install 
```

<button-counter></button-counter>
<!-- tabs:start -->

#### **English**

Hello!

#### **French**

Bonjour!

#### **Italian**

Ciao!

<!-- tabs:end -->


!> 一段重要的内容，可以和其他 **Markdown** 语法混用。

?> 普通的提示信息，比如写 TODO 或者参考内容等。

- [ ] foo
- bar
- [x] baz
- [] bam <~ not working
  - [ ] bim
  - [ ] lim

<details>
<summary>自我评价（点击展开）</summary>

- Abc
- Abc

</details>

> [!TIP]
> An alert of type 'tip' using global style 'callout'.



> [!NOTE]
> An alert of type 'note' using global style 'callout'.

> [!TIP|style:flat|label:My own heading|iconVisibility:hidden]
> An alert of type 'tip' using alert specific style 'flat' which overrides global style 'callout'.
> In addition, this alert uses an own heading and hides specific icon.


> [!ATTENTION]
> An alert of type 'attention' using global style 'callout'.


> [!WARNING]
> An alert of type 'warning' using global style 'callout'.
