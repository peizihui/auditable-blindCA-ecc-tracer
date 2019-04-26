/*
author:rujia
website:www.rujia.uk
version:1.0
date:04/25/2018
ref: https://github.com/oasislabs/secret-ballot/blob/master/app/javascripts/app.js
*/
import "../stylesheets/style.css";
import "../stylesheets/normalize.min.css";

import {default as Web3c} from 'web3c';

import ballot_artifacts from '../../build/contracts/AuditTracer.json'

var web3c, account, AuditTracer, contractAddress;

window.identity_tracing = async function () {
  try {

	let zeta1 = getUrlParameter('zeta1');
	let xiupsilon = getUrlParameter('xiupsilon');
	
	let identity = AuditTracer.methods.identity_calculating(zeta1);
	await  identity.send();
	
	let identity_xiupsilon = await AuditTracer.methods.identity_tracing().call();
	
	$("#credential_xiupsilon").val(identity_xiupsilon)
	
  } catch (err) {
    $("#vote-status-alert").text("Error: " + err);
    console.log(err);
  }
}

window.credential_tracing = async function () {
  try { 

	//let xi = getUrlParameter('xi');
	let upsilon = getUrlParameter('upsilon');
	let zeta1 = getUrlParameter('zeta1');
	let xiupsilon = getUrlParameter('xiupsilon');
	
    
	let credential = AuditTracer.methods.credential_calculating(xiupsilon);
	await  credential.send();
	console.log(credential)
		
    let credential_zeta1 = await AuditTracer.methods.credential_tracing().call();
	console.log(credential_zeta1)
	
	$("#res_zeta_1").val(credential_zeta1)
	
  } catch (err) {
    $("#vote-status-alert").text("Error: " + err);
    console.log(err);
  }
}

window.get_public_key = async function () {
  try {
  
    let public_key = await AuditTracer.methods.get_public_key().call();
	  
	$("#myicon3").removeClass();
	$("#myicon3").addClass("myicon-tick-checked");
	
	contractAddress = $("#sm_addrsss").text();
	
	$("#publickey-status").removeClass();
    $("#publickey-status").addClass("alert alert-success");
    $("#publickey-status").show()
  
  
    $("#myicon5").removeClass();
    $("#myicon5").addClass("myicon-tick-checked");
	
	$("#myicon6").removeClass();
    $("#myicon6").addClass("myicon-tick-checked");
  
    $("#yt").val(public_key)
	$("#issueCred").attr("href","http://127.0.0.1/issuing?pk="+public_key+"&contractAddress="+contractAddress);
	$("#a_issuing").attr("href","http://127.0.0.1/issuing?pk="+public_key+"&contractAddress="+contractAddress);

  } catch (err) {
    $("#register-status").text("Error Deploying: " + err);
	$("#register-status").removeClass();
    $("#register-status").addClass("alert alert-danger");
    console.log(err);
  }
}

window.register = async function () {
  try {

    let _q = getUrlParameter('q');
    let _N = getUrlParameter('N');
    let _g = getUrlParameter('g');
    let _p = getUrlParameter('p');

    let parameters = AuditTracer.methods.register_parameter(_q,_N,_g,_p);
    await  parameters.send();

    $("#register-status").removeClass();
    $("#register-status").addClass("alert alert-success");
    $("#register-status").show()
  
    $("#myicon4").removeClass();
    $("#myicon4").addClass("myicon-tick-checked");
	
  } catch (err) {
    $("#register-status").text("Error Deploying: " + err);
	$("#register-status").removeClass();
    $("#register-status").addClass("alert alert-danger");
    console.log(err);
  }
}

window.deploy = async function() {

  let protoBallot = new web3c.oasis.Contract(ballot_artifacts.abi, undefined, {from: account});
  
  try {
    let deployMethod = protoBallot.deploy({
      data: ballot_artifacts.bytecode,
      arguments: []
    });
    AuditTracer = await deployMethod.send();
	
  } catch(e) {
	$("#compile-status").text("Error Deploying: " + e);
	$("#compile-status").removeClass();
    $("#compile-status").addClass("alert alert-danger");
    return
  }
  
  $("#deploy-status").removeClass();
  $("#deploy-status").addClass("alert alert-success");
  $("#deploy-status").show()
  
  $("#compile-status").removeClass();
  $("#compile-status").addClass("alert alert-success");
  $("#compile-status").show()
  
  $("#myicon3").removeClass();
  $("#myicon3").addClass("myicon-tick-checked");
  
  $("#sm_addrsss").text(AuditTracer.options.address);
  $("#sm_addrsss").attr("href","https://blockexplorer.oasiscloud.io/address/"+AuditTracer.options.address+"/transactions");
  
  $("#sm_code").val(ballot_artifacts.bytecode);
  
  logsubs(AuditTracer.options.address);
 
  // reload to run page that can be shared.
  //let separator;
  //let parms = window.location.search;
  //if (parms) {
   // separator = '&';
  //} else {
   // separator = '?';
  //}
  //if(parms.indexOf("contractAddress") == -1){
  //	  window.location.href += separator + "contractAddress=" + AuditTracer.options.address;
  //}
}

window.runAt = async function(address) {
  console.log("running ballot at ", address);
  AuditTracer = new web3c.oasis.Contract(ballot_artifacts.abi, address, {from: account});
  logsubs(address)
}

window.logsubs = function(address){
  let subscription = web3c.oasis.subscribe('logs', {
	 //fromBlock: 1,
	 //toBlock: "latest",
     address: address
	 //topics: [sha3, topic_1] 
  }, function(error, result){
		if (!error){
			//alert(result.transactionHash)
			if($("#tracelog")){
				var log = "<div class='node'><h3></h3><p> Tracing logs: your tracing activity has been recorded permanently in transaction <input value = '"+result.transactionHash+"'></input> and auditable to every entity. Please check <a href = 'https://blockexplorer.oasiscloud.io/tx/"+result.transactionHash+"/internal_transactions' target='_blank'>here</a> for more detail. <span class='myicon-tick-checked'></span> </p></div>"
				$("#tracelog").append(log)
			}
			console.log(result.transactionHash);
			console.log(result)
		}
  });
  
  //subscription.unsubscribe(function (error, success) {
  //if (success)
  //      console.log('Successfully unsubscribed!');
  //})
}

window.initParam = function(){
	$("#p1").val(getUrlParameter('p'));
	$("#p2").val(getUrlParameter('p'));
	$("#q1").val(getUrlParameter('q'));
	$("#q2").val(getUrlParameter('q'));
	$("#g1").val(getUrlParameter('g'));
	$("#g2").val(getUrlParameter('g'));
	$("#h1").val(getUrlParameter('h'));
	$("#h2").val(getUrlParameter('h'));
	$("#x").val(getUrlParameter('x'));
	$("#y").val(getUrlParameter('y'));
	$("#gamma").val(getUrlParameter('gamma'));	
	$("#xi").val(getUrlParameter('xi'));	 
	$("#z1").val(getUrlParameter('z'));
	$("#z2").val(getUrlParameter('z'));
	$("#N").val(getUrlParameter('N'));
	
	// tracing.html
	if(checkContractAddress()){
		var errdiv = "<div class='alert alert-danger' style='width: 98%'>Please check your smart contract!!! We can not find your smart contract address</div>"
		$("#smhtml").html(errdiv)
	
		$("#traceIden").css("visibility","hidden");
		$("#traceCred").css("visibility","hidden");	
	}else{
		var smddrsss = getUrlParameter('contractAddress')
		var smdiv = "<div class='alert alert-success' style='width: 98%'>Your tracing smart address is deployed at <a href = 'https://blockexplorer.oasiscloud.io/address/"+smddrsss+"/transactions' target = '_blank'>"+smddrsss+"</a></div>"
		$("#smhtml").html(smdiv)
		
		$("#xiupsilon").val(getUrlParameter('xi'))
		$("#zeta_1").val(getUrlParameter('zeta1'))
	}
	
	// get url Param
	
	let param = window.location.search;
	let trace_domain = "http://" + window.location.host;
	if(trace_domain){
		let issue_domain =  trace_domain.substring(0, trace_domain.length-5);
		$("#a_index").attr("href",issue_domain + param);
		$("#a_issuing").attr("href",issue_domain + "/issuing" + param);
		$("#a_verifying").attr("href",issue_domain + "/verifying" + param);
		$("#a_tracing").attr("href",trace_domain + "/tracing.html" + param);
	}

}

window.checkContractAddress = function(){
	return $("#smhtml") && !getUrlParameter('contractAddress')
}


window.getUrlParameter = function(sParam){
  var sPageURL = decodeURIComponent(window.location.search.substring(1)),
      sURLVariables = sPageURL.split('&'),
      sParameterName,
      i;

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=');

    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined ? true : sParameterName[1];
    }
  }
};

window.load = function(){
  console.log("window.ethereum = ", window.ethereum);
  if (getUrlParameter('insecureTestingKeys') === '1') {
    console.warn("Using unsecret key manager signing key");
    web3c = new Web3c(window.ethereum, undefined, {
      // This public key corresponds to an insecure key used for local key manager testing.
      keyManagerPublicKey: '0x9d41a874b80e39a40c9644e964f0e4f967100c91654bfd7666435fe906af060f',
    });
  } else {
    web3c = new Web3c(window.ethereum);
  }
  web3c.eth.getAccounts().then((a) => {
    if (!a.length) {
		
	  $("#check-status").removeClass();
      $("#check-status").addClass("alert alert-danger");
	  $("#check-status").text("Please unlock your wallet, and then reload.");
	  $("#check-status").show()

      return;
    }
    account = a[0];
	$("#success-deploy-status").css('display','block');
    $("#success-deploy-status").text(account);
	
    $("#check-status").removeClass();
    $("#check-status").addClass("alert alert-success");
    $("#check-status").show()
  
    $("#ac_addrsss").text(account);
    $("#ac_addrsss").attr("href","https://blockexplorer.oasiscloud.io/address/"+account);
  
    $("#myicon2").removeClass();
    $("#myicon2").addClass("myicon-tick-checked");

    let contractAddress = getUrlParameter('contractAddress');
	
	if(checkContractAddress()){
		return
	}
		
	if (contractAddress == undefined) {
		deploy();
	}else{
		runAt(contractAddress);
	}
  });
}

window.unlock = function(){
	if (window.ethereum) {
		window.ethereum.enable().then(load).catch((e) => {
		  console.error(e);
		  $("#error-deploy-status").css('display','block');
		  $("#error-deploy-status").text("Error: " + e);
		});
	} else {
		$("#error-deploy-status").css('display','block');
		$("#error-deploy-status").text("Error: Newer version of metamask needed!");
	}
}

$(function(){
	initParam();
	Web3c.Promise.then(unlock);
})

