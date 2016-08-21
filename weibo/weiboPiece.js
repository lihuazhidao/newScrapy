/**
 * Created by zhichaoshen on 2016/8/5.
 */
import $ from 'jquery';
import _ from 'lodash';

import {checkExistUser,checkExistWeibo} from './weiboCommon';



export default class WeiboPiece{



    constructor(){

        var weiboInfo=this.parseWeibo();
        var user=weiboInfo.user;
        var weibo=weiboInfo.weibo;

        console.log(weiboInfo)
        checkExistUser(user.uid).then((data)=>{

           if(data.state){
               //用户已经创建

               checkExistWeibo(user.id,weibo.bid).done((data)=>{

                   if(data.state){
                       //可以继续采集数据
                   }else{
                       //先要创建该微博
                   }

               })



           }else{
               //显示让用户去创建该用户账号
           }


        });




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
        weibo.reposts=blog.reposts;
        weibo.reposts_count=blog.reposts_count;
        weibo.source=blog.source;
        weibo.text=blog.text;

        return weiboInfo;
    }






}




