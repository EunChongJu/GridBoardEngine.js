



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
	cityMap.initAllValues('gs');
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
	changeSite(x,y,d);
}

// 이건 다음 버전에
//function margeSite() {
//	
//}



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
			if (!isOut(ix,iy)) resurfaceRoad(ix,iy);
		}
	}
}

// 여기에 true로 반환된 밖으로 나간 아이템을 또 한번더 걸러야 할 필요가 있다.

// 아마 아래에 만들어 놓은 구조 자체가 다른 도로(운하, 자전거도로, 고속도로 등의 연결성을 지니는 도로)를 만들 때 사용될
// 가능성이 높으므로 이것을 함수로 분리하도록 한다. 분리하면서 앞에 붙은 'R'을 뺀 값을 붙여나간다고 가정한다.

// 도로 포장 (재포장과 차이점은 주변 탐색하고 이 값을 반환한다)
function paveRoad(x,y) {
	var junction = navigateRoad(x,y);	// 좌표의 주위를 탐색하고 아이템에 들어갈 것으로 알맞은 값을 받는다. (문자열)
	
	console.log(junction);
	
	var code = 'R' + connectType(junction);
	setSite(x,y,code);
	
	return junction;	// 그리고 아이템에 사용하고 나면, 이 값을 반환받는다.
}

// 도로 재포장 (포장과 차이점은 결과 값을 true, false를 반환한다는 것이다)
function resurfaceRoad(x,y) {
	var result = false;
	
	var junction = navigateRoad(x,y);	// 좌표의 주위를 탐색하고 아이템에 들어갈 것으로 알맞은 값을 받는다. (문자열)
	
	var code = 'R' + connectType(junction);
	setSite(x,y,code);
	console.log(code);
	
	return result;
}

// 주변에 있는 도로 값을 찾아 결과값을 반환
function navigateRoad(x,y) {
	var arr = [];
//	for (var fx = -1; fx <= 1; fx+=2) {
//		var ix = fx + x;
//		if (isRoad(ix,y)) arr.push({x: ix, y: y});
//	}
//	for (var fy = -1; fy <= 1; fy+=2) {
//		var iy = fy + y;
//		if (isRoad(x,iy)) arr.push({x: x, y: iy});
//	}
	if (isRoad(x-1,y)) arr.push({x: (x-1), y: y});
	if (isRoad(x,y-1)) arr.push({x: x, y: (y-1)});
	if (isRoad(x+1,y)) arr.push({x: (x+1), y: y});
	if (isRoad(x,y+1)) arr.push({x: x, y: (y+1)});
	
	return arr;
}

// 이것이 도로인가 아닌가? (밖으로 나간 존재하지 않는 아이템은 도로라고 간주한다)
function isRoad(x,y) {
	if (isOut(x,y)) {	// 만약 밖으로 나간다! 그러면 true를 무조건 리턴하는거예요!
		return true;
	}
	else {	// 만약 밖으로 안나간다? 그러면 에러로 부터 안심하고 아이템을 조회하쇼!
		var item = cityMap.getItem(x,y);
		if (item.charAt(0) == 'R') {	// 앞에 R이 있다고요? 그럼 도로군요! true 반환!
			return true;
		}
		else {	// 도로가 아니라고요? 그럼 false를 반환!
			return false;
		}
	}
}

// 밖으로 나가면 true를 반환
function isOut(x,y) {
	var frameSize = cityMap.getFrameSize();
	var xStartOut = x < 0;	// 나가면 true
	var yStartOut = y < 0;
	var xEndOut = (x >= frameSize.x);
	var yEndOut = (y >= frameSize.y);
	return (xStartOut || yStartOut || xEndOut || yEndOut);	// 넷중 하나가 true면 true를 반환하도록 한다.
}

// 배열을 받아 연결 상태를 파악한 다음, 알맞은 16진수 값을 반환한다.
function connectType(junction) {
	if (junction.length == 0) {
		return '0';
	}
	else if (junction.length == 1) {	// R1, R2, R3, R4
		var data = junction[0];
		if (data.x != 0) {
			if (data.x > 0) {	// +1
				return '3';
			}
			else if (data.x < 0) {	// -1
				return '1';
			}
		}
		else if(data.x == 0) {
			if (data.y > 0) {	// +1
				return '4';
			}
			else if (data.y < 0) {	// -1
				return '2';
			}
		}
		/*
		if (data.x == -1) {
			return '1';
		}
		if (data.x == 1) {
			return '3';
		}
		if (data.y == -1) {
			return '2';
		}
		if (data.y == 1) {
			return '4';
		}
		*/
	}
	else if (junction.length == 2) {	// R5, R6, R7, R8, RE, RF
		var d1 = junction[0];
		var d2 = junction[1];
		
		if ((d1.x == -1 || d1.x == 1) && (d2.x == 1 || d2.x == -1)) return 'E';
		if ((d1.y == -1 || d1.y == 1) && (d2.y == 1 || d2.y == -1)) return 'F';	// 아주 개같다...
		
		if ((d1.x == -1 || d2.x == -1) && (d2.y == -1 || d1.y == -1)) return '5';
		if ((d1.x == 1 || d2.x == 1) && (d2.y == -1 || d1.y == -1)) return '6';
		if ((d1.x == 1 || d2.x == 1) && (d2.y == 1 || d1.y == 1)) return '7';
		if ((d1.x == -1 || d2.x == -1) && (d2.y == 1 || d1.y == 1)) return '8';
		
	}
	else if (junction.length == 3) {	// RA, RB, RC, RD
		var t1 = junction[0];
		var t2 = junction[1];
		var t3 = junction[2];
		
		if (t1.x != -1 && t2.x != -1 && t3.x != -1) return 'C';
		if (t1.y != -1 && t2.y != -1 && t3.y != -1) return 'D';
		if (t1.x != 1 && t2.x != 1 && t3.x != 1) return 'A';
		if (t1.y != 1 && t2.y != 1 && t3.y != 1) return 'B';
		
	}
	else if (junction.length == 4) {	// R9
		return '9';
	}
	
	return '0';
}
function connectValid(data) {	// 0이면 false를, -1이나 +1이면 true 반환
	var result = false;
	if (data == -1 || data == 1) result = true;
	return result;
}
function connectVal(data) {
	
}





















