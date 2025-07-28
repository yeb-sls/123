(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["pages/admin/home/nav"],{

/***/ 531:
/*!******************************************************************************************!*\
  !*** C:/Users/小美女/Desktop/景区小程序/123/景区小程序/main.js?{"page":"pages%2Fadmin%2Fhome%2Fnav"} ***!
  \******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(wx, createPage) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
__webpack_require__(/*! uni-pages */ 26);
__webpack_require__(/*! @dcloudio/vue-cli-plugin-uni/packages/uni-cloud/dist/index.js */ 27);
var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 25));
var _nav = _interopRequireDefault(__webpack_require__(/*! ./pages/admin/home/nav.vue */ 532));
// @ts-ignore
wx.__webpack_require_UNI_MP_PLUGIN__ = __webpack_require__;
createPage(_nav.default);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/wx.js */ 1)["default"], __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["createPage"]))

/***/ }),

/***/ 532:
/*!*********************************************************************!*\
  !*** C:/Users/小美女/Desktop/景区小程序/123/景区小程序/pages/admin/home/nav.vue ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _nav_vue_vue_type_template_id_d4e8ec28_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./nav.vue?vue&type=template&id=d4e8ec28&scoped=true& */ 533);
/* harmony import */ var _nav_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./nav.vue?vue&type=script&lang=js& */ 535);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _nav_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _nav_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _nav_vue_vue_type_style_index_0_id_d4e8ec28_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./nav.vue?vue&type=style&index=0&id=d4e8ec28&scoped=true&lang=css& */ 537);
/* harmony import */ var _Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../../../Downloads/HBuilderX.4.66.2025051912/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/runtime/componentNormalizer.js */ 44);

var renderjs





/* normalize component */

var component = Object(_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _nav_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _nav_vue_vue_type_template_id_d4e8ec28_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _nav_vue_vue_type_template_id_d4e8ec28_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "d4e8ec28",
  null,
  false,
  _nav_vue_vue_type_template_id_d4e8ec28_scoped_true___WEBPACK_IMPORTED_MODULE_0__["components"],
  renderjs
)

component.options.__file = "pages/admin/home/nav.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ 533:
/*!****************************************************************************************************************!*\
  !*** C:/Users/小美女/Desktop/景区小程序/123/景区小程序/pages/admin/home/nav.vue?vue&type=template&id=d4e8ec28&scoped=true& ***!
  \****************************************************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_nav_vue_vue_type_template_id_d4e8ec28_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../Downloads/HBuilderX.4.66.2025051912/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../../../Downloads/HBuilderX.4.66.2025051912/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!../../../../../../../Downloads/HBuilderX.4.66.2025051912/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!../../../../../../../Downloads/HBuilderX.4.66.2025051912/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!../../../../../../../Downloads/HBuilderX.4.66.2025051912/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../../../../Downloads/HBuilderX.4.66.2025051912/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./nav.vue?vue&type=template&id=d4e8ec28&scoped=true& */ 534);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_nav_vue_vue_type_template_id_d4e8ec28_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_nav_vue_vue_type_template_id_d4e8ec28_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "recyclableRender", function() { return _Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_nav_vue_vue_type_template_id_d4e8ec28_scoped_true___WEBPACK_IMPORTED_MODULE_0__["recyclableRender"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "components", function() { return _Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_nav_vue_vue_type_template_id_d4e8ec28_scoped_true___WEBPACK_IMPORTED_MODULE_0__["components"]; });



/***/ }),

/***/ 534:
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!C:/Users/小美女/Desktop/景区小程序/123/景区小程序/pages/admin/home/nav.vue?vue&type=template&id=d4e8ec28&scoped=true& ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "recyclableRender", function() { return recyclableRender; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "components", function() { return components; });
var components
try {
  components = {
    uniPopup: function () {
      return __webpack_require__.e(/*! import() | components/uni-popup/uni-popup */ "components/uni-popup/uni-popup").then(__webpack_require__.bind(null, /*! @/components/uni-popup/uni-popup.vue */ 775))
    },
  }
} catch (e) {
  if (
    e.message.indexOf("Cannot find module") !== -1 &&
    e.message.indexOf(".vue") !== -1
  ) {
    console.error(e.message)
    console.error("1. 排查组件名称拼写是否正确")
    console.error(
      "2. 排查组件是否符合 easycom 规范，文档：https://uniapp.dcloud.net.cn/collocation/pages?id=easycom"
    )
    console.error(
      "3. 若组件不符合 easycom 规范，需手动引入，并在 components 中注册该组件"
    )
  } else {
    throw e
  }
}
var render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  var g0 = _vm.navs.length
  var g1 = _vm.filteredNavs.length
  var g2 = _vm.filteredNavs.length
  var l0 =
    g2 > 0
      ? _vm.__map(_vm.filteredNavs, function (nav, index) {
          var $orig = _vm.__get_orig(nav)
          var m0 = _vm.getNavKey(nav, index)
          var m1 = _vm.formatTime(nav.updateTime)
          var g3 = index === _vm.filteredNavs.length - 1 || _vm.loading
          return {
            $orig: $orig,
            m0: m0,
            m1: m1,
            g3: g3,
          }
        })
      : null
  var g4 = _vm.pageOptions.indexOf(_vm.currentNav.url)
  _vm.$mp.data = Object.assign(
    {},
    {
      $root: {
        g0: g0,
        g1: g1,
        g2: g2,
        l0: l0,
        g4: g4,
      },
    }
  )
}
var recyclableRender = false
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ 535:
/*!**********************************************************************************************!*\
  !*** C:/Users/小美女/Desktop/景区小程序/123/景区小程序/pages/admin/home/nav.vue?vue&type=script&lang=js& ***!
  \**********************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_nav_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../Downloads/HBuilderX.4.66.2025051912/HBuilderX/plugins/uniapp-cli/node_modules/babel-loader/lib!../../../../../../../Downloads/HBuilderX.4.66.2025051912/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!../../../../../../../Downloads/HBuilderX.4.66.2025051912/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!../../../../../../../Downloads/HBuilderX.4.66.2025051912/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../../../../Downloads/HBuilderX.4.66.2025051912/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./nav.vue?vue&type=script&lang=js& */ 536);
/* harmony import */ var _Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_nav_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_nav_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_nav_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_nav_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_nav_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 536:
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!C:/Users/小美女/Desktop/景区小程序/123/景区小程序/pages/admin/home/nav.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uniCloud, uni) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _regenerator = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/regenerator */ 28));
var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ 11));
var _toConsumableArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/toConsumableArray */ 18));
var _asyncToGenerator2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ 31));
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var uniPopup = function uniPopup() {
  __webpack_require__.e(/*! require.ensure | components/uni-popup/uni-popup */ "components/uni-popup/uni-popup").then((function () {
    return resolve(__webpack_require__(/*! @/components/uni-popup/uni-popup.vue */ 775));
  }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
};
var _default = {
  components: {
    uniPopup: uniPopup
  },
  data: function data() {
    return {
      navs: [],
      filteredNavs: [],
      searchText: '',
      currentNav: {
        text: '',
        icon: '',
        url: '',
        color: '#333333',
        bgColor: '#FFFFFF',
        enabled: true
      },
      deleteNavData: {},
      isEdit: false,
      editIndex: -1,
      loading: false,
      pageOptions: ['/pages/fahui/special', '/pages/fahui/group', '/pages/light/index', '/pages/hall/index', '/pages/gongde/index', '/pages/order/index'],
      colorOptions: [{
        label: '黑色',
        value: '#333333'
      }, {
        label: '蓝色',
        value: '#007AFF'
      }, {
        label: '绿色',
        value: '#34C759'
      }, {
        label: '橙色',
        value: '#FF9500'
      }, {
        label: '红色',
        value: '#FF3B30'
      }, {
        label: '紫色',
        value: '#AF52DE'
      }],
      bgColorOptions: [{
        label: '白色',
        value: '#FFFFFF'
      }, {
        label: '浅蓝',
        value: '#E3F2FD'
      }, {
        label: '浅绿',
        value: '#E8F5E8'
      }, {
        label: '浅橙',
        value: '#FFF3E0'
      }, {
        label: '浅红',
        value: '#FFEBEE'
      }, {
        label: '浅紫',
        value: '#F3E5F5'
      }],
      showNavModal: false,
      showDeleteModal: false
    };
  },
  computed: {
    enabledCount: function enabledCount() {
      return this.navs.filter(function (nav) {
        return nav.enabled;
      }).length;
    },
    disabledCount: function disabledCount() {
      return this.navs.filter(function (nav) {
        return !nav.enabled;
      }).length;
    },
    isFormValid: function isFormValid() {
      return this.currentNav.text.trim() && this.currentNav.icon.trim();
    }
  },
  onLoad: function onLoad() {
    this.loadNavs();
  },
  methods: {
    // 获取导航key
    getNavKey: function getNavKey(nav, index) {
      return nav._id || 'nav-' + index;
    },
    // 加载导航数据
    loadNavs: function loadNavs() {
      var _this = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
        var result, _result$result, _result$result2;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _this.loading = true;
                console.log('开始加载导航数据...');
                _context.next = 5;
                return uniCloud.callFunction({
                  name: 'getHomeNavs'
                });
              case 5:
                result = _context.sent;
                console.log('导航数据加载结果:', result);
                if (result.result && result.result.code === 0) {
                  _this.navs = result.result.data || [];
                  console.log('导航数据加载成功，共', _this.navs.length, '条');
                } else {
                  console.error('导航数据加载失败:', (_result$result = result.result) === null || _result$result === void 0 ? void 0 : _result$result.message);
                  _this.navs = [];
                  uni.showToast({
                    title: '加载失败: ' + (((_result$result2 = result.result) === null || _result$result2 === void 0 ? void 0 : _result$result2.message) || '未知错误'),
                    icon: 'none'
                  });
                }
                _this.filterNavs();
                _context.next = 16;
                break;
              case 11:
                _context.prev = 11;
                _context.t0 = _context["catch"](0);
                console.error('加载导航失败:', _context.t0);
                _this.navs = [];
                uni.showToast({
                  title: '加载失败: ' + (_context.t0.message || '未知错误'),
                  icon: 'none'
                });
              case 16:
                _context.prev = 16;
                _this.loading = false;
                return _context.finish(16);
              case 19:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[0, 11, 16, 19]]);
      }))();
    },
    // 筛选导航
    filterNavs: function filterNavs() {
      var _this2 = this;
      if (!this.searchText) {
        this.filteredNavs = (0, _toConsumableArray2.default)(this.navs);
      } else {
        this.filteredNavs = this.navs.filter(function (nav) {
          return nav.text.toLowerCase().includes(_this2.searchText.toLowerCase()) || nav.icon.includes(_this2.searchText);
        });
      }
    },
    // 显示添加弹窗
    showAddModal: function showAddModal() {
      console.log('显示添加弹窗');
      this.isEdit = false;
      this.editIndex = -1;
      this.currentNav = {
        text: '',
        icon: '',
        url: '',
        color: '#333333',
        bgColor: '#FFFFFF',
        enabled: true
      };
      console.log('添加模式下的currentNav:', this.currentNav);
      this.showNavModal = true;
    },
    // 编辑导航
    editNav: function editNav(index) {
      console.log('编辑导航:', index);
      console.log('原始导航数据:', this.filteredNavs[index]);
      this.isEdit = true;
      this.editIndex = index;

      // 深拷贝确保数据正确复制
      var originalNav = this.filteredNavs[index];
      this.currentNav = {
        text: originalNav.text || '',
        icon: originalNav.icon || '',
        url: originalNav.url || '',
        color: originalNav.color || '#333333',
        bgColor: originalNav.bgColor || '#FFFFFF',
        enabled: originalNav.enabled !== undefined ? originalNav.enabled : true
      };
      console.log('编辑的导航数据:', this.currentNav);
      console.log('currentNav.text:', this.currentNav.text);
      console.log('currentNav.icon:', this.currentNav.icon);
      this.showNavModal = true;
    },
    // 切换导航状态
    toggleNav: function toggleNav(index) {
      var _this3 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
        var nav, newStatus, originalIndex;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                nav = _this3.filteredNavs[index];
                newStatus = !nav.enabled;
                _context2.prev = 2;
                _context2.next = 5;
                return uniCloud.callFunction({
                  name: 'updateHomeNav',
                  data: {
                    id: nav._id,
                    nav: _objectSpread(_objectSpread({}, nav), {}, {
                      enabled: newStatus
                    })
                  }
                });
              case 5:
                // 更新本地数据
                originalIndex = _this3.navs.findIndex(function (n) {
                  return n._id === nav._id;
                });
                if (originalIndex !== -1) {
                  _this3.navs[originalIndex].enabled = newStatus;
                }
                _this3.filterNavs();
                uni.showToast({
                  title: newStatus ? '已启用' : '已禁用',
                  icon: 'success'
                });
                _context2.next = 15;
                break;
              case 11:
                _context2.prev = 11;
                _context2.t0 = _context2["catch"](2);
                console.error('切换状态失败:', _context2.t0);
                uni.showToast({
                  title: '操作失败',
                  icon: 'none'
                });
              case 15:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[2, 11]]);
      }))();
    },
    // 删除导航
    deleteNav: function deleteNav(index) {
      this.deleteNavData = this.filteredNavs[index];
      this.showDeleteModal = true;
    },
    // 确认删除
    confirmDelete: function confirmDelete() {
      var _this4 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3() {
        var index;
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                _this4.loading = true;
                _context3.next = 4;
                return uniCloud.callFunction({
                  name: 'deleteHomeNav',
                  data: {
                    id: _this4.deleteNavData._id
                  }
                });
              case 4:
                // 从本地数据中删除
                index = _this4.navs.findIndex(function (n) {
                  return n._id === _this4.deleteNavData._id;
                });
                if (index !== -1) {
                  _this4.navs.splice(index, 1);
                }
                _this4.filterNavs();
                _this4.showDeleteModal = false;
                uni.showToast({
                  title: '删除成功',
                  icon: 'success'
                });
                _context3.next = 15;
                break;
              case 11:
                _context3.prev = 11;
                _context3.t0 = _context3["catch"](0);
                console.error('删除失败:', _context3.t0);
                uni.showToast({
                  title: '删除失败',
                  icon: 'none'
                });
              case 15:
                _context3.prev = 15;
                _this4.loading = false;
                return _context3.finish(15);
              case 18:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[0, 11, 15, 18]]);
      }))();
    },
    // 取消删除
    cancelDelete: function cancelDelete() {
      this.showDeleteModal = false;
    },
    // 关闭导航弹窗
    closeNavModal: function closeNavModal() {
      this.showNavModal = false;
    },
    // 关闭删除弹窗
    closeDeleteModal: function closeDeleteModal() {
      this.showDeleteModal = false;
    },
    // 移动导航位置
    moveNav: function moveNav(index, direction) {
      var _this5 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee4() {
        var newIndex, navToMove, navToSwap, temp, originalIndex, originalNewIndex, temp2, temp3, temp4;
        return _regenerator.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                console.log('移动导航:', index, direction);
                newIndex = direction === 'up' ? index - 1 : index + 1;
                if (!(newIndex < 0 || newIndex >= _this5.filteredNavs.length)) {
                  _context4.next = 4;
                  break;
                }
                return _context4.abrupt("return");
              case 4:
                // 获取要移动的导航项
                navToMove = _this5.filteredNavs[index];
                navToSwap = _this5.filteredNavs[newIndex]; // 先更新本地数据，实现即时UI更新
                temp = _this5.filteredNavs[index];
                _this5.filteredNavs[index] = _this5.filteredNavs[newIndex];
                _this5.filteredNavs[newIndex] = temp;

                // 同时更新原始navs数组
                originalIndex = _this5.navs.findIndex(function (n) {
                  return n._id === navToMove._id;
                });
                originalNewIndex = _this5.navs.findIndex(function (n) {
                  return n._id === navToSwap._id;
                });
                if (originalIndex !== -1 && originalNewIndex !== -1) {
                  temp2 = _this5.navs[originalIndex];
                  _this5.navs[originalIndex] = _this5.navs[originalNewIndex];
                  _this5.navs[originalNewIndex] = temp2;
                }

                // 更新排序
                _context4.prev = 12;
                _context4.next = 15;
                return uniCloud.callFunction({
                  name: 'updateNavOrder',
                  data: {
                    navs: _this5.filteredNavs
                  }
                });
              case 15:
                uni.showToast({
                  title: '排序更新成功',
                  icon: 'success'
                });
                _context4.next = 26;
                break;
              case 18:
                _context4.prev = 18;
                _context4.t0 = _context4["catch"](12);
                console.error('更新排序失败:', _context4.t0);
                uni.showToast({
                  title: '更新失败',
                  icon: 'none'
                });
                // 恢复原位置
                temp3 = _this5.filteredNavs[index];
                _this5.filteredNavs[index] = _this5.filteredNavs[newIndex];
                _this5.filteredNavs[newIndex] = temp3;
                if (originalIndex !== -1 && originalNewIndex !== -1) {
                  temp4 = _this5.navs[originalIndex];
                  _this5.navs[originalIndex] = _this5.navs[originalNewIndex];
                  _this5.navs[originalNewIndex] = temp4;
                }
              case 26:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, null, [[12, 18]]);
      }))();
    },
    // 页面选择
    onPageChange: function onPageChange(e) {
      this.currentNav.url = this.pageOptions[e.detail.value];
    },
    // 选择文字颜色
    selectColor: function selectColor(color) {
      this.currentNav.color = color;
    },
    // 选择背景颜色
    selectBgColor: function selectBgColor(bgColor) {
      this.currentNav.bgColor = bgColor;
    },
    // 启用状态切换
    onEnabledChange: function onEnabledChange(e) {
      this.currentNav.enabled = e.detail.value;
    },
    // 保存导航
    saveNav: function saveNav() {
      var _this6 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee5() {
        var updateResult, originalIndex, _updateResult$result, result;
        return _regenerator.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                console.log('开始保存导航...');
                console.log('表单验证结果:', _this6.isFormValid);
                console.log('当前导航数据:', _this6.currentNav);
                if (_this6.isFormValid) {
                  _context5.next = 6;
                  break;
                }
                uni.showToast({
                  title: '请填写完整信息',
                  icon: 'none'
                });
                return _context5.abrupt("return");
              case 6:
                _context5.prev = 6;
                _this6.loading = true;
                console.log('设置loading状态为true');
                if (!_this6.isEdit) {
                  _context5.next = 26;
                  break;
                }
                console.log('执行编辑操作...');
                console.log('编辑的导航ID:', _this6.filteredNavs[_this6.editIndex]._id);
                console.log('编辑的导航数据:', _this6.currentNav);

                // 更新导航
                _context5.next = 15;
                return uniCloud.callFunction({
                  name: 'updateHomeNav',
                  data: {
                    id: _this6.filteredNavs[_this6.editIndex]._id,
                    nav: _this6.currentNav
                  }
                });
              case 15:
                updateResult = _context5.sent;
                console.log('更新导航结果:', updateResult);
                if (!(updateResult.result && updateResult.result.code === 0)) {
                  _context5.next = 23;
                  break;
                }
                // 更新本地数据
                originalIndex = _this6.navs.findIndex(function (n) {
                  return n._id === _this6.filteredNavs[_this6.editIndex]._id;
                });
                if (originalIndex !== -1) {
                  _this6.navs[originalIndex] = _objectSpread({}, _this6.currentNav);
                }
                // 同时更新filteredNavs中的数据
                _this6.filteredNavs[_this6.editIndex] = _objectSpread({}, _this6.currentNav);
                _context5.next = 24;
                break;
              case 23:
                throw new Error(((_updateResult$result = updateResult.result) === null || _updateResult$result === void 0 ? void 0 : _updateResult$result.message) || '更新失败');
              case 24:
                _context5.next = 39;
                break;
              case 26:
                console.log('执行添加操作...');
                console.log('调用addHomeNav云函数，参数:', {
                  nav: _this6.currentNav
                });

                // 添加导航
                _context5.next = 30;
                return uniCloud.callFunction({
                  name: 'addHomeNav',
                  data: {
                    nav: _this6.currentNav
                  }
                });
              case 30:
                result = _context5.sent;
                console.log('添加导航结果:', result);
                if (!(result.result && result.result.data)) {
                  _context5.next = 37;
                  break;
                }
                console.log('添加成功，新导航数据:', result.result.data);
                _this6.navs.push(result.result.data);
                _context5.next = 39;
                break;
              case 37:
                console.error('添加失败，返回结果异常:', result);
                throw new Error('云函数返回结果异常');
              case 39:
                console.log('保存成功，关闭弹窗');
                _this6.closePopup();
                _this6.filterNavs();
                uni.showToast({
                  title: _this6.isEdit ? '更新成功' : '添加成功',
                  icon: 'success'
                });
                _context5.next = 51;
                break;
              case 45:
                _context5.prev = 45;
                _context5.t0 = _context5["catch"](6);
                console.error('保存失败:', _context5.t0);
                console.error('错误详情:', _context5.t0.message);
                console.error('错误堆栈:', _context5.t0.stack);
                uni.showToast({
                  title: '保存失败: ' + _context5.t0.message,
                  icon: 'none'
                });
              case 51:
                _context5.prev = 51;
                console.log('设置loading状态为false');
                _this6.loading = false;
                return _context5.finish(51);
              case 55:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, null, [[6, 45, 51, 55]]);
      }))();
    },
    // 关闭弹窗
    closePopup: function closePopup() {
      this.showNavModal = false;
    },
    // 文字输入事件
    onTextInput: function onTextInput(e) {
      console.log('文字输入事件:', e.detail.value);
      this.currentNav.text = e.detail.value;
      console.log('更新后currentNav.text:', this.currentNav.text);
    },
    // 文字聚焦事件
    onTextFocus: function onTextFocus(e) {
      console.log('文字聚焦事件');
      console.log('当前文字值:', this.currentNav.text);
    },
    // 图标输入事件
    onIconInput: function onIconInput(e) {
      console.log('图标输入事件:', e.detail.value);
      this.currentNav.icon = e.detail.value;
      console.log('更新后currentNav.icon:', this.currentNav.icon);
    },
    // 图标聚焦事件
    onIconFocus: function onIconFocus(e) {
      console.log('图标聚焦事件');
      console.log('当前图标值:', this.currentNav.icon);
    },
    // 文字失焦事件
    onTextBlur: function onTextBlur(e) {
      console.log('文字失焦事件:', e.detail.value);
      this.currentNav.text = e.detail.value;
      console.log('失焦后currentNav.text:', this.currentNav.text);
    },
    // 文字改变事件
    onTextChange: function onTextChange(e) {
      console.log('文字改变事件:', e.detail.value);
      this.currentNav.text = e.detail.value;
      console.log('改变后currentNav.text:', this.currentNav.text);
    },
    // 图标失焦事件
    onIconBlur: function onIconBlur(e) {
      console.log('图标失焦事件:', e.detail.value);
      this.currentNav.icon = e.detail.value;
      console.log('失焦后currentNav.icon:', this.currentNav.icon);
    },
    // 图标改变事件
    onIconChange: function onIconChange(e) {
      console.log('图标改变事件:', e.detail.value);
      this.currentNav.icon = e.detail.value;
      console.log('改变后currentNav.icon:', this.currentNav.icon);
    },
    // 测试文字修改
    testTextChange: function testTextChange() {
      console.log('测试文字修改');
      this.currentNav.text = '测试文字' + Date.now();
      console.log('修改后currentNav.text:', this.currentNav.text);
    },
    // 测试图标修改
    testIconChange: function testIconChange() {
      console.log('测试图标修改');
      var icons = ['🕉️', '🙏', '💡', '🏛️', '💰', '🎯', '📱', '⭐'];
      var randomIcon = icons[Math.floor(Math.random() * icons.length)];
      this.currentNav.icon = randomIcon;
      console.log('修改后currentNav.icon:', this.currentNav.icon);
    },
    // 快速编辑文字
    quickEditText: function quickEditText(index) {
      var _this7 = this;
      var nav = this.filteredNavs[index];
      uni.showModal({
        title: '快速编辑',
        content: '请输入新的导航文字',
        editable: true,
        placeholderText: nav.text,
        success: function () {
          var _success = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee6(res) {
            var newText, originalIndex;
            return _regenerator.default.wrap(function _callee6$(_context6) {
              while (1) {
                switch (_context6.prev = _context6.next) {
                  case 0:
                    if (!(res.confirm && res.content.trim())) {
                      _context6.next = 15;
                      break;
                    }
                    _context6.prev = 1;
                    newText = res.content.trim();
                    _context6.next = 5;
                    return uniCloud.callFunction({
                      name: 'updateHomeNav',
                      data: {
                        id: nav._id,
                        nav: _objectSpread(_objectSpread({}, nav), {}, {
                          text: newText
                        })
                      }
                    });
                  case 5:
                    // 更新本地数据
                    originalIndex = _this7.navs.findIndex(function (n) {
                      return n._id === nav._id;
                    });
                    if (originalIndex !== -1) {
                      _this7.navs[originalIndex].text = newText;
                    }
                    _this7.filteredNavs[index].text = newText;
                    uni.showToast({
                      title: '更新成功',
                      icon: 'success'
                    });
                    _context6.next = 15;
                    break;
                  case 11:
                    _context6.prev = 11;
                    _context6.t0 = _context6["catch"](1);
                    console.error('快速编辑失败:', _context6.t0);
                    uni.showToast({
                      title: '更新失败',
                      icon: 'none'
                    });
                  case 15:
                  case "end":
                    return _context6.stop();
                }
              }
            }, _callee6, null, [[1, 11]]);
          }));
          function success(_x) {
            return _success.apply(this, arguments);
          }
          return success;
        }()
      });
    },
    // 格式化时间
    formatTime: function formatTime(timestamp) {
      if (!timestamp) return '';
      var date = new Date(timestamp);
      var now = new Date();
      var diff = now - date;
      if (diff < 60000) {
        // 1分钟内
        return '刚刚';
      } else if (diff < 3600000) {
        // 1小时内
        return "".concat(Math.floor(diff / 60000), "\u5206\u949F\u524D");
      } else if (diff < 86400000) {
        // 1天内
        return "".concat(Math.floor(diff / 3600000), "\u5C0F\u65F6\u524D");
      } else {
        return "".concat(date.getMonth() + 1, "-").concat(date.getDate());
      }
    }
  }
};
exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/uni-cloud/dist/index.js */ 27)["uniCloud"], __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["default"]))

/***/ }),

/***/ 537:
/*!******************************************************************************************************************************!*\
  !*** C:/Users/小美女/Desktop/景区小程序/123/景区小程序/pages/admin/home/nav.vue?vue&type=style&index=0&id=d4e8ec28&scoped=true&lang=css& ***!
  \******************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_nav_vue_vue_type_style_index_0_id_d4e8ec28_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../Downloads/HBuilderX.4.66.2025051912/HBuilderX/plugins/uniapp-cli/node_modules/mini-css-extract-plugin/dist/loader.js??ref--6-oneOf-1-0!../../../../../../../Downloads/HBuilderX.4.66.2025051912/HBuilderX/plugins/uniapp-cli/node_modules/css-loader/dist/cjs.js??ref--6-oneOf-1-1!../../../../../../../Downloads/HBuilderX.4.66.2025051912/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../../Downloads/HBuilderX.4.66.2025051912/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--6-oneOf-1-2!../../../../../../../Downloads/HBuilderX.4.66.2025051912/HBuilderX/plugins/uniapp-cli/node_modules/postcss-loader/src??ref--6-oneOf-1-3!../../../../../../../Downloads/HBuilderX.4.66.2025051912/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../../../../Downloads/HBuilderX.4.66.2025051912/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./nav.vue?vue&type=style&index=0&id=d4e8ec28&scoped=true&lang=css& */ 538);
/* harmony import */ var _Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_nav_vue_vue_type_style_index_0_id_d4e8ec28_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_nav_vue_vue_type_style_index_0_id_d4e8ec28_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_nav_vue_vue_type_style_index_0_id_d4e8ec28_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_nav_vue_vue_type_style_index_0_id_d4e8ec28_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_nav_vue_vue_type_style_index_0_id_d4e8ec28_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 538:
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??ref--6-oneOf-1-0!./node_modules/css-loader/dist/cjs.js??ref--6-oneOf-1-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--6-oneOf-1-2!./node_modules/postcss-loader/src??ref--6-oneOf-1-3!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!C:/Users/小美女/Desktop/景区小程序/123/景区小程序/pages/admin/home/nav.vue?vue&type=style&index=0&id=d4e8ec28&scoped=true&lang=css& ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin
    if(false) { var cssReload; }
  

/***/ })

},[[531,"common/runtime","common/vendor"]]]);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/admin/home/nav.js.map