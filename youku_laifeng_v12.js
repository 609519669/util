(function(){

    var _isRequest = false,
        lf_live_data = [],
        _rate = 10;


    ready(function(){
        bind(window,'scroll',function(){
            loadLaifeng();
        });
        loadLaifeng();
    });

    //来自大数据
    window.comeBigDataToLaifeng = function(data) {
        var _data = data.data;
        for(var i=0,len=_data.length;i<len;i++) {
            lf_live_data.push({
                nickName:_data[i].title,
                coverW400H225:_data[i].picUrl,
                clickLogUrl:_data[i].clickLogUrl,
                roomUrl:_data[i].playLink,
                userCount:_data[i].onlineAmount,
                status:_data[i].status,
                livehouse:_data[i].livehouse
            });
        }
        readData(true);
    }

    //获取随机数
    function getRandom() {
        var _r = Math.floor(Math.random()*10);
        if(_r<_rate) return true;
        return false;
    }
    //千分位格式化
    function format(num) {
        return (num+'').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
    }

    function loadLaifeng() {
        if(_isRequest) return false;
        var _laifeng = document.getElementById('LAIFENG_REQUEST');
        var _top = _laifeng.offsetTop;
        var ele = (document.documentElement && document.documentElement.scrollTop)?document.documentElement:document.body;
        if(ele.scrollTop+800>_top) {
            _isRequest = true;
            if(getRandom()) {
                xmloadingjs('//cms.laifeng.com/cms/youku/home/channel/v4?limit=9&_t='+new Date().getTime(),function(){
                    lf_live_data = window.lf_live_data.pic_data;
                    readData();
                });
            }
            else {
                var _uid  = Nova.Cookie.get('yktk')?(decode64(decodeURIComponent(Nova.Cookie.get('yktk')).split('|')[3]).split(',')[0].split(':')[1]):'';
                var _guid = Nova.Cookie.get('__ysuid')?Nova.Cookie.get('__ysuid'):'';
                xmloadingjs('//ykatr.youku.com/atr/related/packed_list.json?site=1&uid='+_uid+'&guid='+_guid+'&apptype=1&pg=8&module=15&pl=7&oc=lf_drawer&callback=comeBigDataToLaifeng&_t='+new Date().getTime(),function(){});
            }
        }
    }

    function readData(toLog) {
        var _xm_container = document.getElementById('LAIFENG_REQUEST');
        if(!_xm_container || typeof lf_live_data=='undefined') return;
        var data = lf_live_data;
        var html = '';
        //容器
        html+='<div class="h">'+
                    '<h2>'+
                        '<a target="_blank" href="//cps.laifeng.com/redirect.html?id=00014089&url=http%3A%2F%2Fwww.laifeng.com%2F">来疯直播</a>'+
                    '</h2>'+
                    '<ul class="t_tab" id="laifeng-ul">'+addTab(data)+'</ul>'+
                '</div>';
        html+='<div class="c" id="laifeng-c">'+addCon(data,toLog)+'</div>';
        _xm_container.innerHTML = html;
        //加hover
        $('#LAIFENG_REQUEST .laifeng_ablock').hover(function(){
            if($(this).parent().find('.laifeng_live')){
                $(this).parent().find('.laifeng_live').hide();
            }
        },function(){
            if($(this).parent().find('.laifeng_live')){
                $(this).parent().find('.laifeng_live').show();
            }
        });
        var timer=null;
        $('#laifeng-ul li').on('mouseover',function(){
            var _this=this;
            clearTimeout(timer);
            timer=setTimeout(function(){
                $(_this).addClass('current').siblings().removeClass('current');
                $('#laifeng-c .tab-c').eq($(_this).index()).show().siblings().hide();
            },40);
        });
        $('#laifeng-ul li').on('mouseout',function(){
            clearTimeout(timer);
        });
        //绑定统计
        if(toLog) {
            var eles = _xm_container.getElementsByTagName('a');
            for(var i=0,len=eles.length;i<len;i++) {
                bind(eles[i],'click',function(){
                    if(this.getAttribute('logsrc')) {
                        var img = new Image();
                        img.src = this.getAttribute('logsrc');
                    }
                });
            }
        }
        _xm_container.className = 'mod mod-new';
    }
    //加载tab
    function addTab(data){
        var _html='';
        for(var i=0;i<data.length;i++){
            var _url = unescape(data[i].linked).replace(/http:|https:/g,'')
            if(i==0){
                _html+='<li class="current"><a target="_blank" href="'+_url+'" rel="'+(i+1)+'" hidefocus="true">'+data[i].name+'</a></li>'; 
            }else{
                _html+='<li><a target="_blank" href="'+_url+'" rel="'+(i+1)+'" hidefocus="true">'+(data[i].name == "DJ" ? "&nbsp;DJ&nbsp;":data[i].name)+'</a></li>';
            }
        }
        return _html;
    }
    function addCon(data,toLog){
        var _html='';
        for(var i=0;i<data.length;i++){
            if(i==0){
                _html+='<div class="tab-c"><div class="yk-row">'+loadConnect(data[i].data,toLog)+'</div></div>';
            }else{
                _html+='<div class="tab-c hide"><div class="yk-row">'+loadConnect(data[i].data,toLog)+'</div></div>';
            }
        }
        return _html;
    }
    //加载内容体
    function loadConnect(DATA,toLog) {
        if(DATA.length==0){return '';}
        var _html = '';
        /*_html+='<div class="yk-col8">'+loadCON(toLog,DATA,0)+'</div>';
        _html+='<div class="yk-col4">'+loadCON(toLog,DATA,1)+loadCON(toLog,DATA,2)+'</div>';
        _html+='<div class="yk-col4">'+loadCON(toLog,DATA,3)+loadCON(toLog,DATA,4)+'</div>';
        _html+='<div class="yk-col4 colxx">'+loadCON(toLog,DATA,5)+loadCON(toLog,DATA,6)+'</div>';
        _html+='<div class="yk-col4 colx">'+loadCON(toLog,DATA,7)+loadCON(toLog,DATA,8)+'</div>';*/
        // _html+='<div class="yk-col8">'+loadCON(toLog,DATA,0)+'</div>';
        for(var i=1;i<Math.min(DATA.length,8);i++){
            if(i==6){
                _html+='<div class="yk-col4 colx">'+loadCON(toLog,DATA,i)+'</div>';
            }else{
                _html+='<div class="yk-col4">'+loadCON(toLog,DATA,i)+'</div>';
            }
        }

        return _html;
    }
    //加载每个yk-col4 下的内容
    function loadCON(toLog,DATA,i){
        var sClass=['p-large','mb16','','mb16','','mb16','','mb16',''];
        var data=DATA[i];
        var imgUrl=(data.faceUrl600+'?x-oss-process=image/resize,m_lfit,h_240,w_240').replace(/http:|https:/g,'');
        var _log='';
        if(toLog) {
            _log = 'logsrc="'+data.clickLogUrl+'"';
        }
        var _html='',_url = unescape(data.roomUrl).replace(/http:|https:/g,'');
        
        _html+='<div class="yk-pack p-list pack-laifeng">';
        _html+='<div class="p-thumb">'+
                    '<a class="laifeng_ablock" href="'+_url+'" title="'+data.nickName+'" '+_log+' target="video">'+
                    '</a>'+
                    '<i class="bg" style="z-index:7;">'+
                    '</i>'+
                    '<img class="quic lazyImg" alt="'+data.nickName+'" src="'+imgUrl+'">';
        if(data.status==1){
            _html+='<div class="p-thumb-tagrt"><span class="red">直播中</span></div>';
        }
        _html+='</div>';
        _html+='<ul class="info-list">'+
                    '<li class="title short-title">'+
                        '<a href="'+_url+'" '+_log+' title="'+data.nickName+'" target="video">'+data.nickName+'</a>'+
                    '</li>'+
                    '<li><span>';
        if(data.status==1 && !data.livehouse){
            _html+=format(data.userCount)+'人正在观看';
        }else{
            _html+='<a target="_blank" style="color:#909090;" href="'+_url+'" '+_log+'>查看详情</a>';
        }
        _html+='</span></li></ul>';
        _html+='</div>'; 
        return _html;
    }

    function xmloadingjs(url,callback,id) {
        var road = document.createElement('script');
        road.type = 'text/javascript';
        road.src = url;
        if(typeof id !='undefined') road.id = id;
        document.getElementsByTagName('head')[0].appendChild(road);
        if(road.readyState) {
            road.onreadystatechange = function() {
                if(road.readyState == 'loaded' || road.readyState == 'complete') {
                    road.onreadystatechange = null;
                    if(callback && Object.prototype.toString.call(callback)==='[object Function]') callback(road);
                }
            }
        }
        else {
            road.onload = function() {
                callback(road);
            }
        }
    }

    function bind(ele, name, fn) {
        if (ele.attachEvent) {
            ele['e' + name + fn] = fn;
            ele[name + fn] = function () {
                ele['e' + name + fn](window.event);
            }
            ele.attachEvent('on' + name, ele[name + fn]);
        }
        else ele.addEventListener(name, fn, false);
    }

    //返回元素的位置
    function LFpos(el) {
        if(el.parentNode === null || el.style.display == 'none') return false;
        var parent = null,pos = [],box;
        if (el.getBoundingClientRect) {
            box = el.getBoundingClientRect();
            var scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
            var scrollLeft = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
            return {
                x: box.left + scrollLeft,
                y: box.top + scrollTop
            };
        }
        else 
            if (document.getBoxObjectFor) {
                box = document.getBoxObjectFor(el);
                var borderLeft = (el.style.borderLeftWidth) ? parseInt(el.style.borderLeftWidth) : 0;
                var borderTop = (el.style.borderTopWidth) ? parseInt(el.style.borderTopWidth) : 0;
                pos = [box.x - borderLeft, box.y - borderTop];
            }
            else {
                pos = [el.offsetLeft, el.offsetTop];
                parent = el.offsetParent;
                if (parent != el) {
                    while (parent) {
                        pos[0] += parent.offsetLeft;
                        pos[1] += parent.offsetTop;
                        parent = parent.offsetParent;
                    }
                }
                if(!window.opera || (!(navigator.userAgent.indexOf('Safari') >= 0) && el.style.position == 'absolute')) {
                     pos[0]-= document.body.offsetLeft;
                     pos[1]-= document.body.offsetTop;
                 } 
            }
            if(el.parentNode) {
                parent = el.parentNode;
            } 
            else {
                parent = null;
            }
            while(parent && parent.tagName.toUpperCase() != 'BODY' && parentName.toUpperCase() !='HTML'){
                pos[0]-=parent.scrollLeft;
                pos[1]-=parent.scrollTop;
                if(parent.parentNode) {
                    parent = parent.parentNode;
                }
                else parent = null;
            }
        return {x:pos[0],y:pos[1]};
    }

    //DOM加载完毕
    function ready(func, win, doc) {
        var win = win || window;
        var doc = doc || document;
        var loaded = false;
        var readyFunc = function () {
            if (loaded) return;
            loaded = true;
            func();
        };
        if (doc.addEventListener) {
            bind(doc, 'DOMContentLoaded', readyFunc);
        } else if (doc.attachEvent) {
            bind(doc, 'readystatechange', function () {
                if (doc.readyState == 'complete' || doc.readyState == 'loaded') readyFunc();
            });
            if (doc.documentElement.doScroll && typeof win.frameElement === 'undefined') {
                var ieReadyFunc = function () {
                    if (loaded) return;
                    try {
                        doc.documentElement.doScroll('left');
                    } catch (e) {
                        window.setTimeout(ieReadyFunc, 0);
                        return;
                    }
                    readyFunc();
                };
                ieReadyFunc();
            }
        }
        bind(win, 'load', readyFunc);
    }

})();
