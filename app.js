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
var weiboListPattern=/http:\/\/m\.weibo\.cn\/page\/.*/;






window.onload=function(){
    // var weiboList=new WeiboList();
    var weiboUser=new WeiboUser();






}


