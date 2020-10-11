//declare the required modules of electron and node
const electron = require('electron');
const path = require('path');
const fs = require('fs');
const remote = require('electron');
//console.log(remote);
const dialog1 = require('electron').remote.dialog; 
//console.log(dialog1);

//save all HTML elements in variables
const hostname = document.getElementById('hostname');
const domainname = document.getElementById('domainname');
const ipmiip = document.getElementById('ipmiip');
const ipmidg = document.getElementById('ipmidg');
const mgmtip = document.getElementById('mgmtip');
const mgmtdg = document.getElementById('mgmtdg');
const rep1ip = document.getElementById('rep1ip');
const rep1dg = document.getElementById('rep1dg');
const ts = document.getElementById('ts');
const dns = document.getElementById('dns');
const email = document.getElementById('email');
const userid = document.getElementById('userid');
const license = document.getElementById('license');
const eula = document.getElementById('enduserlicense');
const copilot = document.getElementById('copilot');
const cloudsight = document.getElementById('cloudsight');
const startconfig = document.getElementById('startconfig');

//if button clicked, start
startconfig.addEventListener('click', start);

//if validation is passed, save dialog will open
//if not nothing will happen in this function, but the other functions will alter the UI
function start(){
    if (startValidation()){
        var filetext = createConfig();
        dialog1.showSaveDialog({
            title: 'Select place to save',
            defaultPath: 'config.toml',
            buttonLabel: 'Save',
            properties:[]
        }).then(file => {
            fs.writeFile(file.filePath.toString(),
                filetext , function (err) {
                    if (err) throw err;
                });
    
        }).catch(err => {
            console.log(err)
        });
    }
    else {}
}

//goes through all elements, that need validations and returns true or false in the end
//if an invalid values is found, it will alter the UI
function startValidation(){
    var inputCorrect = true;
    //console.log("start validation");
    if (validateMultipleIP(dns.value)){}
    else {
        inputCorrect = false;
        //change UI
        //"Please enter one or more valid IPv4 addresses!"
    }
    if (validateCIDR(mgmtip.value)){}
    else {
        inputCorrect = false;
        //change UI
        //"Please enter one valid IPv4 address in CIDR notation!"
    }
    if (validateIP(mgmtdg.value)){}
    else {
        inputCorrect = false;
        //change UI
        //"Please enter one valid IPv4 address!"
    }
    if (validateCIDR(ipmiip.value)){}
    else {
        inputCorrect = false;
        //change UI
        //"Please enter one valid IPv4 address in CIDR notation!"
    }
    if (validateIP(ipmidg.value)){}
    else {
        inputCorrect = false;
        //change UI
        //"Please enter one valid IPv4 address!"
    }
    if (validateCIDR(rep1ip.value)){}
    else {
        inputCorrect = false;
        //change UI
        //"Please enter one valid IPv4 address in CIDR notation!"
    }
    if (validateIP(rep1dg.value)){}
    else {
        inputCorrect = false;
        //change UI
        //"Please enter one valid IPv4 address!"
    }
    if(countTimeserver(ts.value)){}
    else {
        inputCorrect = false;
        //change UI
        //"Please provide at least threee time servers!"
    }
    if(validateMultipleEmails(email.value)){}
    else {
        inputCorrect = false;
        //change UI
        //"Please provide one or more valid email addresses!"
    }
    return inputCorrect;
}

//checks if at least 3 timeservers are given
function countTimeserver(servers){
    var count = servers.split(",");
    if(count.length >= 3){
        return true;
    }
    else{
        return false;
    }
}

//checks for a valid IPv4 with CIDR notation
function validateCIDR(ip){
    var parts = ip.split("/");
    if (parts.length == 2) {
        if (parts[1] >= 1 && parts[1] <= 30) {
            return validateIP(parts[0]);
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
}

//splits inputs with multiple IPs (dns)
//and validates them
function validateMultipleIP(ipaddresses){
    var ips = ipaddresses.split(",");
    var i;
    for(i=0;i<ips.length;i++){
        if(validateIP(ips[i])){}
        else {
            return false;
        }
    }
    return true;
}

//checks for a valid IPv4
function validateIP(ip){
    var ipparts = ip.split(".");
    if (ipparts.length == 4) {
        var i;
        for (i=0; i<4; i++){
            if(ipparts[i] <= 255 && ipparts[i] >= 0) {}
            else {
                return false;
            }
        }
    }
    else {
        return false;
    }
    return true;
}

//splits validates emails
function validateMultipleEmails(emails){
    var mails = emails.split(",");
    var i;
    for(i=0;i<mails.length;i++){
        if(validateEmail(mails[i])){}
        else {
            return false;
        }
    }
    return true;
}

//checks for a valid emailaddress
function validateEmail(email){
    var atpos = email.indexOf("@");
    var dotpos = email.lastIndexOf(".");
    if (atpos != -1 && dotpos != -1){
        if (dotpos > atpos){
            return true;
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
}

//creates the string to write in configuration file
//one line of code for one line in the file for better editing
function createConfig(){
    var config = "[spu]\n";
    config += "hostname = \""+hostname.value+"\"\n";
    config += "domainname = \""+domainname.value+"\"\n";
    config += "fqnd = \""+hostname.value+"."+domainname.value+".\"\n";
    config += "[ipmi]\n";
    config += "address = \""+ipmiip.value+"\"\n";
    config += "gateway = \""+ipmidg.value+"\"\n";
    config += "[mgmt]\n";
    config += "address = \""+mgmtip.value+"\"\n";
    config += "gateway = \""+mgmtdg.value+"\"\n";
    config += "dns = "+splitAndMerge(dns.value)+"\n";
    config += "timeservers = "+splitAndMerge(ts.value)+"\n";
    config += "[rep1]\n";
    config += "address = \""+rep1ip.value+"\"\n";
    config += "gateway = \""+rep1dg.value+"\"\n";
    config += "[userinformation]\n";
    config += "userid = \""+userid.value+"\"\n";
    config += "emails = "+splitAndMerge(email.value)+"\n";
    config += "license = \""+license.value+"\"\n";
    config += "eula = \""+eula.value+"\"\n";
    config += "[features]\n";
    config += "copilot = \""+copilot.value+"\"\n";
    config += "cloudsight = \""+cloudsight.value+"\"\n";

    return config;
}

//splits fields with multiple entries and merges them to fit in the
//configuration file
//test@storvix.com,storvix@test.com -> ["test@strovix.com","storvix@test.com"]
function splitAndMerge(text){
    var help = text.split(",");
    var mergedText = "[\""+help[0]+"\"";
    var i;
    for (i=1; i < help.length; i++){
        mergedText += ",\""+help[i]+"\"";
    }
    mergedText += "]";
    return mergedText;
}

//not used functions////////////////////////////////////////////////////////

function comparePasswords(pw1, pw2){
    if (pw1 === pw2){
        return true;
    }
    else {
        return false;
    }
}

//creates a subnetmask from an ip with cidr notation
function createSubnetmask(ip){
   help = ip.split("/");
   var fullBytes = Math.trunc(help[1]/8);
   var remainingBit = help[1]%8;
   var subnet = "";
   var i;
   for(i=0;i<fullBytes;i++){
       subnet += "255.";
   }
   if(fullBytes==3){
       return subnet+getIPParts(remainingBit);
   }
   if(fullBytes==2){
       return subnet+getIPParts(remainingBit)+".0";
   }
   if(fullBytes==1){
       return subnet+getIPParts(remainingBit)+".0.0";
   }
   if(fullBytes==0){
       return subnet+getIPParts(remainingBit)+".0.0.0";
   } 
}

//used in the createSubnetmask function
//returns the sum of bits in decimal
function getIPParts(bits){
    if(bits==1){return 128;}
    if(bits==2){return 192;}
    if(bits==3){return 224;}
    if(bits==4){return 240;}
    if(bits==5){return 248;}
    if(bits==6){return 252;}
    if(bits==7){return 254;}
    if(bits==0){return 0;}
}

