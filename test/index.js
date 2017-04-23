$(function() {
    $('#text1').CreateInput({
        // 输入框类型：text、password、datetime、datetime-local、date、month、time、week、number、email、url、search、tel 和 color。
        type: 'text',
        //输入框规则
        spec: null,
        //长度
        length: '2-5',
        //描述输入字段
        placeholder: "该值不能为空，长度为2-5",
        //是否必填
        isRequired: false,
        // 左侧方块图标
        leftAddon: null,
        // 右侧方块图标
        rightAddon: null
    });
    var text1 = $('#text1').data('CreateInput');
    $("#text1_success").click(function() {
        text1.setStatus("right");
    });
    $("#text1_warning").click(function() {
        text1.setStatus("warning");
    });
    $("#text1_error").click(function() {
        text1.setStatus("error");
    });
    $("#text1_blur").click(function() {
        text1.setStatus("blur");
    });
    $("#text1_disable").click(function() {
        text1.setDisabled();
    });
    $("#text1_enable").click(function() {
        text1.removeDisabled();
    });
    $("#text1_getValue").click(function() {
        alert(text1.getValue());
    });
    $("#text1_setValue").click(function() {
        var value = prompt('请输入输入框塞入的值：', '梦想总是要有的，万一实现了呢');
        console.log(value)
        text1.setValue(value);
    });

    $('#text2').CreateInput({
        type: 'text',
        spec: null,
        length: 10,
        placeholder: null,
        isRequired: false,
        leftAddon: "￥",
        rightAddon: ".00"
    });
    // 分页组件
    $("#page1").CreatePages({
        //一共多少数据
        total: 2100,
        //默认每页显示的条数
        show: 10
    });
    $("#page1_create").click(function(e) {
        e.preventDefault();
        $("#page1").removeData("CreatePages");
        $("#page1").empty().CreatePages({
            total: parseInt($("#page1_totle").val()) || 2100,
            show: parseInt($("#page1_every").val()) || 10
        });
    });

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
    radio1.setDisabled([2]);
    //多选框
    $("#checkbox1").CreateCheckbox({
        inline: false,
        group: 'checkgroup',
        data: [{ title: 'Html', value: 'Html' },
            { title: 'Css', value: 'Css' },
            { title: 'JavaScript', value: 'JavaScript' },
            { title: 'Angular.js', value: 'Angular.js' },
            { title: 'React.js', value: 'React.js' },
            { title: 'Node.js', value: 'Node.js' }
        ],
        selected: [1, 2],
        changeFunc: function() {
            console.log(2);
        }
    });
    var checkboxObj = $("#checkbox1").data('CreateCheckbox');
    $('#checkbox1_selectAll').click(function() {
        checkboxObj.seclectAll();
    });
    $('#checkbox1_seclectNone').click(function() {
        checkboxObj.seclectNone();
    });
    $('#checkbox1_selectInverse').click(function() {
        checkboxObj.selectInverse();
    });
    $('#checkbox1_getValue').click(function() {
        alert(checkboxObj.getValue());
    });
    $('#checkbox1_setDisabled').click(function() {
        checkboxObj.setDisabled([2, 5]);
    });
    $('#checkbox1_removeDisabled').click(function() {
        checkboxObj.removeDisabled([2, 5]);
    });


    $("#switch1").CreateSwitch({
        status: "on",
        changeFunc: function() {
            console.log($("#switch1").data('CreateSwitch').getValue());
        }
    });
    var switchObj = $("#switch1").data('CreateSwitch');
    switchObj.setValue('off');

    $("#button0").CreateButton({
        class: 'success',
        title: "Click Me",
        //点击的时候调用
        ckickFunc: function() {
            console.log(1);
        }
    });
    var buttonObj = $("#button0").data('CreateButton');
    buttonObj.setDisabled();
    //按钮
    var buttonArr = ["default", "primary", "success", "info", "warning", "danger"];
    for (var i = 0; i < buttonArr.length; i++) {
        $("#button" + (i + 1)).CreateButton({
            class: buttonArr[i],
            title: "按钮" + (i + 1),
            //点击的时候调用
            ckickFunc: function() {
                console.log(i + 1);
            }
        });
    }

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

    var tipArr = ['', 'success', 'warning', 'error'];
    var tBtnArr = ['primary', 'success', 'warning', 'danger'];
    $(".tipArr").each(function(index) {
        var id = $(this).attr('id');
        $('#' + id).CreateButton({
            class: tBtnArr[index],
            title: "反馈提示框" + (index + 1),
            //点击的时候调用
            ckickFunc: function() {
                $.ShowTip({
                    //confirm 和 feedback
                    type: 'feedback',
                    class: tipArr[index],
                    title: '听见啥？',
                    detail: '我仿佛听见有人在说我帅？',
                    cancel: { title: '取消', clickFunc: null },
                    confirm: { title: '确定', clickFunc: null }
                });
            }
        });
    });
    $('#tip5').CreateButton({
        class: 'info',
        title: "选择提示框",
        //点击的时候调用
        ckickFunc: function() {
            $.ShowTip({
                //confirm 和 feedback
                type: 'confirm',
                class: '',
                title: '听见啥？',
                detail: '我仿佛听见有人在说我帅？',
                cancel: { title: '确实听见了', clickFunc: null },
                confirm: {
                    title: '没有听见',
                    clickFunc: function() {
                        $.ShowTip({
                            //confirm 和 feedback
                            type: 'confirm',
                            class: 'error',
                            title: '没有听见？',
                            detail: '难道您真的没有听见吗？',
                            cancel: { title: '真的没有听见', clickFunc: null },
                            confirm: {
                                title: '终于听见了',
                                clickFunc: null
                            }
                        });
                    }
                }
            });
        }
    });

    $("#modelBtn").CreateButton({
        class: 'success',
        title: "模态框",
        //点击的时候调用
        ckickFunc: function() {
            var modal1 = $.Modal({
                title: '请确认',
                html: 'One fine body…',
                width: '400px',
                confirm: {
                    title: '下一步',
                    clickFunc: function() {
                        console.log('确定');
                    }
                }
            });
            modal1.show();
        }
    });
});