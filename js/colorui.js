! function($) {
    var CreateInput = (function() {
        function CreateInput(element, options) {
            // 将用户配置项与默认选项进行深拷贝
            this.settings = $.extend(false, $.fn.CreateInput.defaultValue, options || {});
            this.element = element;
            this.init();
        }
        CreateInput.prototype = {
            // 初始化插件
            init: function() {
                this.type = this.settings.type;
                this.spec = this.settings.spec;
                this.length = this.settings.length;
                this.placeholder = this.settings.placeholder;
                this.isRequired = this.settings.isRequired;
                this.leftAddon = this.settings.leftAddon;
                this.rightAddon = this.settings.rightAddon;
                this._initDom();
            },
            //初始化输入框DOM结构
            _initDom: function() {
                //容器
                var inputContainer = $('<div class="form-group"></div>');
                var inputGroup = $('<div class="input-group"></div>');
                // 输入框
                var input = $('<input>');
                input.attr({
                    class: 'form-control',
                    type: this.type,
                    placeholder: this.placeholder,
                });
                inputGroup.append(input);
                // 输入框左侧图标
                if (this.leftAddon) {
                    var leftAddon = $('<span class="input-group-addon"></span>');
                    leftAddon.html(this.leftAddon);
                    inputGroup.prepend(leftAddon);
                }
                // 输入框右侧图标片
                if (this.rightAddon) {
                    var rightAddon = $('<span class="input-group-addon"></span>');
                    rightAddon.html(this.rightAddon);
                    inputGroup.append(rightAddon);
                }
                if (this.leftAddon || this.rightAddon) {
                    inputContainer.append(inputGroup);
                } else {
                    inputContainer.append(input);
                }
                this.element.append(inputContainer);
                this.inputContainer = inputContainer;
                this.input = input;
                this._initEvent();
            },
            // 绑定事件
            _initEvent: function() {
                // 获取焦点focus,失去焦点blur,值改变change
                // 如果输入框只读的话就不操作
                var _this = this;
                _this.input.bind('blur keyup', function() {
                    //只有text且在非置灰情况下，才进行输入框值校验
                    if (this.type == 'text' && !_this.input.attr('readonly')) {
                        if (_this.isRequired) {
                            if (_this.getValue() === '') {
                                _this.setStatus('error');
                            }
                        } else {
                            if (_this.getValue() === '') {
                                _this.setStatus('blur');
                            } else {
                                if (_this._checkSpec()) {
                                    _this._checkLengh();
                                } else {
                                    _this.setStatus('error');
                                }
                            }

                        }
                    }
                });
            },
            //校验输入框输入内容
            _checkSpec: function() {
                if (this.spec) {
                    return this.spec.test(this.getValue());
                } else {
                    return true;
                }
            },
            //检验输入框输入长度
            _checkLengh: function() {
                var _this = this,
                    inputLength = this.length,
                    //8-32这种格式的范围
                    currentLength = this.getValue().length,
                    // 长度是否在范围内
                    lengthFlag = true;
                if (/^\d+-\d+$/.test(inputLength)) {
                    // 区间范围
                    var valueRange = inputLength.split('-');
                    //当前值长度小于设定范围
                    if (parseInt(valueRange[0], 10) > currentLength) {
                        lengthFlag = false;
                    }
                    //当前值长度大于设定范围，屏蔽输入
                    if (currentLength > parseInt(valueRange[1], 10)) {
                        this.setValue(this.getValue().substring(0, parseInt(valueRange[1], 10)));
                    }
                } else if (/^\d+$/.test(inputLength)) {
                    // 固定长度
                    // 当前长度不等于设定长度
                    if (currentLength !== parseInt(inputLength, 10)) {
                        lengthFlag = false;
                    }
                }
                // 长度不在区间飘红
                if (!lengthFlag) {
                    this.setStatus('error');
                } else {
                    this.setStatus('right');
                }

            },
            //设置输入框状态，正确，错误，失去焦点，获得焦点
            setStatus: function(status) {
                this.inputContainer.removeClass('has-success has-error has-warning');
                if (status === "right") {
                    this.inputContainer.addClass('has-success');
                } else if (status === "warning") {
                    this.inputContainer.addClass('has-warning');
                } else if (status === "error") {
                    this.inputContainer.addClass('has-error');
                } else if (status === "blur") {

                } else if (status === "focus") {

                }
            },
            //输入框置灰
            setDisabled: function() {
                this.input.attr('readonly', '');
            },
            removeDisabled: function() {
                this.input.removeAttr('readonly');
            },
            //获取输入框值
            getValue: function() {
                return this.input.val();
            },
            //设置输入框值
            setValue: function(str) {
                this.input.val(str);
            }
        };
        // 必须要将该对象返回出去
        return CreateInput;
    })();
    $.fn.CreateInput = function(options) {
        return this.each(function() {
            var _this = $(this),
                // 从当前对象下读取实例
                instance = _this.data('CreateInput');
            // 如果没有实例新建一个
            if (!instance) {
                // 新建实例,_this表示当前选中元素，options表示配置
                instance = new CreateInput(_this, options);
                // 将当前实例保存到data数据中
                _this.data('CreateInput', instance);
            }
            if ($.type(options) === 'string') {
                // 不带参函数
                return instance[options]();
            }
        });
    };
    // 默认参数
    $.fn.CreateInput.defaultValue = {
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
        // 左侧方块图标
        leftAddon: null,
        // 右侧方块图标
        rightAddon: null
    };
}(jQuery);
//输入框end

//单选按钮start

! function($) {
    var CreateRadio = (function() {
        function CreateRadio(element, options) {
            // 将用户配置项与默认选项进行深拷贝
            this.settings = $.extend(false, $.fn.CreateRadio.defaultValue, options || {});
            this.element = element;
            this.init();
        }
        CreateRadio.prototype = {
            // 初始化插件
            init: function() {
                this.inline = this.settings.inline;
                this.group = this.settings.group;
                this.selected = this.settings.selected;
                this.data = this.settings.data;
                this._initDom();
            },
            _initDom: function() {
                var _this = this;
                this.radioContainer = $('<div class="radio-group"></div>');
                var allRadio = [];
                for (var i = 0; i < this.data.length; i++) {
                    var currentRadioContainer = $('<div class = "radio"></div>');
                    var currentLabel = $('<label></label>');
                    var currentRadioTemp = '<input type="radio" name="' + this.element.attr('id') + '-radio">' + this.data[i].title;
                    currentLabel.append(currentRadioTemp);
                    var currentRadio = currentLabel.find('input');
                    currentRadio.click(function(e) {
                        e.stopPropagation();
                        if ($.type(_this.settings.changeFunc) && !$(this).attr('disabled')) {
                            _this.settings.changeFunc();
                        }
                    });
                    // 是否是内联，内敛直接多个label并列，非内联label需要使用div包裹
                    if (this.inline) {
                        currentLabel.addClass('radio-inline');
                        allRadio.push(currentLabel);
                    } else {
                        currentRadioContainer.append(currentLabel);
                        allRadio.push(currentRadioContainer);
                    }
                }
                this.radioContainer.append(allRadio);
                this.element.append(this.radioContainer);
                this.radioAll = _this.element.find('input');
                this.setChecked(this.selected);
            },
            //默认选中项
            setChecked: function(index) {
                this.radioAll.removeAttr('checked');
                this.radioAll.get(index).checked = true;
            },
            // 置灰
            setDisabled: function(indexArr) {
                for (var i = 0; i < indexArr.length; i++) {
                    if (this.inline) {
                        this.radioAll.eq(indexArr[i]).attr('disabled', 'disabled').parent().addClass('disabled');
                    } else {
                        this.radioAll.eq(indexArr[i]).attr('disabled', 'disabled').parent().parent().addClass('disabled');
                    }
                }
            },
            removeDisabled: function(indexArr) {
                for (var i = 0; i < indexArr.length; i++) {
                    if (this.inline) {
                        this.radioAll.eq(indexArr[i]).removeAttr('disabled', 'disabled').parent().removeClass('disabled');
                    } else {
                        this.radioAll.eq(indexArr[i]).removeAttr('disabled', 'disabled').parent().parent().removeClass('disabled');
                    }
                }
            },
            //获取输入框值
            getValue: function() {
                var selectIndex = 0;
                this.radioAll.each(function(index) {
                    if ($(this).is(':checked')) {
                        selectIndex = index;
                    }
                });
                return selectIndex;
            },
        };
        // 必须要将该对象返回出去
        return CreateRadio;
    })();
    $.fn.CreateRadio = function(options) {
        return this.each(function() {
            var _this = $(this),
                // 从当前对象下读取实例
                instance = _this.data('CreateRadio');
            // 如果没有实例新建一个
            if (!instance) {
                // 新建实例,_this表示当前选中元素，options表示配置
                instance = new CreateRadio(_this, options);
                // 将当前实例保存到data数据中
                _this.data('CreateRadio', instance);
            }
            if ($.type(options) === 'string') {
                return instance[options]();
            }
        });
    };
    // 默认参数
    $.fn.CreateRadio.defaultValue = {
        // 是否内联
        inline: false,
        // 所属组
        group: '',
        //数据
        data: [],
        //默认选中
        selected: 0,
        //值改变的时候调用
        changeFunc: null
    };
}(jQuery);
// 单选按钮end

//复选按钮start
! function($) {
    var CreateCheckbox = (function() {
        function CreateCheckbox(element, options) {
            // 将用户配置项与默认选项进行深拷贝
            this.settings = $.extend(false, $.fn.CreateCheckbox.defaultValue, options || {});
            this.element = element;
            this.init();
        }
        CreateCheckbox.prototype = {
            // 初始化插件
            init: function() {
                this.inline = this.settings.inline;
                this.group = this.settings.group;
                this.data = this.settings.data;
                this.selected = this.settings.selected;
                this._initDom();
            },
            _initDom: function() {
                var _this = this;
                this.checkboxContainer = $('<div class="checkbox-group"></div>');
                var allCheckbox = [];
                for (var i = 0; i < this.data.length; i++) {
                    var currentCheckboxContainer = $('<div class = "checkbox"></div>');
                    var currentLabel = $('<label></label>');
                    var currentCheckboxTemp = '<input type="checkbox" name="' + this.element.attr('id') + '-radio">' + this.data[i].title;
                    currentLabel.append(currentCheckboxTemp);
                    var currentCheckbox = currentLabel.find('input');
                    currentCheckbox.click(function(e) {
                        e.stopPropagation();
                        _this.changeFunc();
                    });
                    // 是否是内联，内敛直接多个label并列，非内联label需要使用div包裹
                    if (this.inline) {
                        currentLabel.addClass('checkbox-inline');
                        allCheckbox.push(currentLabel);
                    } else {
                        currentCheckboxContainer.append(currentLabel);
                        allCheckbox.push(currentCheckboxContainer);
                    }
                }
                this.checkboxContainer.append(allCheckbox);
                this.element.append(this.checkboxContainer);
                this.checkboxAll = _this.element.find('input');
                this.setChecked(this.selected);
            },
            //默认选中项
            setChecked: function(indexArr) {
                this.checkboxAll.removeAttr('checked');
                for (var i = 0; i < indexArr.length; i++) {
                    this.checkboxAll.eq(indexArr[i]).prop('checked', 'checked');
                }
            },
            // 置灰
            setDisabled: function(indexArr) {
                for (var i = 0; i < indexArr.length; i++) {
                    if (this.inline) {
                        this.checkboxAll.eq(indexArr[i]).attr('disabled', 'disabled').parent().addClass('disabled');
                    } else {
                        this.checkboxAll.eq(indexArr[i]).attr('disabled', 'disabled').parent().parent().addClass('disabled');
                    }
                }
            },
            removeDisabled: function(indexArr) {
                for (var i = 0; i < indexArr.length; i++) {
                    if (this.inline) {
                        this.checkboxAll.eq(indexArr[i]).removeAttr('disabled', 'disabled').parent().removeClass('disabled');
                    } else {
                        this.checkboxAll.eq(indexArr[i]).removeAttr('disabled', 'disabled').parent().parent().removeClass('disabled');
                    }
                }
            },
            seclectAll: function() {
                var id = this.element.attr('id');
                $('#' + id + ' input[type="checkbox"]').prop('checked', true);
            },
            seclectNone: function() {
                var id = this.element.attr('id');
                $('#' + id + ' input[type="checkbox"]').removeAttr('checked');
            },
            selectInverse: function() {
                var id = this.element.attr('id');
                $('#' + id + ' input[type="checkbox"]').each(function() {
                    if ($(this).prop('checked')) {
                        $(this).removeAttr('checked');
                    } else {
                        $(this).prop('checked', true);
                    }
                });
            },
            //获取选中值
            getValue: function() {
                var selectIndexArr = [];
                this.checkboxAll.each(function(index) {
                    if ($(this).is(':checked')) {
                        selectIndexArr.push(index);
                    }
                });
                return selectIndexArr;
            },
            // 点击checkbox回调函数
            changeFunc: function() {
                //每次值改变的时候自定义函数
                if ($.type(this.settings.changeFunc) && !$(this).attr('disabled')) {
                    this.settings.changeFunc();
                }
            }
        };
        // 必须要将该对象返回出去
        return CreateCheckbox;
    })();
    $.fn.CreateCheckbox = function(options) {
        return this.each(function() {
            var _this = $(this),
                // 从当前对象下读取实例
                instance = _this.data('CreateCheckbox');
            // 如果没有实例新建一个
            if (!instance) {
                // 新建实例,_this表示当前选中元素，options表示配置
                instance = new CreateCheckbox(_this, options);
                // 将当前实例保存到data数据中
                _this.data('CreateCheckbox', instance);
            }
            if ($.type(options) === 'string') {
                return instance[options]();
            }
        });
    };
    // 默认参数
    $.fn.CreateCheckbox.defaultValue = {
        // 所属组
        group: '',
        //显示的文字
        textArr: [],
        //checkbox每一项对应的值
        valueArr: [],
        //值改变的时候调用
        changeFunc: null
    };
}(jQuery);
//复选框end

// 下拉菜单start
! function($) {
    var CreateDroplist = (function() {
        function CreateDroplist(element, options) {
            // 将用户配置项与默认选项进行深拷贝
            this.settings = $.extend(false, $.fn.CreateDroplist.defaultValue, options || {});
            this.element = element;
            this.init();
        }
        CreateDroplist.prototype = {
            // 初始化插件
            init: function() {
                this.class = this.settings.class;
                this.isSplit = this.settings.isSplit;
                this.direction = this.settings.direction;
                this.data = this.settings.data;
                this._initDom();
            },
            //初始化输入框DOM结构
            _initDom: function() {
                var _this = this;
                this.droplistContainer = $('<div class="btn-group"></div>');
                this.droplistContainer.width('100%');
                if (this.direction === 'up') {
                    this.droplistContainer.addClass('dropup');
                }
                // 左侧button
                this.firstButton = $('<button class="btn"></button>');
                this.firstButton.addClass('btn-' + this.class);
                // 右侧button
                this.lastButton = $('<button class="btn dropdown-toggle" data-toggle="dropdown"></button>');
                this.lastButton.addClass('btn-' + this.class);
                // 分裂式给后面的button加上下拉图标,否则给前面的加上图标
                this.lastButton.append('<span class="caret"></span>');
                if (this.isSplit) {
                    // 宽度要减去右边箭头按钮的宽度
                    this.firstButton.css('width', 'calc(100% - 26px)');
                    this.droplistContainer.append(this.firstButton, this.lastButton);

                } else {
                    this.lastButton.width('100%');
                    this.droplistContainer.append(this.lastButton);
                }
                this.lastButton.click(function() {
                    $(this).parent().toggleClass('open');
                    if ($.type(_this.settings.dropDown) === 'function' && !$(this).parent().hasClass('open')) {
                        _this.settings.dropDown();
                    }
                });
                this.listContainer = $('<ul class="dropdown-menu"></ul>');
                this.listContainer.width('100%');
                this.initData();
                this.droplistContainer.append(this.listContainer);
                this.element.append(this.droplistContainer);
            },
            //从数组中获取符合条件的数据
            _getQualifiedData: function(value) {
                var tempData = this.data.filter(function(item) {
                    return item.value === value;
                });
                if (tempData) {
                    return tempData[0];
                } else {
                    return _this.data[0];
                }
            },
            //根据data设置下拉组件的菜单选项
            initData: function() {
                var _this = this;
                this.listContainer.empty();
                var list = [];
                for (var i = 0; i < this.data.length; i++) {
                    // 生成li
                    var currentLi = $('<li></li>');
                    //是否插入分割线
                    if (this.data[i].isSeparator) {
                        currentLi.addClass('divider').attr('role', 'separator');
                    } else {
                        // li下面插入a标签
                        var currentA = $('<a href="javascript:;">' + this.data[i].title + '</a>');
                        currentA.attr('data-value', this.data[i].value);
                        // 是否是禁用的菜单项
                        if (this.data[i].disabled) {
                            currentLi.addClass('disabled');
                        } else {
                            currentA.click(function() {
                                $(this).parent().siblings().removeClass('active');
                                $(this).parent().addClass('active');
                                _this.droplistContainer.removeClass('open');
                                _this.changeFunc($(this).attr('data-value'), true);
                            });
                        }
                        currentLi.append(currentA);
                    }
                    list.push(currentLi);
                    if (this.data[i].selected) {
                        currentLi.addClass('active');
                        this.changeFunc(this.data[i].value, false);
                    }
                }
                this.listContainer.append(list);
                this.droplistContainer.append(this.listContainer);
            },
            changeFunc: function(value, isExecuteUserFun) {
                var currentData = this._getQualifiedData(value);
                this.droplistContainer.find('.valueSpan').remove();
                if (this.isSplit) {
                    this.firstButton.prepend('<span class="valueSpan" data-value="' + currentData.value + '">' + currentData.title + ' </span>');
                } else {
                    this.lastButton.prepend('<span class="valueSpan" data-value="' + currentData.value + '">' + currentData.title + ' </span>');
                }
                //用户是否已经自定义值改变时的方法，并且需要执行
                if ($.type(this.settings.changeFunc) === 'function' && isExecuteUserFun) {
                    this.settings.changeFunc();
                }
            },
            //输入框置灰
            setDisabled: function() {
                this.firstButton.attr('disabled', 'disabled');
                this.lastButton.attr('disabled', 'disabled');
            },
            removeDisabled: function() {
                this.firstButton.removeAttr('disabled');
                this.lastButton.removeAttr('disabled');
            },
            //获取输入框值
            getValue: function() {
                return this.droplistContainer.find('.valueSpan').attr('data-value');
            }
        };
        // 必须要将该对象返回出去
        return CreateDroplist;
    })();
    $.fn.CreateDroplist = function(options) {
        return this.each(function() {
            var _this = $(this),
                // 从当前对象下读取实例
                instance = _this.data('CreateDroplist');
            // 如果没有实例新建一个
            if (!instance) {
                // 新建实例,_this表示当前选中元素，options表示配置
                instance = new CreateDroplist(_this, options);
                // 将当前实例保存到data数据中
                _this.data('CreateDroplist', instance);
            }
            if ($.type(options) === 'string') {
                return instance[options]();
            }
        });
    };
    // 默认参数
    $.fn.CreateDroplist.defaultValue = {
        // 单按钮下拉菜单,分裂式按钮下拉菜单 
        //default,primary,success,info,warning,danger
        class: 'default',
        // 是否是分裂式
        isSplit: false,
        //up,down
        direction: 'down',
        // [{title:1,value:1,selected:true}]
        data: [],
        // 值改变时触发的方法
        changeFunc: null,
        // 点击下拉的时候触发的方法
        dropDown: null
    };
}(jQuery);
//下拉菜单end

// 开关start
! function($) {
    var CreateSwitch = (function() {
        function CreateSwitch(element, options) {
            // 将用户配置项与默认选项进行深拷贝
            this.settings = $.extend(false, $.fn.CreateSwitch.defaultValue, options || {});
            this.element = element;
            this.init();
        }
        CreateSwitch.prototype = {
            // 初始化插件
            init: function() {
                var _this = this;
                _this.status = _this.settings.status;
                _this.changeFunc = _this.settings.changeFunc;
                _this._initDom();
            },
            _initDom: function() {
                var _this = this,
                    switchBackground = $('<div class="ui_switch_background"></div>'),
                    switchFront = $('<div class="ui_switch_front"></div>');
                switchBackground.append(switchFront);
                if (_this.status === 'on') {
                    switchBackground.addClass('ui_switch_background_on');
                    switchFront.addClass('ui_switch_front_on');
                } else {
                    switchBackground.addClass('ui_switch_background_off');
                    switchFront.addClass('ui_switch_front_off')
                }
                _this.element.append(switchBackground);
                _this.switchBackground = _this.element.find('.ui_switch_background')
                _this.switchFront = _this.element.find('.ui_switch_front')
                _this._initEvent();
            },
            _initEvent: function() {
                var _this = this;
                _this.switchBackground.click(function() {
                    if (!_this.switchBackground.hasClass('ui_switch_background_grey')) {
                        if (_this.getValue() === "on") {
                            _this.switchBackground.removeClass('ui_switch_background_on').addClass('ui_switch_background_off');
                            _this.switchFront.removeClass('ui_switch_front_on').addClass('ui_switch_front_off');
                        } else {
                            _this.switchBackground.removeClass('ui_switch_background_off').addClass('ui_switch_background_on');
                            _this.switchFront.removeClass('ui_switch_front_off').addClass('ui_switch_front_on');
                        }
                        //每次值改变的时候自定义函数
                        if ($.type(_this.changeFunc) === 'function') {
                            _this.changeFunc();
                        }
                    }
                });
            },
            //置灰
            setDisabled: function(flag) {
                _this.switchBackground.addClass('ui_switch_background_grey');
            },
            removeDisabled: function() {
                _this.switchBackground.removeClass('ui_switch_background_grey');
            },
            //获取值
            getValue: function() {
                var _this = this;
                if (_this.switchFront.hasClass('ui_switch_front_on')) {
                    return "on";
                } else {
                    return "off";
                }
            },
            //设置值
            setValue: function(status) {
                var _this = this;
                if (status === "on") {
                    _this.switchBackground.removeClass('ui_switch_background_off').addClass('ui_switch_background_on');
                    _this.switchFront.removeClass('ui_switch_front_off').addClass('ui_switch_front_on');
                } else {
                    _this.switchBackground.removeClass('ui_switch_background_on').addClass('ui_switch_background_off');
                    _this.switchFront.removeClass('ui_switch_front_on').addClass('ui_switch_front_off');
                }
            }

        };
        // 必须要将该对象返回出去
        return CreateSwitch;
    })();
    $.fn.CreateSwitch = function(options) {
        return this.each(function() {
            var _this = $(this),
                // 从当前对象下读取实例
                instance = _this.data('CreateSwitch');
            // 如果没有实例新建一个
            if (!instance) {
                // 新建实例,_this表示当前选中元素，options表示配置
                instance = new CreateSwitch(_this, options);
                // 将当前实例保存到data数据中
                _this.data('CreateSwitch', instance);
            }
            if ($.type(options) === 'string') {
                return instance[options]();
            }
        });
    };
    // 默认参数
    $.fn.CreateSwitch.defaultValue = {
        // 状态
        status: 'on',
        changeFunc: null
    };
}(jQuery);
// 开关end

// 按钮start
! function($) {
    var CreateButton = (function() {
        function CreateButton(element, options) {
            // 将用户配置项与默认选项进行深拷贝
            this.settings = $.extend(false, $.fn.CreateButton.defaultValue, options || {});
            this.element = element;
            this.init();
        }
        CreateButton.prototype = {
            // 初始化插件
            init: function() {
                this.class = this.settings.class;
                this.title = this.settings.title;
                this.ckickFunc = this.settings.ckickFunc;
                this._initDom();
            },
            //初始化输入框DOM结构
            _initDom: function() {
                var _this = this;
                this.button = $('<button class="btn"></button>');
                this.button.addClass('btn-' + this.class);
                this.button.html(this.title);
                this.element.append(this.button);
                this._initEvent();
            },
            _initEvent: function() {
                var _this = this;
                this.button.click(function() {
                    if ($.type(_this.ckickFunc) === 'function' && !$(this).attr('disabled')) {
                        _this.ckickFunc();
                    }
                });

            },
            //输入框置灰
            setDisabled: function() {
                this.button.attr('disabled', 'disabled');
            },
            removeDisabled: function() {
                this.button.removeAttr('disabled');
            }
        };
        // 必须要将该对象返回出去
        return CreateButton;
    })();
    $.fn.CreateButton = function(options) {
        return this.each(function() {
            var _this = $(this),
                // 从当前对象下读取实例
                instance = _this.data('CreateButton');
            // 如果没有实例新建一个
            if (!instance) {
                // 新建实例,_this表示当前选中元素，options表示配置
                instance = new CreateButton(_this, options);
                // 将当前实例保存到data数据中
                _this.data('CreateButton', instance);
            }
            if ($.type(options) === 'string') {
                return instance[options]();
            }
        });
    };
    // 默认参数
    $.fn.CreateButton.defaultValue = {
        // 单按钮下拉菜单,分裂式按钮下拉菜单 
        //default,primary,success,info,warning,danger
        class: 'default',
        //按钮文字
        title: 'Button',
        //点击事件
        ckickFunc: null,
    };
}(jQuery);
//按钮end

//页签start
! function($) {
    var CreateTab = (function() {
        function CreateTab(element, options) {
            // 将用户配置项与默认选项进行深拷贝
            this.settings = $.extend(false, $.fn.CreateTab.defaultValue, options || {});
            this.element = element;
            this.init();
        }
        CreateTab.prototype = {
            // 初始化插件
            init: function() {
                this.type = this.settings.type;
                this.selectIndex = this.settings.selectIndex;
                this.data = this.settings.data;
                this._initDom();
            },
            //初始化输入框DOM结构
            _initDom: function() {
                var _this = this;
                this.tabContainer = $('<ul class="nav"></ul>');
                if (this.type === 'tab') {
                    this.tabContainer.addClass('nav-tabs');
                } else {
                    this.tabContainer.addClass('nav-pills');
                    if (this.type === 'pill-vertical') {
                        this.tabContainer.addClass('nav-stacked');
                    }
                }
                var list = [];
                for (var i = 0; i < this.data.length; i++) {
                    var liTemp = $('<li role="presentation"><a href="javascript:;">' + this.data[i].title + '</a></li>');
                    if (this.selectIndex === i) {
                        liTemp.addClass('active');
                    }
                    list.push(liTemp);
                }
                this.tabContainer.append(list);
                this.list = this.tabContainer.find('li');
                this.element.append(this.tabContainer);
                this._initEvent();
            },
            _initEvent: function() {
                var _this = this;
                this.list.each(function(index) {
                    $(this).click(function() {
                        // 点击页签触发函数
                        if (!$(this).hasClass('active')) {
                            _this.list.removeClass('active');
                            if ($.type(_this.data[index].ckickFunc) === 'function') {
                                _this.data[index].ckickFunc();
                            }
                            $(this).addClass('active');
                        }
                    });
                });
            },
            //输入框置灰
            setDisabled: function() {
                this.button.attr('disabled', 'disabled');
            },
            removeDisabled: function() {
                this.button.removeAttr('disabled');
            }
        };
        // 必须要将该对象返回出去
        return CreateTab;
    })();
    $.fn.CreateTab = function(options) {
        return this.each(function() {
            var _this = $(this),
                // 从当前对象下读取实例
                instance = _this.data('CreateTab');
            // 如果没有实例新建一个
            if (!instance) {
                // 新建实例,_this表示当前选中元素，options表示配置
                instance = new CreateTab(_this, options);
                // 将当前实例保存到data数据中
                _this.data('CreateTab', instance);
            }
            if ($.type(options) === 'string') {
                return instance[options]();
            }
        });
    };
    // 默认参数
    $.fn.CreateTab.defaultValue = {
        // 单按钮下拉菜单,分裂式按钮下拉菜单 
        //tab,pill,pill-vertical
        type: 'tab',
        //默认选择哪个页签被选中
        selectIndex: 0,
        // 数据
        data: []
    };
}(jQuery);
//页签end

//面包屑start
! function($) {
    var CreateCrumb = (function() {
        function CreateCrumb(element, options) {
            // 将用户配置项与默认选项进行深拷贝
            this.settings = $.extend(false, $.fn.CreateCrumb.defaultValue, options || {});
            this.element = element;
            this.init();
        }
        CreateCrumb.prototype = {
            // 初始化插件
            init: function() {
                this.type = this.settings.type;
                this.selectIndex = this.settings.selectIndex;
                this.data = this.settings.data;
                this._initDom();
            },
            //初始化输入框DOM结构
            _initDom: function() {
                var _this = this;
                this.CrumbContainer = $('<ol class="breadcrumb"></ol>');
                var list = [];
                for (var i = 0; i < this.data.length; i++) {
                    var liTemp = $('<li><a href="javascript:;">' + this.data[i].title + '</a></li>');
                    if (i === this.data.length - 1) {
                        liTemp.addClass('active');
                        liTemp.empty().append(this.data[i].title);
                    }
                    list.push(liTemp);
                }
                this.CrumbContainer.append(list);
                this.list = this.CrumbContainer.find('li');
                this.element.append(this.CrumbContainer);
                this._initEvent();
            },
            _initEvent: function() {
                var _this = this;
                this.list.each(function(index) {
                    $(this).click(function() {
                        // 点击页签触发函数
                        if (!$(this).hasClass('active')) {
                            _this.list.removeClass('active');
                            if ($.type(_this.data[index].ckickFunc) === 'function') {
                                _this.data[index].ckickFunc();
                            }
                            $(this).addClass('active');
                        }
                    });
                });
            },
            //输入框置灰
            setDisabled: function() {
                this.button.attr('disabled', 'disabled');
            },
            removeDisabled: function() {
                this.button.removeAttr('disabled');
            }
        };
        // 必须要将该对象返回出去
        return CreateCrumb;
    })();
    $.fn.CreateCrumb = function(options) {
        return this.each(function() {
            var _this = $(this),
                // 从当前对象下读取实例
                instance = _this.data('CreateCrumb');
            // 如果没有实例新建一个
            if (!instance) {
                // 新建实例,_this表示当前选中元素，options表示配置
                instance = new CreateCrumb(_this, options);
                // 将当前实例保存到data数据中
                _this.data('CreateCrumb', instance);
            }
            if ($.type(options) === 'string') {
                return instance[options]();
            }
        });
    };
    // 默认参数
    $.fn.CreateCrumb.defaultValue = {
        // 单按钮下拉菜单,分裂式按钮下拉菜单 
        //tab,pill,pill-vertical
        type: 'tab',
        //默认选择哪个页签被选中
        selectIndex: 0,
        // 数据
        data: []
    };
}(jQuery);
//面包end

//分页start
! function($) {
    var CreatePages = (function() {
        function CreatePages(element, options) {
            // 将用户配置项与默认选项进行深拷贝
            this.settings = $.extend(false, $.fn.CreatePages.defaultValue, options || {});
            this.element = element;
            this.init();
        }
        CreatePages.prototype = {
            // 初始化插件
            init: function() {
                this.total = this.settings.total;
                this.show = this.settings.show;
                this._initDom();
            },
            //初始化输入框DOM结构
            _initDom: function() {
                if (this.total) {
                    this.pageContainer = $('<nav></nav>');
                    this.ulContainer = $('<ul class="pagination" style="float: left"></ul>');
                    this.divContainer = $('<div class="pagination"></div>');
                    // 一共分多少页
                    this.totalPages = Math.ceil(this.total / this.show);
                    var totalLi = this.totalPages < 9 ? this.totalPages + 2 : 11;
                    var list = [];
                    for (var i = 0; i < totalLi; i++) {
                        list.push($('<li><a href="javascript:;"></a></li>'));
                        //初始化的时候第二个省略号赢藏
                    }
                    this.jumpInput = $('<input type="text" class="form-control" style="width:50px;float: left;margin: 0 10px;color:#337ab7">');
                    this.jumpBtn = $('<button class="btn btn-default" type="button" style="color:#337ab7">Go!</button>');
                    this.jumpBtn.attr('disabled', true);
                    this.ulContainer.append(list);
                    this.list = this.ulContainer.find('li');
                    // 1后面的省略号
                    this.firstDot = this.list.eq(2);
                    // 最后一页前面的省略号
                    this.lastDot = this.list.eq(this.list.length - 3);
                    this.divContainer.append(this.jumpInput, this.jumpBtn);
                    this.pageContainer.append(this.ulContainer, this.divContainer);
                    this.element.append(this.pageContainer);
                    this.selectPage(1);
                    this._initEvent();
                }
            },
            _initEvent: function() {
                var _this = this;
                this.list.click(function() {
                    // 当前点击的页
                    var page = $(this).children('a').text();
                    //禁止图标和点点点不指定事件
                    if ($(this).hasClass('disabled') || page === '...') {
                        return;
                    }
                    // 点击之前展示的页
                    var activePage = _this.ulContainer.find('.active').children('a').text();
                    $(this).siblings().removeClass('active');
                    if (page === '«') {
                        _this.jumpPrev(activePage);
                    } else if (page === '»') {
                        _this.jumpNext(activePage);
                    } else if (page === '...') {

                    } else {
                        _this.selectPage(page);
                    }
                });
                //跳转页输入框事件
                this.jumpInput.on('keyup', function() {
                    var jumpPage = $(this).val();
                    if (jumpPage !== '' && /^[0-9]*$/.test(jumpPage)) {
                        var jumpPageNum = parseInt(jumpPage, 10);
                        //跳转的页码不在范围内
                        if (jumpPageNum < 1 || jumpPageNum > _this.totalPages) {
                            _this.jumpBtn.attr('disabled', true);
                        } else {
                            _this.jumpBtn.removeAttr('disabled');
                        }
                    } else {
                        _this.jumpBtn.attr('disabled', true);
                    }
                });
                // 跳转按钮绑定事件
                this.jumpBtn.click(function() {
                    if (!$(this).attr('disabled')) {
                        var jumpPage = _this.jumpInput.val();
                        _this.selectPage(jumpPage);
                    }
                });
            },
            // 跳转到前一页
            jumpPrev: function(page) {
                var prePage = parseInt(page, 10) - 1;
                this.selectPage(prePage);
            },
            // 跳转到后一页
            jumpNext: function(page) {
                var nextPage = parseInt(page, 10) + 1;
                this.selectPage(nextPage);
            },
            getValue: function() {
                return this.ulContainer.find('.avtive').children('a').text();
            },
            selectPage: function(page) {
                var page = parseInt(page, 10);
                var pagesArr = [];
                if (this.totalPages < 9) {
                    for (var i = 0; i < this.totalPages + 2; i++) {
                        if (i === 0) {
                            pagesArr.push('«');
                        } else if (i === this.totalPages + 1) {
                            pagesArr.push('»');
                        } else {
                            pagesArr.push(i);
                        }
                    }
                } else {
                    this.firstDot.show();
                    this.lastDot.show();
                    if (page <= 4) {
                        pagesArr = ['«', '1', '...', '2', '3', '4', '5', '6', '...', this.totalPages, '»'];
                        this.firstDot.hide();
                    } else if (page > 4 && page < this.totalPages - 4) {
                        pagesArr = ['«', '1', '...', page - 2, page - 1, page, page + 1, page + 2, '...', this.totalPages, '»'];
                    } else {
                        pagesArr = ['«', '1', '...', this.totalPages - 5, this.totalPages - 4, this.totalPages - 3, this.totalPages - 2, this.totalPages - 1, '...', this.totalPages, '»'];
                        this.lastDot.hide();
                    }
                }
                for (var j = 0; j < pagesArr.length; j++) {
                    this.list.eq(j).children('a').text(pagesArr[j]);
                }
                this.list.each(function() {
                    if ($(this).children('a').text() == page) {
                        $(this).siblings().removeClass('active');
                        $(this).addClass('active');
                        $(this).children('a').focus();
                    }
                });
                // 如果第一页被选中，那么置灰上页功能
                if (this.list.eq(1).hasClass('active')) {
                    this.list.eq(0).addClass('disabled');
                } else {
                    this.list.eq(0).removeClass('disabled');
                }
                // 如果最后一页被选中，那么置灰下页功能
                if (this.list.eq(pagesArr.length - 2).hasClass('active')) {
                    this.list.eq(pagesArr.length - 1).addClass('disabled');
                } else {
                    this.list.eq(pagesArr.length - 1).removeClass('disabled');
                }
            }
        };
        // 必须要将该对象返回出去
        return CreatePages;
    })();
    $.fn.CreatePages = function(options) {
        return this.each(function() {
            var _this = $(this),
                // 从当前对象下读取实例
                instance = _this.data('CreatePages');
            // 如果没有实例新建一个
            if (!instance) {
                // 新建实例,_this表示当前选中元素，options表示配置
                instance = new CreatePages(_this, options);
                // 将当前实例保存到data数据中
                _this.data('CreatePages', instance);
            }
            if ($.type(options) === 'string') {
                return instance[options]();
            }
        });
    };
    // 默认参数
    $.fn.CreatePages.defaultValue = {
        //一共多少数据
        total: null,
        //默认每页显示的条数
        show: 10
    };
}(jQuery);
//分页end

//进度条start
! function($) {
    var CreateProgress = (function() {
        function CreateProgress(element, options) {
            // 将用户配置项与默认选项进行深拷贝
            this.settings = $.extend(false, $.fn.CreateProgress.defaultValue, options || {});
            this.element = element;
            this.init();
        }
        CreateProgress.prototype = {
            // 初始化插件
            init: function() {
                this.isShowNum = this.settings.isShowNum;
                this.isStriped = this.settings.isStriped;
                this.class = this.settings.class;
                this._initDom();
            },
            //初始化输入框DOM结构
            _initDom: function() {
                var _this = this;
                this.progressContainer = $('<div class="progress"></div>');
                this.progressBar = $('<div class="progress-bar" role="progressbar" aria-valuenow="" aria-valuemin="0" aria-valuemax="100" style="width: 0%"></div>');
                if (this.isStriped) {
                    this.progressBar.addClass('progress-bar-striped active');
                }
                if (this.class) {
                    this.progressBar.addClass('progress-bar-' + this.class);
                }
                this.progressContainer.append(this.progressBar);
                this.element.append(this.progressContainer);
            },
            setValue: function(value) {
                this.progressBar.attr('aria-valuenow', value);
                this.progressBar.css('width', value + '%');
            }
        };
        // 必须要将该对象返回出去
        return CreateProgress;
    })();
    $.fn.CreateProgress = function(options) {
        return this.each(function() {
            var _this = $(this),
                // 从当前对象下读取实例
                instance = _this.data('CreateProgress');
            // 如果没有实例新建一个
            if (!instance) {
                // 新建实例,_this表示当前选中元素，options表示配置
                instance = new CreateProgress(_this, options);
                // 将当前实例保存到data数据中
                _this.data('CreateProgress', instance);
            }
            if ($.type(options) === 'string') {
                return instance[options]();
            }
        });
    };
    // 默认参数
    $.fn.CreateProgress.defaultValue = {
        // 是否显示数字
        isShowNum: false,
        // 是否带条纹
        isStriped: false,
        //类型success、info、warning、danger
        class: null
    };
}(jQuery);
//进度条end

//模态框start
! function($) {
    var Modal = function(config) {
        var_this = this;
        // 默认配置
        this.config = {
            title: '',
            html: '',
            width: null,
            height: null,
            hiddenCancel: false,
            cancel: { title: '取消', clickFunc: null },
            confirm: { title: '确定', clickFunc: null }
        };
        if (config && $.isPlainObject(config)) {
            $.extend(this.config, config);
        }
        this._initDom();
    };
    Modal.prototype = {
        _initDom: function() {
            //模态框内容
            this.modalContainer = $('<div class="modal fade"></div>');
            this.modalContainer.css('background', 'rgba(0,0,0,0.5)');
            this.dialogContainer = $('<div class="modal-dialog"></div>');
            //绝对定位，用于拖拽
            this.dialogContainer.css({
                'position': 'absolute',
                'margin': '0'
            });
            // 自定义模态框宽高
            if (this.config.width) {
                this.dialogContainer.width(this.config.width);
            }
            if (this.config.height) {
                this.dialogContainer.height(this.config.height);
                //默认高度自适应
                this.dialogContainer.css('overflow', 'hidden');
            }
            this.contentContainer = $('<div class="modal-content"></div>');
            //模态框头部
            this.dialogHeader = $('<div class="modal-header"></div>');
            this.closeButton = $('<button class="close"><span>&times;</span></button>');
            this.dialogTitle = $('<h4 class="modal-title">' + this.config.title + '</h4>');
            this.dialogHeader.append(this.closeButton, this.dialogTitle);
            //模态框内容
            this.dialogBody = $('<div class="modal-body"></div>');
            this.dialogBody.append(this.config.html);
            //模态框底部
            this.dialogFooter = $('<div class="modal-footer"></div>');
            this.cancelBtn = $('<button type="button" class="btn btn-default">' + this.config.cancel.title + '</button>');
            this.confirmBtn = $('<button type="button" class="btn btn-primary">' + this.config.confirm.title + '</button>');
            if (this.config.hiddenCancel) {
                // 只有一个按钮的时候显示默认样式
                this.dialogFooter.append(this.confirmBtn);
                this.confirmBtn.removeClass('btn-primary').addClass('btn-default');
            } else {
                this.dialogFooter.append(this.cancelBtn, this.confirmBtn);
            }
            this.modalContainer.append(this.dialogContainer.append(this.contentContainer.append(this.dialogHeader, this.dialogBody, this.dialogFooter)));
            $(document.body).append(this.modalContainer);
            this._initEvent();
        },
        _initEvent: function() {
            var _this = this;
            this.closeButton.click(function() {
                if ($.type(_this.config.cancel.clickFunc) === 'function') {
                    _this.config.cancel.clickFunc();
                }
                _this.remove();
            });
            this.cancelBtn.click(function() {
                if ($.type(_this.config.cancel.clickFunc) === 'function') {
                    _this.config.cancel.clickFunc();
                }
                _this.remove();
            });
            this.confirmBtn.click(function() {
                if ($.type(_this.config.confirm.clickFunc) === 'function') {
                    _this.config.confirm.clickFunc();
                }
                if (_this.config.hiddenCancel) {
                    _this.remove();
                }
            });
            //鼠标拖拽事件
            this.dialogHeader.Drag(this.dialogContainer);
        },
        show: function() {
            var _this = this;
            $(document.body).addClass('modal-open');
            this.modalContainer.show();
            this.center();
            setTimeout(function() {
                _this.modalContainer.addClass('in');
            }, 150);
        },
        remove: function() {
            var _this = this;
            $(document.body).removeClass('modal-open');
            this.modalContainer.removeClass('in');
            setTimeout(function() {
                _this.modalContainer.remove();
            }, 150);

        },
        center: function() {
            // 可视区域的大小
            widowWidth = $(window).width();
            widowHeight = $(window).height();
            // 弹窗大小
            modalWidth = this.dialogContainer.width();
            modalHeight = this.dialogContainer.height();
            // 计算绝对居中位置
            var modalLeft = (widowWidth - modalWidth) / 2;
            var modalTop = (widowHeight - modalHeight) / 2;
            //位置小于0，则为0
            modalLeft = modalLeft > 0 ? modalLeft : 0;
            modalTop = modalTop > 0 ? modalTop : 0;
            // 计算的位置应用到弹窗中
            this.dialogContainer.css({ left: modalLeft, top: modalTop });
        }
    };
    $.Modal = function(config) {
        return new Modal(config);
    };
}(jQuery);
//模态框end

//提示框start，基于模态框
! function($) {
    var Tip = function(config) {
        var_this = this;
        // 默认配置
        this.config = {
            //confirm 和 feedback
            type: 'confirm',
            //success,warning,error,其他
            class: '',
            title: '',
            detail: '',
            cancel: { title: '取消', clickFunc: null },
            confirm: { title: '确定', clickFunc: null }
        };
        if (config && $.isPlainObject(config)) {
            $.extend(this.config, config);
        }
        // 绘制内容显示-操作确认弹窗
        var htmlStr = '';
        if (this.config.type === 'feedback') {
            var positionStr = 'background:url(../images/tip-icon.png);';
            positionStr += 'background-size:200px 50px;';
            positionStr += 'background-position-x: ';
            // 设置提示图标
            if (this.config.class === 'success') {
                positionStr += '0px;';
            } else if (this.config.class === 'warning') {
                positionStr += '-100px;';
            } else if (this.config.class === 'error') {
                positionStr += '-150px;';
            } else {
                positionStr += '-50px;';
            }
            htmlStr += '<div style="' + positionStr + ' width:50px;height:50px;margin:0 auto;"></div>';
        }
        htmlStr += '<h3>' + this.config.title + '</h3>';
        htmlStr += '<p>' + this.config.detail + '</p>';

        //继承模态框
        this.tipObj = $.Modal({
            html: htmlStr,
            width: '400px',
            hiddenCancel: this.config.type === 'confirm' ? false : true,
            cancel: this.config.cancel,
            confirm: this.config.confirm
        });
        this._initDom();
    };
    Tip.prototype = {
        _initDom: function() {
            // 去掉模态框分割线
            this.tipObj.dialogHeader.css('border-bottom', '0px');
            this.tipObj.dialogFooter.css('border-top', '0px');
            this.tipObj.dialogBody.css({
                'text-align': 'center'
            });
            this.tipObj.show();
        }
    };
    $.ShowTip = function(config) {
        return new Tip(config);
    };
}(jQuery);
//提示框end

//拖拽start
! function($) {
    $.fn.Drag = function(divWrap) {
        return this.each(function() {
            //鼠标可拖拽区域
            var $divMove = $(this);
            //整个移动区域
            var $divWrap = divWrap ? divWrap : $divMove;
            //定义鼠标X轴Y轴
            var mX = 0,
                mY = 0;
            //定义div左、上位置
            var dX = 0,
                dY = 0;
            //mousedown标记
            var isDown = false;
            $divMove.mousedown(function(event) {
                var event = event || window.event;
                mX = event.clientX;
                mY = event.clientY;
                dX = $divWrap.offset().left;
                dY = $divWrap.offset().top;
                //鼠标拖拽启动
                isDown = true;
            });
            $(document).mousemove(function(event) {
                var event = event || window.event;
                //鼠标滑动时的X轴
                var x = event.clientX;
                //鼠标滑动时的Y轴
                var y = event.clientY;
                if (isDown) {
                    // 设置边界值，不让其拖到边界外边,上面取值使用了offset,将滚动条也算在内了
                    var left = x - mX + dX - $(window).scrollLeft();
                    var top = y - mY + dY - $(window).scrollTop();
                    //最小边界值判断
                    left = left < 0 ? 0 : left;
                    top = top < 0 ? 0 : top;
                    // 最大边界值判断
                    var maxLeft = $(window).width() - $divWrap.width();
                    var maxTop = $(window).height() - $divWrap.height();
                    left = left > maxLeft ? maxLeft : left;
                    top = top > maxTop ? maxTop : top;
                    //div动态位置赋值
                    $divWrap.css({ "left": left, "top": top });
                }
            });
            $(document).mouseup(function() {
                //鼠标拖拽结束
                isDown = false;
            });
            $divMove.mouseup(function() {
                //鼠标拖拽结束
                isDown = false;
            });
        });
    };
}(jQuery);
// 拖拽end