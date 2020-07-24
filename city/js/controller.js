//// ::CONTROLLER:: ////
// 데이터와 사용자 인터페이스 요소들을 잇는 다리 역할
// 사용자가 데이터를 클릭하고 수정하는 것에 대한 이벤트들을 처리하는 부분

// 모델이나 뷰에 대해서 알고 있어야 한다.
// 모델이나 뷰의 변경을 모니터링 해야 한다.
// 애플리케이션의 메인 로직은 컨트롤러가 담당한다.


// 맨 처음 호출되는 함수가 바로 여기에 있다.
function cityInit() {
	console.log('cityInit Start()');
	cityMap = new GridBoardEngine();
	zBoard = new GridBoardEngine();
	cityStart();
	eventListenerSet();
}

// 시티맵이나 zBoard를 전체적 총괄적으로 시작하게 하는 함수
function cityStart() {
	console.log('cityStart()');
	newMap();
	startZ_Board();
	// 맨 끝에는 디스플레이를 구성하는 view.js의 함수를 호출해야 한다.
}

//// 시티의 도로나 빌딩 등 지도 구성을 하는 데이터 보드를 저장하고 관리하는 함수 모음

// 시티의 새로운 맵을 생성
function newMap() {
	cityMap.newBoard(10,10);	// 20 x 20
	cityMap.initAllValues('gs');
	cityMap.setStartIndex(0);
	showMap(10,10);
}

// 맵의 영역 확장에 의해 맵의 크기가 변경될 때 (영토 확장)
function resizeMap(x,y) {
	var process = 0, valid = 0;
	cityMap.resizeFrame({x: x, y: y, process: process, valid: valid});
	resetZ_Board();
}




//// z-index의 값들을 저장하는 보드를 관리하는 함수 모음

// 맵을 새롭게 시작할 때
function startZ_Board() {
	zBoard.newBoard(10,10);
	makeForZBoard();
}

// z-index 배치를 위해 호출할 때
function getZ_Board() {
	return zBoard.getBoard();
}

// z-index를 사용하기 위한 것인데, 이미지를 사용하면 상대적으로 적은 수의 z-index는 맨 뒤로 가게 된다.
function makeForZBoard() {
	var typeNumber = 1;
	var add = 1;
	zBoard.setSlashMap(typeNumber,add);
}

// 영토 확장으로 z-index를 재정비
function resetZ_Board() {
	makeForZBoard();
}



function selectSize(lv) {
	if (lv == 1) setSize(20,20);
	else if (lv == 2) setSize(40,40);
	else if (lv == 3) setSize(80,80);
	else return;
}



// 맵 안의 모든 셀을 통틀어 클릭을 감지하는 함수
function cellClickActive(e) {
	if (e.target !== e.currentTarget) {
		var cell = e.target.id;
//		console.log('Click!');
		
		// 앞에 c가 붙지 않은 아이디 값을 걸러낸다. (좌표 아이디는 c로 시작한다.)
		if (cell.charAt(0) == 'c') {
			// 아이디 값을 좌표값으로 전환.
			var at = convertCoordinateValues(cell);
			var x = Math.abs(at.x), y = Math.abs(at.y);
//			console.log('Click ('+x+','+y+'), id:('+ cell +'), e.button: '+e.button);
			
			// 마우스 우클릭, 좌클릭에 따라 구분
			if (e.button == 0) clickLeft(x,y);	// 좌클릭
			else if (e.button == 2) clickRight(x,y);	// 우클릭
			else return;
		}
	}
	e.stopPropagation();
}

// 아이디 값을 좌표값으로 바꿔준다.
function convertCoordinateValues(id) {
	var x = parseInt(id.substr(1,2));
	var y = parseInt(id.substr(3,2));
	
	return {x: x, y: y};
}


function eventListenerSet() {
	document.getElementById("map").addEventListener("mousedown", cellClickActive, false);
}

function clickLeft(x,y) {
	var itemCode = getItemCode();
	if (itemCode == 'R') {
		makeRoad(x,y);
		return;
	}
	setSite(x, y, itemCode);
	console.log(x,y);
}
function clickRight(x,y) {
	
}

// 클릭을 통해 클릭된 이미지를 바꾸는 작업을 한다.

// 일단 이미지에서 여러개의 셀 병합은 다음 버전 아니 빌표 끝나고 계속해서 업데이트할 때 나올 것이다.

// 빌딩을 올리는 작업을 CSS에서 해결할 수 있는 방법을 빨리 찾아본다.
// 이미지에 의해 빌딩이 세워지면 타일 클릭에 문자가 발생할 것이다.
// 타일은 아래의 타일 기준으로 하는데, 클릭 감지를 이미지 값으로 받으므로 심각한 오류를 야기할 수 있다.
// TODO: 이 점을 빨리 바꾸어라


function keySelector() {
	var arr = [];
	var result = 0;
	
	for (var i = 0; i < arr.length + 1; i++) {
		for (var j = 0; j < arr.length; j++) {
			if (arr[j] == result) {
				break;
			}
		}
		result++;
	}
	return result;
}



function openMenu() {
	document.getElementById('h-navi').display = 'block';
}

function closeMenu() {
	document.getElementById('h-navi').display = 'none';
}

function saveDownload() {
	alert('Download');
}

function refresh() {
	alert('Reset');
}

function back() {
	alert('back');
}

function forward() {
	alert('forward');
}

function exit() {
	alert('Exit');
}




