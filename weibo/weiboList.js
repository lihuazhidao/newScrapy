/**
 * Created by zhichaoshen on 2016/8/5.
 */
import $ from 'jquery';
import _ from 'lodash';
import Weibo  from  './weibo';


export default class WeiboList extends Weibo{

    constructor(){
        super();
        //时间间隔
        this.speed=6000;//爬去速度
        this.pageCount=10;
        //获取地址
        this.getUrl="http://m.weibo.cn/page/json";
        //传递地址
        this.postUrl="http://192.168.0.236:3000/weibo/lists";
        //请求参数
        var config=$("#box + script").html();
        eval(config)
        //请求参数
        this.params={
            containerid:window.$config.stageId,
            page:1
        };


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
        this.getUserUid();
        this.checkHasCreate();


    }

    //后去uid

    getUserUid() {
            this.user.uid=$(".card-list .mod-media:first").attr("href").split("/")[2];
    }


    doGet(){

        this.getData(this.getUrl,this.params,(data)=>{
            //如果当前页大于总页数 则停止采集 仅当当前页不为第一页的时候
            if( this.params.page<0 || this.params.page!=1 &&  this.params.page>this.totalPage){
                this.lessTime=0;
                this.stop();
                console.log('collect end');
                this.upDateUI();
                return;
            }


            //统计总条数
            if(this.params.page==1){
                this.total=data.count;//总条数
                this.totalPage=data.cards[0].maxPage;//总页数
                this.allTime=this.total*this.speed/10;//采集时间//每次10条
            }


            //如果返回内容不为空
            if(data.cards[0].mod_type=="mod/pagelist" && data.count!=""){
                console.log(data);
                var postParams=this.parseData(data);
                var lists={
                    uid:this.user.uid,
                    lists:postParams,
                    currentPage:this.params.page
                };
                var tempPage=this.params.page;
                this.params.page++;
                this.postData(this.postUrl,lists,(data)=>{
                    if(data.state){

                        if(data.allreadyUpdate){
                            clearInterval(this.timeHandle);
                            this.upDateUI();
                            return;
                        }

                        this.hasCollect=data.collectNum;
                        this.user.missing=data.missing;
                        this.lessTime=(this.total-this.pageCount*tempPage)*this.speed/10;

                        if(this.lessTime<0){
                            this.lessTime=0;
                        }

                        this.upDateUI();
                    }else{
                        console.log(data.msg);
                    }
                });
            }else{
                //如果返回内容为空或者错误，重新发起请求，页数回退

                this.params.page=this.params.page;
            }
        });

    }



    //开始爬取
    start() {
        this.startState=true;
        this.upDateUI();
        this.doGet();
        this.timeHandle=setInterval(()=>{
        this.doGet();
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
                comments_count:e.comments_count,
                reposts_count:e.reposts_count,
                created_at:e.created_at,
                created_timestamp:e.created_timestamp,
                mid:e.mid,
                id:e.id,
                bid:e.bid,
                text:e.text,
                source:e.source,
                pic_ids:e.pic_ids,
                pics:(e.pics?e.pics:[])
            }
        });

        return lists;
    }
}