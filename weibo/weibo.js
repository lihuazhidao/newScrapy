/**
 * Created by zhichaoshen on 2016/8/5.
 */

/*
* 微博
*   //总条数
*   //已经采集
*   //已经丢失
*   //速度
*   //剩余时间
*   //开始顺序
*   时间句柄
* */

import $ from 'jquery';
import _ from 'lodash';
import {checkExistUser} from './weiboCommon';
import {timeStatistics} from '../common/common';


export default class Weibo{


    constructor() {

        //微博用户
        this.user={};
        this.created=false;
        this.startState=false;
        this.hideState=true;
        this.total=0;//总条数
        this.totalPage=0;//总页数
        this.allTime=0;//所有采集时间
        this.lessTime=0;//采集剩余时间
        this.hasCollect=0;//已经采集条数
        this.speed=0;//采集时间间隔
        this.order=true;//采集顺序
        this.pageCount=0;//每页条数
        this.timeHandle=undefined;
        this.dom="body";
        this.constructorUI();
    }


    constructorUI(){
        var template=`
            <span id="scrapy-wrapper-weibo">
                <div id="scrapy-weibo" class="scrapy-weibo ${this.hideState?"":"showItem"}">
                    <div class="wrap">
                        <div class="hide">
                          ${this.hideState?'':'<button id="show">Show</button>'}
                          ${this.hideState?'<button id="hide">Hide</button> ':''}
                        </div>
                        <div class="${this.created?"":"none"}">
                            <h3>个人微博列表</h3>
                            <div class="set">
                                <label for="speed">采集速度：</label><input type="text" value="${this.speed/1000}">秒/条
                                <button id="set">设置</button>
                            </div>
                            <div class="controll">
                                <button id="start" class="${this.startState?"active":""}">Start</button>
                                <button id="stop"  class="${this.startState?"":"active"}">End</button>
                            </div>
                            <div class="infos">
                                <ul>
                                    <li>总计：${this.total}条</li>
                                    <li>已经爬取：${this.hasCollect}条</li>
                                    <li>遗漏：${this.user.missing}条</li>
                                    <li>爬取速度：${this.speed/1000}秒/10条</li>
                                    <li>总计时间：${timeStatistics(this.allTime)}</li>
                                    <li>预计剩余时间：${timeStatistics(this.lessTime)}</li>
                                </ul>
                            </div>
                            <div class="lookDetails">
                                <a href="http://192.168.0.236:3000/weibo/users" target="_blank">lookDetails</a>
                            </div>
                        </div>
                        <div  class="create-user ${this.created?"none":""}">
                            <a href="http://m.weibo.cn/u/${this.user.uid}?jumpfrom=weibocom">GO创建用户</a>
                        </div>
                    </div>
                </div>
            </span>
        `;
        $(this.dom).append(template);
    }

    upDateUI(){
        var updateHtml=`
                     <div id="scrapy-weibo" class="scrapy-weibo ${this.hideState?"":"showItem"}">
                        <div class="wrap">
                            <div class="hide">
                              ${this.hideState?'':'<button id="show">Show</button>'}
                              ${this.hideState?'<button id="hide">Hide</button> ':''}
                            </div>
                            <div class="${this.created?"":"none"}">
                                <h3>个人微博列表</h3>
                                <div class="set">
                                    <label for="speed">采集速度：</label><input type="text" value="${this.speed/1000}">秒/条
                                    <button id="set">设置</button>
                                </div>
                                <div class="controll">
                                    <button id="start" class="${this.startState?"active":""}">Start</button>
                                    <button id="stop"  class="${this.startState?"":"active"}">End</button>
                                </div>
                                <div class="infos">
                                    <ul>
                                        <li>总计：${this.total}条</li>
                                        <li>已经爬取：${this.hasCollect}条</li>
                                        <li>遗漏：${this.user.missing}条</li>
                                        <li>爬取速度：${this.speed/1000}秒/10条</li>
                                        <li>总计时间：${timeStatistics(this.allTime)}</li>
                                        <li>预计剩余时间：${timeStatistics(this.lessTime)}</li>
                                    </ul>
                                </div>
                                <div class="lookDetails">
                                     <a href="http://192.168.0.236:3000/weibo/users" target="_blank">lookDetails</a>
                                </div>
                            </div>
                            <div  class="create-user ${this.created?"none":""}">
                               <a href="http://m.weibo.cn/u/${this.user.uid}?jumpfrom=weibocom">GO创建用户</a>
                            </div>
                        </div>
                     </div>
                        `;

            $("#scrapy-wrapper-weibo").html(updateHtml);
    }

    bindEvents(methods){
        _.each(methods,(func,key)=>{
            var event=key.split(" ")[0];
            var dom=key.split(" ")[1];
            $("#scrapy-wrapper-weibo").delegate(dom,event,func)

        });
    }


    checkHasCreate(){
        checkExistUser(this.user.uid,(data)=>{
            if(data.state){
                this.created=true;
                this.user.missing=data.missing;
                this.upDateUI();
            }else{
                this.upDateUI();
            }
        })
    }

    hide(){
        this.hideState=false;
        this.upDateUI();
    }
    show(){
        this.hideState=true;
        this.upDateUI();
    }

    //设置爬去速度
    setSpeed(speed) {
        this.speed=speed;
        this.upDateUI();
    }

    //开始顺序
    startOrder() {
        this.order=!this.order
    }

    //获取数据
    getData(url,params,success){
        $.get(url,params,success,'json');
    }

    //传递数据
    postData(url,params,success){
        $.ajax({
            url:url,
            type:"POST",
            data:JSON.stringify(params),
            dataType:'json',
            contentType:'application/json',
            success:success,
            error:(err)=>{
                console.log(err);
            }
        });
        //返回状态和已经采集条数
        /*
        *
        * {
        * msg:"",
        * collectNum:102
        * }
        *
        * */

    }

}






















