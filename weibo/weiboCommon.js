/**
 * Created by zhichaoshen on 2016/8/8.
 */


import  $ from 'jquery';




export function checkExistUser(uid,success){
    $.ajax({
        url:`http://192.168.0.236:3000/weibo/checkuser/${uid}`,
        type:'GET',
        dataType:'json',
        success:success,
        error:(err)=>{
            console.log(err);
        }
    });
}