(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["pages/admin/fahui/orders"],{

/***/ 659:
/*!**********************************************************************************************!*\
  !*** C:/Users/小美女/Desktop/景区小程序/123/景区小程序/main.js?{"page":"pages%2Fadmin%2Ffahui%2Forders"} ***!
  \**********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(wx, createPage) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
__webpack_require__(/*! uni-pages */ 26);
__webpack_require__(/*! @dcloudio/vue-cli-plugin-uni/packages/uni-cloud/dist/index.js */ 27);
var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 25));
var _orders = _interopRequireDefault(__webpack_require__(/*! ./pages/admin/fahui/orders.vue */ 660));
// @ts-ignore
wx.__webpack_require_UNI_MP_PLUGIN__ = __webpack_require__;
createPage(_orders.default);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/wx.js */ 1)["default"], __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["createPage"]))

/***/ }),

/***/ 660:
/*!*************************************************************************!*\
  !*** C:/Users/小美女/Desktop/景区小程序/123/景区小程序/pages/admin/fahui/orders.vue ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _orders_vue_vue_type_template_id_6f9cf068_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./orders.vue?vue&type=template&id=6f9cf068&scoped=true& */ 661);
/* harmony import */ var _orders_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./orders.vue?vue&type=script&lang=js& */ 663);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _orders_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _orders_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _orders_vue_vue_type_style_index_0_id_6f9cf068_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./orders.vue?vue&type=style&index=0&id=6f9cf068&scoped=true&lang=css& */ 665);
/* harmony import */ var _Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../../../Downloads/HBuilderX.4.66.2025051912/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/runtime/componentNormalizer.js */ 44);

var renderjs





/* normalize component */

var component = Object(_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _orders_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _orders_vue_vue_type_template_id_6f9cf068_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _orders_vue_vue_type_template_id_6f9cf068_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "6f9cf068",
  null,
  false,
  _orders_vue_vue_type_template_id_6f9cf068_scoped_true___WEBPACK_IMPORTED_MODULE_0__["components"],
  renderjs
)

component.options.__file = "pages/admin/fahui/orders.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ 661:
/*!********************************************************************************************************************!*\
  !*** C:/Users/小美女/Desktop/景区小程序/123/景区小程序/pages/admin/fahui/orders.vue?vue&type=template&id=6f9cf068&scoped=true& ***!
  \********************************************************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_orders_vue_vue_type_template_id_6f9cf068_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../Downloads/HBuilderX.4.66.2025051912/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../../../Downloads/HBuilderX.4.66.2025051912/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!../../../../../../../Downloads/HBuilderX.4.66.2025051912/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!../../../../../../../Downloads/HBuilderX.4.66.2025051912/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!../../../../../../../Downloads/HBuilderX.4.66.2025051912/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../../../../Downloads/HBuilderX.4.66.2025051912/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./orders.vue?vue&type=template&id=6f9cf068&scoped=true& */ 662);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_orders_vue_vue_type_template_id_6f9cf068_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_orders_vue_vue_type_template_id_6f9cf068_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "recyclableRender", function() { return _Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_orders_vue_vue_type_template_id_6f9cf068_scoped_true___WEBPACK_IMPORTED_MODULE_0__["recyclableRender"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "components", function() { return _Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_orders_vue_vue_type_template_id_6f9cf068_scoped_true___WEBPACK_IMPORTED_MODULE_0__["components"]; });



/***/ }),

/***/ 662:
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!C:/Users/小美女/Desktop/景区小程序/123/景区小程序/pages/admin/fahui/orders.vue?vue&type=template&id=6f9cf068&scoped=true& ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
  var l1 = _vm.__map(_vm.filteredOrders, function (order, index) {
    var $orig = _vm.__get_orig(order)
    var m0 = _vm.getStatusText(order.status)
    var g0 =
      order.participantName ||
      (order.applicants &&
        order.applicants
          .map(function (a) {
            return a.name
          })
          .join("、")) ||
      "-"
    var m1 = _vm.getStatusText(order.status)
    var m2 = order.payTime ? _vm.formatDate(order.payTime) : null
    var g1 = order.goods && order.goods.length
    var g2 = g1
      ? order.goods
          .map(function (g) {
            return g.name + "×" + g.qty
          })
          .join("，")
      : null
    var m3 =
      _vm.showDetailIndex === index && order.payTime
        ? _vm.formatDate(order.payTime)
        : null
    var m4 =
      _vm.showDetailIndex === index ? _vm.getStatusText(order.status) : null
    var g3 =
      _vm.showRemarkIndex === index
        ? order.adminRemarks && order.adminRemarks.length
        : null
    var l0 =
      _vm.showRemarkIndex === index && g3
        ? _vm.__map(order.adminRemarks, function (r, i) {
            var $orig = _vm.__get_orig(r)
            var m5 = _vm.formatDate(r.createTime)
            return {
              $orig: $orig,
              m5: m5,
            }
          })
        : null
    return {
      $orig: $orig,
      m0: m0,
      g0: g0,
      m1: m1,
      m2: m2,
      g1: g1,
      g2: g2,
      m3: m3,
      m4: m4,
      g3: g3,
      l0: l0,
    }
  })
  var m6 = _vm.selectedOrder
    ? _vm.formatDate(_vm.selectedOrder.createTime)
    : null
  var m7 = _vm.selectedOrder ? _vm.formatDate(_vm.selectedOrder.payTime) : null
  var m8 = _vm.selectedOrder
    ? _vm.getStatusText(_vm.selectedOrder.status)
    : null
  var g4 = _vm.selectedOrder
    ? _vm.selectedOrder.applicants && _vm.selectedOrder.applicants.length
    : null
  var g5 = _vm.selectedOrder
    ? _vm.selectedOrder.deceasedList && _vm.selectedOrder.deceasedList.length
    : null
  var g6 = _vm.selectedOrder
    ? _vm.selectedOrder.goods && _vm.selectedOrder.goods.length
    : null
  var g7 = _vm.selectedOrder
    ? _vm.selectedOrder.adminRemarks &&
      _vm.selectedOrder.adminRemarks.length > 0
    : null
  var l2 =
    _vm.selectedOrder && g7
      ? _vm.__map(_vm.selectedOrder.adminRemarks, function (remark, index) {
          var $orig = _vm.__get_orig(remark)
          var m9 = _vm.formatDate(remark.createTime)
          return {
            $orig: $orig,
            m9: m9,
          }
        })
      : null
  var g8 = _vm.selectedOrder
    ? _vm.selectedOrder.logs && _vm.selectedOrder.logs.length
    : null
  var l3 =
    _vm.selectedOrder && g8
      ? _vm.__map(_vm.selectedOrder.logs, function (log, idx) {
          var $orig = _vm.__get_orig(log)
          var m10 = _vm.formatDate(log.time)
          return {
            $orig: $orig,
            m10: m10,
          }
        })
      : null
  if (!_vm._isMounted) {
    _vm.e0 = function ($event) {
      _vm.showFahuiDatePopup = false
    }
  }
  _vm.$mp.data = Object.assign(
    {},
    {
      $root: {
        l1: l1,
        m6: m6,
        m7: m7,
        m8: m8,
        g4: g4,
        g5: g5,
        g6: g6,
        g7: g7,
        l2: l2,
        g8: g8,
        l3: l3,
      },
    }
  )
}
var recyclableRender = false
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ 663:
/*!**************************************************************************************************!*\
  !*** C:/Users/小美女/Desktop/景区小程序/123/景区小程序/pages/admin/fahui/orders.vue?vue&type=script&lang=js& ***!
  \**************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_orders_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../Downloads/HBuilderX.4.66.2025051912/HBuilderX/plugins/uniapp-cli/node_modules/babel-loader/lib!../../../../../../../Downloads/HBuilderX.4.66.2025051912/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!../../../../../../../Downloads/HBuilderX.4.66.2025051912/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!../../../../../../../Downloads/HBuilderX.4.66.2025051912/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../../../../Downloads/HBuilderX.4.66.2025051912/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./orders.vue?vue&type=script&lang=js& */ 664);
/* harmony import */ var _Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_orders_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_orders_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_orders_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_orders_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_orders_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 664:
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!C:/Users/小美女/Desktop/景区小程序/123/景区小程序/pages/admin/fahui/orders.vue?vue&type=script&lang=js& ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni, uniCloud) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _regenerator = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/regenerator */ 28));
var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ 11));
var _toConsumableArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/toConsumableArray */ 18));
var _asyncToGenerator2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ 31));
var _methods;
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
      fahuiType: 'special',
      // 默认专场法会
      orders: [],
      filteredOrders: [],
      statusOptions: ['全部', '待确认', '已确认', '已取消'],
      statusIndex: 0,
      typeOptions: ['全部', '专场法会', '合坛法会'],
      typeIndex: 0,
      selectedOrder: null,
      remarkContent: '',
      currentOrderForRemark: null,
      receiverEnabled: false,
      fahuiDateInput: '',
      showFahuiDatePopup: false,
      fahuiDateOrder: null,
      showDetailIndex: -1,
      showRemarkIndex: -1,
      inlineFahuiDate: '',
      inlineRemarkContent: ''
    };
  },
  onLoad: function onLoad(options) {
    // 获取法会类型参数
    if (options.type) {
      this.fahuiType = options.type;
    }
    this.loadOrders();
    this.getReceiverConfig();
  },
  methods: (_methods = {
    goBack: function goBack() {
      uni.navigateBack();
    },
    // 加载订单列表
    loadOrders: function loadOrders() {
      var _this = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
        var result;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                uni.showLoading({
                  title: '加载中...'
                });
                _context.next = 4;
                return uniCloud.callFunction({
                  name: 'getFahuiOrders',
                  data: {
                    type: _this.fahuiType
                  }
                });
              case 4:
                result = _context.sent;
                if (result.result && result.result.data) {
                  _this.orders = result.result.data;
                  _this.filterOrders();
                }
                _context.next = 12;
                break;
              case 8:
                _context.prev = 8;
                _context.t0 = _context["catch"](0);
                console.error('加载订单失败：', _context.t0);
                uni.showToast({
                  title: '加载失败',
                  icon: 'none'
                });
              case 12:
                _context.prev = 12;
                uni.hideLoading();
                return _context.finish(12);
              case 15:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[0, 8, 12, 15]]);
      }))();
    },
    // 筛选订单
    filterOrders: function filterOrders() {
      var filtered = (0, _toConsumableArray2.default)(this.orders);

      // 按状态筛选
      if (this.statusIndex > 0) {
        var status = this.statusOptions[this.statusIndex];
        filtered = filtered.filter(function (item) {
          return item.status === status;
        });
      }

      // 按类型筛选
      if (this.typeIndex > 0) {
        var type = this.typeOptions[this.typeIndex];
        filtered = filtered.filter(function (item) {
          return item.fahuiType === type;
        });
      }
      this.filteredOrders = filtered;
    },
    // 状态筛选变化
    onStatusChange: function onStatusChange(e) {
      this.statusIndex = e.detail.value;
      this.filterOrders();
    },
    // 类型筛选变化
    onTypeChange: function onTypeChange(e) {
      this.typeIndex = e.detail.value;
      this.filterOrders();
    },
    // 获取状态样式
    getStatusClass: function getStatusClass(status) {
      switch (status) {
        case '待确认':
          return 'status-pending';
        case '已确认':
          return 'status-confirmed';
        case '已取消':
          return 'status-cancelled';
        default:
          return 'status-default';
      }
    },
    // 获取状态文本
    getStatusText: function getStatusText(status) {
      return status || '未知';
    },
    // 格式化日期
    formatDate: function formatDate(date) {
      if (!date) return '';
      var d = new Date(date);
      return "".concat(d.getFullYear(), "-").concat(String(d.getMonth() + 1).padStart(2, '0'), "-").concat(String(d.getDate()).padStart(2, '0'), " ").concat(String(d.getHours()).padStart(2, '0'), ":").concat(String(d.getMinutes()).padStart(2, '0'));
    },
    // 查看详情
    viewDetail: function viewDetail(order) {
      this.selectedOrder = order;
      this.fahuiDateInput = order.fahuiDate || '';
      console.log('detailModal ref:', this.$refs.detailModal);
      if (this.$refs.detailModal && typeof this.$refs.detailModal.open === 'function') {
        this.$refs.detailModal.open('center');
      } else if (this.$refs.detailModal && typeof this.$refs.detailModal.show === 'function') {
        this.$refs.detailModal.show();
      }
    },
    // 隐藏详情弹窗
    hideDetailModal: function hideDetailModal() {
      this.$refs.detailModal.close();
      this.selectedOrder = null;
    },
    // 更改状态
    changeStatus: function changeStatus(order) {
      var _this2 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
        var newStatus, result;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                newStatus = order.status === '待确认' ? '已确认' : '待确认';
                _context2.prev = 1;
                uni.showLoading({
                  title: '更新中...'
                });
                _context2.next = 5;
                return uniCloud.callFunction({
                  name: 'updateFahuiOrderStatus',
                  data: {
                    id: order._id,
                    status: newStatus,
                    operator: '管理员' // 可替换为当前登录用户
                  }
                });
              case 5:
                result = _context2.sent;
                if (!(result.result && result.result.success)) {
                  _context2.next = 11;
                  break;
                }
                uni.showToast({
                  title: '状态更新成功',
                  icon: 'success'
                });
                _this2.loadOrders();
                _context2.next = 12;
                break;
              case 11:
                throw new Error(result.result.message || '更新失败');
              case 12:
                _context2.next = 18;
                break;
              case 14:
                _context2.prev = 14;
                _context2.t0 = _context2["catch"](1);
                console.error('更新状态失败：', _context2.t0);
                uni.showToast({
                  title: '更新失败',
                  icon: 'none'
                });
              case 18:
                _context2.prev = 18;
                uni.hideLoading();
                return _context2.finish(18);
              case 21:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[1, 14, 18, 21]]);
      }))();
    },
    // 删除订单
    deleteOrder: function deleteOrder(id) {
      var _this3 = this;
      uni.showModal({
        title: '确认删除',
        content: '确定要删除这个订单吗？',
        success: function () {
          var _success = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3(res) {
            var result;
            return _regenerator.default.wrap(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    if (!res.confirm) {
                      _context3.next = 21;
                      break;
                    }
                    _context3.prev = 1;
                    uni.showLoading({
                      title: '删除中...'
                    });
                    _context3.next = 5;
                    return uniCloud.callFunction({
                      name: 'deleteFahuiOrder',
                      data: {
                        id: id
                      }
                    });
                  case 5:
                    result = _context3.sent;
                    if (!(result.result && result.result.success)) {
                      _context3.next = 11;
                      break;
                    }
                    uni.showToast({
                      title: '删除成功',
                      icon: 'success'
                    });
                    _this3.loadOrders();
                    _context3.next = 12;
                    break;
                  case 11:
                    throw new Error(result.result.message || '删除失败');
                  case 12:
                    _context3.next = 18;
                    break;
                  case 14:
                    _context3.prev = 14;
                    _context3.t0 = _context3["catch"](1);
                    console.error('删除失败：', _context3.t0);
                    uni.showToast({
                      title: '删除失败',
                      icon: 'none'
                    });
                  case 18:
                    _context3.prev = 18;
                    uni.hideLoading();
                    return _context3.finish(18);
                  case 21:
                  case "end":
                    return _context3.stop();
                }
              }
            }, _callee3, null, [[1, 14, 18, 21]]);
          }));
          function success(_x) {
            return _success.apply(this, arguments);
          }
          return success;
        }()
      });
    },
    // 添加备注
    addRemark: function addRemark(order) {
      this.currentOrderForRemark = order;
      this.remarkContent = '';
      console.log('remarkModal ref:', this.$refs.remarkModal);
      if (this.$refs.remarkModal && typeof this.$refs.remarkModal.open === 'function') {
        this.$refs.remarkModal.open('center');
      } else if (this.$refs.remarkModal && typeof this.$refs.remarkModal.show === 'function') {
        this.$refs.remarkModal.show();
      }
    },
    // 保存备注
    saveRemark: function saveRemark() {
      var _this4 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee4() {
        var remark, orderIndex;
        return _regenerator.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (_this4.remarkContent.trim()) {
                  _context4.next = 3;
                  break;
                }
                uni.showToast({
                  title: '请输入备注内容',
                  icon: 'none'
                });
                return _context4.abrupt("return");
              case 3:
                _context4.prev = 3;
                remark = {
                  content: _this4.remarkContent
                };
                _context4.next = 7;
                return uniCloud.callFunction({
                  name: 'addFahuiOrderRemark',
                  data: {
                    orderId: _this4.currentOrderForRemark._id,
                    remark: remark,
                    operator: '管理员' // 可替换为当前登录用户
                  }
                });
              case 7:
                // 更新本地数据
                orderIndex = _this4.orders.findIndex(function (o) {
                  return o._id === _this4.currentOrderForRemark._id;
                });
                if (orderIndex !== -1) {
                  if (!_this4.orders[orderIndex].adminRemarks) {
                    _this4.orders[orderIndex].adminRemarks = [];
                  }
                  _this4.orders[orderIndex].adminRemarks.push(_objectSpread(_objectSpread({}, remark), {}, {
                    author: '管理员',
                    createTime: new Date()
                  }));
                }
                _this4.hideRemarkModal();
                uni.showToast({
                  title: '备注添加成功',
                  icon: 'success'
                });
                _context4.next = 17;
                break;
              case 13:
                _context4.prev = 13;
                _context4.t0 = _context4["catch"](3);
                console.error('添加备注失败：', _context4.t0);
                uni.showToast({
                  title: '添加备注失败',
                  icon: 'none'
                });
              case 17:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, null, [[3, 13]]);
      }))();
    },
    // 隐藏备注弹窗
    hideRemarkModal: function hideRemarkModal() {
      this.$refs.remarkModal.close();
      this.currentOrderForRemark = null;
      this.remarkContent = '';
    },
    getReceiverConfig: function getReceiverConfig() {
      var _this5 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee5() {
        var res;
        return _regenerator.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.prev = 0;
                _context5.next = 3;
                return uniCloud.callFunction({
                  name: 'getFahuiReceiverConfig',
                  data: {
                    t: Date.now()
                  }
                });
              case 3:
                res = _context5.sent;
                console.log('[调试] getFahuiReceiverConfig 返回:', res);
                // 兼容 enabled 字段在 result 或根对象
                _this5.receiverEnabled = !!(res.result && typeof res.result.enabled !== 'undefined' ? res.result.enabled : res.enabled);
                _context5.next = 11;
                break;
              case 8:
                _context5.prev = 8;
                _context5.t0 = _context5["catch"](0);
                _this5.receiverEnabled = false;
              case 11:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, null, [[0, 8]]);
      }))();
    },
    onReceiverSwitchChange: function onReceiverSwitchChange(e) {
      var _this6 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee6() {
        var value;
        return _regenerator.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                value = e.detail.value;
                _context6.prev = 1;
                _context6.next = 4;
                return uniCloud.callFunction({
                  name: 'updateFahuiReceiverConfig',
                  data: {
                    enabled: value
                  }
                });
              case 4:
                _this6.receiverEnabled = value;
                uni.showToast({
                  title: value ? '已启用' : '已关闭',
                  icon: 'success'
                });
                _context6.next = 11;
                break;
              case 8:
                _context6.prev = 8;
                _context6.t0 = _context6["catch"](1);
                uni.showToast({
                  title: '设置失败',
                  icon: 'none'
                });
              case 11:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, null, [[1, 8]]);
      }))();
    },
    exportOrders: function exportOrders() {
      var _this7 = this;
      // 导出当前筛选结果为CSV
      var headers = ['订单号', '法会名称', '法会项目', '报名人', '配偶', '超度类型', '已故亲人', '代办物品', '收件人', '金额', '支付方式', '支付时间', '报名时间', '专场法会日期', '状态', '备注'];
      var rows = this.filteredOrders.map(function (o) {
        return [o.orderNo || o._id, o.fahuiName || o.fahuiProject && o.fahuiProject.name || '', o.fahuiProject && o.fahuiProject.name ? o.fahuiProject.name : '', o.applicants && o.applicants.length ? o.applicants.map(function (a) {
          return "".concat(a.name, "/").concat(a.phone);
        }).join('；') : '', o.spouse && o.spouse.name ? o.spouse.name : '', o.chaoduType || '', o.deceasedList && o.deceasedList.length ? o.deceasedList.map(function (d) {
          return "".concat(d.name, "/").concat(d.relation);
        }).join('；') : '', o.goods && o.goods.length ? o.goods.map(function (g) {
          return "".concat(g.name, "\xD7").concat(g.qty);
        }).join('；') : '', o.receiver && o.receiver.name ? o.receiver.name : '', o.amount || o.totalFee || 0, o.paymentMethod || '', o.payTime ? _this7.formatDate(o.payTime) : '', o.createTime ? _this7.formatDate(o.createTime) : '', o.fahuiDate || '', _this7.getStatusText(o.status), o.adminRemarks && o.adminRemarks.length ? o.adminRemarks[o.adminRemarks.length - 1].content : o.remark || ''];
      });
      // 加 BOM 兼容 Excel
      var csv = "\uFEFF" + [headers].concat((0, _toConsumableArray2.default)(rows)).map(function (row) {
        return row.map(function (v) {
          return "\"".concat((v || '').toString().replace(/"/g, '""'), "\"");
        }).join(',');
      }).join('\n');
      // 创建下载
      var blob = new Blob([csv], {
        type: 'text/csv'
      });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'fahui_orders.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      uni.showToast({
        title: '导出成功',
        icon: 'success'
      });
    },
    openFahuiDateDialog: function openFahuiDateDialog(order) {
      this.fahuiDateOrder = order;
      this.fahuiDateInput = order.fahuiDate || '';
      this.showFahuiDatePopup = true;
    },
    confirmFahuiDate: function confirmFahuiDate() {
      var _this8 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee7() {
        var result;
        return _regenerator.default.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                if (!(!_this8.fahuiDateOrder || !_this8.fahuiDateInput)) {
                  _context7.next = 2;
                  break;
                }
                return _context7.abrupt("return");
              case 2:
                _context7.prev = 2;
                uni.showLoading({
                  title: '确认中...'
                });
                _context7.next = 6;
                return uniCloud.callFunction({
                  name: 'updateFahuiOrderStatus',
                  data: {
                    id: _this8.fahuiDateOrder._id,
                    status: '已确认',
                    fahuiDate: _this8.fahuiDateInput,
                    operator: '管理员' // 可替换为当前登录用户
                  }
                });
              case 6:
                result = _context7.sent;
                if (!(result.result && result.result.success)) {
                  _context7.next = 13;
                  break;
                }
                uni.showToast({
                  title: '专场法会已确认',
                  icon: 'success'
                });
                _this8.showFahuiDatePopup = false;
                _this8.loadOrders();
                _context7.next = 14;
                break;
              case 13:
                throw new Error(result.result.message || '确认失败');
              case 14:
                _context7.next = 19;
                break;
              case 16:
                _context7.prev = 16;
                _context7.t0 = _context7["catch"](2);
                uni.showToast({
                  title: '确认失败',
                  icon: 'none'
                });
              case 19:
                _context7.prev = 19;
                uni.hideLoading();
                return _context7.finish(19);
              case 22:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, null, [[2, 16, 19, 22]]);
      }))();
    },
    toggleDetail: function toggleDetail(idx) {
      if (this.showDetailIndex === idx) {
        this.showDetailIndex = -1;
      } else {
        this.showDetailIndex = idx;
        this.inlineFahuiDate = this.filteredOrders[idx].fahuiDate || '';
      }
    },
    toggleRemark: function toggleRemark(idx) {
      if (this.showRemarkIndex === idx) {
        this.showRemarkIndex = -1;
      } else {
        this.showRemarkIndex = idx;
        this.inlineRemarkContent = '';
      }
    }
  }, (0, _defineProperty2.default)(_methods, "confirmFahuiDate", function confirmFahuiDate(order) {
    var _this9 = this;
    return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee8() {
      var result;
      return _regenerator.default.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              if (!(!order || !_this9.inlineFahuiDate)) {
                _context8.next = 2;
                break;
              }
              return _context8.abrupt("return");
            case 2:
              _context8.prev = 2;
              uni.showLoading({
                title: '确认中...'
              });
              _context8.next = 6;
              return uniCloud.callFunction({
                name: 'updateFahuiOrderStatus',
                data: {
                  id: order._id,
                  status: '已确认',
                  fahuiDate: _this9.inlineFahuiDate,
                  operator: '管理员'
                }
              });
            case 6:
              result = _context8.sent;
              if (!(result.result && result.result.success)) {
                _context8.next = 12;
                break;
              }
              uni.showToast({
                title: '专场法会已确认',
                icon: 'success'
              });
              _this9.loadOrders();
              _context8.next = 13;
              break;
            case 12:
              throw new Error(result.result.message || '确认失败');
            case 13:
              _context8.next = 18;
              break;
            case 15:
              _context8.prev = 15;
              _context8.t0 = _context8["catch"](2);
              uni.showToast({
                title: '确认失败',
                icon: 'none'
              });
            case 18:
              _context8.prev = 18;
              uni.hideLoading();
              return _context8.finish(18);
            case 21:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8, null, [[2, 15, 18, 21]]);
    }))();
  }), (0, _defineProperty2.default)(_methods, "saveInlineRemark", function saveInlineRemark(order) {
    var _this10 = this;
    return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee9() {
      var remark;
      return _regenerator.default.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              if (_this10.inlineRemarkContent.trim()) {
                _context9.next = 3;
                break;
              }
              uni.showToast({
                title: '请输入备注内容',
                icon: 'none'
              });
              return _context9.abrupt("return");
            case 3:
              _context9.prev = 3;
              remark = {
                content: _this10.inlineRemarkContent
              };
              _context9.next = 7;
              return uniCloud.callFunction({
                name: 'addFahuiOrderRemark',
                data: {
                  orderId: order._id,
                  remark: remark,
                  operator: '管理员'
                }
              });
            case 7:
              _this10.inlineRemarkContent = '';
              _this10.loadOrders();
              uni.showToast({
                title: '备注添加成功',
                icon: 'success'
              });
              _context9.next = 15;
              break;
            case 12:
              _context9.prev = 12;
              _context9.t0 = _context9["catch"](3);
              uni.showToast({
                title: '添加备注失败',
                icon: 'none'
              });
            case 15:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9, null, [[3, 12]]);
    }))();
  }), _methods)
};
exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["default"], __webpack_require__(/*! ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/uni-cloud/dist/index.js */ 27)["uniCloud"]))

/***/ }),

/***/ 665:
/*!**********************************************************************************************************************************!*\
  !*** C:/Users/小美女/Desktop/景区小程序/123/景区小程序/pages/admin/fahui/orders.vue?vue&type=style&index=0&id=6f9cf068&scoped=true&lang=css& ***!
  \**********************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_orders_vue_vue_type_style_index_0_id_6f9cf068_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../Downloads/HBuilderX.4.66.2025051912/HBuilderX/plugins/uniapp-cli/node_modules/mini-css-extract-plugin/dist/loader.js??ref--6-oneOf-1-0!../../../../../../../Downloads/HBuilderX.4.66.2025051912/HBuilderX/plugins/uniapp-cli/node_modules/css-loader/dist/cjs.js??ref--6-oneOf-1-1!../../../../../../../Downloads/HBuilderX.4.66.2025051912/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../../Downloads/HBuilderX.4.66.2025051912/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--6-oneOf-1-2!../../../../../../../Downloads/HBuilderX.4.66.2025051912/HBuilderX/plugins/uniapp-cli/node_modules/postcss-loader/src??ref--6-oneOf-1-3!../../../../../../../Downloads/HBuilderX.4.66.2025051912/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../../../../Downloads/HBuilderX.4.66.2025051912/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./orders.vue?vue&type=style&index=0&id=6f9cf068&scoped=true&lang=css& */ 666);
/* harmony import */ var _Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_orders_vue_vue_type_style_index_0_id_6f9cf068_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_orders_vue_vue_type_style_index_0_id_6f9cf068_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_orders_vue_vue_type_style_index_0_id_6f9cf068_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_orders_vue_vue_type_style_index_0_id_6f9cf068_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Downloads_HBuilderX_4_66_2025051912_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_orders_vue_vue_type_style_index_0_id_6f9cf068_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 666:
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??ref--6-oneOf-1-0!./node_modules/css-loader/dist/cjs.js??ref--6-oneOf-1-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--6-oneOf-1-2!./node_modules/postcss-loader/src??ref--6-oneOf-1-3!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!C:/Users/小美女/Desktop/景区小程序/123/景区小程序/pages/admin/fahui/orders.vue?vue&type=style&index=0&id=6f9cf068&scoped=true&lang=css& ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin
    if(false) { var cssReload; }
  

/***/ })

},[[659,"common/runtime","common/vendor"]]]);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/admin/fahui/orders.js.map