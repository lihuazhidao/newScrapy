

export  function timeStatistics(time){
    var hour=Math.floor(time/1000/60/60);
    var min=Math.floor((time-hour*1000*60*60)/1000/60);
    var sec=Math.floor((time-hour*1000*60*60-min*1000*60)/1000);
    return `${hour} 小时 ${min} 分钟 ${sec}秒`;
}