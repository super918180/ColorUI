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

    $("#tab1").CreateTab({
        type: 'tab',
        selectIndex: 1,
        data: [{
            'title': 'Home',
            'ckickFunc': function() {
                console.log(1);
            }
        }, {
            'title': 'Profile',
            'ckickFunc': function() {
                console.log(2);
            }
        }, {
            'title': 'Messages',
            'ckickFunc': function() {
                console.log(3);
            }
        }]
    });
    $("#tab2").CreateTab({
        type: 'pill-vertical',
        selectIndex: 1,
        data: [{
            'title': 'Home',
            'ckickFunc': function() {
                console.log(1);
            }
        }, {
            'title': 'Profile',
            'ckickFunc': function() {
                console.log(2);
            }
        }, {
            'title': 'Messages',
            'ckickFunc': function() {
                console.log(3);
            }
        }]
    });

    $("#crumb1").CreateCrumb({
        data: [{
            'title': 'Home',
            'ckickFunc': function() {
                console.log(1);
            }
        }, {
            'title': 'Profile',
            'ckickFunc': function() {
                console.log(2);
            }
        }, {
            'title': 'Messages',
            'ckickFunc': function() {
                console.log(3);
            }
        }]
    });

    $("#page1").CreatePages({
        //一共多少数据
        total: 2100,
        //默认每页显示的条数
        show: 10
    });

    $("#progress1").CreateProgress({
        isShowNum: true,
        isStriped: true,
        class: 'danger'
    });
    var progress = $("#progress1").data('CreateProgress');
    var a = 10;
    setInterval(function() {
        a = a === 100 ? 0 : a;
        a += 5;
        progress.setValue(a);
    }, 1000);

    // var modal1 = $.Modal({
    //     title: '请确认',
    //     html: 'One fine body…',
    //     width: '400px',
    //     confirm: {
    //         title: '下一步',
    //         clickFunc: function() {
    //             console.log('确定');
    //         }
    //     }
    // });
    // modal1.show();

    $.ShowTip({
        //confirm 和 feedback
        type: 'feedback',
        class: 'info',
        title: '听见啥？',
        detail: '我仿佛听见有人在说我帅？',
        cancel: { title: '取消', clickFunc: null },
        confirm: { title: '确定', clickFunc: null }
    });
});