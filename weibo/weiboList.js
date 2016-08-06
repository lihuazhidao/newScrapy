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