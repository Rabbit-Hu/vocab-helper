dictionary = [];
detailedAnswer = [];
isMarked = [];
characterMode = "kana" // kana（假名） or kanji（汉字）
currentPage = 0;
problem = "没有更多题了！"
answer = "没有更多题了！"
hintVisible = false;

changeDict = function(){
    dictName = document.getElementById("currentDict").value;
    if(!isNaN(parseInt(dictName))){
        dictionaryPath = "dict/XSJ" + dictName + ".txt";
        getServerDict(dictionaryPath);
    }
    else{
        loadDictionary(document.getElementById("userDict").value);
    }
    document.getElementById('userDict').style.display='none';
}
getServerDict = function(path){
    var xmlhttp;
	if (window.XMLHttpRequest){
		//IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
		xmlhttp = new XMLHttpRequest();
	}
	else{
		//IE6, IE5 浏览器执行代码
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange = function(){
		if (xmlhttp.readyState == 4){
            console.log("Successfully got response text:\n" + xmlhttp.responseText);
            loadDictionary(xmlhttp.responseText);
		}
	}
	xmlhttp.open("GET", path, true);
	xmlhttp.send();
}
loadDictionary = function(str){
    dictionary = str.split('\n');
    for(i = 0; i < dictionary.length; i++){
        dictionary[i] = dictionary[i].split('|');
    }
    for(i = dictionary.length - 1; i >=0 ; i--)
        if(dictionary[i].length < 2)
            dictionary.splice(i, 1);
    isMarked = Array(dictionary.length).fill(0);
    loadProblem(0);
    loadMarkList();
    document.getElementById("totalPages").innerHTML = "/" + dictionary.length;
}

loadProblem = function(index){
    currentPage = index;
    if(index >= 0 && index < dictionary.length){
        document.getElementById("currentPage").value = currentPage + 1;
        problem = dictionary[index][0];
        answerIndex = 1;
        if(characterMode == "kanji" && dictionary[index].length > 2){
            answerIndex = 2;
        }
        answer = dictionary[index][answerIndex];
        document.getElementById("trueAnswer").innerHTML = dictionary[index][1] + (dictionary[index].length > 2 ? "（" + dictionary[index][2] + "）": "");
        if(index == currentPage) document.getElementById("markOrUnmark").innerHTML = isMarked[currentPage] ? "取消": "收藏";
    }
    document.getElementById("problem").innerHTML = problem;
    document.getElementById("trueProblem").innerHTML = problem;
    document.getElementById("answer").value = "";
    document.getElementById("judge").innerHTML = "🤔";
    hintVisible = 0;
    refreshHintStatus();
}

nextProblem = function(){
    loadProblem((currentPage + 1) % dictionary.length);
}
prevProblem = function(){
    loadProblem((currentPage + dictionary.length - 1) % dictionary.length);
}
jumpProblem = function(){
    loadProblem(parseInt(document.getElementById("currentPage").value - 1));
}

refreshHintStatus = function(){
    document.getElementById("trueAnswerContainer").style.display = hintVisible ? "block" : "none";
    document.getElementById("mainContainer").style.height = hintVisible ? "300px" : "180px";
    document.getElementById("showHideHint").innerHTML = hintVisible ? "隐藏" : "提示";
}
showHideHint = function(){
    hintVisible = !hintVisible;
    if(hintVisible){
        mark(currentPage);
    }
    refreshHintStatus();
}

checkAnswer = function(){
    answerTextbox = document.getElementById("answer");
    console.log(answerTextbox.value);
    if(answerTextbox.value == answer){
        document.getElementById("judge").innerHTML = "✅";
        setTimeout(nextProblem, 500);
    }
    else{
        document.getElementById("judge").innerHTML = "❌";
        mark(currentPage);
    }
}

loadMarkList = function(){
    markList = document.getElementById("markList");
    str = '<tr style="background-color: #efefef;"><td width="180">单词</td><td width="80">含义</td><td width="0"><button onclick="unmarkAll()" style="height: 28px;">清除</button></td></tr>'
    for(i = 0; i < dictionary.length; i++){
        if(isMarked[i]){
            detailedAnswer = dictionary[i][1];
            if(dictionary[i].length > 2) detailedAnswer += ' (' + dictionary[i][2] + ')';
            str += '<tr><td>{1}</td><td>{2}</td><td><button onclick="unmark({0})" style="height: 28px; width: 28px">X</button></td></tr>'.format(i, detailedAnswer, dictionary[i][0]);
        }
    }
    markList.innerHTML = str;
}

mark = function(index){
    isMarked[index] = 1;
    if(index == currentPage) document.getElementById("markOrUnmark").innerHTML = isMarked[currentPage] ? "取消": "收藏";
    loadMarkList();
}
unmark = function(index){
    isMarked[index] = 0;
    if(index == currentPage) document.getElementById("markOrUnmark").innerHTML = isMarked[currentPage] ? "取消": "收藏";
    loadMarkList();
}
markOrUnmark = function(){
    isMarked[currentPage] ? unmark(currentPage): mark(currentPage);
    loadMarkList();
}
unmarkAll = function(){
    isMarked = Array(dictionary.length).fill(0);
    document.getElementById("markOrUnmark").innerHTML = isMarked[currentPage] ? "取消": "收藏";
    loadMarkList();
}

exportMarkList = function(){
    str = "";
    for(i = 0; i < dictionary.length; i++){
        if(isMarked[i]){
            str += dictionary[i][0] + '|' + dictionary[i][1];
            if(dictionary[i].length > 2) str += '|' + dictionary[i][2];
            str += '\n';
        }
    }
    document.getElementById("exportedMarkList").innerHTML = str;
    document.getElementById("exportedMarkList").style.display = "";
}

practiceMarkList = function(){
    newDictionary = [];
    for(i = 0; i < dictionary.length; i++){
        if(isMarked[i]){
            newDictionary.push(dictionary[i]);
        }
    }
    dictionary = newDictionary;
    isMarked = Array(dictionary.length).fill(0);
    loadProblem(0);
    loadMarkList();
    document.getElementById("totalPages").innerHTML = "/" + dictionary.length;
}

window.onload = function(){
    changeDict();
}

String.prototype.format = function(args){
    var result = this;
    if (arguments.length < 1){
        return result;
    }
    var data = arguments;
    if (arguments.length == 1 && typeof (args) == "object"){
        data = args;
    }
    for (var key in data){
        var value = data[key];
        if (undefined != value){
            result = result.replace("{" + key + "}", value);
        }
	}
    return result;
}