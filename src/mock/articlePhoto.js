/**
 * Created by Micheal Xiao on 2017/11/15.
 */
import {onlyParam2Obj} from 'utils';

const tpls = [
    // 标题-step
    {
        "title":"",
        tag:["title"],
        "content":`<section class="" style="margin-top: 10px; margin-bottom: 10px; box-sizing: border-box;"><section class="" style="width: 0px; border-bottom: 1em solid rgb(100, 180, 191); box-sizing: border-box; border-left: 0.8em solid transparent !important; border-right: 0.8em solid transparent !important;"></section><section class="" style="height: 0px; border-top: 0.1em solid rgb(100, 180, 191); box-sizing: border-box;"></section><section class="" style="padding: 10px 15px; box-sizing: border-box; background-color: rgb(245, 238, 232);"><section class="" style="box-sizing: border-box;"><section class="" style="box-sizing: border-box;">
                                        <div cell-type="fulltext"><section style="text-align: center; box-sizing: border-box;"><section style="box-sizing: border-box;"><strong style="box-sizing: border-box;">step3</strong>：在主贴中，任意处粘贴授权码</section></section></div>
                                    </section></section></section><section class="" style="height: 0px; border-top: 0.1em solid rgb(207, 190, 120); box-sizing: border-box;"></section><section class="" style="width: 0px; float: right; border-top: 1em solid rgb(207, 190, 120); box-sizing: border-box; border-left: 0.8em solid transparent !important; border-right: 0.8em solid transparent !important;"></section><section class="" style="clear: both; box-sizing: border-box;"></section></section>`,
    },
    // 标题-时间icon
   {
        "title":"",
        tag:["title","text"],
        "content":`<section style="margin-top: 10px; margin-bottom: 10px;">
                        <div style="text-align: left;display: inline-block;">
                            <img style="width: 30px; vertical-align: top; margin-left: 16px; background-color: rgb(249, 110, 87);" src="IMG017">
                            <div cell-type="fulltext" style="display: inline-block; padding: 3px; margin-left: 8px;"><section>请输入活动时间</section></div>
                        </div>
                    </section>`,
    },
    // 标题-Now，It's Racing Time!
    {
        "title":"",
        tag:["title"],
        "content":`<div style="white-space: normal;text-align: center;margin-bottom: 5px;line-height: 2em;font-size: 16px;font-weight: bold;">
                        <div cell-type="fulltext"><em style="background-color: rgb(183, 24, 24);color: rgb(255, 255, 255);letter-spacing: 2px;">Now，It's Racing Time!</em></div>
                    </div>`,
    },
    // 标题-年度潮流复兴主爵到底多精彩？
    {
        "title":"",
        tag:["title"],
        "content":`<div style="white-space: normal;text-align: center;margin-bottom: 5px;line-height: 2em;font-size: 16px;font-weight: bold;">
                        <div cell-type="fulltext"><em style="background-color: rgb(183, 24, 24);color: rgb(255, 255, 255);letter-spacing: 1px;">年度潮流复兴主爵到底多精彩？</em></div>
                    </div>`,
    },
    // 标题红色
    {
        "title":"",
        tag:["title"],
        "content":`<div style="width: 100%;text-align: center;margin: 10px 0">
                        <section style="display: inline-block; padding: 0 5px; text-align: center;">
                            <div style="width: 10px; height: 20px; margin-right: -4px; display: inline-block; vertical-align: middle; transform: rotate(0deg); border-radius: 0px 10px 10px 0px; background-color: rgb(255, 255, 255);"></div>
                            <div style="display: inline-block; background-color: rgb(249, 110, 87); padding-left: 12px; padding-right: 12px; color: rgb(255, 255, 255);"
                                 class="tn-child-position-absolute">
                                <div cell-type="fulltext"><strong>输入标题</strong></div>
                            </div>
                            <div style="width: 10px; height: 20px; margin-left: -4px; display: inline-block; vertical-align: middle; transform: rotate(0deg); border-radius: 10px 0px 0px 10px; background-color: rgb(255, 255, 255);"></div>
                        </section>
                    </div>`,
    },
    // 点击-标题
    {
        "title":"",
        tag:["title"],
        "content":`<div>
                        <section class="" style="width: 5em; transform: rotate(-25deg); -webkit-transform: rotate(-25deg); -moz-transform: rotate(-25deg); -o-transform: rotate(-25deg); box-sizing: border-box;"> <section style="border-top: 1px solid rgb(249, 110, 87); width: 5em; margin: 2.45em 0px -0.5em 3.3em;   box-sizing: border-box;"></section></section>
                        <section class="" style="width: 100%; box-sizing: border-box;"><section tt="tt" key="font" class="" style="display: block; float: left; padding: 5px; border: 1px solid rgb(249, 110, 87);line-height: 1; margin-right: 5px; background-color: rgb(249, 110, 87); box-sizing: border-box;"><section class="Powered-by-XIUMI V5" style="box-sizing: border-box;"> <section class="" style="position: static; box-sizing: border-box;"><section class="" style="font-size: 45px; color: rgb(255, 255, 255); box-sizing: border-box;"><section style="box-sizing: border-box;">点击</section></section></section></section></section><section tt="tt" key="font" class="" style="display: block; padding-top: 5px; min-height: 4.5em !important; box-sizing: border-box;"><section class="Powered-by-XIUMI V5" style="box-sizing: border-box;" powered-by="xiumi.us"><section class="" style="position: static; box-sizing: border-box;"><section class="" style="box-sizing: border-box;"><section style="box-sizing: border-box;"><div cell-type="fulltext"><p style="margin-top: 0px">左上角“联蔚科技”，可以进入图文管理页面。</p></div></section></section></section></section></section><section style="clear: both; box-sizing: border-box;"></section></section>
                    </div>`,
    },
    // 标题黄色
    {
        "title":"",
        tag:["title"],
        "content":`<div style="width: 100%;text-align: center;margin: 10px 0">
                        <section
                                style="word-break: break-all; white-space: normal; color: rgb(0, 0, 0); font-family: 'Helvetica Neue', Helvetica, 'Microsoft YaHei', Arial, sans-serif; font-size: 14px; line-height: 22.4px;">
                            <section
                                    style="word-break: break-all; transform: skew(-20deg); display: inline-block; margin-left: 10px;">
                                <section
                                        style="word-break: break-all; padding-right: 40px; padding-left: 20px; line-height: 40px; height: 40px; float: left; font-weight: bold; font-size: 1em; color: rgb(255, 255, 255); opacity: 0.7; background-color: rgb(255, 140, 0);">
                                    <section style="word-break: break-all; transform: skew(20deg);">
                                        <div cell-type="fulltext"><strong>输入标题</strong></div>
                                    </section>
                                </section>
                                <section
                                        style="word-break: break-all; margin-left: -8px; border-top-width: 35px; border-top-style: solid; border-top-color: transparent; border-bottom-width: 0px; border-bottom-style: solid; border-bottom-color: transparent; border-right-width: 15px; border-right-style: solid; border-right-color: rgb(233, 128, 0); transform: skew(23deg); float: right;"></section>
                            </section>
                        </section>
                    </div>`,
    },
    // 文字模板
    {
        "title":"",
        tag:["text"],
        "content":`<div style-con style="font-size:18px;line-height: 35px;">
                        <div cell-type="fulltext"><span>文字模板</span></div>
                    </div>`,
    },
    // 文字带边框
    {
        "title":"",
        tag:["text","set"],
        "content":`<section style="margin: 5px auto;" class=""><section style="height:3em;"><section style="width: 6em;float: left;border-top: 0.4em solid rgb(183, 24, 24);border-right-color: rgb(183, 24, 24);border-bottom-color: rgb(183, 24, 24);border-left-color: rgb(183, 24, 24);"></section><section style="width: 6em;float: right;border-top: 0.4em solid rgb(183, 24, 24);border-right-color: rgb(183, 24, 24);border-bottom-color: rgb(183, 24, 24);border-left-color: rgb(183, 24, 24);"></section></section><section style="margin: -2.8em 0em -0.2em;padding: 20px;border-width: 1px 0.4em;border-style: solid;border-color: rgb(183, 24, 24);border-radius: 0.3em;box-sizing: border-box;vertical-align: top;" class="">
                                        <div cell-type="fulltext"><p style="text-align: center;"><span style="color: rgb(183, 24, 24);"><strong><span style="font-size: 14px;letter-spacing: 2px;">福利：</span></strong></span><span style="color: rgb(45, 44, 44);"><strong><span style="font-size: 14px;letter-spacing: 2px;">解锁Party新玩法，欢乐赚积分！</span></strong></span><br></p></div></section><section style="width: 6em;float: left;border-bottom: 0.4em solid rgb(183, 24, 24);border-top-color: rgb(183, 24, 24);border-right-color: rgb(183, 24, 24);border-left-color: rgb(183, 24, 24);"></section><section style="width: 6em;float: right;border-bottom: 0.4em solid rgb(183, 24, 24);border-top-color: rgb(183, 24, 24);border-right-color: rgb(183, 24, 24);border-left-color: rgb(183, 24, 24);"></section></section>`,
    },
    // 文字模板_标题
    // {
    //     "title":"",
    //     tag:["text","title"],
    //     "content":`<div style-con style="padding:10px 0;">
    //     <div style="margin:10px 0;font-size:12px; border-top: 1px solid rgb(255, 76, 176);border-bottom: 1px solid rgb(148, 11, 169);">
	 //                    <div style="width: 75px; height: 3px; float: right; background-color: rgb(255, 76, 176);" tn-bind-aux-prop="{ backgroundColor: compAux.bdc1 }" class="ng-scope"></div>
	 //                    <div style="padding: 10px;"><div cell-type="fulltext"><span style="text-align:center;display: inline-block; width: 100%;">输入文字输入文字</span></br><span style="text-align:center;display: inline-block; width: 100%;">输入文字输入文字</span></div></div>
	 //                    <div style="width: 75px; height: 3px; margin-top: -3px; background-color: rgb(148, 11, 169);" tn-bind-aux-prop="{ backgroundColor: compAux.bdc2 }" class="ng-scope"></div>
	 //            	</div></div>`,
    // },
    // 文字模板_标题
    {
        "title":"",
        tag:["text","title"],
                                    
        "content":`<div style="display: inline-block;width: 100%;margin:10px 0;">
                    	<div style="float:left;display: inline-block;border: 1px solid rgb(253, 198, 32);background-color: rgb(253, 198, 32);text-align: center;width: 1.8em;height: 1.8em;line-height: 1.8em;border-radius: 100%;margin-left: auto;margin-right: auto;font-size: 112.5%;color: rgb(0, 0, 0);">
                    		<div cell-type="fulltext"><p style="margin: 0; padding: 0;">01</p></div>
                    	</div>
                        <div style="float: left;margin-left: 5px;">
                        	<div style="display: inline-block;vertical-align: bottom;border-bottom: 1px dashed rgb(175, 175, 175);margin-bottom: 0.25em;padding-left: 5px;padding-right: 5px;">
                        		<div cell-type="fulltext"><section>输入标题</section></div>
                        	</div>
                        </div>
                        <div style="display: inline-block; vertical-align: bottom; width: 0.5em; height: 0.5em; border-radius: 50%; background-color: rgb(253, 198, 32);margin-bottom: -4px;"> </div>
                    </div>`,
    },
    // 文字模板_简洁标题只有一条红色下划线
    {
        "title":"",
        tag:["text","title"],
        "content":`<div style-con style="padding:10px 0;">
        				<div style="border-bottom: 1px solid rgb(249, 110, 87);font-size: 150%;border-top-style: solid;border-right-style: solid;border-left-style: solid;border-top-width: 0px;border-right-width: 0px;border-left-width: 0px;">
		                	<div cell-type="fulltext"><span>请输入标题</span></div>
		                </div>
		            </div>`,
    },
    // 文字模板_标题序列蓝色
    {
        "title":"",
        tag:["text","title"],
        "content":`<div style="display: inline-block; margin: 10px 0;">
                    	<div style="width: 0px; border-left: 0.35em solid rgb(1, 183, 204); border-bottom: 0.35em solid rgb(1, 183, 204); display: inline-block; vertical-align: bottom; margin-right: -1em; border-right: 0.35em solid transparent !important; border-top: 0.35em solid transparent !important;"> </div>
                    	<div style="display: inline-block;vertical-align: bottom;width: 1.8em;height: 1.8em;border-radius: 0px 0px 0px 1.1em;background-color: rgb(1, 183, 204);font-size: 150%;line-height: 1.8em;color: rgb(255, 255, 255);">
                    		<div cell-type="fulltext"><span style="text-align: center; display: inline-block; width: 100%;">01</span></div>
                    	</div>
                    </div>`,
    },
    // 文字模板_标题序列黄色
    {
        "title":"",
        tag:["text","title"],
        "content":`<div style="display: inline-block; margin: 10px 0;">
                    	<div style="display: inline-block; vertical-align: bottom; width: 1.8em; height: 1.8em; border-radius: 0px 0px 1.1em; background-color: rgb(254, 209, 109); font-size: 150%; line-height: 1.8em; color: rgb(255, 255, 255);">
                    		<div cell-type="fulltext"><span style="text-align: center; display: inline-block; width: 100%;">01</span></div>
                    	</div>
                    	<div style="width: 0px; border-bottom: 0.35em solid rgb(254, 209, 109); border-right: 0.35em solid rgb(254, 209, 109); display: inline-block; vertical-align: bottom; margin-left: -1em; border-left: 0.35em solid transparent !important; border-top: 0.35em solid transparent !important;"></div>
                    </div>`,
    },
    // 分割线
    {
        "title":"",
        tag:["line"],
        "content":`<div style="background-color: rgb(249, 110, 87);height: 2px;margin:10px 0"></div>`,
    },
    // 分割线-小车
    {
        "title":"",
        tag:["line"],
        "content":`<p style="text-align: center;"><img class="" data-ratio="0.05255023183925812" data-src="IMG018" data-type="png" data-w="647" style="display: inline; width: 300px !important; height: auto !important; visibility: visible !important;" title="分割线" _width="300px" src="IMG019" data-fail="0"></p>`,
    },
    // 分割线-虚线
    {
        "title":"",
        tag:["line"],
        "content":`<section style="margin-top: 0.5em;margin-bottom: 0.5em;overflow: hidden;"><section style="display: inline-block;vertical-align: middle;width: 6px;height: 6px;"><section style="transform: rotate(0.1deg);-webkit-transform: rotate(0.1deg);-moz-transform: rotate(0.1deg);-o-transform: rotate(0.1deg);"><section style="width: 6px;height: 6px;background-color: rgb(198, 198, 199);color: rgb(70, 70, 72);"></section></section></section><section style="display: inline-block;vertical-align: middle;width: 100%;margin-right: -6px;margin-left: -7px;border-bottom: 2px dotted rgb(198, 198, 199);" data-width="100%"></section><section style="display: inline-block;vertical-align: middle;width: 6px;height: 6px;background-color: rgb(198, 198, 199);color: rgb(70, 70, 72);"></section></section>`,
    },
    // 分割线_虚线分割线
    {
        "title":"",
        tag:["line"],
        "content":`<section style="clear: both;border-width: 0px;border-style: none;border-color: initial;margin-top: 5px;margin-bottom: 5px;">
                        <section style="border-top: 2.5px solid rgb(183, 24, 24);border-right-color: rgb(183, 24, 24);border-bottom-color: rgb(183, 24, 24);border-left-color: rgb(183, 24, 24);font-size: 1em;font-weight: inherit;text-decoration: inherit;color: rgb(254, 254, 254);box-sizing: border-box;">
                           <section style="border-width: 0px;border-style: initial;border-color: rgb(183, 24, 24);margin-top: 2px;overflow: hidden;color: inherit;">
                                <section style="display: inline-block;font-size: 1em;font-family: inherit;font-weight: inherit;text-align: inherit;text-decoration: inherit;color: inherit;border-color: rgb(183, 24, 24);">
                                    <section class="" data-bcless="darken" data-brushtype="text" style="display: inline-block;line-height: 1.4em;padding: 5px 10px;height: 32px;vertical-align: top;font-family: inherit;font-weight: bold;float: left;color: inherit;border-color: rgb(93, 12, 12);background: rgb(183, 24, 24);box-sizing: border-box !important;">
                                        <div cell-type="fulltext"><p><span style="font-size: 14px;letter-spacing: 0.5px;">操控&amp;漂移，咔咔就是炸！</span></p>
                                        </div>
                                        </section>
                                    <section style="display: inline-block;vertical-align: top;width: 0px;height: 0px;border-top: 32px solid rgb(183, 24, 24);border-right: 32px solid transparent;border-top-right-radius: 4px;border-bottom-left-radius: 2px;color: inherit;box-sizing: border-box !important;"></section>
                                </section>
                            </section>
                        </section>
                    </section>`,
    },
    // 分割线_操控&漂移，咔咔就是炸！​
    {
        "title":"",
        tag:["line"],
        "content":`<div style="border-top: 3px dashed rgb(249, 110, 87);width: 100%;margin:10px 0;"></div>`,
    },
    // 分割线_叶子图片
    {
        "title":"",
        tag:["line","leaves"],
        "content":`<div style="width: 100%; text-align: center; margin: 10px auto;">
                    	<div style="width: 60%; display: inline-block;">
                    		<img style="width: 100%; text-align: center;" src="IMG001" />
                    	</div>
                    </div>`,
    },
    {
        "title":"",
        tag:["line"],
        "content":`<section style="margin: 0.5em 0px;">
                        <div style="display: inline-block; float: left; width: 45%; margin-top: 0.2em; border: 1px dotted rgb(249, 110, 87);"></div>
                        <div style="display: inline-block; float: right; width: 45%; margin-top: 0.2em; border: 1px dotted rgb(249, 110, 87);"></div>
                        <div style="width: 0.5em; height: 0.5em; margin:auto;">
                            <div style="-ms-transform:rotate(45deg);-moz-transform:rotate(45deg);-webkit-transform:rotate(45deg);transform:rotate(45deg);"> <div style="width: 0.5em; height: 0.5em; background-color: rgb(249, 110, 87);"></div></div>
                        </div>
                    </section>`,
    },
    {
        "title":"",
        tag:["line"],
        "content":`<div class="line_01" style="margin-top:10px">
                		<div style="border-bottom: 2px solid rgb(249, 110, 87);"></div>
                		<div style="width: 0px;border-top: 1em solid rgb(249, 110, 87);border-left: 0.8em solid transparent !important;border-right: 0.8em solid transparent !important;margin: auto;"></div>
                    </div>`,
    },

    // 图片
    {
        "title":"",
        tag:["single-image"],
        "content":
            `<div style="margin: 10px 0;text-align: center" >
                <div style="display: inline-block;width: 100%;vertical-align: top;">
                    <img cell-type="image"
                         src="IMG002"
                         style="max-width: 100%;vertical-align: middle;box-shadow: rgb(0, 0, 0) 0px 0px 10px;">
                </div>
            </div>`
    },
    // 图片-单图灰色边框
    {
        "title":"",
        tag:["single-image"],
        "content":
            `<div style="margin: 10px 0;text-align: center" >
                <div style="display: inline-block;width: 100%;vertical-align: top;border: 2px solid #DBDBDB;padding: 8px;">
                    <img cell-type="image"
                         src="IMG020"
                         style="max-width: 100%;vertical-align: middle;">
                </div>
            </div>`
    },
    // 图片_单图1
    {
        "title":"",
        tag:["single-image"],
        "content":
            `<div style="margin: 0;">
            	<div style="width: 0px; float: right; margin-right: 1em; transform: rotate(0deg); border-top: 2em solid rgb(255, 255, 255); border-right: 2em solid rgb(255, 255, 255); border-left: 2em solid transparent !important; border-bottom: 2em solid transparent !important;" ></div>
            	<div style="padding: 0 2em; margin: -3em 0 0;display: inline-block;">
                	<div style="box-sizing: border-box;width: 100%;margin: 0px;text-align: start;height: auto !important;display: inline-block;overflow: hidden !important;">
                    	<div>
                    		<img cell-type="image" style="width: 100%;" src="IMG003" />
                    	</div>
                	</div>
            	</div>
            </div>`
    },
    // 视频-视频1
    {
        "title":"视频1",
        tag:["video"],
        "content":
            `<div cell-type="video" style="width: 100%;margin: 1rem 0;min-height: 150px;background-color: #000000;text-align: center;line-height: 0;">
                
            </div>`
    },
    // 小节标题一
    {
        "title":"",
        tag:["set"],
        "content":
            `<div>
                <div style="display: inline-block; text-align: left; margin: 10px 0% 10px;font-size: 80%;">
                    <div cell-type="bg" style="width: 1.5em; height: 1.5em; margin: auto; display: inline-block; vertical-align: middle; border-radius: 100%; font-weight: 500; background-color: rgb(203, 11, 11); text-align: center; font-size: 160%; line-height: 1.5em; color: rgb(255, 255, 255);">
                        <div cell-type="fulltext">
                            <p style="margin:0;padding: 0">1</p>
                        </div>
                    </div>
                    <div style="vertical-align: middle;display: inline-block;padding-left: 5px;">
                        <div cell-type="fulltext" style="font-size: 150%; color: rgb(203, 11, 11);">
                            <p style="margin:0;padding: 0"><strong>发展历程</strong></p>
                        </div>
                    </div>
                </div>
                <div>
                    <div style="display: inline-block;width: 100%;border: 1px solid rgb(203, 11, 11);padding: 10px;background-color: transparent;border-radius: 5px;">
                        <div cell-type="fulltext"
                             style="text-align: justify;font-size: 93.75%;line-height: 1.8;">
                            <p style="margin:0;padding: 0">
                                上海汽车集团股份有限公司（简称"上汽集团"，股票代码600104）是国内A股市场最大的汽车上市公司，总股本达到116.83亿股。上汽集团努力把握产业发展趋势，加快创新转型。</p>
                        </div>
                    </div>
    
                </div>
            </div>`
    },
    // 二维码
    {
        "title":"",
        tag:["set","multi-image"],
        "content":
            `<ul style="padding-left: 0;display: inline-block; width: 100%; vertical-align: top;">
                <li style="position: static;list-style-type: none;">
                    <section style="margin: 10px 0% 0px;text-align: right;font-size: 90%;transform: translate3d(-5px, 0px, 0px);">
                        <div style="display: inline-block;border: 2px solid rgb(0, 0, 0);padding: 0.1em 0.3em;background-color: rgb(0, 0, 0);color: rgb(255, 255, 255);line-height: 1.4;">
                            <p style="margin: 0;padding: 0;" cell-type="text">©上汽</p>
                        </div>
                    </section>
                </li>
                <li style="position: static;list-style-type: none;">
                    <section style="margin: 10px 0% 0px;text-align: right;font-size: 90%;transform: translate3d(-5px, 0px, 0px);">
                        <ul style="padding-left: 0;display: inline-block;width: 95%;vertical-align: top;box-shadow: rgba(81, 81, 81, 0.54) 0px 0px 0px;border-color: rgb(0, 0, 0);border-width: 1px;border-radius: 0px;border-style: solid;">
                            <li style="position: static;list-style-type: none;">
                                <section style="transform: translate3d(5px, 0px, 0px);margin: -5px 0% 5px;">
                                    <ul style="list-style-type: none;display: inline-block;width: 100%;vertical-align: top;box-shadow: rgba(81, 81, 81, 0.54) 0px 0px 0px;background-color: rgba(255, 255, 255, 0.2);border-color: rgb(0, 0, 0);border-width: 1px;border-radius: 0px;border-style: solid;padding: 10px;">
                                        <li style="position: static;list-style-type: none;">
                                            <section style="margin: 0px 0%;">
                                                <ul style="display: inline-block;vertical-align: bottom;width: 8%;">
                                                </ul>
                                                <ul style="display: inline-block;vertical-align: bottom;width: 92%;padding: 0px 0px 0px 10px;">
                                                    <li style="position: static;list-style-type: none;">
                                                        <div style="text-align: justify;font-size: 87.5%;line-height: 1.6;">
                                                            <p style="margin: 0;padding: 0;">
                                                                <strong>长按下方二维码关注我们</strong>
                                                            </p>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </section>
                                        </li>
                                        <li style="position: static;list-style-type: none;">
                                            <ul style="display: inline-block;vertical-align: middle;width: 50%;padding: 0px;">
                                                <img cell-type="image"
                                                     style="max-width: 100%;vertical-align: middle;"
                                                     src="IMG004">
                                            </ul>
                                            <ul style="display: inline-block;vertical-align: middle;width: 48%;padding: 0px 5px;">
                                                <section
                                                        style="text-align: center;margin: 10px 0%;">
                                                    <img cell-type="image"
                                                         style="max-width: 100%;vertical-align: middle;"
                                                         src="IMG005">
                                                </section>
                                                <!--<section style="margin: 0px 0% 5px;">-->
                                                    <!--<div style="text-align: center;font-size: 75%;line-height: 1.6;">-->
                                                        <!--<p style="margin: 0;padding: 0;">-->
                                                            <!--每一次的旅行</p>-->
                                                        <!--<p style="margin: 0;padding: 0;">-->
                                                            <!--都想与你同在</p>-->
                                                    <!--</div>-->

                                                <!--</section>-->
                                            </ul>
                                        </li>
                                    </ul>
                                </section>
                            </li>
                        </ul>
                    </section>
                </li>
            </ul>`,
    },
    // 图文组合_小鹿
    {
        "title":"",
        tag:["set","multi-image"],
        "content":
            `<div style="display: inline-block; border: 1px dashed #add8e6;margin:10px 0">
            	<div style="display: inline-block;margin: 10px 0;">
            		<div style="float: left; width: 50%;margin-top: 35px; text-align: center;">
            			<div cell-type="fulltext"><div style="border-bottom: 5px solid #f96e57; width: 68%;margin-left:14%;padding: 8px 0;"><span>形容一见钟情心跳加速的样子叫做"心如鹿撞"</span></div></div>
            		</div>
            		<div style="float: left; width: 50%;overflow: visible;">
            			<div><img cell-type="image" style="width: 100%;border-radius: 15px;" src="IMG006" /></div>
            		</div>
            	</div>
            	<div style="display: inline-block; margin-bottom: -0.7rem;">
            		<div style="float: left; width: 50%;overflow: visible;">
            			<div><img cell-type="image" style="width: 100%;border-radius: 15px;" src="IMG006" /></div>
            		</div>
            		<div style="float: left; width: 50%;margin-top: 35px; text-align: center;">
            			<div cell-type="fulltext"><div style="border-bottom: 5px solid #f96e57; width: 68%;margin-left:14%;padding: 8px 0;"><span>形容一见钟情心跳加速的样子叫做"心如鹿撞"</span></div></div>
            		</div>
            	</div>
            </div>`,
    },
    // 图文组合_MG
    {
        "title":"",
        tag:["set","multi-image"],
        "content":
            `<section style="margin-top:20px;"><section style="display:flex;align-items: flex-start;"><section data-width="2px" style="width: 2px;height: 60px;background: rgb(172, 29, 16);margin-left: 5px;margin-top: -7px;margin-right: 5px;color: rgb(255, 255, 255);"><span style="font-size: 18px;"></span></section><section class="" data-width="60%" style="margin-top: 5px;width: 60%;background: rgb(172, 29, 16);padding: 5px;margin-right: 5px;color: rgb(255, 255, 255);box-sizing: border-box;"><img cell-type="image" style="white-space: normal; width: 100%; height: auto !important; visibility: visible !important;" src="IMG021" data-fail="0"></section><section style="flex:1;"><section style="height: 34px;line-height: 34px;background: rgb(172, 29, 16);text-align: center;color: rgb(255, 255, 255);">
                                        <div cell-type="fulltext"><p class="" data-brushtype="text" style="font-size: 18px;min-width: 1px;">全新MG3上市</p></div></section>
                                        <section class="" style="margin-top: 10px;border-width: 2px;border-style: solid;border-color: rgb(172, 29, 16);padding: 5px;font-size: 14px;color: rgb(6, 6, 6);box-sizing: border-box;">
                                            <div cell-type="fulltext"><p>2017年8月25日<br></p><p><span style="letter-spacing: 2px;"><em><strong>成都国际车展</strong></em></span></p></div></section></section></section></section>`,
    },
    // 图文组合_黄宾虹
    {
        "title":"",
        tag:["set","multi-image"],
        "content":
            `<div style="margin: 10px 0 0;"><div style="padding:10px 10px 5px;display: inline-block;border-top: 5px solid #cbc547;border-left: 5px solid #cbc547;border-right: 5px solid #777329; border-bottom: 5px solid #777329;">
            	<div style="width:50%;float: left;">
            		<div><img cell-type="image" style="width: 100%;" src="IMG007" /></div>
            	</div>
            	<div style="float: right; width: 48%;">
            		<div style="font-weight: bold;font-size: 18px; border-bottom: 1px solid #cbc547;">
            			<div cell-type="fulltext"><span>荣威俱乐部</span></div>
            		</div>
            		<div style="font-size: 14px; padding-top: 10px; line-height: 22px;">
            			<div cell-type="fulltext"><span>荣威车友平台，精彩有奖互动，车友用车资讯，尽在荣威俱乐部微信。</span></div>
            		</div>
            	</div>
            </div></div>`,
    },
    // 图文组合_黄宾虹
    // 图文组合_熊猫
    {
        "title":"",
        tag:["set","multi-image"],
        "content":
            `<div style="background: #cae2c6; display: inline-block;padding: 20px 10px 15px;">
            	<div style="float: left;width: 33%;">
                	<div>
                		<img cell-type="image" style="width: 100%;" src="IMG008" />
                	</div>
            	</div>
            	<div style="position: relative; float:right;display: inline-block;vertical-align: bottom;width: 61.8%;padding: 0px;background-color: rgb(228, 241, 231);">
            		<div style="font-size: 0.9rem;background: rgb(11, 72, 39);display: INLINE-BLOCK;color: #fff;padding: 2px 6px 1px;margin-top: -12px;position: absolute;">
            			<div cell-type="fulltext"><span>MG名爵俱乐部</span></div>
            		</div>
            		<div style="padding: 25px 5px 10px; display: inline-block;font-size: 0.8rem;">
            			<div cell-type="fulltext"><span>MG名爵车友平台。</span></div>
            		</div>
            	</div>
            </div>`,
    },
    // 图文组合_会议时间
    {
        "title":"",
        tag:["set","meetingTime"],
        "content":
            `<div style="margin: 10px 0; display: inline-block;">
        		<div style="width: 6%; float: left; vertical-align: middle;">
        		<div><img cell-type="image" style="width: 100%;" src="IMG009" /></div>
        		</div>
        		<div style="float: left; margin-left: 10px;">
        			<div cell-type="fulltext"><span>大会时间</span></div>
        		</div>
        		<div style="width: 100%; display: inline-block; text-align: left; margin-top: 2px;">
        			<div cell-type="fulltext"><span>全国会议大堂金色大厅</span></div>
        		</div>
        	</div>`,
    },
    // 图文组合_会议地址
    {
        "title":"",
        tag:["set","meetingAddress"],
        "content":
            `<div style="margin: 10px 0; display: inline-block;">
        		<div style="width: 6%; float: left; vertical-align: middle;">
        		<div><img cell-type="image" style="width: 100%;" src="IMG010" /></div>
        		</div>
        		<div style="float: left; margin-left: 10px;">
        			<div cell-type="fulltext"><span>大会地点</span></div>
        		</div>
        		<div style="width: 100%; display: inline-block; text-align: left; margin-top: 2px;">
        			<div cell-type="fulltext"><span>全国会议大堂金色大厅</span></div>
        		</div>
        	</div>`,
    },
    // 图文组合_会议内容
    {
        "title":"",
        tag:["set","meetingConnext"],
        "content":
            `<div style="margin: 10px 0; display: inline-block;">
        		<div style="width: 6%; float: left; vertical-align: middle;">
        		<div><img cell-type="image" style="width: 100%;" src="IMG011" /></div>
        		</div>
        		<div style="float: left; margin-left: 10px;">
        			<div cell-type="fulltext"><span>大会内容</span></div>
        		</div>
        		<div style="width: 100%; display: inline-block; text-align: left; margin-top: 2px;">
        			<div cell-type="fulltext"><span>大会将根据交流内容设置专题分会场，专题报告人将采取大会邀请和从提交的论文摘要中遴选两种方式产生。每个专题报告的报告时间暂定为30分钟。</span></div>
        		</div>
        	</div>`,
    },
    // 贴纸_手
    {
        "title":"",
        tag:["stickers","hand-right"],
        "content":
            `<div style="text-align: center; margin:10px">
                <div style="max-width: 100%;vertical-align: middle;display: inline-block;overflow: hidden !important;width: 15%; ">
                	<div><img cell-type="image" style="width: 100%;" src="IMG012"/></div>
            	</div>
        	</div>`,
    },
    {
        "title":"",
        tag:["stickers","hand-left"],
        "content":
            `<div style="text-align: center; margin:10px">
                <div style="max-width: 100%;vertical-align: middle;display: inline-block;overflow: hidden !important;width: 15%; ">
                	<div><img cell-type="image" style="width: 100%;" src="IMG013"/></div>
				</div>
        	</div>`,
    },
    {
        "title":"",
        tag:["stickers","hand-bottom"],
        "content":
            `<div style="text-align: center; margin:10px">
                <div style="max-width: 100%;vertical-align: middle;display: inline-block;overflow: hidden !important;width: 12%; ">
                	<div><img cell-type="image" style="width: 100%;" src="IMG014"/></div>
				</div>
        	</div>`,
    },
    {
        "title":"",
        tag:["stickers","hand-top"],
        "content":
            `<div style="text-align: center; margin:10px">
                <div style="max-width: 100%;vertical-align: middle;display: inline-block;overflow: hidden !important;width: 12%; ">
                	<div><img cell-type="image" style="width: 100%;" src="IMG015"/></div>
				</div>
        	</div>`,
    },
    // 贴纸_手
    // 贴纸_问号
    {
        "title":"",
        tag:["stickers","hand-top"],
        "content":
            `<div style="text-align: center; margin:10px">
                <div style="max-width: 100%;vertical-align: middle;display: inline-block;overflow: hidden !important;width: 20%; ">
                	<div><img cell-type="image" style="width: 100%;" src="IMG016"/></div>
				</div>
        	</div>`,
    },
    // 贴纸_问号
    // {
    //     "title":"",
    //     tag:["set"],
    //     "content":``,
    // },
    // // 二维码
    // {
    //     "title":"",
    //     tag:["set"],
    //     "content":``,
    // },
    // // 二维码
    // {
    //     "title":"",
    //     tag:["set"],
    //     "content":``,
    // },
]


export default {
    getArtTps: (request) => {
        let tag = request.body
        for (let [n,v] of tpls.entries()){
            v.id = n
        }
        if(!tag || tag === "all"){
            return tpls;
        }else{
            let reData = [];
            for (let v of tpls){
                for (let value of v.tag){
                    if(value === tag){
                        reData.push(v)
                    }
                }
            }
            return reData
        }
    },
};
