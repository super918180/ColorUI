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
            setGrey: function(flag) {
                var _this = this;
                if (flag) {
                    this.input.attr('readonly', '');
                } else {
                    this.input.removeAttr('readonly');
                }
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
                this.type = this.settings.type;
                this.class = this.settings.class;
                this.isSplit = this.settings.isSplit;
                this._initDom();
            },
            //初始化输入框DOM结构
            _initDom: function() {
                var droplistdContainer = $('<div class="btn-group"></div>');
                // 左侧button
                var firstButton = $('<button class="btn"></button>');
                firstButton.addClass('btn-' + this.class);
                // 右侧button
                var lastButton = $('<button class="btn dropdown-toggle" data-toggle="dropdown"></button>');
                lastButton.addClass('btn-' + this.class);
                // 分裂式给后面的button加上下拉图标,否则给前面的加上图标
                if (this.isSplit) {
                    lastButton.append('<span class="caret"></span>');
                    droplistdContainer.append(firstButton, lastButton);
                } else {
                    firstButton.append('<span class="caret"></span>');
                    droplistdContainer.append(lastButton);
                }
                this.element.append(droplistdContainer);
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
            //输入框置灰
            setGrey: function(flag) {
                var _this = this;
                if (flag) {
                    this.input.attr('readonly', '');
                } else {
                    this.input.removeAttr('readonly');
                }
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
        // [{title:1,value:1,selectd:true}]
        data: [],
        // 值改变时触发的方法
        valueChange: null,
        // 点击下拉的时候触发的方法
        dropDown: null
    };
})(jQuery);
//下拉菜单end