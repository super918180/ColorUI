$(function() {
    $('#text1').CreateInput({
        // 输入框类型：text、password、datetime、datetime-local、date、month、time、week、number、email、url、search、tel 和 color。
        type: 'text',
        //输入框规则
        spec: null,
        //长度
        length: '2-5',
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
    $('#droplist1').CreateDroplist({
        data: [{ title: 'Action', value: '1', selected: true, disabled: false },
            { title: 'Another action', value: '2', selected: false, disabled: true },
            { isSeparator: true },
            { title: 'Something else here', value: '3', selected: false, disabled: false }
        ]
    });
    var droplist1 = $('#droplist1').data('CreateDroplist');
    $('#droplist2').CreateDroplist({
        class: 'primary',
        isSplit: 'true',
        direction: 'up',
        changeFunc: function() {
            console.log('changeFunc');
        },
        dropDown: function() {
            console.log('dropDown');
        },
        data: [{ title: 'Action', value: '1', selected: true, disabled: false },
            { title: 'Another action', value: '2', selected: false, disabled: true },
            { isSeparator: true },
            { title: 'Something else here', value: '3', selected: false, disabled: false }
        ]
    });
    var droplist2 = $('#droplist2').data('CreateDroplist');
    droplist2.setDisabled();
    console.log(droplist2.getValue());
    droplist2.changeFunc('3', false);

    $("#radio1").CreateRadio({
        inline: false,
        // 所属组
        group: 'sex',
        //显示的文字
        data: [{ title: 'Action', value: 'Action' },
            { title: 'Another action', value: 'Another action' },
            { title: 'Something else here', value: 'Something else here' }
        ],
        //默认选中
        selected: 2,
        //值改变的时候调用
        changeFunc: function() {
            console.log(1);
        }
    });
    var radio1 = $("#radio1").data('CreateRadio');
    console.log(radio1.getValue());
    radio1.setDisabled([0, 2]);


    $("#checkbox1").CreateCheckbox({
        inline: false,
        group: 'checkgroup',
        data: [{ title: 'Action', value: 'Action' },
            { title: 'Another action', value: 'Another action' },
            { title: 'Something else here', value: 'Something else here' }
        ],
        selected: [1, 2],
        changeFunc: function() {
            console.log(2);
        }
    });
    var checkboxObj = $("#checkbox1").data('CreateCheckbox');
    checkboxObj.setDisabled([1]);
    console.log(checkboxObj.getValue());

    $("#switch1").CreateSwitch({
        status: "on",
        changeFunc: function() {
            console.log($("#switch1").data('CreateSwitch').getValue());
        }
    });
    var switchObj = $("#switch1").data('CreateSwitch');
    switchObj.setValue('off');

    $("#button1").CreateButton({
        class: 'success',
        title: "Click Me",
        //点击的时候调用
        ckickFunc: function() {
            console.log(1);
        }
    });
    var buttonObj = $("#button1").data('CreateButton');
    buttonObj.setDisabled();

    $("#button2").CreateButton({
        class: 'info',
        title: "Click Me",
        //点击的时候调用
        ckickFunc: function() {
            console.log(1);
        }
    });
});