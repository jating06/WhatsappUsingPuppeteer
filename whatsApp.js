let puppeteer = require("puppeteer");
const readline = require("readline");
let figlet=require("figlet")
let chalk=require("chalk")
let user=process.argv[2]
let fs=require("fs")
if(user==undefined){
  console.log(chalk.red("Please Enter A User And Try Again"))
  process.exit()
}
console.log(chalk.bgBlack.greenBright.bold(figlet.textSync('Whatsapp', {
    font: 'small',
    horizontalLayout: 'full',
    verticalLayout: 'default'
})));
  
const sender=readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "",
  removeHistoryDuplicates: true
});

(async function () {
 
 try{
  let sendFlag=true;
    
  
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      
      '--start-maximized',
     
    ],
    defaultViewport:null,
    userDataDir: "./temp",
  });
     console.log(chalk.yellow.bold("P L E A S E   W A I T"))
    let tabs = await browser.pages();
 
    let tab = tabs[0];
    await tab.goto("http://web.whatsapp.com", { waitUntil: 'networkidle2',
    timeout: 0 });
    
    console.log(chalk.yellow("Scanning Qr Code"))
    console.log(chalk.red("Scan Qr Code If U Are Using This For The first Time"))
    
    
    await tab.waitForNavigation()
    try{
   await tab.type("._3F6QL._3xlwb ._2S1VP.copyable-text.selectable-text",user)
    await tab.waitForSelector("._2EXPL ._25Ooe .matched-text._3FXB1",{timeout:4000})
 let element=   await tab.$("._2EXPL ._25Ooe .matched-text._3FXB1")
await element.click();

    }
    catch(err){
      console.log(chalk.red("User Not Found"))
      process.exit()
    }
    
   
sender.prompt();
sender.on("line",function(data){
sendMessage(data)

})
console.log(chalk.yellow("Type message u want To Send..........."))
async  function sendMessage(data){
  console.log(chalk.yellow("Type message u want To Send..........."))
  await tab.waitForSelector("._3F6QL._2WovP ._2S1VP.copyable-text.selectable-text")
  await tab.type("._3F6QL._2WovP ._2S1VP.copyable-text.selectable-text" ,data)
  await tab.keyboard.press("Enter")

  sender.prompt();
  sendFlag=false;
}
sender.on("close",function(){
  console.log(chalk.bgBlack.red.bold(figlet.textSync('Thanks For Using', {
    font: 'small',
    horizontalLayout: 'full',
    verticalLayout: 'default'
})));
})

let lastReceiverMessage=""

async function receiveMessage(){
message = await tab.evaluate((selector) => {

  let nodes = document.querySelectorAll(selector);
  let el = nodes[nodes.length - 1];

  if (!el) {
    return " ";
  }
  nodes = el.querySelectorAll('span.selectable-text');
  el = nodes[nodes.length - 1];

  return el ? el.innerText :'Media File';

}, "div.message-in");

if(lastReceiverMessage!=message){
  
  lastReceiverMessage=message;
 name= await tab.evaluate(sel=>{
 return document.querySelector(sel).innerText
 },"._3XrHh")
 

 if(sendFlag==false){
   console.log(chalk.white("New message..."))
   
    console.log(chalk.green(name+": "+lastReceiverMessage))
  
 
  console.log(chalk.yellow("Type message u want To Send..........."))
 }
 

}
}


  setInterval(receiveMessage, 1000);



 }
 catch(err){
   console.log(chalk.red("Something Went Wrong"))
   process.exit()
 }

})()