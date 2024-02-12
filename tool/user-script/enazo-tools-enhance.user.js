// ==UserScript==
// @name           绘谜工具集通用功能增强
// @description    给绘谜小工具所用的通用功能增强脚本
// @namespace      https://enazo.cn
// @version        0.1.1
// @author         itorr
// @include        *://192.168.31.2:5500/*
// @include        *://192.168.31.7:5500/*
// @include        https://enazo.cn/*
// @run-at         document-start
// @noframes
// @grant          GM_setClipboard
// @grant          GM_xmlhttpRequest
// @grant          GM_openInTab
// @grant          GM_registerMenuCommand
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_getResourceText
// @grant          GM_info
// @grant          GM_addStyle
// @connect        *
// ==/UserScript==






unsafeWindow.enazoToolsEnhanceFunctions = {
    httpRequest: options => GM_xmlhttpRequest(options),
    openTab: url => GM_openInTab(url),
    setClipboard: text => GM_setClipboard(text),
    getValue: key => GM_getValue(key),
    setValue: (key, value) => GM_setValue(key, value),
    registerMenuCommand: (name, fn) => GM_registerMenuCommand(name, fn),
}