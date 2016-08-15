/**
 * Created by zhichaoshen on 2016/8/4.
 */




/*
*
* 爬虫插件
*
* 百度 news.baidu.com
* 微博PC weibo.com
* */




import $ from 'jquery';
import WeiboList from './weibo/weiboList';
import WeiboUser from './weibo/weiboUser';


let uri=window.location;
let host=uri.host.toLowerCase();

//微博用户
var weiboUserPattern=/http:\/\/m\.weibo\.cn\/u\d*/;
//微博正文
var weiboMainPattern=/http:\/\/m\.weibo\.cn\/\d*\/\d*/;
//微博列表
var weiboListPattern=/http:\/\/m\.weibo\.cn\/page\/.*PROFILE_WEIBO.*/;
//微博关注列表
var weiboViewsListPattern=/http:\/\/m\.weibo\.cn\/page\/.*FOLLOWERS$/;
//微博粉丝列表
var weiboFansListPattern=/http:\/\/m\.weibo\.cn\/page\/.*FANS$/;










window.onload=function(){

    var type='WEIBOUSER';


    if(host==='m.weibo.cn'){

        if(weiboUserPattern.test(uri)){
            type='WEIBOUSER';
        }

        if(weiboMainPattern.test(uri)){
            type='WEIBOCONTENT';
        }

        if(weiboListPattern.test(uri)){
            type='WEIBOLIST';
        }

        if(weiboViewsListPattern.test(uri)){
            type='WEIBOVIEWS';
        }

        if( weiboFansListPattern.test(uri)){
            type='WEIBOFANS';
        }


            switch (type){
               case 'WEIBOUSER':
                   var weiboUser=new WeiboUser();
                    break;
               case 'WEIBOCONTENT':
                    ;
                    break;
               case 'WEIBOLIST':
                   var weiboList=new WeiboList();
                    break;
               case 'WEIBOVIEWS':
                    ;
                    break;
               case 'WEIBOFANS':
                    ;
                    break;
                default:
                    ;

            }



    }











}


