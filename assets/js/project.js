var full_text_array = []
var full_text = "";
var text_file_all_text = [];
var page_num = 0;
var selected_text = "";
var training_datas = [];
var training_data = {};
var entities = [];
var entities_values = [];
var json;
var class_names = [];
var decalage = 0;
var indextable = new Array();
function l(message){
	console.log(message);
}
function getRandomColor() {
  var color = 'rgb(';
	for (var x = 0; x < 2; x++) {
		color += Math.floor(Math.random() * 4) + 6;
	  color += Math.floor(Math.random() * 10);
		color+= ",";
	}
	color += Math.floor(Math.random() * 4) + 6;
  color += Math.floor(Math.random() * 10);
	color+= ")";
	l(color);
  return color;
}
function myFunction(){
	setTimeout(function() {
		$("#editor").html($("#editor").text());
	}, 0);
	// alert();
}
function getCorrectedText(){
	if($(".gsc-results.gsc-webResult").children().length > 3){
		corrected_text = $(".gs-spelling a").first().text();
		l(corrected_text)
	}
}
function getFilename(myFile){
	if(myFile.files.length > 0){
		var file = myFile.files[0];
	   	var filename = file.name;
	   	$(".custom-file-label").text(filename);
	   	l(filename);
   }
   else{
   		$(".custom-file-label").text('Choose file...');
   }
}
function onPaste(e){
  e.preventDefault();

  if( e.clipboardData ){
    full_text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, full_text);
    l(full_text);
    return false;
  }
  else if( window.clipboardData ){
    full_text = window.clipboardData.getData('Text');
    l(full_text);
    if (window.getSelection)
      window.getSelection().getRangeAt(0).insertNode( document.createTextNode(full_text) );
  }
}
// document.querySelector('[contenteditable]').addEventListener('paste', onPaste);
function setEntityOutput(value,color,idtable){
	l(value,color);
	$("#entity").append('<div class="entityval" id="' + idtable + '"><div style="background-color:'+color+'">'+value+'</div></div>');
}
function clearSelection()
{
 if (window.getSelection) {window.getSelection().removeAllRanges();}
 else if (document.selection) {document.selection.empty();}
}
$(document).ready(function(){
	l('ok');
	$("#edit").hide();
	$('textarea').attr('readonly',false);
	$("#fileUpload").click()

	// var cx = '011558942542564350974:nldba-ydc7g'; // Insert your own Custom Search engine ID here
	// var gcse = document.createElement('script');
	// gcse.type = 'text/javascript';
	// gcse.async = true;
	// gcse.src = 'https://cse.google.com/cse.js?cx=' + cx;
	// var s = document.getElementsByTagName('script')[0];
	// s.parentNode.insertBefore(gcse, s);


	// var inputText = prompt('Please enter the training dataset(filename.txt)');
	// l("MANI"+inputText+"vannan");
	// if((inputText != null) && (inputText.length > 0)){
	// 	l(inputText);
	// 	var rawFile = new XMLHttpRequest();
	//     rawFile.open("GET", inputText, false);
	//     rawFile.onreadystatechange = function ()
	//     {
	//         if(rawFile.readyState === 4)
	//         {
	//             if(rawFile.status === 200 || rawFile.status == 0)
	//             {
	//                 text_file_all_text = rawFile.responseText.split('\n');
	//                 l('success');
	//     			l(text_file_all_text);
	//     			$('#editor').text(text_file_all_text[page_num]);
	//     			setTimeout(function(){
	//     				$("#gsc-i-id1.gsc-input").val(text_file_all_text[page_num]);
	//     				$(".gsc-search-button").click();
	//     			}, 500);
	//     			// $("#gsc-i-id1.gsc-input").val(text_file_all_text[page_num]);
	//             }
	//             else{
	//             	alert(inputText+" doest not exist");
	//             }
	//         }
	//     }
	//     rawFile.send(null);
	// }
});
$("#save").click(function(){
	full_text = $("#editor").text();
	if(full_text != $("#gsc-i-id1").val()){
		$("#gsc-i-id1.gsc-input").val(full_text);
	    $(".gsc-search-button").click();
	}
	$("#editor").attr('contenteditable',false);
	$("#save").hide();
	$("#edit").show();
});
$("#edit").click(function(){
	$("#editor").attr('contenteditable',true);
	$("#edit").hide();
	$("#save").show();
});
$("#addclass").click(function(){
	classname = $('input').val();
	if(class_names.indexOf(classname) != -1){
		alert("Class names is already saved");
		$('input').val("");
		return;
	}
	class_names.push(classname);
	classname2 = classname.replace(" ","_");
	//classname2 = classname.split(' ').join('_');
	$(".classes").append('<div class="row pdn"><div class="col-9"><button class="class" id="'+classname2+'" style="background-color:'+getRandomColor()+'"><span>'+classname+'</span></button></div><div class="col-3"><button class="btn pull-right delete_btn"><i class="fa fa-trash"></i></button></div></div>')
	$('input').val("");
});
$("input").keypress(function(e){
	var key = e.which;
	if(key == 13){
		$("#addclass").click();
		return false;
	}
});
$( ".classes" ).on("click",".class",function(){
	entity = [];
	if($("#editor").attr('contenteditable') == 'true'){
		alert("Please save the content");
		return;
	}
	selection = window.getSelection();
	selected_text = selection.toString();
	if(selected_text == ""){
		alert("Please select atleast one entity");
		return;
	}
	iniidx = full_text.indexOf(selected_text);
	lgth = selected_text.length;
	if(iniidx == -1){
		alert("Please select entity inside the content");
		return;
	}
	entities.push([iniidx,(iniidx+lgth),$(this).text()]);
	// alert(window.getSelection().toString());
	l(selected_text)
	l($(this).text());
	color_rgb = $(this).css('background-color');
	$("#editor").attr('contenteditable',true);
	if (selection.rangeCount && selection.getRangeAt) {
	    range = selection.getRangeAt(0);
	}
	// Set design mode to on
	document.designMode = "on";
	if (range) {
	  selection.removeAllRanges();
	  selection.addRange(range);
	}
	// Colorize text
	document.execCommand("BackColor", false, color_rgb);
	// Set design mode to off
	document.designMode = "off";
	entities_values.push(selected_text);
	entities_values.push(color_rgb);

	//à modifier
	//########################################################
	var tag_string1 = '<span style="background-color: ' + color_rgb + ';">';
	var tag_string2 = selected_text + '</span>';
	index1 = $("#editor").html().indexOf(selected_text) - tag_string1.length;
	index2 = $("#editor").html().indexOf(selected_text) + tag_string2.length;
	//########################################################
	indextable.push(index1 + "," + index2);
	var tag_string = '<span style="background-color: ' + color_rgb + ';">' + selected_text + '</span>';
	for (var i = 0; i < indextable.length; i++) {
		if (indextable[i].slice(0,indextable[i].indexOf(",")) > index1) {
			indextable[i] = indextable[i].slice(0,indextable[i].indexOf(",")) + "," + indextable[i].slice(indextable[i].indexOf(",") + 1  + tag_string.length,indextable[i].length) + tag_string.length;
		}
	}
	idtable = indextable.length - 1;
	setEntityOutput(selected_text,color_rgb,idtable);
	selected_text = "";
	$("#editor").attr('contenteditable',false);
	clearSelection();
});
$( "#entity" ).on("dblclick",".entityval",function(){
	var delete_text = $(this).text();
	var e_v_idx = entities_values.indexOf(delete_text);
	var color_txt = entities_values[e_v_idx+1];
	l(indextable);
	index1 = indextable[this.id].slice(0,indextable[this.id].indexOf(","));
	l("index1:" + index1);
	index2 = indextable[this.id].slice((indextable[this.id].indexOf(",") + 1),indextable[this.id].length);
	l("index2:" + index2);
	var textearly = $("#editor").html().slice(0,index1);
	l("early:" + textearly);
	var textend = $("#editor").html().slice(index2,$("#editor").html().length);
	l("end:" + textend);
	//$("#editor").html($("#editor").html().split(tag_string).join(delete_text));
	$("#editor").html(textearly + delete_text + textend);

	entities_values.splice(e_v_idx,1);
	entities_values.splice(e_v_idx,1);
	en_del_idx = full_text.indexOf(delete_text);
	en_len_cnt = en_del_idx+delete_text.length;
	del_idx = -1;
	$.each(entities,function(idx,val){
		if((en_del_idx == val[0]) && (en_len_cnt == val[1])){
			del_idx = idx;
		}
	});
	if(del_idx != -1){
		entities.splice(del_idx,1);
	}
	$(this).remove();
});
$("#previous").click(function(){
	training_data = {};
	training_data['content'] = full_text;
	training_data['entities'] = entities;
	training_datas.push(training_data);
	page_num--;
	entities = [];
	full_text = "";
	$("#editor").text("");
	$("#editor").attr('contenteditable',true);
	$("#save").show();
	$("#edit").hide();
	$("#entity").empty();
	if(page_num > -1){
		$('#editor').text(text_file_all_text[page_num]);
		$("#gsc-i-id1.gsc-input").val(text_file_all_text[page_num]);
		$(".gsc-search-button").click();
		for (var i = 0; i < json[page_num].entities.length; i++) {
			addentities(json[page_num].entities[i][0],json[page_num].entities[i][1],json[page_num].entities[i][2]);
		}
		$("#save").click();
	}
});
$("#next").click(function(){
	if(entities.length == 0){
		alert("Please select atleast one entity");
		return;
	}
	training_data = {};
	training_data['content'] = full_text;
	training_data['entities'] = entities;
	training_datas.push(training_data);
	page_num++;
	entities = [];
	full_text = "";
	$("#editor").text("");
	$("#editor").attr('contenteditable',true);
	$("#save").show();
	$("#edit").hide();
	$("#entity").empty();
	if(page_num < text_file_all_text.length){
		$('#editor').text(text_file_all_text[page_num]);
		$("#gsc-i-id1.gsc-input").val(text_file_all_text[page_num]);
		$(".gsc-search-button").click();
		for (var i = 0; i < json[page_num].entities.length; i++) {
			addentities(json[page_num].entities[i][0],json[page_num].entities[i][1],json[page_num].entities[i][2]);
		}
		$("#save").click();
	}
});
$("#complete").click(function(){
	training_data = {};
	training_data['content'] = full_text;
	training_data['entities'] = entities;
	training_datas.push(training_data);
	if ('Blob' in window) {
		var fileName = prompt('Please enter file name to save with(.json)', 'Untitled.json');
		if(fileName != null){
			l(fileName);
			var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(training_datas));
			var dlAnchorElem = document.createElement('a');
			dlAnchorElem.setAttribute("href",     dataStr     );
			dlAnchorElem.setAttribute("download", fileName);
			dlAnchorElem.click();
			training_datas = []
			page_num = 0;
			entities = [];
			full_text = "";
			$("#editor").text("");
			$("#editor").attr('contenteditable',true);
			$("#save").show();
			$("#edit").hide();
			$("#entity").empty();
		}
	}
	else{
		alert('Your browser does not support the HTML5 Blob.');
	}

});
$( ".classes" ).on("click",".delete_btn",function(){
	if(confirm("Are you sure want to delete entity name?")){
		l('deleted');
		tt = $('.delete_btn').parent().parent().text();
		class_names.splice(class_names.indexOf(tt),1);
		$(this).parent().parent().remove();
	}
});
function addentities(index1,index2,classe){
	entity = [];
	//document.setSelection();
	//selection = window.getSelection();
	//selected_text = selection.toString();
	selected_text = text_file_all_text[page_num].slice(index1,index2);
	entities.push([index1,index2,classe]);
	// alert(window.getSelection().toString());
	l(selected_text)
	l(classe);
	classe2 = classe.replace(" ","_");
	//classe2 = classe.split(' ').join('_');
	color_rgb = $( "#" + classe2 ).css('background-color');
	$("#editor").attr('contenteditable',true);
	// Colorize text
	//l("text:" + $("#editor").html());
	//if (selection.rangeCount && selection.getRangeAt) {
	//    range = selection.getRangeAt(0);
	//}
	// Set design mode to on
	//document.designMode = "on";
	//if (range) {
	//  selection.removeAllRanges();
	//  selection.addRange(range);
	//}
	// Colorize text
	//document.execCommand("BackColor", false, color_rgb);
	// Set design mode to off
	//document.designMode = "off";

	entities_values.push(selected_text);
	entities_values.push(color_rgb);
	var number = 0;
	var tag_string = '<span style="background-color: ' + color_rgb + ';">' + selected_text + '</span>';
	for (var i = 0; i < indextable.length; i++) {
		if (indextable[i].slice(0,indextable[i].indexOf(",")) < index1) {
			number ++;
		}
	}
	index1 += ((tag_string.length - selected_text.length)* number);
	index2 += ((tag_string.length - selected_text.length)* number);

	var textearly = $("#editor").html().slice(0,(index1));
	l("early:"+textearly);
	var textend = $("#editor").html().slice((index2),$("#editor").html().length);
	l("end:"+textend);
	//$("#editor").html($("#editor").html().split(selected_text).join(tag_string));
	$("#editor").html(textearly + tag_string + textend);
	index2 += tag_string.length - selected_text.length;
	indextable.push(index1 + "," + index2);
	for (var i = 0; i < indextable.length; i++) {
		if (indextable[i].slice(0,indextable[i].indexOf(",")) > index1) {
			indextable[i] = indextable[i].slice(0,indextable[i].indexOf(",")) + tag_string.length + "," + indextable[i].slice((indextable[i].indexOf(",") + 1),indextable[i].length) + tag_string.length;
		}
	}
	idtable = indextable.length - 1;
	setEntityOutput(selected_text,color_rgb,idtable);
	selected_text = "";
	$("#editor").attr('contenteditable',false);
	clearSelection();
}
$("#upload").click(function(){
	l('upload clicked');
	var fileInput = $('#validatedCustomFile');
	var input = fileInput.get(0);
	if(input.files.length > 0){
		var textFile = input.files[0];
		var reader = new FileReader();
		reader.onload = function(e) {
			 json = JSON.parse(e.target.result);
		   // The file's text will be printed here
			  for (var i = 0; i < json.length; i++) {
			 	 	text_file_all_text[i] = json[i].content;
			  }
				var classes = [];
				for (var i = 0; i < json.length; i++) {
					for (var k = 0; k < json[i].entities.length; k++) {
						if (classes.length === 0) {
							classname = json[i].entities[k][2];
							classes.push(json[i].entities[k][2]);
							class_names.push(classname);
							$(".classes").append('<div class="row pdn"><div class="col-9"><button class="class" id="'+classname+'" style="background-color:'+getRandomColor()+'"><span>'+classname+'</span></button></div><div class="col-3"><button class="btn pull-right delete_btn"><i class="fa fa-trash"></i></button></div></div>')
				  	}
						var addtoclasses = true;
						for (var l = 0; l < classes.length; l++) {
							if (json[i].entities[k][2] == classes[l]) {
								addtoclasses = false;
							}
						}
						if (addtoclasses == true) {
							classes.push(json[i].entities[k][2]);
							classname = json[i].entities[k][2];
							class_names.push(classname);
							$(".classes").append('<div class="row pdn"><div class="col-9"><button class="class" id="'+classname+'" style="background-color:'+getRandomColor()+'"><span>'+classname+'</span></button></div><div class="col-3"><button class="btn pull-right delete_btn"><i class="fa fa-trash"></i></button></div></div>')
						}
					}
				}
		    $('#editor').text(text_file_all_text[page_num]);
	    	$("#gsc-i-id1.gsc-input").val(text_file_all_text[page_num]);
	    	$(".gsc-search-button").click();
				for (var i = 0; i < json[page_num].entities.length; i++) {
					addentities(json[page_num].entities[i][0],json[page_num].entities[i][1],json[page_num].entities[i][2]);
				}
				$("#save").click();
		};
		reader.readAsText(textFile);
	}
});
