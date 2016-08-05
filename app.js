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
import {WeiboSearch,WeiboList,WeiboDetails} from './weibo/weibo';


let uri=window.location;
let host=uri.host.toLowerCase();

window.onload=function(){

    var weiboList=new WeiboList();

}


