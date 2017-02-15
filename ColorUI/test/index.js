$(function() {
    $('#text1').CreateInput({
        // 输入框类型：text、password、datetime、datetime-local、date、month、time、week、number、email、url、search、tel 和 color。
        type: "text",
        //输入框规则
        spec: null,
        //长度
        length: null,
        //描述输入字段
        placeholder: null,
        //是否必填
        isRequired: false,
        //反馈图标（feedback icon）只能使用在文本输入框 <input class="form-control"> 元素上。
        hasFeedback: true,
        // 左侧方块图标
        leftAddon: '@',
        // 右侧方块图标
        rightAddon: null
    });
    var text1 = $('#text1').data('CreateInput');
    text1.setStatus('error');
});