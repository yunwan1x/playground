# PWA

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
