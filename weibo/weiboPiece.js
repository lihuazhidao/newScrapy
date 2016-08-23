/**
 * Created by zhichaoshen on 2016/8/5.
 */
import $ from 'jquery';
import _ from 'lodash';

import {checkExistUser,checkExistWeibo,createWeibo} from './weiboCommon';



export default class WeiboPiece{



    constructor(){

        var weiboInfo=this.parseWeibo();
        var user=weiboInfo.user;
        var weibo=weiboInfo.weibo;

        this.hideState=true;
        this.createUser=false;
        this.createWeibo=false;
        this.dom="body";

        this.methods={
            "click #hide":(event)=>{
                this.hide();
            },
            "click #show":(event)=>{
                this.show();
            }
        };


        this.createWeiboEvents={
            "click .create-weibo button":(event)=>{
                /*
                *
                * post 微博 再返回该条微博，更新UI到scrapy UI
                * */

                var data={
                    weibo:weibo
                };
                createWeibo(data,user.uid);
                console.log(data)
            }
        }


        checkExistUser(user.uid).then((data)=>{

           if(data.state){
               //用户已经创建
               this.createUser=true;
               checkExistWeibo(user.uid,weibo.bid).done((data)=>{
                   if(data.state){
                       //可以继续采集数据
                       this.createWeibo=true;
                       this.weibo=data.data;
                       this.scrapyUI();


                   }else{
                       //先要创建该微博

                       this.gotoCreateWeibo();
                   }
               })

           }else{
               //显示让用户去创建该用户账号
               this.goToCreateUser(user.uid);
           }

        });




    }


    scrapyUI(){
        var  scrapyUI =`<span id="scrapy-wrapper-weibo" >
                <div id="scrapy-weibo" class="scrapy-weibo weibo-piece ${this.hideState?"":"showItem"}">
                <div class="wrap">
                        <div class="hide">
                          ${this.hideState?'':'<button id="show">Show</button>'}
                          ${this.hideState?'<button id="hide">Hide</button> ':''}
                        </div>
                <h1>该微博已经创建</h1>
                <ul class="weibo-info">
                    <li>转发数：${this.weibo.reposts_count}</li>
                    <li>评论数：${this.weibo.comments_count}</li>
                    <li>点赞数：${this.weibo.attitudes_count}</li>
                </ul>
                <div class="weibo-comments">
                <ul>
                <li>已采集评论:${this.weibo.hasCollectComment}</li>
                <li>丢失:${this.weibo.missingComment}</li>
                <li>采集速度10条/6秒</li>
                <li>起始位置 <input type="text"></li>
                <li><button class="start">Start</button><button class="end">End</button></li>
                </ul>
                </div>
                 <div class="weibo-reposts">
                <ul>
                <li>已采集转发：${this.weibo.hasCollectRepost}</li>
                  <li>丢失:${this.weibo.missingRepost}</li>
                <li>采集速度10条/6秒</li>
                <li>起始位置 <input type="text"></li>
                <li><button class="start">Start</button><button class="end">End</button></li>
                </ul>
                </div>
                </div>
                </div>       
                 </span>
            `;

        $(this.dom).find("#scrapy-wrapper-weibo").remove();
        $(this.dom).append(scrapyUI);
        this.bindEvents(this.methods);
    }


    goToCreateUser(uid){
        var createUserhtml =`     <span id="scrapy-wrapper-weibo">
                <div id="scrapy-weibo" class="scrapy-weibo  weibo-piece ${this.hideState?"":"showItem"}">
                <div class="wrap">
                        <h1>未创建该用户</h1>
                        <div class="create-user">
                        <a href="http://m.weibo.cn/u/${uid}">GO创建该用户</a>
                        </div>
                        </div>
                </div>       
                 </span>
            `;
        $(this.dom).find("#scrapy-wrapper-weibo").remove();
        $(this.dom).append(createUserhtml);
        this.bindEvents(this.methods);

    }
    gotoCreateWeibo(){
        var createWeibohtml =`     <span id="scrapy-wrapper-weibo">
                <div id="scrapy-weibo" class="scrapy-weibo  weibo-piece ${this.hideState?"":"showItem"}">
                <div class="wrap">
                        <h1>未创建该条微博</h1>
                        <div class="create-weibo">
                        <button >创建该条微博</button>
                        </div>
                </div>  
                     </div>
                 </span>
            `;
        $(this.dom).find("#scrapy-wrapper-weibo").remove();
        $(this.dom).append(createWeibohtml);
        this.bindEvents(this.methods);
        this.bindEvents(this.createWeiboEvents);
    }





    parseWeibo(){

        var weiboInfo={};
        var user={}
        var weibo={}
        weiboInfo.user=user;
        weiboInfo.weibo=weibo;
        /*
        *
        * start parse
        *
        * */
        var config=$("#box + script").html();
            eval(config)
        var data=window.$render_data;
        console.log(data)
        var blog=data.stage.single[1].mblog;
        user.uid=blog.user.id;
        //start get data
        weibo.appid=blog.appid;
        weibo.attitudes_count=blog.attitudes_count;
        weibo.bid=blog.bid;
        weibo.comments=[];
        weibo.comments_count=blog.comments_count;
        weibo.created_at=blog.created_at;
        weibo.created_timestamp=blog.created_timestamp;
        weibo.id=blog.id;
        weibo.mid=blog.mid;
        weibo.pic_ids=blog.pic_ids;
        weibo.pics=blog.pics?blog.pics:[];
        weibo.reposts=[];
        weibo.reposts_count=blog.reposts_count;
        weibo.source=blog.source;
        weibo.text=blog.text;
        weibo.hasCollectComment=0;
        weibo.hasCollectRepost=0;
        weibo.missingComment=0;
        weibo.missingRepost=0;
        return weiboInfo;
    }




    hide(){
        this.hideState=false;
        this.scrapyUI()
    }
    show(){
        this.hideState=true;
        this.scrapyUI()
    }


    bindEvents(methods){
        _.each(methods,(func,key)=>{
            var event=key.split(" ")[0];
            var dom=key.split(" ")[1];
            $("#scrapy-wrapper-weibo").delegate(dom,event,func)

        });
    }





}




