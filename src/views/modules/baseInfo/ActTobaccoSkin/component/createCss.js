export default (form, name) => {
  return new File(
    [`.scan-container.active{
background-image: url('${form.proBanner}');
background-size: 100% 100%;
background-position: center center;
}
.scan-container .verify-cover .verify-content {
background-size: 100% 100%;
background-repeat: no-repeat;
background-image: url('${form.toastBg}');
}
.scan-container .verify-cover .verify-content .submit-btn {
background-color: transparent;
background-image: url('${form.btnBg}');
background-size: 100% 100%;
color: ${form.btnColor};
}
.scan-container .verify-cover .verify-content .input-tips {
color: ${form.tipColor};
}
/* 验证成功弹窗 */
.results-page {
  background-image: url('${form.checkBg}');
}
.results-page .header {
  background-image: url("${form.checkTitle}");
}
.results-page .btn-act {
  background-image: url("${form.checkLuckEntry}");
  color: #ffffff;
}
.results-page .main .icon-result .img-result-fail {
  background-image: url('${form.checkFail}');
}
.results-page .main .icon-result .img-result-succ {
  background-image: url('${form.checkReal}');
}
/* 验证失败弹窗 */
.error-page {
  background-image: url("${form.errorBg}");
}`],
    name,
    {
      type: 'text/css'
    }
  )
}
