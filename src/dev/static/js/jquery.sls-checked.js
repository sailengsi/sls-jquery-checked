(function(field, factory, context) {
    if (typeof exports === 'object') {
        module.exports = factory(require('jquery'));
    } else if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else {
        factory(context.jQuery);
    }
})("SlsModal", function($) {
    if (!$) {
        console.error('此插件依赖于jQuery或者Zepto。');
    } else {

        /**
         * 默认参数
         */
        var defaults = {
            allCheckbox: '.check-all', //父checkbox
            oneCheckbox: '.check-one', //子checkbox

            btnGetCheck: null, //获取信息按钮
            btnChecks: null, //全选全不选按钮
            btnReverse: null, //反选按钮

            onChange: function() {}, //操作时的回调
            onGetCheck: function() {} //操作时的回调
        }

        /**
         * 获取当前容器内所有checkbox的所有值相关的信息
         * @param  {[DOMList]} checks [jquery获取的当前容器的checkbox列表]
         * @return {[Object]}        [获取到的选中和未选中的信息]
         */
        var getCheckStatus = function(checks) {
            var data = {
                checkOk: {
                    index: [],
                    value: []
                },
                checkNo: {
                    index: [],
                    value: []
                },
                isAllCheckTrue: null,
                isAllCheckFalse: null
            };
            checks.each(function(i, el) {
                var isChecked = $(el).prop('checked');

                data[isChecked ? 'checkOk' : 'checkNo'].index.push(i);
                data[isChecked ? 'checkOk' : 'checkNo'].value.push($(el).val());
            });

            data.isAllCheckTrue = data.checkOk.index.length === checks.length;
            data.isAllCheckFalse = data.checkOk.index.length === 0;
            return data;
        }

        $.fn.extend({
            checked: function(options) {

                /**
                 * 如果传的参数是对象，合并到默认参数中
                 */
                if ($.isPlainObject(options)) {
                    defaults = $.extend(true, defaults, options);
                }

                //保存所有的checkbox容器
                var $allCheck = this,
                    arrayData = [];

                /**
                 * 循环操作所有的checkbox容器
                 */
                return $allCheck.each(function(index, el) {

                    var index = index, //当前容器索引
                        self = el, //当前容器DOM对象
                        $self = $(el), //当前容器jqueryDOM对象

                        curCheck = $self.find(defaults.oneCheckbox), //当前容器内的checkbox列表
                        len = curCheck.length; //当前容器内的checkbox长度



                    /**
                     * 获取初始化全选全不选信息，在回调中返回给用户，回调
                     */
                    arrayData[index] = getCheckStatus(curCheck);
                    arrayData[index].index = index; //告知用户当前操作的是哪个checkbox容器

                    //全部选中了
                    $self.find(defaults.allCheckbox).prop('checked', arrayData[index].isAllCheckTrue);
                    $self.isAllCheck = arrayData[index].isAllCheckTrue;

                    //返回回调
                    defaults.onChange && defaults.onChange.call(self, arrayData[index]);


                    /**
                     * 给全选全不选的checkbox绑定事件
                     */
                    $self.on('change', defaults.allCheckbox, function() {
                        var curSelf = this, //当前dom对象
                            $curSelf = $(this), //当前jquerydom对象
                            isAllCheckTrue = $curSelf.prop('checked'), //改变后的状态
                            $curCheck = $self.find(defaults.oneCheckbox); //当前全选全不选控制的所有jquery-checkbox列表

                        $self.isAllCheck = isAllCheckTrue;

                        //当改变全选全不选checkbox时，只需要让子checkbox跟随状态即可
                        $curCheck.prop('checked', isAllCheckTrue);

                        //获取信息并回调返回
                        arrayData[index] = getCheckStatus($curCheck);
                        arrayData[index].index = index;

                        //全选全不选回调
                        defaults.onChange && defaults.onChange.call(self, arrayData[index]);

                    }).on('change', defaults.oneCheckbox, function(event) { //给单个checkbox绑定事件
                        var checks = $self.find(defaults.oneCheckbox), //当前全选全不选控制的所有jquery-checkbox列表
                            flag = true; //检测是否已经全部选中，默认是

                        //当有一个没选中时，即可退出循环    
                        curCheck.each(function(index, el) {
                            if (!$(el).prop('checked')) {
                                flag = false;
                            }
                        });
                        $self.isAllCheck = flag;

                        //全选全不选checkbox状态就是是否全部选中的值
                        $self.find(defaults.allCheckbox).prop('checked', flag);

                        //获取参数并回调返回
                        arrayData[index] = getCheckStatus(checks);
                        arrayData[index].index = index;
                        arrayData[index].cIndex = $self.find(defaults.oneCheckbox).index(this); //顺便返回出当前操作的checkbox的索引
                        arrayData[index].curStatus = $(this).prop('checked');

                        //改变一个状态时的回调
                        defaults.onChange && defaults.onChange.call(self, arrayData[index]);
                    });


                    /**
                     * 处理按钮控制
                     */
                    if (defaults.btnChecks) {
                        /**
                         * 全选按钮
                         */
                        $self.on('click', defaults.btnChecks, function() {
                            $self.isAllCheck = !$self.isAllCheck;

                            //如果传了全选全不选checkbox时，也要让这个checkbox跟着改变状态
                            var selector = defaults.allCheckbox ? defaults.allCheckbox + ',' + defaults.oneCheckbox : defaults.oneCheckbox;
                            $self.find(selector).prop('checked', $self.isAllCheck);

                            //获取信息回调
                            arrayData[index] = getCheckStatus($self.find(defaults.oneCheckbox));
                            arrayData[index].index = index;

                            //全选全不选回调
                            defaults.onChange && defaults.onChange.call(self, arrayData[index]);
                        })
                    }

                    if (defaults.btnReverse) {
                        /**
                         * 反选按钮
                         */
                        $self.on('click', defaults.btnReverse, function() {
                            //获取子checkbox
                            var checks = $self.find(defaults.oneCheckbox);

                            //遍历取反checkbox
                            checks.each(function(index, el) {
                                $(el).prop('checked', !$(el).prop('checked'));
                            });

                            //获取信息
                            arrayData[index] = getCheckStatus(checks);
                            arrayData[index].index = index;
                            $self.isAllCheck = arrayData[index].isAllCheckTrue;

                            //判断是否符合全选或全不选状态
                            if (defaults.allCheckbox && (arrayData[index].isAllCheckTrue || arrayData[index].isAllCheckFalse)) {
                                $self.find(defaults.allCheckbox).prop('checked', (arrayData[index].isAllCheckTrue ? true : false))
                            }

                            //反选回调
                            defaults.onChange && defaults.onChange.call(self, arrayData[index]);
                        })
                    }


                    if (defaults.btnGetCheck) {
                        /**
                         * 获取check信息
                         */
                        $self.on('click', defaults.btnGetCheck, function() {
                            defaults.onGetCheck && defaults.onGetCheck.call(self, arrayData[index]);
                        });
                    }
                });
            }
        });
    }
}, this);