



// 게임에서 두가지 보드가 사용되는데, 
// 한 보드는 건물이나 도로, 강, 다리, 숲 등 어떤 건물이 배치되느냐에 따라 아이템 값이 달라진다.
// 또 다른 보드는 z-index를 위한 것으로, NW->SE 방향으로 증가하는 슬래시 맵을 형성한다.





// 이 보드를 여러개 사용하여 확장 모드를 사용해 볼 수 있는 게임으로 만들 것이다.
// 하지만 지금은 현재로서는 작은 것부터 하는 것이 좋기 때문에 나중에 해도 무방할 것이다.

// 나중에 모든 데이터를 (GridBoardEngine.js도 포함) JSON으로 관리할 수 있도록 해보고 싶다.

var cityMap = null;
var zBoard = null;

























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
	cityMap.initAllValues(0);
	cityMap.setStartIndex(0);
	showMap(10,10);
}

// 기존의 맵을 새로운 맵으로 덮어쓰기 할 때
function setMap(map) {
	cityMap.setBoard();
}

// view에 변경사항을 갱신할 수 있도록 맵을 반환
function getMap() {
	return cityMap.getBoard();
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




//// 맵 안에 있는 (보드에서는 셀과 아이템임) 영역의 값을 관리하는 함수 모음

function getSite(x,y) {
	return cityMap.getItem(x,y);
}

function setSite(x,y,d) {
	cityMap.setItem(x,y,d);
}

function margeSite() {
	
}



//// 맵 안에 있는 도로라는 아이템에 주변의 도로 아이템과의 연결을 도와주는 함수들의 모음

// 1. 먼저 도로라는 아이템이 특정 좌표에 생성 된다.
// 2. 생성되면 주변 값을 인식하여 분석한 다음, 분석 결과 연결 값에 따른 알맞은 이미지를 생성하도록 한다.
// 3. 그 다음, 주변 값(가로 세로 1칸씩만)을 찾아 2번과 같이 한다.
// 4. 주변 값 탐색이 완료되면 도로 함수는 종료된다.
// 정리:
// 도로 생성한다. -> 도로 생성하고 주변 값을 탐색한다.
// 탐색 완료되면 이 값에 따라 도로가 배치된다.
// 주변 값을 탐색한 결과에 따라 해당 값을 도로 재배치한다.

// 도로 생성	(도로 탐색에서 가장자리로 가는 부분은 연결이 된다고 간주한다)
function makeRoad(x,y) {
	var junction = paveRoad(x,y);
	if (junction.length != 0) {
		for (var i = 0; i < junction.length; i++) {
			var ix = junction[i].x;
			var iy = junction[i].y;
			resurfaceRoad(ix,iy);
		}
	}
	
}

// 도로 포장 (재포장과 차이점은 주변 탐색하고 이 값을 반환한다)
function paveRoad(x,y) {
	var junction = [];	// 좌표의 주위를 탐색하고 아이템에 들어갈 것으로 알맞은 값을 받는다.	(문자열임)
	
	return junction;	// 그리고 아이템에 사용하고 나면, 이 값을 반환받는다.
}

// 도로 재포장 (포장과 차이점은 결과 값을 true, false를 반환한다는 것이다)
function resurfaceRoad(x,y) {
	var ix = fitToNumUnit(i, 2);
	var iy = fitToNumUnit(j, 2);
	var result = false;
	
	
	
	return result;
}

// 주변에 있는 도로 값을 찾아 결과값을 반환
function navigateRoad(x,y) {
	var arr = [];
	for (var fx = -1; fx <= 1; fx+=2) {
		var ix = fx + x;
		if (isRoad(ix,y)) arr.push({x: ix, y: y});
	}
	for (var fy = -1; fy <= 1; fy+=2) {
		var iy = fy + y;
		if (isRoad(x,iy)) arr.push({x: x, y: iy});
	}
	return arr;
}

function isRoad(x,y) {
	var item = getSite(x,y);
	return item.charAt(0) == 'R';
}






















