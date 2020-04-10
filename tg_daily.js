const axios = require('axios');
const Bluebird = require('bluebird');
const { TG_BOT_TOKEN, TG_ID, targets, except } = require("./const");

const sendMessage = async (messageText) => {
  return await axios({
    method: 'post',
    url: `https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`,
    data: { chat_id: `${TG_ID}`, text: messageText }
    })
}

const checkIP = async (url) => {
  return axios({
    method: 'post',
    url: `https://www.toolsdaquan.com/toolapi/public/ipchecking/${url}/443`,
    headers: {
      "Content-Type": "application/json",
      "Referer": "www.toolsdaquan.com"
    }
  })
}

const main = async () => {
  const successResult = [];
  const failedResult = [];
  // check server avalibilty
  for(let target in targets){
    let res = await checkIP(target).then(x => x.data);
    let message = { server: targets[target], icmp: res.icmp === 'success'? true:false, tcp: res.tcp === 'success'? true:false};
    message.icmp && message.tcp? successResult.push(message):failedResult.push(message);
  }

  // generate report
  let report = '';

  if(successResult.length){
    report += '⭕️正常服務器\xa0(icmp\xa0tcp)\n';
    for(let [index,result] of successResult.entries()){
      report += result.server+(result.icmp?'\xa0✅':'\xa0⛔️')+(result.tcp?'\xa0✅':'\xa0⛔️');
      if(index < successResult.length -1) report += '\n';
    }
  }

  if(failedResult.length){
    if(successResult.length) report += '\n\n';
    report += '❌異常服務器\xa0(icmp\xa0tcp)\n';
    for(let [index,result] of failedResult.entries()){
      report += result.server+(result.icmp?'\xa0✅':'\xa0⛔️')+(result.tcp?'\xa0✅':'\xa0⛔️');
      if(index < failedResult.length -1) report += '\n';
    }
  }

  if(successResult.length || failedResult.length){
    report += '\n\n';
    const success = successResult.filter( x => !except.includes(x.server) ).length;
    const failed = failedResult.filter( x => !except.includes(x.server) ).length;
    report += `健康:\xa0${success}\xa0異常:\xa0${failed}\n`;
    report += `健康率(不含CF):\xa0${success}\xa0\/\xa0${success+failed}\xa0(\xa0${Math.round((success/(success+failed))*10000)/100}\%\xa0)`;
  }else {
    report += '今日無任何檢查結果';
  }

  if(failedResult.filter(x => !x.icmp && !x.tcp).length){
    const unHealth = failedResult.filter(x => !x.icmp && !x.tcp).map(x => x.server).join('、')
    // mesaage sent last will appear on the top of telegram preview field
    Bluebird.join([sendMessage(report), sendMessage(`可能被牆：${unHealth}`)]);
  }else{
    sendMessage(report)
  }
}

main();
