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



class Weibo{


    constructor() {
        this.startState=false;
        this.hideState=true;
        this.total=0;//总条数
        this.totalPage=0;//总页数
        this.allTime=0;//所有采集时间
        this.lessTime=0;//采集剩余时间
        this.hasCollect=0;//已经采集条数
        this.missing=0;//丢失多少条
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
                                <li>已经爬取：${this.total}条</li>
                                <li>遗漏：${this.total}条</li>
                                <li>爬取速度：${this.total}条</li>
                                <li>总计时间：${this.total}ms</li>
                                <li>预计剩余时间：${this.total}ms</li>
                            </ul>
                        </div>
                        <div class="lookDetails">
                            <a href="###">lookDetails</a>
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
                                        <li>遗漏：${this.missing}条</li>
                                        <li>爬取速度：${this.speed/1000}条/秒</li>
                                        <li>总计时间：${this.allTime}ms</li>
                                        <li>预计剩余时间：${this.lessTime}ms</li>
                                    </ul>
                                </div>
                                <div class="lookDetails">
                                    <a href="###">lookDetails</a>
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
        })
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




export class WeiboSearch extends Weibo{

    constructor(){
        super();
        this.getUrl="xxx";
        this.postUrl="xxxx";
    }

    //开始
    start() {

    }

    //结束
    stop() {

    }

    getData(){

    }
    parseData(){

    }

}
export class WeiboList extends Weibo{

    constructor(){
        super();

        //时间间隔
        this.speed=8000;//爬去速度
        this.pageCount=10;
        //获取地址
        this.getUrl="http://m.weibo.cn/page/json";
        //传递地址
        this.postUrl="xxxx";
        //请求参数
        var config=$("#box + script").html();
            eval(config)
        //请求参数
        this.params={
            containerid:window.$config.stageId,
            page:1
        };

            console.log(this.params)
        this.methods={
            "click #start": (event)=>{
                this.start();
            },
            "click #stop": (event)=>{
                this.stop();
            },
            "click #set":(event)=>{
                this.setSpeed()
            },
            "click #hide":(event)=>{
                this.hide();
            },
            "click #show":(event)=>{
                this.show();
            }
        };

        this.bindEvents(this.methods);



    }






    //开始爬取
    start() {
       this.startState=true;
       this.upDateUI();
       this.timeHandle=setInterval(()=>{
         this.getData(this.getUrl,this.params,(data)=>{
               //如果当前页大于总页数 则停止采集 仅当当前页不为第一页的时候
               if( this.params.page<0 || this.params.page!=1 &&  this.params.page>this.totalPage){
                   this.stop();
                   console.log('collect end');
                   this.upDateUI();
                   return;
               }


               //统计总条数
                if(this.params.page==1){
                    this.total=data.count;//总条数
                    this.totalPage=data.cards[0].maxPage;//总页数
                    this.allTime=this.total*this.speed;//采集时间
                }


                //如果返回内容不为空
               if(data.cards[0].mod_type=="mod/pagelist" && data.count!=""){
                   console.log(data);
                   var postParams=this.parseData(data);
                   var lists={
                       lists:postParams
                   };
                   var tempPage=this.params.page;
                   this.params.page++;
                   this.postData(this.postUrl,lists,(data)=>{
                        this.hasCollect=data.collectNum;
                        this.missing=tempPage*this.pageCount-this.hasCollect;
                        this.lessTime=(this.total-this.pageCount*tempPage)*this.speed;
                        this.upDateUI();
                        console.log(data.msg);
                   })
               }else{
                   //如果返回内容为空或者错误，重新发起请求，页数回退
                   this.params.page--;
               }
           });

       },8000)
    }

    stop() {
        this.startState=false;
        this.upDateUI();
        clearInterval(this.timeHandle);
    }

    parseData(data){
        var cardGroup=data.cards[0].card_group;//获取card_group
        var lists=_.map(cardGroup,(d)=>d.mblog);//获取weibolists
            lists=_.map(lists,(e)=>{  //过滤获取所需信息
                return {
                    appid:e.appid,
                    attitudes_count:e.attitudes_count,
                    attitudes_status:e.attitudes_status,
                    created_at:e.created_at,
                    created_timestamp:e.created_timestamp,
                    mid:e.mid,
                    id:e.id,
                    text:e.text,
                    textLength:e.textLength,
                    source:e.source,
                    source_type:e.source_type,
                    comments_count:e.comments_count,
                    pic_ids:e.pic_ids,
                    pics:(e.pics?e.pics:[])
                }
            });
        console.log(lists)
        return lists;
    }
}
export class WeiboDetails extends Weibo{
    constructor(){
        super();
        this.getUrl="xxx";
        this.postUrl="xxxx";
    }

    parseData(){

    }
}














