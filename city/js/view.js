//// ::VIEW:: ////
// Input 텍스트, 체크박스 항목 등과 같은 사용자 인터페이스 요소를 나타낸다.
// 데이터 및 객체의 입력 그리고 보여주는 출력을 담당
// 데이터를 기반으로 사용자들이 볼 수 있는 화면

// 모델이 가지고 있는 정보를 따로 저장해서는 안된다.
// 모델이나 컨트롤러와 같이 다른 구성 요소들을 몰라야 한다.
// 뷰는 데이터를 받으면 화면에 표시해주는 역할을 가진다.
// 변경이 일어나면 변경 통지에 대한 처리 방법을 구현해야 한다.
// 재사용 가능하게끔 설계를 해야 하며 다른 정보들을 표현할 때 쉽게 설계를 해야 한다.


function hideFront() {
	document.getElementById('front').style.display = 'none';
}
function showFront() {
	document.getElementById('front').style.display = 'block';
}

function hideBack() {
	document.getElementById('back').style.display = 'none';
}
function showBack() {
	document.getElementById('back').style.display = 'block';
}

function hideStart() {
	hideBack();
	document.getElementById('start').style.display = 'none';
}
function showStart() {
	showBack();
	document.getElementById('start').style.display = 'block';
}

function hideEnd() {
	hideBack();
	document.getElementById('end').style.display = 'none';
}
function showEnd() {
	showBack();
	document.getElementById('end').style.display = 'block';
}

function setCityName(name) {
	document.getElementById('cityName').value = name;
}
function getCityName() {
	return document.getElementById('cityName').value;
}

function setWidth(n) {
	document.getElementById('width').value = n;
}
function setHeight(n) {
	document.getElementById('height').value = n;
}
function getWidth() {
	return document.getElementById('width').value;
}
function getHeight() {
	return document.getElementById('height').value;
}

function setSize(w,h) {
	setWidth(w);
	setHeight(h);
}
function getSize() {
	return {
		w: getWidth(), h: getHeight()
	};
}



// 게임에서 두가지 보드가 사용되는데, 
// 한 보드는 건물이나 도로, 강, 다리, 숲 등 어떤 건물이 배치되느냐에 따라 아이템 값이 달라진다.
// 또 다른 보드는 z-index를 위한 것으로, NW->SE 방향으로 증가하는 슬래시 맵을 형성한다.


// z-index를 사용하기 위한 것인데, 이미지를 사용하면 상대적으로 적은 수의 z-index는 맨 뒤로 가게 된다.
function displaySetZ_Board() {
	var fs = zBoard.getFrameSize();
	for (var y = 0; y < fs.y; y++) {
		for (var x = 0; x < fs.x; x++) {
			var item = zBoard.getItem(x,y);
			console.log(x,y,item);
			
			var ix = fitToNumUnit(x,2);
			var iy = fitToNumUnit(y,2);
			var id = 'c'+ix+iy;
			console.log(ix,iy,id);
			
			// 아이디에 스타일을 지정하여 z값을 배치한다.
			document.getElementById(id).style.zIndex = item;
		}
	}
}










// 맵을 보여준다.
function showMap(w,h) {
	if (w * h <= 10000)	document.getElementById('content').innerHTML = makeUpMap(w,h);	// 셀맵을 띄운다.
}

// 맵을 만들어 디스플레이에 띄울 수 있도록 한다.
function makeUpMap(w,h) {
	var code = '<div class="cell-map" id="map">';
	for (var j = 0; j < h; j++) {
		code += '<div class="cell-row">';
		for (var i = 0; i < w; i++) {
			var x = fitToNumUnit(i, 2);
			var y = fitToNumUnit(j, 2);
//			var item = 'gs';
			var item = 'gp';
			code += '<div class="cell"><div class="cell-tile">'
//			code += '<img src="image/item/'+ item +'.png" id="c'+ x + y +'"></div></div>';
			code += '' + item +' : '+ x + y +'</div></div>';
		}
		code += '</div>';
	}
	code += '</div>';
	return code;
}

function fitToNumUnit(i, n) {
	var str = "0000000000" + i;
	return str.slice(-n);
}

// 문제가 발생했다. 투명한 영역을 하나의 이미지로 처리되는 문제로, PNG를 SVG로 대체 시도했으나 실패했다. 새로운 방안을 찾아라.
// <img>로 SVG를 가져오지 말고 직접 SVG를 이식하고 필요할 때마다 그 SVG를 교체하면 되지 않을까?
// ㅅㅂ svg를 띄우면 되긴 되는데 지하로 내려간다 해결 불능인듯

function changeSite(x,y,d) {
	var ix = fitToNumUnit(x, 2);
	var iy = fitToNumUnit(y, 2);
	var id = 'c' + ix + iy;
	
	document.getElementById(id).src = 'image/item/'+d+'.png';
}









