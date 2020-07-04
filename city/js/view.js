


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
			var item = 'gp';
			code += '<div class="cell" id="c'+ x + y +'">';
			code += '<div class="cell-tile"><img src="image/item/'+ item +'.png"></div></div>';
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










