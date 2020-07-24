//// ::MODEL:: ////
// 애플리케이션의 정보, 데이터를 나타냄
// 데이터베이스, 처음으로 정의하는 상수, 초기화값, 변수 등을 의미
// 이러한 DATA, 정보들의 가공을 책임지는 컴포넌트

// 사용자가 편집하길 원하는 모든 데이터를 가지고 있어야 한다.
// 뷰나 컨트롤러에 대해서 어떤 정보도 알지 말아야 한다.
// 변경이 일어나면, 변경 통지에 대한 처리 방법을 구현해야만 한다.


//// 지을 수 있는 모든 아이템의 목록

// + 도로 등 시스템에 사용되는 것을 구분하기 위해 다음과 같은 사항을 추가한다.
// <ㅓ>로 되있으면 이것을 눕힐 때 오른쪽 아래만 연결이 안되있고, <ㅏ>는 왼쪽 위쪽만 연결 안된 것이다.

// 도로나 운하, 빌딩 등을 모두 관리할 때 필요한 모든 것을 리스트로 정리한 것이다.
// 아래는 도로의 경우 연결 할 수 있는 경우의 수를 따져봤을 때, 가능한 목록을 정리한 것이다.
// 본 아이템 코드는 16진수를 사용한다.
/*
원점: 0
서쪽 단일 연결: 1
북쪽 단일 연결: 2
동쪽 단일 연결: 3
남쪽 단일 연결: 4

서쪽 북쪽 연결: 5
북쪽 동쪽 연결: 6
동쪽 남쪽 연결: 7
남쪽 서쪽 연결: 8

서쪽 'ㅓ' 연결: A
북쪽 'ㅗ' 연결: B
동쪽 'ㅏ' 연결: C
남쪽 'ㅜ' 연결: D

동서 직렬 연결: E
남북 직렬 연결: F
전체 '+' 연결: 9	// 수로에서는 그냥 바다임
*/

// 이거는 그냥 아이템의 목록일 뿐, 실제로 사용할 수 있는 것은 아니다.
var buildingList = {
	"empty": 0,
	"road": [
		"R",
		{
			"R1": "R1",
			"R2": "R2",
			"R3": "R3",
			"R4": "R4",
			"R5": "R5",
			"R6": "R6",
			"R7": "R7",
			"R8": "R8",
			"R9": "R9",
			"RA": "RA",
			"RB": "RB",
			"RC": "RC",
			"RD": "RD",
			"RE": "RE",
			"RF": "RF"
		}
	],
	"canal": [	// CHANNEL OR CANAL
		"C",
		{
			"C1": "C1",
			"C2": "C2",
			"C3": "C3",
			"C4": "C4",
			"C5": "C5",
			"C6": "C6",
			"C7": "C7",
			"C8": "C8",
			"C9": "C9",
			"CA": "CA",
			"CB": "CB",
			"CC": "CC",
			"CD": "CD",
			"CE": "CE",
			"CF": "CF"
		}
	],
	"highway": [	// AUTOBAN OR HIGHWAY
		"H",
		{
			"H1": "H1",
			"H2": "H2",
			"H3": "H3",
			"H4": "H4",
			"H5": "H5",
			"H6": "H6",
			"H7": "H7",
			"H8": "H8",
			"H9": "H9",
			"HA": "HA",
			"HB": "HB",
			"HC": "HC",
			"HD": "HD",
			"HE": "HE",
			"HF": "HF"
		}
	],
	"metro": [	// SUBWAY OR METRO
		"M",
		{
			"M1": "M1",
			"M2": "M2",
			"M3": "M3",
			"M4": "M4",
			"M5": "M5",
			"M6": "M6",
			"M7": "M7",
			"M8": "M8",
			"M9": "M9",
			"MA": "MA",
			"MB": "MB",
			"MC": "MC",
			"MD": "MD",
			"ME": "ME",
			"MF": "MF"
		}
	],
	"residency": {
		"house1": "rh1",
		"house2": "rh2",
		"house3": "rh3",
		"mansion1": "rh4",
		"mansion2": "rh5",
		"apartment": "rh6",
	},
	"commercial": {
		"": "",
		"": "",
		"": "",
	},
	"building": {
		"": "",
		"": "",
		"": "",
	},
	"tower": {
		"": "",
		"": "",
		"": "",
	},
	"industry": {
		"": "",
		"": "",
		"": "",
	},
	"public": {
		"": "",
		"": "",
		"": "",
	},
	"park": {
		"green": "gp",
		"park1": "gp1",
		"park2": "gp2",
		"": "",
	},
	"ground": {
		"zero": "gz",
		"none": "nn"
	},
	"": {
		"": "",
	}
}

function getBuildingList() {
	return buildingList;
}

var itemCode = 'gp';	// 현재 아이템 코드 (빌딩을 지을 때 가장 최근에 눌렀던 아이템의 코드를 저장하는 것이다)

function getItemCode() {
	return itemCode;
}

function setItemCode(code) {
	itemCode = code;
	console.log(code);
}







//// GAME START INTO DISPLAY CONTROLLER

function randomNamingCity() {
	var cityNameList = [
		'Daegu', 'Seoul', 'Busan', 'Pyeongyang', 'Tokyo', 'Tel\' aviv', 'Jerusalem', 'Athens', 'Berlin', 'Bern', 'Geneva', 'Basel', 'Zürich', 'Moscow', 'London', 'Lisbone', 'Madrid', 'Helsinki', 'Stockholm', 'Rome', 'Nairobi', 'Denver', 'Olso', 'Bogota', 'Rio', 'Marsella', 'Sofia', 'Kiev', 'Kyiv', 'Manila', 'Copenhagen', 'Amsterdam', 'Prague', 'Bratislava', 'Brussels', 'Rotterdam', 'Taipei', 'Vienna', 'Budapest', 'Warsaw', 'Bucharest', 'Kraków', 'Paris', 'Singapore', 'Bangkok', 'Kaosiung', 'Kuala Lumpur', 'Ulaanbaatar', 'Hong Kong', 'Macao', 'Jakarta', 'Sydney', 'New York', 'Washington D.C', 'Toronto', 'Dubai', 'Ottawa', 'Vancouver', 'Ontario', 'Quebec', 'Montreal', 'Seattle', 'Philadelphia', 'Cicago', 'San Francisco', 'Los Angeles', 'Las Vegas', 'Boston', 'Houston', 'Gotham City', 'Tian', 'Straupia', 'Oplandia', 'Serjio', 'Marquina', 'Vefrasinky', 'Jei Cien', 'Suqular', 'Edvardia', 'Xian', 'Anttriol', 'Naver City', 'Doppler', 'Trolling', 'Hexa', 'Enigma', 'Coldwarm', 'Ivory', 'Tax High', 'Yeterbori'
	];
	var min = 0, max = cityNameList.length-1;
	var random = Math.floor(Math.random() * (max - min + 1)) + min; //최댓값도 포함, 최솟값도 포함
	setCityName(cityNameList[random]);
}



// 게임에서 두가지 보드가 사용되는데, 
// 한 보드는 건물이나 도로, 강, 다리, 숲 등 어떤 건물이 배치되느냐에 따라 아이템 값이 달라진다.
// 또 다른 보드는 z-index를 위한 것으로, NW->SE 방향으로 증가하는 슬래시 맵을 형성한다.





// 이 보드를 여러개 사용하여 확장 모드를 사용해 볼 수 있는 게임으로 만들 것이다.
// 하지만 지금은 현재로서는 작은 것부터 하는 것이 좋기 때문에 나중에 해도 무방할 것이다.

// 나중에 모든 데이터를 (GridBoardEngine.js도 포함) JSON으로 관리할 수 있도록 해보고 싶다.

var cityMap = null;
var zBoard = null;

























// 기존의 맵을 새로운 맵으로 덮어쓰기 할 때
function setMap(map) {
	cityMap.setBoard();
}

// view에 변경사항을 갱신할 수 있도록 맵을 반환
function getMap() {
	return cityMap.getBoard();
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





















