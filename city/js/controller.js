



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
	"": {
		"": "",
	},
	"": {
		"": "",
	}
}

//var example = buildingList.road[1].R1;
//console.log(example);

var item = 0;	// 현재 아이템 코드 (빌딩을 지을 때 가장 최근에 눌렀던 아이템의 코드를 저장하는 것이다)









//// GAME START INTO DISPLAY CONTROLLER

function randomNamingCity() {
	var cityNameList = [
		'Daegu', 'Seoul', 'Busan', 'Pyeongyang', 'Tokyo', 'Tel\' aviv', 'Jerusalem', 'Athens', 'Berlin', 'Bern', 'Geneva', 'Basel', 'Zürich', 'Moscow', 'London', 'Lisbone', 'Madrid', 'Helsinki', 'Stockholm', 'Rome', 'Nairobi', 'Denver', 'Olso', 'Bogota', 'Rio', 'Marsella', 'Sofia', 'Kiev', 'Kyiv', 'Manila', 'Copenhagen', 'Amsterdam', 'Prague', 'Bratislava', 'Brussels', 'Rotterdam', 'Taipei', 'Vienna', 'Budapest', 'Warsaw', 'Bucharest', 'Kraków', 'Paris', 'Singapore', 'Bangkok', 'Kaosiung', 'Kuala Lumpur', 'Ulaanbaatar', 'Hong Kong', 'Macao', 'Jakarta', 'Sydney', 'New York', 'Washington D.C', 'Toronto', 'Dubai', 'Ottawa', 'Vancouver', 'Ontario', 'Quebec', 'Montreal', 'Seattle', 'Philadelphia', 'Cicago', 'San Francisco', 'Los Angeles', 'Las Vegas', 'Boston', 'Houston', 'Gotham City', 'Tian', 'Straupia', 'Oplandia', 'Serjio', 'Marquina', 'Vefrasinky', 'Jei Cien', 'Suqular', 'Edvardia', 'Xian', 'Anttriol', 'Naver City', 'Doppler', 'Trolling', 'Hexa', 'Enigma', 'Coldwarm', 'Ivory', 'Tax High', 'Yeterbori'
	];
	var min = 0, max = cityNameList.length-1;
	var random = Math.floor(Math.random() * (max - min + 1)) + min; //최댓값도 포함, 최솟값도 포함
	setCityName(cityNameList[random]);
}

function selectSize(lv) {
	if (lv == 1) setSize(20,20);
	else if (lv == 2) setSize(40,40);
	else if (lv == 3) setSize(80,80);
	else return;
}














// 게임에서 두가지 보드가 사용되는데, 
// 한 보드는 건물이나 도로, 강, 다리, 숲 등 어떤 건물이 배치되느냐에 따라 아이템 값이 달라진다.
// 또 다른 보드는 z-index를 위한 것으로, NW->SE 방향으로 증가하는 슬래시 맵을 형성한다.


// z-index를 사용하기 위한 것인데, 이미지를 사용하면 상대적으로 적은 수의 z-index는 맨 뒤로 가게 된다.





//// 이번엔 진짜 COLTROLLER.JS임

// 맵 안의 모든 셀을 통틀어 클릭을 감지하는 함수
function cellClickActive(e) {
	if (e.target !== e.currentTarget) {
		var cell = e.target.id;
		
		console.log('Click ('+x+','+y+') e.button: '+e.button);
		
		// 앞에 c가 붙지 않은 아이디 값을 걸러낸다. (좌표 아이디는 c로 시작한다.)
		if (cell.charAt(0) == 'c') {
			// 아이디 값을 좌표값으로 전환.
			var at = convertCoordinateValues(cell);
			var x = Math.abs(at.x), y = Math.abs(at.y);
			
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
	var x = parseInt(id.substr(0,2));
	var y = parseInt(id.substr(2,2));
	
	return {x: x, y: y};
}


function eventListenerSet() {
	document.getElementById("map").addEventListener("mousedown", cellClickActive, false);
}

function clickLeft(x,y) {
	
}
function clickRight(x,y) {
	
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




