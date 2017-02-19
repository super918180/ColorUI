(function($) {
    var CreateInput = (function() {
        function CreateInput(element, options) {
            // 将用户配置项与默认选项进行深拷贝
            this.settings = $.extend(true, $.fn.CreateInput.defaultValue, options || {});
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
                this.hasFeedback = this.settings.hasFeedback;
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
                //图标反馈
                var feedbackSpan = $('<span class="glyphicon form-control-feedback"></span>');
                this.feedbackSpan = feedbackSpan;
                if (this.hasFeedback) {
                    inputContainer.addClass('has-feedback');
                    inputGroup.append(feedbackSpan);
                }
                inputContainer.append(inputGroup);
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
                    if (!_this.input.attr('readonly')) {
                        if (_this.isRequired) {
                            if (_this.getValue() === '') {
                                _this.setStatus('error');
                            }
                        } else {
                            if (_this._checkSpec()) {
                                _this._checkLengh();
                            } else {
                                _this.setStatus('error');
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
                this.inputContainer.removeClass('has-success,has-error,has-warning');
                this.feedbackSpan.removeClass('glyphicon-ok,glyphicon-remove,glyphicon-warning-sign');
                if (status === "right") {
                    this.inputContainer.addClass('has-success');
                    this.feedbackSpan.addClass('glyphicon-ok');
                } else if (status === "warning") {
                    this.inputContainer.addClass('has-warning');
                    this.feedbackSpan.addClass('glyphicon-warning-sign');
                } else if (status === "error") {
                    this.inputContainer.addClass('has-error');
                    this.feedbackSpan.addClass('glyphicon-remove');
                } else if (status === "blur") {

                } else if (status === "focus") {

                }
            },
            //输入框置灰
            setDisabled: function(flag) {
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
                // 带参函数
                if (/\w*\(*\)/.test(options)) {
                    var functionName = options.split('(')[0],
                        functionParam = options.split("(")[1].replace(')', '');
                    return instance[functionName](functionParam);
                } else {
                    // 不带参函数
                    return instance[options]();

                }
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
        //反馈图标（feedback icon）只能使用在文本输入框 <input class="form-control"> 元素上。
        hasFeedback: false,
        // 左侧方块图标
        leftAddon: null,
        // 右侧方块图标
        rightAddon: null
    };
})(jQuery);
//输入框end

//单选按钮start
(function($) {
    var CreateRadio = (function() {
        function CreateRadio(element, options) {
            // 将用户配置项与默认选项进行深拷贝
            this.settings = $.extend(true, $.fn.CreateRadio.defaultValue, options || {});
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
                // 带参函数
                if (/\w*\(*\)/.test(options)) {
                    var functionName = options.split('(')[0],
                        functionParam = options.split("(")[1].replace(')', '');
                    return instance[functionName](functionParam);
                } else {
                    // 不带参函数
                    return instance[options]();

                }
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
})(jQuery);
// 单选按钮end

//复选按钮start
(function($) {
    var CreateCheckbox = (function() {
        function CreateCheckbox(element, options) {
            // 将用户配置项与默认选项进行深拷贝
            this.settings = $.extend(true, $.fn.CreateCheckbox.defaultValue, options || {});
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
            removeDisabled: function() {
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
                // 带参函数
                if (/\w*\(*\)/.test(options)) {
                    var functionName = options.split('(')[0],
                        functionParam = options.split("(")[1].replace(')', '');
                    return instance[functionName](functionParam);
                } else {
                    // 不带参函数
                    return instance[options]();

                }
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
})(jQuery);
//复选框end

// 下拉菜单start
(function($) {
    var CreateDroplist = (function() {
        function CreateDroplist(element, options) {
            // 将用户配置项与默认选项进行深拷贝
            this.settings = $.extend(true, $.fn.CreateDroplist.defaultValue, options || {});
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
                        var currentA = $('<a href="#">' + this.data[i].title + '</a>');
                        currentA.attr('data-value', this.data[i].value);
                        // 是否是禁用的菜单项
                        if (this.data[i].disabled) {
                            currentLi.addClass('disabled');
                        } else {
                            currentA.click(function() {
                                $(this).parent().siblings().removeClass('active');
                                $(this).parent().addClass('active');
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
                // 带参函数
                if (/\w*\(*\)/.test(options)) {
                    var functionName = options.split('(')[0],
                        functionParam = options.split("(")[1].replace(')', '');
                    return instance[functionName](functionParam);
                } else {
                    // 不带参函数
                    return instance[options]();
                }
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
})(jQuery);
//下拉菜单end