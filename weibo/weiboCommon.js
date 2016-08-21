/**
 * Created by zhichaoshen on 2016/8/8.
 */


import  $ from 'jquery';




export function checkExistUser(uid){
    return $.ajax({
        url:`http://127.0.0.1:3000/weibo/checkuser/${uid}`,
        type:'GET',
        dataType:'json'
    });
}




export function checkExistWeibo(uid,bid){
   return  $.ajax({
        url:`http://127.0.0.1:3000/weibo/checkweibo/${uid}/${bid}`,
        type:'GET',
        dataType:'json'
    })
}