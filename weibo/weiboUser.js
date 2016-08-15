/**
 * Created by zhichaoshen on 2016/8/6.
 */

import $ from 'jquery';
import _ from 'lodash';
import {checkExistUser} from './weiboCommon';
/*
*
*uid:String,//用户uid
 img:String,//头像
 desc:String,//用户简介
 username:String,//用户名
 fans:Number,//粉丝量
 lists:Number,//微博数量
 views:Number,//关注量,
 weiboList:[]//发布微博
* */

export default class WeiboUser{

    constructor(){

     //用户
     this.user={};
     this.user.weiboList=[];
     this.user.fansList=[];
     this.user.viewsList=[];
     this.user.missing=0;//采集微博丢失条数
     this.toDownload=undefined;
     this.hideState=true;
     this.created=false;
     this.parseData();
     this.constructorUI();
     this.methods={
        "click #create":(event)=>{
            this.create();
        },
        "click #hide":(event)=>{
            this.hide();
        },
        "click #show":(event)=>{
            this.show();
        }
    };
     this.bindEvents(this.methods);
     this.checkHasCreate();
    }

    constructorUI() {
        var template=`
            <span class="scrapy-wrapper-weibo-user" id="scrapy-wrapper-weibo-user" >
                <div class="scrapy-user-info ${this.hideState?"":"showItem"}" id="scrapy-user-info">
                   <div class="hide">
                      ${this.hideState?'':'<button id="show">Show</button>'}
                      ${this.hideState?'<button id="hide">Hide</button> ':''}
                    </div>
                    <h3 class="user">用户：${this.user.username}</h3>
                    <ul class="user-info-list">
                        <li><img src="${this.user.img}" alt=""></li>
                        <li>uid：${this.user.uid}</li>
                        <li>用户： ${this.user.username}</li>
                        <li>粉丝：${this.user.fans}</li>
                        <li>微博：${this.user.weibo}</li>
                        <li>关注：${this.user.views}</li>
                        <li>简介：${this.user.desc}</li>
                    </ul>
                    <div class="controll">
                        ${this.created?' <button id="created">该用户已经创建</button>':'  <button id="create">创建用户</button>'}
                      <div class="goDetails">
                        <a href="${this.toDownload}">去下载用户微博</a>
                    </div>
                </div>
            </span>
            `;
        $("body").append(template);

    }


    upDateUI(){
           var template=`
                  <div class="scrapy-user-info ${this.hideState?"":"showItem"}" id="scrapy-user-info">
                   <div class="hide">
                      ${this.hideState?'':'<button id="show">Show</button>'}
                      ${this.hideState?'<button id="hide">Hide</button> ':''}
                    </div>
                    <h3 class="user">用户：${this.user.username}</h3>
                    <ul class="user-info-list">
                        <li><img src="${this.user.img}" alt=""></li>
                        <li>uid：${this.user.uid}</li>
                        <li>用户： ${this.user.username}</li>
                        <li>粉丝：${this.user.fans}</li>
                        <li>微博：${this.user.weibo}</li>
                        <li>关注：${this.user.views}</li>
                        <li>简介：${this.user.desc}</li>
                    </ul>
                    <div class="controll">
                        ${this.created?' <button id="created">该用户已经创建</button>':'  <button id="create">创建用户</button>'}
                    </div>
                      <div class="goDetails">
                        <a href="${this.toDownload}">去下载用户微博</a>
                    </div>
                </div>` ;
        $("#scrapy-wrapper-weibo-user").html(template);
    }

    bindEvents(methods){
        _.each(methods,(func,key)=>{
            var event=key.split(" ")[0];
            var dom=key.split(" ")[1];
            $("#scrapy-wrapper-weibo-user").delegate(dom,event,func)

        });
    }


    //隐藏
    hide(){
        this.hideState=false;
        this.upDateUI();
    }
    //展示
    show(){
        this.hideState=true;
        this.upDateUI();
    }



    checkHasCreate(){
        checkExistUser(this.user.uid,(data)=>{
            if(data.state){
                this.created=true;
                this.upDateUI();
            }
        })
    }

    //创建user
    create() {

        var userData={
            user:this.user
        };

        $.ajax({
            url:'http://192.168.0.236:3000/weibo/user',
            data:JSON.stringify(userData),
            type:'POST',
            dataType:'json',
            contentType:'application/json',
            success:(data)=>{
               if(data.state){
                   this.created=true;
                   this.upDateUI();
               }
            },
            error:(err)=>{
                console.log(err);
            }
        })


    }


    //解析html
    parseData() {
            this.user.img=$(".media-main img").attr("src");
            this.user.username=$(".box-col.item-list .item-main span").html();
            this.user.desc=$("a[data-node-type='desc']").text();
            this.user.uid=$("a[data-node-type='desc']").attr("href").split("/")[2];
            this.user.weibo=$(".layout-box > a:eq(1) div:first").text();
            this.user.weibo=parseInt(this.user.weibo);
            this.toDownload=$(".layout-box > a:eq(1)").attr("href");
            this.user.views=$(".layout-box > a:eq(2) div:first").text();
            this.user.views=parseInt(this.user.views);
            this.user.fans=$(".layout-box > a:eq(3) div:first").text();
            this.user.fans=this.user.fans.replace("万","000");
            this.user.fans=parseInt(this.user.fans);
    }
}