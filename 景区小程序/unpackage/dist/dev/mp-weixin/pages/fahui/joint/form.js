(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["pages/fahui/joint/form"],{

/***/ 328:
/*!*********************************************************************************************************!*\
  !*** C:/Users/qub/Documents/HBuilderProjects/123/景区小程序/main.js?{"page":"pages%2Ffahui%2Fjoint%2Fform"} ***!
  \*********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(wx, createPage) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
__webpack_require__(/*! uni-pages */ 26);
__webpack_require__(/*! @dcloudio/vue-cli-plugin-uni/packages/uni-cloud/dist/index.js */ 27);
var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 25));
var _form = _interopRequireDefault(__webpack_require__(/*! ./pages/fahui/joint/form.vue */ 329));
// @ts-ignore
wx.__webpack_require_UNI_MP_PLUGIN__ = __webpack_require__;
createPage(_form.default);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/wx.js */ 1)["default"], __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 3)["createPage"]))

/***/ }),

/***/ 329:
/*!************************************************************************************!*\
  !*** C:/Users/qub/Documents/HBuilderProjects/123/景区小程序/pages/fahui/joint/form.vue ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _form_vue_vue_type_template_id_4bb6e490_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./form.vue?vue&type=template&id=4bb6e490&scoped=true& */ 330);
/* harmony import */ var _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./form.vue?vue&type=script&lang=js& */ 332);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _form_vue_vue_type_style_index_0_id_4bb6e490_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./form.vue?vue&type=style&index=0&id=4bb6e490&scoped=true&lang=css& */ 336);
/* harmony import */ var _Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../../../Desktop/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/runtime/componentNormalizer.js */ 44);

var renderjs





/* normalize component */

var component = Object(_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _form_vue_vue_type_template_id_4bb6e490_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _form_vue_vue_type_template_id_4bb6e490_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "4bb6e490",
  null,
  false,
  _form_vue_vue_type_template_id_4bb6e490_scoped_true___WEBPACK_IMPORTED_MODULE_0__["components"],
  renderjs
)

component.options.__file = "pages/fahui/joint/form.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ 330:
/*!*******************************************************************************************************************************!*\
  !*** C:/Users/qub/Documents/HBuilderProjects/123/景区小程序/pages/fahui/joint/form.vue?vue&type=template&id=4bb6e490&scoped=true& ***!
  \*******************************************************************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_form_vue_vue_type_template_id_4bb6e490_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../Desktop/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../../../Desktop/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!../../../../../../../Desktop/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!../../../../../../../Desktop/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!../../../../../../../Desktop/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../../../../Desktop/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./form.vue?vue&type=template&id=4bb6e490&scoped=true& */ 331);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_form_vue_vue_type_template_id_4bb6e490_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_form_vue_vue_type_template_id_4bb6e490_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "recyclableRender", function() { return _Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_form_vue_vue_type_template_id_4bb6e490_scoped_true___WEBPACK_IMPORTED_MODULE_0__["recyclableRender"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "components", function() { return _Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_form_vue_vue_type_template_id_4bb6e490_scoped_true___WEBPACK_IMPORTED_MODULE_0__["components"]; });



/***/ }),

/***/ 331:
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!C:/Users/qub/Documents/HBuilderProjects/123/景区小程序/pages/fahui/joint/form.vue?vue&type=template&id=4bb6e490&scoped=true& ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
      return __webpack_require__.e(/*! import() | components/uni-popup/uni-popup */ "components/uni-popup/uni-popup").then(__webpack_require__.bind(null, /*! @/components/uni-popup/uni-popup.vue */ 762))
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
  var g0 = !_vm.isLoading ? _vm.applicants.length : null
  var l0 = !_vm.isLoading
    ? _vm.__map(_vm.applicants, function (applicant, idx) {
        var $orig = _vm.__get_orig(applicant)
        var g1 = _vm.applicants.length
        return {
          $orig: $orig,
          g1: g1,
        }
      })
    : null
  var g2 = !_vm.isLoading ? _vm.applicants.length : null
  var l1 =
    !_vm.isLoading && _vm.isChaoduProject
      ? _vm.__map(_vm.deceasedList, function (deceased, idx) {
          var $orig = _vm.__get_orig(deceased)
          var g3 = _vm.deceasedList.length
          return {
            $orig: $orig,
            g3: g3,
          }
        })
      : null
  var g4 =
    !_vm.isLoading && _vm.isChaoduProject ? _vm.deceasedList.length : null
  var g5 = !_vm.isLoading && true ? _vm.applicants.length : null
  var g6 = !_vm.isLoading && true ? _vm.deceasedList.length : null
  var g7 = !_vm.isLoading && true ? _vm.items.length : null
  _vm.$mp.data = Object.assign(
    {},
    {
      $root: {
        g0: g0,
        l0: l0,
        g2: g2,
        l1: l1,
        g4: g4,
        g5: g5,
        g6: g6,
        g7: g7,
      },
    }
  )
}
var recyclableRender = false
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ 332:
/*!*************************************************************************************************************!*\
  !*** C:/Users/qub/Documents/HBuilderProjects/123/景区小程序/pages/fahui/joint/form.vue?vue&type=script&lang=js& ***!
  \*************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Desktop_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../Desktop/HBuilderX/plugins/uniapp-cli/node_modules/babel-loader/lib!../../../../../../../Desktop/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!../../../../../../../Desktop/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!../../../../../../../Desktop/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../../../../Desktop/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./form.vue?vue&type=script&lang=js& */ 333);
/* harmony import */ var _Desktop_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _Desktop_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _Desktop_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 333:
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!C:/Users/qub/Documents/HBuilderProjects/123/景区小程序/pages/fahui/joint/form.vue?vue&type=script&lang=js& ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
var _asyncToGenerator2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ 31));
var _jointDataManager = _interopRequireDefault(__webpack_require__(/*! @/utils/jointDataManager.js */ 334));
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var uniPopup = function uniPopup() {
  __webpack_require__.e(/*! require.ensure | components/uni-popup/uni-popup */ "components/uni-popup/uni-popup").then((function () {
    return resolve(__webpack_require__(/*! @/components/uni-popup/uni-popup.vue */ 762));
  }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
};
// 导入云对象
var jointManagement = uniCloud.importObject('joint-management');
var _default = {
  components: {
    uniPopup: uniPopup
  },
  data: function data() {
    return {
      isLoading: true,
      isSubmitting: false,
      projectId: '',
      // 报名人信息
      applicants: [],
      editApplicant: {},
      editIndex: -1,
      // 法会项目信息
      jointProjects: [],
      jointProjectIdx: -1,
      currentProject: null,
      selectedDateIdx: -1,
      selectedDate: '',
      // 姻缘和合法会特殊信息
      spouse: {
        name: '',
        gender: '',
        lunarBirthday: '',
        birthTime: ''
      },
      editSpouse: {},
      // 超度法会特殊信息
      chaoduType: '',
      chaoduTypes: ['超度亡灵', '超度婴灵', '超度冤亲债主', '超度历代宗亲'],
      deceasedList: [],
      editDeceased: {},
      editDeceasedIndex: -1,
      // 代办物品
      items: [],
      showItems: false,
      // 收件信息
      receiver: {
        name: '',
        phone: '',
        address: ''
      },
      showReceiver: false,
      receiverConfig: null,
      // 选项数据
      genderOptions: ['男', '女'],
      birthTimeOptions: ['子时(23:00-01:00)', '丑时(01:00-03:00)', '寅时(03:00-05:00)', '卯时(05:00-07:00)', '辰时(07:00-09:00)', '巳时(09:00-11:00)', '午时(11:00-13:00)', '未时(13:00-15:00)', '申时(15:00-17:00)', '酉时(17:00-19:00)', '戌时(19:00-21:00)', '亥时(21:00-23:00)'],
      deceasedRelationOptions: ['先曾祖父', '先曾祖母', '先祖父', '先祖母', '外祖父', '外祖母', '先父', '先母', '岳父', '岳母', '先夫', '先妻', '故爱子', '故爱女', '好友', '恩师', '其他']
    };
  },
  computed: {
    hasSelectedItems: function hasSelectedItems() {
      return this.items.some(function (item) {
        return item.count > 0;
      });
    },
    projectNames: function projectNames() {
      return this.jointProjects.map(function (p) {
        return p.name;
      });
    },
    genderIndex: function genderIndex() {
      return this.genderOptions.indexOf(this.editApplicant.gender);
    },
    birthTimeIndex: function birthTimeIndex() {
      return this.birthTimeOptions.indexOf(this.editApplicant.birthTime);
    },
    chaoduTypeIndex: function chaoduTypeIndex() {
      return this.chaoduTypes.indexOf(this.chaoduType);
    },
    spouseGenderIndex: function spouseGenderIndex() {
      return this.genderOptions.indexOf(this.editSpouse.gender);
    },
    spouseBirthTimeIndex: function spouseBirthTimeIndex() {
      return this.birthTimeOptions.indexOf(this.editSpouse.birthTime);
    },
    deceasedRelationIndex: function deceasedRelationIndex() {
      return this.deceasedRelationOptions.indexOf(this.editDeceased.relation);
    },
    hasProjectDates: function hasProjectDates() {
      return this.currentProject && this.currentProject.dates && this.currentProject.dates.length > 0;
    },
    showSpouseInfo: function showSpouseInfo() {
      return this.currentProject && this.currentProject.category === '姻缘和合' && this.spouse.name;
    },
    isYinyuanProject: function isYinyuanProject() {
      return this.currentProject && this.currentProject.category === '姻缘和合';
    },
    isChaoduProject: function isChaoduProject() {
      return this.currentProject && this.currentProject.category === '超度法会';
    }
  },
  onLoad: function onLoad(options) {
    console.log('🔍 页面加载调试: ========== 页面开始加载 ==========');
    console.log('🔍 页面加载调试: options:', options);
    console.log('🔍 页面加载调试: 初始 showReceiver =', this.showReceiver);
    console.log('🔍 页面加载调试: 初始 applicants =', this.applicants);
    if (options.projectId) {
      this.projectId = options.projectId;
      console.log('🔍 页面加载调试: 设置 projectId =', this.projectId);
    }
    console.log('🔍 页面加载调试: 开始调用 loadData()');
    this.loadData();
    console.log('🔍 页面加载调试: loadData() 调用完成');
  },
  onShow: function onShow() {
    console.log('🔍 页面显示调试: ========== 页面显示 ==========');
    console.log('🔍 页面显示调试: 当前 showReceiver =', this.showReceiver);
    console.log('🔍 页面显示调试: 当前 applicants =', this.applicants);
    console.log('🔍 页面显示调试: 开始调用 loadDraft()');
    this.loadDraft();
    console.log('🔍 页面显示调试: loadDraft() 调用完成');
    console.log('🔍 页面显示调试: 开始调用 checkAndClearOldData()');
    this.checkAndClearOldData();
    console.log('🔍 页面显示调试: checkAndClearOldData() 调用完成');
    console.log('🔍 页面显示调试: 页面显示完成，最终 applicants =', this.applicants);
  },
  methods: {
    loadData: function loadData() {
      var _this = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
        var _this$currentProject, index;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                console.log('🔍 loadData调试: ========== 开始加载数据 ==========');
                _context.prev = 1;
                _this.isLoading = true;
                console.log('🔍 loadData调试: 设置 isLoading = true');

                // 加载合坛法会项目
                console.log('🔍 loadData调试: 开始加载合坛法会项目');
                _context.next = 7;
                return _this.loadJointProjects();
              case 7:
                console.log('🔍 loadData调试: 合坛法会项目加载完成，项目数量:', _this.jointProjects.length);

                // 加载收件信息配置
                console.log('🔍 loadData调试: 开始加载收件信息配置...');
                _context.next = 11;
                return _this.loadReceiverConfig();
              case 11:
                console.log('🔍 loadData调试: 收件信息配置加载完成，showReceiver =', _this.showReceiver);

                // 如果有projectId，自动选择对应项目
                if (!_this.projectId) {
                  _context.next = 24;
                  break;
                }
                console.log('🔍 loadData调试: 有projectId，开始自动选择项目:', _this.projectId);
                index = _this.jointProjects.findIndex(function (p) {
                  return p._id === _this.projectId;
                });
                if (!(index !== -1)) {
                  _context.next = 23;
                  break;
                }
                _this.jointProjectIdx = index;
                _this.currentProject = _this.jointProjects[index];
                console.log('🔍 loadData调试: 自动选择项目成功:', _this.currentProject.name, '项目ID:', _this.currentProject._id);
                // 加载选中项目的代办物品
                _context.next = 21;
                return _this.loadItemsConfig(_this.currentProject._id);
              case 21:
                _context.next = 24;
                break;
              case 23:
                console.log('🔍 loadData调试: 未找到对应的项目');
              case 24:
                // 初始化报名人
                console.log('🔍 loadData调试: 检查报名人初始化，当前applicants长度:', _this.applicants.length);
                if (_this.applicants.length === 0) {
                  console.log('🔍 loadData调试: 没有报名人，添加默认报名人');
                  _this.addApplicant();
                  console.log('🔍 loadData调试: 添加默认报名人完成，当前applicants:', _this.applicants);
                } else {
                  console.log('🔍 loadData调试: 已有报名人，数量:', _this.applicants.length);
                  console.log('🔍 loadData调试: 现有报名人详情:', _this.applicants);
                }
                console.log('🔍 loadData调试: ========== 数据加载完成 ==========');
                console.log('🔍 loadData调试: 当前项目数量:', _this.jointProjects.length);
                console.log('🔍 loadData调试: 当前选中项目:', ((_this$currentProject = _this.currentProject) === null || _this$currentProject === void 0 ? void 0 : _this$currentProject.name) || '无');
                console.log('🔍 loadData调试: 代办物品显示状态:', _this.showItems);
                console.log('🔍 loadData调试: 收件信息显示状态:', _this.showReceiver);
                console.log('🔍 loadData调试: 收件信息配置对象:', _this.receiverConfig);
                console.log('🔍 loadData调试: 收件人信息:', _this.receiver);
                console.log('🔍 loadData调试: 最终applicants状态:', _this.applicants);
                console.log('🔍 loadData调试: applicants长度:', _this.applicants.length);
                _this.isLoading = false;
                console.log('🔍 loadData调试: 设置 isLoading = false');
                _context.next = 44;
                break;
              case 39:
                _context.prev = 39;
                _context.t0 = _context["catch"](1);
                console.error('加载数据失败:', _context.t0);
                uni.showToast({
                  title: '加载数据失败',
                  icon: 'none'
                });
                _this.isLoading = false;
              case 44:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[1, 39]]);
      }))();
    },
    loadJointProjects: function loadJointProjects() {
      var _this2 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
        var result;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                _context2.next = 3;
                return jointManagement.getProjects();
              case 3:
                result = _context2.sent;
                if (result.success && result.data && result.data.length > 0) {
                  _this2.jointProjects = result.data;
                } else {
                  // 使用默认数据
                  _this2.jointProjects = [{
                    _id: 'joint_pingan',
                    name: '平安合坛',
                    price: 200,
                    description: '祈求平安吉祥，消灾免难',
                    category: '平安祈福',
                    deadline: '2025-12-31',
                    dates: ['2025-08-01', '2025-08-15', '2025-09-01'],
                    maxApplicants: 100
                  }, {
                    _id: 'joint_yinyuan',
                    name: '姻缘合坛',
                    price: 300,
                    description: '祈求姻缘美满，感情和睦',
                    category: '姻缘和合',
                    deadline: '2025-12-31',
                    dates: ['2025-08-10', '2025-09-10'],
                    maxApplicants: 50
                  }, {
                    _id: 'joint_chaodu',
                    name: '超度合坛',
                    price: 400,
                    description: '超度亡灵，祈求往生净土',
                    category: '超度法会',
                    deadline: '2025-12-31',
                    dates: ['2025-08-18', '2025-08-30', '2025-09-18'],
                    maxApplicants: 80
                  }];
                }
                _context2.next = 11;
                break;
              case 7:
                _context2.prev = 7;
                _context2.t0 = _context2["catch"](0);
                console.error('加载合坛法会项目失败:', _context2.t0);
                throw _context2.t0;
              case 11:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[0, 7]]);
      }))();
    },
    loadItemsConfig: function loadItemsConfig(projectId) {
      var _this3 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3() {
        var moduleResult, moduleEnabled, result;
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (projectId) {
                  _context3.next = 5;
                  break;
                }
                console.log('🔍 代办物品调试: 项目ID为空，禁用代办物品模块');
                _this3.showItems = false;
                _this3.items = [];
                return _context3.abrupt("return");
              case 5:
                _context3.prev = 5;
                console.log('🔍 代办物品调试: 开始检查模块启用状态，项目ID:', projectId);

                // 首先检查模块是否启用
                _context3.next = 9;
                return jointManagement.getGoodsConfig();
              case 9:
                moduleResult = _context3.sent;
                console.log('🔍 代办物品调试: 模块配置云函数返回结果:', moduleResult);
                moduleEnabled = false;
                if (moduleResult.success && moduleResult.data) {
                  moduleEnabled = moduleResult.data.enabled || false;
                  console.log('🔍 代办物品调试: 从数据库获取的启用状态:', moduleEnabled);
                } else {
                  console.log('🔍 代办物品调试: 数据库中没有配置数据，默认禁用');
                }

                // 如果模块未启用，直接返回
                if (moduleEnabled) {
                  _context3.next = 18;
                  break;
                }
                console.log('🔍 代办物品调试: 模块已禁用，隐藏代办物品区域');
                _this3.showItems = false;
                _this3.items = [];
                return _context3.abrupt("return");
              case 18:
                console.log('🔍 代办物品调试: 模块已启用，开始加载项目物品');

                // 模块启用后，检查项目是否有物品
                _context3.next = 21;
                return jointManagement.getGoods({
                  projectId: projectId
                });
              case 21:
                result = _context3.sent;
                console.log('🔍 代办物品调试: 项目物品云函数返回结果:', result);
                if (result.data && result.data.length > 0) {
                  console.log('🔍 代办物品调试: 项目有物品，显示代办物品区域，物品数量:', result.data.length);
                  _this3.showItems = true;
                  _this3.items = result.data.map(function (item) {
                    return _objectSpread(_objectSpread({}, item), {}, {
                      count: 0
                    });
                  });
                } else {
                  console.log('🔍 代办物品调试: 项目没有物品，隐藏代办物品区域');
                  _this3.showItems = false;
                  _this3.items = [];
                }
                _context3.next = 31;
                break;
              case 26:
                _context3.prev = 26;
                _context3.t0 = _context3["catch"](5);
                console.error('🔍 代办物品调试: 加载代办物品配置失败:', _context3.t0);
                _this3.showItems = false;
                _this3.items = [];
              case 31:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[5, 26]]);
      }))();
    },
    loadReceiverConfig: function loadReceiverConfig() {
      var _this4 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee4() {
        var result, oldShowReceiver, _oldShowReceiver, _oldShowReceiver2;
        return _regenerator.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                console.log('🔍 收件信息调试: 开始加载收件信息配置...');
                console.log('🔍 收件信息调试: 调用前 showReceiver =', _this4.showReceiver);
                _context4.next = 5;
                return jointManagement.getReceiverConfig();
              case 5:
                result = _context4.sent;
                console.log('🔍 收件信息调试: 云函数返回结果:', result);
                console.log('🔍 收件信息调试: result.data =', result.data);
                if (result.success && result.data) {
                  _this4.receiverConfig = result.data;
                  oldShowReceiver = _this4.showReceiver;
                  _this4.showReceiver = result.data.enabled || false;
                  console.log('🔍 收件信息调试: 配置加载成功');
                  console.log('🔍 收件信息调试: enabled =', result.data.enabled);
                  console.log('🔍 收件信息调试: showReceiver 从', oldShowReceiver, '变为', _this4.showReceiver);
                  console.log('🔍 收件信息调试: 完整配置对象:', _this4.receiverConfig);
                } else {
                  _oldShowReceiver = _this4.showReceiver;
                  _this4.receiverConfig = null;
                  _this4.showReceiver = false;
                  console.log('🔍 收件信息调试: 配置为空或无效');
                  console.log('🔍 收件信息调试: showReceiver 从', _oldShowReceiver, '变为', _this4.showReceiver);
                  console.log('🔍 收件信息调试: receiverConfig 设置为 null');
                }
                console.log('🔍 收件信息调试: 方法执行完成，最终 showReceiver =', _this4.showReceiver);
                _context4.next = 20;
                break;
              case 12:
                _context4.prev = 12;
                _context4.t0 = _context4["catch"](0);
                console.error('🔍 收件信息调试: 加载收件信息配置失败:', _context4.t0);
                console.error('🔍 收件信息调试: 错误详情:', _context4.t0.message || _context4.t0);
                _oldShowReceiver2 = _this4.showReceiver;
                _this4.receiverConfig = null;
                _this4.showReceiver = false;
                console.log('🔍 收件信息调试: 异常处理，showReceiver 从', _oldShowReceiver2, '变为', _this4.showReceiver);
              case 20:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, null, [[0, 12]]);
      }))();
    },
    getReceiverConfig: function getReceiverConfig() {
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee5() {
        var result;
        return _regenerator.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.prev = 0;
                console.log('🔍 收件信息调试: getReceiverConfig 被调用');
                _context5.next = 4;
                return jointManagement.getReceiverConfig();
              case 4:
                result = _context5.sent;
                console.log('🔍 收件信息调试: getReceiverConfig 云函数返回:', result);
                if (!(result.success && result.data)) {
                  _context5.next = 9;
                  break;
                }
                console.log('🔍 收件信息调试: getReceiverConfig 返回配置:', result.data);
                return _context5.abrupt("return", result.data);
              case 9:
                console.log('🔍 收件信息调试: getReceiverConfig 返回 null');
                return _context5.abrupt("return", null);
              case 13:
                _context5.prev = 13;
                _context5.t0 = _context5["catch"](0);
                console.error('🔍 收件信息调试: getReceiverConfig 调用失败:', _context5.t0);
                return _context5.abrupt("return", null);
              case 17:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, null, [[0, 13]]);
      }))();
    },
    checkModuleConfig: function checkModuleConfig() {
      var _this5 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee6() {
        var _this5$currentProject, _moduleResult$data, _moduleResult$data$, moduleResult, checkResult, projectInfo, projectItems, itemsResult, message;
        return _regenerator.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.prev = 0;
                console.log('=== 检查代办物品模块配置 ===');

                // 检查模块配置
                _context6.next = 4;
                return jointManagement.getGoodsConfig();
              case 4:
                moduleResult = _context6.sent;
                console.log('模块配置结果:', moduleResult);

                // 检查数据库配置
                _context6.next = 8;
                return jointManagement.getGoodsConfig();
              case 8:
                checkResult = _context6.sent;
                console.log('数据库检查结果:', checkResult);

                // 检查当前项目信息
                projectInfo = '无';
                if (_this5.currentProject) {
                  projectInfo = "".concat(_this5.currentProject.name, " (").concat(_this5.currentProject._id, ")");
                }

                // 检查项目物品
                projectItems = '无';
                if (!(_this5.currentProject && _this5.currentProject._id)) {
                  _context6.next = 24;
                  break;
                }
                _context6.prev = 14;
                _context6.next = 17;
                return jointManagement.getGoods({
                  projectId: _this5.currentProject._id
                });
              case 17:
                itemsResult = _context6.sent;
                if (itemsResult.success && itemsResult.data) {
                  projectItems = "".concat(itemsResult.data.length, "\u4E2A\u7269\u54C1");
                }
                _context6.next = 24;
                break;
              case 21:
                _context6.prev = 21;
                _context6.t0 = _context6["catch"](14);
                projectItems = '查询失败';
              case 24:
                // 显示结果
                message = '代办物品模块配置检查结果：\n\n';
                message += "\u5F53\u524D\u9879\u76EE: ".concat(projectInfo, "\n");
                message += "\u9879\u76EE\u5206\u7C7B: ".concat(((_this5$currentProject = _this5.currentProject) === null || _this5$currentProject === void 0 ? void 0 : _this5$currentProject.category) || '无', "\n");
                message += "\u6A21\u5757\u542F\u7528\u72B6\u6001: ".concat((_moduleResult$data = moduleResult.data) !== null && _moduleResult$data !== void 0 && (_moduleResult$data$ = _moduleResult$data[0]) !== null && _moduleResult$data$ !== void 0 && _moduleResult$data$.enabled ? '启用' : '禁用', "\n");
                message += "\u6570\u636E\u5E93\u914D\u7F6E\u5B58\u5728: ".concat(checkResult.total > 0 ? '是' : '否', "\n");
                message += "\u9879\u76EE\u7269\u54C1\u6570\u91CF: ".concat(projectItems, "\n");
                message += "\u5F53\u524D\u663E\u793A\u72B6\u6001: ".concat(_this5.showItems ? '显示' : '隐藏', "\n");
                message += "\u7269\u54C1\u5217\u8868\u957F\u5EA6: ".concat(_this5.items.length);
                uni.showModal({
                  title: '代办物品模块配置检查',
                  content: message,
                  showCancel: false
                });
                _context6.next = 39;
                break;
              case 35:
                _context6.prev = 35;
                _context6.t1 = _context6["catch"](0);
                console.error('检查模块配置失败:', _context6.t1);
                uni.showToast({
                  title: '检查失败',
                  icon: 'none'
                });
              case 39:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, null, [[0, 35], [14, 21]]);
      }))();
    },
    checkReceiverConfig: function checkReceiverConfig() {
      var _this6 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee7() {
        var _receiverResult$data, _receiverResult$data$, _receiverResult$data2, _receiverResult$data3, _receiverResult$data4, _receiverResult$data5, _receiverResult$data6, _receiverResult$data7, receiverResult, checkResult, message;
        return _regenerator.default.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.prev = 0;
                console.log('=== 检查收件信息模块配置 ===');

                // 检查收件信息配置
                _context7.next = 4;
                return jointManagement.getReceiverConfig();
              case 4:
                receiverResult = _context7.sent;
                console.log('收件信息配置结果:', receiverResult);

                // 检查数据库配置
                _context7.next = 8;
                return jointManagement.getReceiverConfig();
              case 8:
                checkResult = _context7.sent;
                console.log('数据库检查结果:', checkResult);

                // 检查当前状态
                message = '收件信息模块配置检查结果：\n\n';
                message += "\u914D\u7F6E\u542F\u7528\u72B6\u6001: ".concat((_receiverResult$data = receiverResult.data) !== null && _receiverResult$data !== void 0 && (_receiverResult$data$ = _receiverResult$data[0]) !== null && _receiverResult$data$ !== void 0 && _receiverResult$data$.enabled ? '启用' : '禁用', "\n");
                message += "\u59D3\u540D\u5FC5\u586B: ".concat((_receiverResult$data2 = receiverResult.data) !== null && _receiverResult$data2 !== void 0 && (_receiverResult$data3 = _receiverResult$data2[0]) !== null && _receiverResult$data3 !== void 0 && _receiverResult$data3.nameRequired ? '是' : '否', "\n");
                message += "\u7535\u8BDD\u5FC5\u586B: ".concat((_receiverResult$data4 = receiverResult.data) !== null && _receiverResult$data4 !== void 0 && (_receiverResult$data5 = _receiverResult$data4[0]) !== null && _receiverResult$data5 !== void 0 && _receiverResult$data5.phoneRequired ? '是' : '否', "\n");
                message += "\u5730\u5740\u5FC5\u586B: ".concat((_receiverResult$data6 = receiverResult.data) !== null && _receiverResult$data6 !== void 0 && (_receiverResult$data7 = _receiverResult$data6[0]) !== null && _receiverResult$data7 !== void 0 && _receiverResult$data7.addressRequired ? '是' : '否', "\n");
                message += "\u6570\u636E\u5E93\u914D\u7F6E\u5B58\u5728: ".concat(checkResult.total > 0 ? '是' : '否', "\n");
                message += "\u914D\u7F6E\u8BB0\u5F55\u6570\u91CF: ".concat(checkResult.total || 0, "\n");
                message += "\u6536\u4EF6\u4FE1\u606F\u6570\u91CF: 0\n";
                message += "\u5F53\u524D\u663E\u793A\u72B6\u6001: ".concat(_this6.showReceiver ? '显示' : '隐藏', "\n");
                message += "\u914D\u7F6E\u5BF9\u8C61: ".concat(_this6.receiverConfig ? '存在' : 'null', "\n");
                message += "\u6536\u4EF6\u4EBA\u59D3\u540D: ".concat(_this6.receiver.name || '未填写', "\n");
                message += "\u8054\u7CFB\u7535\u8BDD: ".concat(_this6.receiver.phone || '未填写', "\n");
                message += "\u6536\u4EF6\u5730\u5740: ".concat(_this6.receiver.address || '未填写');
                uni.showModal({
                  title: '收件信息模块配置检查',
                  content: message,
                  showCancel: false
                });
                _context7.next = 30;
                break;
              case 26:
                _context7.prev = 26;
                _context7.t0 = _context7["catch"](0);
                console.error('检查收件信息配置失败:', _context7.t0);
                uni.showToast({
                  title: '检查失败',
                  icon: 'none'
                });
              case 30:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, null, [[0, 26]]);
      }))();
    },
    // 报名人管理
    addApplicant: function addApplicant() {
      console.log('🔍 addApplicant调试: ========== 添加报名人 ==========');
      console.log('🔍 addApplicant调试: 当前applicants长度:', this.applicants.length);
      if (this.applicants.length >= 5) {
        console.log('🔍 addApplicant调试: 已达到最大数量限制');
        uni.showToast({
          title: '最多只能添加5位报名人',
          icon: 'none'
        });
        return;
      }
      var newApplicant = {
        name: '',
        gender: '',
        phone: '',
        lunarBirthday: '',
        birthTime: '',
        address: ''
      };
      console.log('🔍 addApplicant调试: 准备添加新报名人:', newApplicant);
      this.applicants.push(newApplicant);
      console.log('🔍 addApplicant调试: 添加完成，当前applicants:', this.applicants);
      this.saveDraft();
      console.log('🔍 addApplicant调试: 保存草稿完成');
    },
    removeApplicant: function removeApplicant(index) {
      this.applicants.splice(index, 1);
      this.saveDraft();
    },
    openApplicantDialog: function openApplicantDialog(index) {
      console.log('🔍 打开报名人弹窗调试: index =', index);
      console.log('🔍 打开报名人弹窗调试: applicants[', index, '] =', this.applicants[index]);
      this.editIndex = index;
      this.editApplicant = _objectSpread({}, this.applicants[index]);
      console.log('🔍 打开报名人弹窗调试: editIndex =', this.editIndex);
      console.log('🔍 打开报名人弹窗调试: editApplicant =', this.editApplicant);
      this.$refs.popup.open();
    },
    saveApplicant: function saveApplicant() {
      var _this7 = this;
      console.log('🔍 保存报名人调试: 开始保存报名人信息');
      console.log('🔍 保存报名人调试: editIndex =', this.editIndex);
      console.log('🔍 保存报名人调试: editApplicant =', this.editApplicant);
      if (!this.editApplicant.name) {
        uni.showToast({
          title: '请输入姓名',
          icon: 'none'
        });
        return;
      }
      if (!this.editApplicant.gender) {
        uni.showToast({
          title: '请选择性别',
          icon: 'none'
        });
        return;
      }
      if (!this.editApplicant.phone) {
        uni.showToast({
          title: '请输入联系电话',
          icon: 'none'
        });
        return;
      }
      if (!this.editApplicant.lunarBirthday) {
        uni.showToast({
          title: '请选择农历生日',
          icon: 'none'
        });
        return;
      }
      if (!this.editApplicant.birthTime) {
        uni.showToast({
          title: '请选择出生时辰',
          icon: 'none'
        });
        return;
      }
      if (!this.editApplicant.address) {
        uni.showToast({
          title: '请输入常住地址',
          icon: 'none'
        });
        return;
      }

      // 保存前检查
      console.log('🔍 保存报名人调试: 保存前的applicants =', this.applicants);

      // 确保数据正确保存 - 使用Vue.set确保响应式更新
      var savedApplicant = _objectSpread({}, this.editApplicant);

      // 使用Vue.set确保响应式更新
      if (this.$set) {
        this.$set(this.applicants, this.editIndex, savedApplicant);
      } else {
        // 如果$set不可用，使用数组方法
        this.applicants.splice(this.editIndex, 1, savedApplicant);
      }

      // 保存后检查
      console.log('🔍 保存报名人调试: 保存后的applicants =', this.applicants);
      console.log('🔍 保存报名人调试: 保存后的applicants[', this.editIndex, '] =', this.applicants[this.editIndex]);
      console.log('🔍 保存报名人调试: 保存的数据 =', savedApplicant);

      // 强制触发响应式更新
      this.$forceUpdate();
      this.closePopup();
      this.saveDraft();

      // 再次验证保存结果
      setTimeout(function () {
        console.log('🔍 保存报名人调试: 延迟验证 - applicants =', _this7.applicants);
        console.log('🔍 保存报名人调试: 延迟验证 - applicants[', _this7.editIndex, '] =', _this7.applicants[_this7.editIndex]);

        // 显示成功提示
        uni.showToast({
          title: '报名人信息保存成功',
          icon: 'success',
          duration: 2000
        });
      }, 100);
      console.log('🔍 保存报名人调试: 保存完成，当前applicants =', this.applicants);
    },
    closePopup: function closePopup() {
      this.$refs.popup.close();
      this.editIndex = -1;
      this.editApplicant = {};
    },
    // 选择器事件
    onGenderChange: function onGenderChange(e) {
      this.editApplicant.gender = this.genderOptions[e.detail.value];
    },
    onLunarBirthdayChange: function onLunarBirthdayChange(e) {
      this.editApplicant.lunarBirthday = e.detail.value;
    },
    onBirthTimeChange: function onBirthTimeChange(e) {
      this.editApplicant.birthTime = this.birthTimeOptions[e.detail.value];
    },
    onProjectChange: function onProjectChange(e) {
      var _this8 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee8() {
        return _regenerator.default.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _this8.jointProjectIdx = e.detail.value;
                _this8.currentProject = _this8.jointProjects[e.detail.value];
                console.log('🔍 代办物品调试: 用户选择项目:', _this8.currentProject.name, '项目ID:', _this8.currentProject._id, '项目分类:', _this8.currentProject.category);
                console.log('🔍 姻缘和合法会调试: 选择项目后，currentProject:', _this8.currentProject);
                console.log('🔍 姻缘和合法会调试: 项目分类检查:', _this8.currentProject.category === '姻缘和合');
                _this8.selectedDateIdx = -1;
                _this8.selectedDate = '';
                _this8.chaoduType = '';
                _this8.deceasedList = [];

                // 加载选中项目的代办物品
                if (!(_this8.currentProject && _this8.currentProject._id)) {
                  _context8.next = 15;
                  break;
                }
                console.log('🔍 代办物品调试: 开始加载新项目的代办物品配置');
                _context8.next = 13;
                return _this8.loadItemsConfig(_this8.currentProject._id);
              case 13:
                _context8.next = 18;
                break;
              case 15:
                console.log('🔍 代办物品调试: 项目ID无效，禁用代办物品模块');
                _this8.showItems = false;
                _this8.items = [];
              case 18:
                _this8.saveDraft();
              case 19:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8);
      }))();
    },
    onDateChange: function onDateChange(e) {
      this.selectedDateIdx = e.detail.value;
      this.selectedDate = this.currentProject.dates[e.detail.value];
      this.saveDraft();
    },
    onChaoduTypeChange: function onChaoduTypeChange(e) {
      this.chaoduType = this.chaoduTypes[e.detail.value];
      this.saveDraft();
    },
    // 超度法会特殊功能
    addDeceased: function addDeceased() {
      if (this.deceasedList.length >= 5) {
        uni.showToast({
          title: '最多只能添加5位已故亲人',
          icon: 'none'
        });
        return;
      }
      this.deceasedList.push({
        name: '',
        lunarBirthday: '',
        deathDate: '',
        relation: ''
      });
      this.saveDraft();
    },
    removeDeceased: function removeDeceased(index) {
      this.deceasedList.splice(index, 1);
      this.saveDraft();
    },
    openDeceasedDialog: function openDeceasedDialog(index) {
      this.editDeceasedIndex = index;
      this.editDeceased = _objectSpread({}, this.deceasedList[index]);
      this.$refs.deceasedPopup.open();
    },
    saveDeceased: function saveDeceased() {
      if (!this.editDeceased.name) {
        uni.showToast({
          title: '请输入姓名',
          icon: 'none'
        });
        return;
      }
      if (!this.editDeceased.relation) {
        uni.showToast({
          title: '请选择关系',
          icon: 'none'
        });
        return;
      }
      this.deceasedList[this.editDeceasedIndex] = _objectSpread({}, this.editDeceased);
      this.closeDeceasedPopup();
      this.saveDraft();
    },
    closeDeceasedPopup: function closeDeceasedPopup() {
      this.$refs.deceasedPopup.close();
      this.editDeceasedIndex = -1;
      this.editDeceased = {};
    },
    onDeceasedLunarBirthdayChange: function onDeceasedLunarBirthdayChange(e) {
      this.editDeceased.lunarBirthday = e.detail.value;
    },
    onDeceasedDeathDateChange: function onDeceasedDeathDateChange(e) {
      this.editDeceased.deathDate = e.detail.value;
    },
    onDeceasedRelationChange: function onDeceasedRelationChange(e) {
      this.editDeceased.relation = this.deceasedRelationOptions[e.detail.value];
    },
    // 配偶信息相关方法
    openSpouseDialog: function openSpouseDialog() {
      this.editSpouse = _objectSpread({}, this.spouse);
      this.$refs.spousePopup.open();
    },
    saveSpouse: function saveSpouse() {
      this.spouse = _objectSpread({}, this.editSpouse);
      this.closeSpousePopup();
      this.saveDraft();
    },
    closeSpousePopup: function closeSpousePopup() {
      this.$refs.spousePopup.close();
      this.editSpouse = {};
    },
    onSpouseGenderChange: function onSpouseGenderChange(e) {
      this.editSpouse.gender = this.genderOptions[e.detail.value];
    },
    onSpouseLunarBirthdayChange: function onSpouseLunarBirthdayChange(e) {
      this.editSpouse.lunarBirthday = e.detail.value;
    },
    onSpouseBirthTimeChange: function onSpouseBirthTimeChange(e) {
      this.editSpouse.birthTime = this.birthTimeOptions[e.detail.value];
    },
    // 验证方法
    validateName: function validateName() {
      if (this.editApplicant.name && this.editApplicant.name.length < 2) {
        uni.showToast({
          title: '姓名至少2个字符',
          icon: 'none'
        });
      }
    },
    validatePhone: function validatePhone() {
      if (this.editApplicant.phone && !/^1[3-9]\d{9}$/.test(this.editApplicant.phone)) {
        uni.showToast({
          title: '请输入正确的手机号',
          icon: 'none'
        });
      }
    },
    // 检查并清除旧数据
    checkAndClearOldData: function checkAndClearOldData() {
      try {
        // 检查是否有旧的订单数据
        var oldOrderData = uni.getStorageSync('joint_fahui_order');
        if (oldOrderData) {
          // 检查数据是否来自当前会话（避免清除刚填写的数据）
          var currentTime = new Date().getTime();
          var dataTime = oldOrderData.createTime || 0;

          // 如果数据是5分钟内的，不提示清除
          if (currentTime - dataTime < 5 * 60 * 1000) {
            console.log('🔍 检测到最近的订单数据，不提示清除');
            return;
          }
          console.log('🔍 发现旧的订单数据，询问是否清除');
          uni.showModal({
            title: '提示',
            content: '检测到之前的报名数据，是否清除重新填写？',
            success: function success(res) {
              if (res.confirm) {
                // 清除旧数据
                uni.removeStorageSync('joint_fahui_order');
                uni.removeStorageSync('joint_fahui_confirm');
                uni.removeStorageSync('joint_fahui_order_id');
                console.log('✅ 旧数据已清除');
                uni.showToast({
                  title: '数据已清除，请重新填写',
                  icon: 'success'
                });
              }
            }
          });
        }
      } catch (error) {
        console.error('检查旧数据失败:', error);
      }
    },
    // 数据持久化
    saveDraft: function saveDraft() {
      console.log('🔍 保存草稿调试: 开始保存草稿');
      console.log('🔍 保存草稿调试: applicants =', this.applicants);
      var draft = {
        applicants: this.applicants,
        jointProjectIdx: this.jointProjectIdx,
        selectedDateIdx: this.selectedDateIdx,
        selectedDate: this.selectedDate,
        spouse: this.spouse,
        chaoduType: this.chaoduType,
        deceasedList: this.deceasedList,
        items: this.items,
        receiver: this.receiver
      };
      console.log('🔍 保存草稿调试: 准备保存的草稿数据 =', draft);
      try {
        uni.setStorageSync('joint_fahui_draft', draft);
        console.log('🔍 保存草稿调试: 草稿保存成功');

        // 验证保存结果
        var savedDraft = uni.getStorageSync('joint_fahui_draft');
        console.log('🔍 保存草稿调试: 验证保存结果 =', savedDraft);
        console.log('🔍 保存草稿调试: 验证保存的applicants =', savedDraft === null || savedDraft === void 0 ? void 0 : savedDraft.applicants);
      } catch (error) {
        console.error('🔍 保存草稿调试: 保存草稿失败:', error);
      }
    },
    loadDraft: function loadDraft() {
      try {
        console.log('🔍 加载草稿调试: 开始加载草稿...');
        var oldShowReceiver = this.showReceiver;
        var draft = uni.getStorageSync('joint_fahui_draft');
        console.log('🔍 加载草稿调试: 从存储中获取的草稿数据 =', draft);
        if (draft) {
          console.log('🔍 加载草稿调试: 草稿中的applicants =', draft.applicants);
          this.applicants = draft.applicants || [];
          this.jointProjectIdx = draft.jointProjectIdx || -1;
          this.selectedDateIdx = draft.selectedDateIdx || -1;
          this.selectedDate = draft.selectedDate || '';
          this.spouse = draft.spouse || {
            name: '',
            gender: '',
            lunarBirthday: '',
            birthTime: ''
          };
          this.chaoduType = draft.chaoduType || '';
          this.deceasedList = draft.deceasedList || [];
          this.items = draft.items || [];
          this.receiver = draft.receiver || {
            name: '',
            phone: '',
            address: ''
          };
          if (this.jointProjectIdx !== -1 && this.jointProjects.length > 0) {
            this.currentProject = this.jointProjects[this.jointProjectIdx];
          }
          console.log('🔍 加载草稿调试: 草稿加载完成');
          console.log('🔍 加载草稿调试: 加载后的applicants =', this.applicants);
          console.log('🔍 加载草稿调试: 草稿中的收件人信息:', this.receiver);
          console.log('🔍 加载草稿调试: showReceiver 在草稿加载前后:', oldShowReceiver, '->', this.showReceiver);
        } else {
          console.log('🔍 加载草稿调试: 没有找到草稿数据');
        }
      } catch (error) {
        console.error('🔍 加载草稿调试: 加载草稿失败:', error);
      }
    },
    // 表单验证
    validateForm: function validateForm() {
      var _this9 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee9() {
        var i, applicant, missingFields, _i, deceased, receiverConfig;
        return _regenerator.default.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                console.log('🔍 表单验证调试: 开始验证表单');
                console.log('🔍 表单验证调试: applicants =', _this9.applicants);
                console.log('🔍 表单验证调试: applicants.length =', _this9.applicants.length);
                if (!(_this9.applicants.length === 0)) {
                  _context9.next = 7;
                  break;
                }
                console.log('🔍 表单验证调试: 没有报名人');
                uni.showToast({
                  title: '请至少添加一位报名人',
                  icon: 'none'
                });
                return _context9.abrupt("return", false);
              case 7:
                i = 0;
              case 8:
                if (!(i < _this9.applicants.length)) {
                  _context9.next = 32;
                  break;
                }
                applicant = _this9.applicants[i];
                console.log("\uD83D\uDD0D \u8868\u5355\u9A8C\u8BC1\u8C03\u8BD5: \u9A8C\u8BC1\u7B2C".concat(i + 1, "\u4F4D\u62A5\u540D\u4EBA:"), applicant);
                console.log("\uD83D\uDD0D \u8868\u5355\u9A8C\u8BC1\u8C03\u8BD5: \u7B2C".concat(i + 1, "\u4F4D\u62A5\u540D\u4EBA\u5B57\u6BB5\u68C0\u67E5:"));
                console.log("  - name: \"".concat(applicant.name, "\" (").concat(!!applicant.name, ")"));
                console.log("  - gender: \"".concat(applicant.gender, "\" (").concat(!!applicant.gender, ")"));
                console.log("  - phone: \"".concat(applicant.phone, "\" (").concat(!!applicant.phone, ")"));
                console.log("  - lunarBirthday: \"".concat(applicant.lunarBirthday, "\" (").concat(!!applicant.lunarBirthday, ")"));
                console.log("  - birthTime: \"".concat(applicant.birthTime, "\" (").concat(!!applicant.birthTime, ")"));
                console.log("  - address: \"".concat(applicant.address, "\" (").concat(!!applicant.address, ")"));
                if (!(!applicant.name || !applicant.gender || !applicant.phone || !applicant.lunarBirthday || !applicant.birthTime || !applicant.address)) {
                  _context9.next = 29;
                  break;
                }
                console.log("\uD83D\uDD0D \u8868\u5355\u9A8C\u8BC1\u8C03\u8BD5: \u7B2C".concat(i + 1, "\u4F4D\u62A5\u540D\u4EBA\u4FE1\u606F\u4E0D\u5B8C\u6574"));

                // 提供更详细的错误信息
                missingFields = [];
                if (!applicant.name) missingFields.push('姓名');
                if (!applicant.gender) missingFields.push('性别');
                if (!applicant.phone) missingFields.push('电话');
                if (!applicant.lunarBirthday) missingFields.push('农历生日');
                if (!applicant.birthTime) missingFields.push('出生时辰');
                if (!applicant.address) missingFields.push('地址');
                uni.showModal({
                  title: '信息不完整',
                  content: "\u7B2C".concat(i + 1, "\u4F4D\u62A5\u540D\u4EBA\u7F3A\u5C11\u4EE5\u4E0B\u4FE1\u606F\uFF1A\n").concat(missingFields.join('、')),
                  showCancel: false,
                  confirmText: '知道了'
                });
                return _context9.abrupt("return", false);
              case 29:
                i++;
                _context9.next = 8;
                break;
              case 32:
                if (_this9.currentProject) {
                  _context9.next = 35;
                  break;
                }
                uni.showToast({
                  title: '请选择法会项目',
                  icon: 'none'
                });
                return _context9.abrupt("return", false);
              case 35:
                if (!(_this9.currentProject.category === '超度法会')) {
                  _context9.next = 51;
                  break;
                }
                if (_this9.chaoduType) {
                  _context9.next = 39;
                  break;
                }
                uni.showToast({
                  title: '请选择超度类型',
                  icon: 'none'
                });
                return _context9.abrupt("return", false);
              case 39:
                if (!(_this9.deceasedList.length === 0)) {
                  _context9.next = 42;
                  break;
                }
                uni.showToast({
                  title: '请至少添加一位已故亲人',
                  icon: 'none'
                });
                return _context9.abrupt("return", false);
              case 42:
                _i = 0;
              case 43:
                if (!(_i < _this9.deceasedList.length)) {
                  _context9.next = 51;
                  break;
                }
                deceased = _this9.deceasedList[_i];
                if (!(!deceased.name || !deceased.relation)) {
                  _context9.next = 48;
                  break;
                }
                uni.showToast({
                  title: "\u7B2C".concat(_i + 1, "\u4F4D\u5DF2\u6545\u4EB2\u4EBA\u4FE1\u606F\u4E0D\u5B8C\u6574"),
                  icon: 'none'
                });
                return _context9.abrupt("return", false);
              case 48:
                _i++;
                _context9.next = 43;
                break;
              case 51:
                // 收件信息验证
                console.log('🔍 收件信息调试: 开始验证收件信息，showReceiver =', _this9.showReceiver);
                if (!_this9.showReceiver) {
                  _context9.next = 80;
                  break;
                }
                console.log('🔍 收件信息调试: 收件信息模块已启用，开始验证');
                _context9.next = 56;
                return _this9.getReceiverConfig();
              case 56:
                receiverConfig = _context9.sent;
                console.log('🔍 收件信息调试: 获取到的配置:', receiverConfig);
                if (!receiverConfig) {
                  _context9.next = 77;
                  break;
                }
                console.log('🔍 收件信息调试: 验证收件人姓名，必填:', receiverConfig.nameRequired, '值:', _this9.receiver.name);
                if (!(receiverConfig.nameRequired && !_this9.receiver.name.trim())) {
                  _context9.next = 64;
                  break;
                }
                console.log('🔍 收件信息调试: 收件人姓名为空，验证失败');
                uni.showToast({
                  title: '请填写收件人姓名',
                  icon: 'none'
                });
                return _context9.abrupt("return", false);
              case 64:
                console.log('🔍 收件信息调试: 验证收件人电话，必填:', receiverConfig.phoneRequired, '值:', _this9.receiver.phone);
                if (!(receiverConfig.phoneRequired && !_this9.receiver.phone.trim())) {
                  _context9.next = 69;
                  break;
                }
                console.log('🔍 收件信息调试: 收件人电话为空，验证失败');
                uni.showToast({
                  title: '请填写收件人电话',
                  icon: 'none'
                });
                return _context9.abrupt("return", false);
              case 69:
                console.log('🔍 收件信息调试: 验证收件地址，必填:', receiverConfig.addressRequired, '值:', _this9.receiver.address);
                if (!(receiverConfig.addressRequired && !_this9.receiver.address.trim())) {
                  _context9.next = 74;
                  break;
                }
                console.log('🔍 收件信息调试: 收件地址为空，验证失败');
                uni.showToast({
                  title: '请填写收件地址',
                  icon: 'none'
                });
                return _context9.abrupt("return", false);
              case 74:
                console.log('🔍 收件信息调试: 收件信息验证通过');
                _context9.next = 78;
                break;
              case 77:
                console.log('🔍 收件信息调试: 未获取到收件信息配置，跳过验证');
              case 78:
                _context9.next = 81;
                break;
              case 80:
                console.log('🔍 收件信息调试: 收件信息模块未启用，跳过验证');
              case 81:
                return _context9.abrupt("return", true);
              case 82:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9);
      }))();
    },
    // 下一步
    nextStep: function nextStep() {
      var _this10 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee10() {
        var activityFee, goodsFee, selectedItems, orderData;
        return _regenerator.default.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                console.log('🔍 nextStep调试: ========== 开始提交表单 ==========');
                console.log('🔍 nextStep调试: 当前项目:', _this10.currentProject);
                console.log('🔍 nextStep调试: 报名人信息:', _this10.applicants);
                console.log('🔍 nextStep调试: 报名人数量:', _this10.applicants.length);
                console.log('🔍 nextStep调试: 页面路径:', '/pages/fahui/joint/form');
                _context10.next = 7;
                return _this10.validateForm();
              case 7:
                if (_context10.sent) {
                  _context10.next = 9;
                  break;
                }
                return _context10.abrupt("return");
              case 9:
                _this10.isSubmitting = true;
                try {
                  // 计算费用
                  activityFee = 0;
                  goodsFee = 0;
                  selectedItems = []; // 根据项目分类计算费用
                  if (_this10.currentProject.category === '超度法会') {
                    // 超度法会按已故亲人人数收费
                    activityFee = _this10.currentProject.price * _this10.deceasedList.length;
                  } else {
                    // 其他法会按报名人人数收费
                    activityFee = _this10.currentProject.price * _this10.applicants.length;
                  }
                  if (_this10.showItems) {
                    _this10.items.forEach(function (item) {
                      if (item.count > 0) {
                        goodsFee += item.price * item.count;
                        selectedItems.push({
                          name: item.name,
                          price: item.price,
                          count: item.count
                        });
                      }
                    });
                  }

                  // 准备订单数据
                  orderData = {
                    type: 'joint_fahui',
                    projectId: _this10.currentProject._id,
                    projectName: _this10.currentProject.name,
                    projectPrice: _this10.currentProject.price,
                    selectedDate: _this10.selectedDate,
                    chaoduType: _this10.chaoduType,
                    applicants: _this10.applicants,
                    spouse: _this10.currentProject.category === '姻缘和合' ? _this10.spouse : null,
                    deceasedList: _this10.deceasedList,
                    selectedItems: selectedItems,
                    receiver: _this10.showReceiver ? _this10.receiver : null,
                    activityFee: activityFee,
                    goodsFee: goodsFee,
                    totalFee: activityFee + goodsFee,
                    applicantCount: _this10.currentProject.category === '超度法会' ? _this10.deceasedList.length : _this10.applicants.length,
                    createTime: new Date().getTime() // 添加创建时间戳
                  };

                  console.log('🔍 调试信息 - 表单页面构建的订单数据:', orderData);

                  // 跳转到确认页面，并传递数据
                  console.log('📋 准备传递的订单数据:', orderData);

                  // 保存订单数据到本地存储
                  _jointDataManager.default.saveOrderData(orderData);

                  // 清除草稿
                  _jointDataManager.default.clearDraftData();

                  // 跳转到确认页面
                  uni.navigateTo({
                    url: '/pages/fahui/joint/confirm',
                    success: function success() {
                      console.log('✅ 跳转到确认页面成功，数据已保存到本地存储');
                    },
                    fail: function fail(err) {
                      console.error('❌ 跳转到确认页面失败:', err);
                      uni.showToast({
                        title: '页面跳转失败',
                        icon: 'none'
                      });
                    }
                  });
                } catch (error) {
                  console.error('提交失败:', error);
                  uni.showToast({
                    title: '提交失败，请重试',
                    icon: 'none'
                  });
                } finally {
                  _this10.isSubmitting = false;
                }
              case 11:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10);
      }))();
    },
    // 调试数据方法
    debugData: function debugData() {
      console.log('🔍 调试 - 当前表单数据:');
      console.log('  - 报名人:', this.applicants);
      console.log('  - 当前项目:', this.currentProject);
      console.log('  - 代办物品:', this.items);
      console.log('  - 收件信息:', this.receiver);
      var debugInfo = _jointDataManager.default.getDebugInfo();
      console.log('  - 数据管理器调试信息:', debugInfo);

      // 生成测试数据并保存
      var testData = _jointDataManager.default.generateTestData();
      console.log('✅ 测试数据已生成:', testData);
    },
    // 调试报名人数据
    debugApplicants: function debugApplicants() {
      var _this11 = this;
      console.log('🔍 调试报名人数据:');
      console.log('  - applicants数组:', this.applicants);
      console.log('  - applicants长度:', this.applicants.length);
      this.applicants.forEach(function (applicant, index) {
        console.log("  - \u62A5\u540D\u4EBA".concat(index + 1, ":"), applicant);
        console.log("    - name: \"".concat(applicant.name, "\" (").concat(!!applicant.name, ")"));
        console.log("    - gender: \"".concat(applicant.gender, "\" (").concat(!!applicant.gender, ")"));
        console.log("    - phone: \"".concat(applicant.phone, "\" (").concat(!!applicant.phone, ")"));
        console.log("    - lunarBirthday: \"".concat(applicant.lunarBirthday, "\" (").concat(!!applicant.lunarBirthday, ")"));
        console.log("    - birthTime: \"".concat(applicant.birthTime, "\" (").concat(!!applicant.birthTime, ")"));
        console.log("    - address: \"".concat(applicant.address, "\" (").concat(!!applicant.address, ")"));
      });

      // 检查本地存储
      try {
        var draft = uni.getStorageSync('joint_fahui_draft');
        console.log('  - 本地存储的草稿数据:', draft);
        console.log('  - 本地存储的applicants:', draft === null || draft === void 0 ? void 0 : draft.applicants);
      } catch (error) {
        console.error('  - 读取本地存储失败:', error);
      }

      // 显示调试信息给用户
      var message = "\u62A5\u540D\u4EBA\u6570\u636E\u8C03\u8BD5\u4FE1\u606F\uFF1A\n\n";
      message += "\u5F53\u524D\u62A5\u540D\u4EBA\u6570\u91CF: ".concat(this.applicants.length, "\n\n");
      this.applicants.forEach(function (applicant, index) {
        message += "\u62A5\u540D\u4EBA".concat(index + 1, ":\n");
        message += "  \u59D3\u540D: ".concat(applicant.name || '未填写', "\n");
        message += "  \u6027\u522B: ".concat(applicant.gender || '未选择', "\n");
        message += "  \u7535\u8BDD: ".concat(applicant.phone || '未填写', "\n");
        message += "  \u519C\u5386\u751F\u65E5: ".concat(applicant.lunarBirthday || '未选择', "\n");
        message += "  \u51FA\u751F\u65F6\u8FB0: ".concat(applicant.birthTime || '未选择', "\n");
        message += "  \u5730\u5740: ".concat(applicant.address || '未填写', "\n\n");
      });
      uni.showModal({
        title: '报名人数据调试',
        content: message,
        showCancel: true,
        cancelText: '知道了',
        confirmText: '强制刷新数据',
        success: function success(res) {
          if (res.confirm) {
            _this11.forceRefreshData();
          }
        }
      });
    },
    // 强制刷新数据
    forceRefreshData: function forceRefreshData() {
      var _this12 = this;
      console.log('🔍 强制刷新数据: 开始刷新');

      // 重新加载草稿数据
      this.loadDraft();

      // 强制更新视图
      this.$forceUpdate();

      // 显示刷新结果
      setTimeout(function () {
        console.log('🔍 强制刷新数据: 刷新后的applicants =', _this12.applicants);
        uni.showToast({
          title: '数据已刷新',
          icon: 'success',
          duration: 2000
        });
      }, 500);
    },
    // 快速修复数据
    quickFix: function quickFix() {
      console.log('🔍 快速修复: 开始修复数据');

      // 检查并修复applicants数组
      if (!this.applicants || this.applicants.length === 0) {
        console.log('🔍 快速修复: applicants为空，重新初始化');
        this.applicants = [{
          name: '',
          gender: '',
          phone: '',
          lunarBirthday: '',
          birthTime: '',
          address: ''
        }];
      } else {
        console.log('🔍 快速修复: 检查现有报名人数据');
        // 确保每个报名人都有完整的字段
        this.applicants = this.applicants.map(function (applicant) {
          return {
            name: applicant.name || '',
            gender: applicant.gender || '',
            phone: applicant.phone || '',
            lunarBirthday: applicant.lunarBirthday || '',
            birthTime: applicant.birthTime || '',
            address: applicant.address || ''
          };
        });
      }

      // 强制更新
      this.$forceUpdate();

      // 保存到本地存储
      this.saveDraft();
      console.log('🔍 快速修复: 修复完成，当前applicants =', this.applicants);
      uni.showModal({
        title: '快速修复完成',
        content: '数据已修复，请重新填写报名人信息并保存。',
        showCancel: false,
        confirmText: '知道了'
      });
    }
  }
};
exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/uni-cloud/dist/index.js */ 27)["uniCloud"], __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 3)["default"]))

/***/ }),

/***/ 336:
/*!*********************************************************************************************************************************************!*\
  !*** C:/Users/qub/Documents/HBuilderProjects/123/景区小程序/pages/fahui/joint/form.vue?vue&type=style&index=0&id=4bb6e490&scoped=true&lang=css& ***!
  \*********************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Desktop_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_form_vue_vue_type_style_index_0_id_4bb6e490_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../Desktop/HBuilderX/plugins/uniapp-cli/node_modules/mini-css-extract-plugin/dist/loader.js??ref--6-oneOf-1-0!../../../../../../../Desktop/HBuilderX/plugins/uniapp-cli/node_modules/css-loader/dist/cjs.js??ref--6-oneOf-1-1!../../../../../../../Desktop/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../../Desktop/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--6-oneOf-1-2!../../../../../../../Desktop/HBuilderX/plugins/uniapp-cli/node_modules/postcss-loader/src??ref--6-oneOf-1-3!../../../../../../../Desktop/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../../../../Desktop/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./form.vue?vue&type=style&index=0&id=4bb6e490&scoped=true&lang=css& */ 337);
/* harmony import */ var _Desktop_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_form_vue_vue_type_style_index_0_id_4bb6e490_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_form_vue_vue_type_style_index_0_id_4bb6e490_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _Desktop_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_form_vue_vue_type_style_index_0_id_4bb6e490_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _Desktop_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_form_vue_vue_type_style_index_0_id_4bb6e490_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Desktop_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_form_vue_vue_type_style_index_0_id_4bb6e490_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 337:
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??ref--6-oneOf-1-0!./node_modules/css-loader/dist/cjs.js??ref--6-oneOf-1-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--6-oneOf-1-2!./node_modules/postcss-loader/src??ref--6-oneOf-1-3!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!C:/Users/qub/Documents/HBuilderProjects/123/景区小程序/pages/fahui/joint/form.vue?vue&type=style&index=0&id=4bb6e490&scoped=true&lang=css& ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin
    if(false) { var cssReload; }
  

/***/ })

},[[328,"common/runtime","common/vendor"]]]);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/fahui/joint/form.js.map