// import는 다음에 클래스를 개발 완료하고 나면 그때 사용하는걸로

// gbe라는 곳에 새로운 엔진을 실행시키고 저장한다.
var gbe = new GridBoardEngine();

// 여기에 데이터 삽입을 안하고 싶다면 null을 사용하라. 그러면 넘어가줄 것이다.
// 또는 3개 다 사용하지 않는다면, 애초에 사용안해도 된다.
//gbe.newClass({index:1,init:1,fx:3,fy:4});
//gbe.newBoard(3,4);
//
//gbe.printGrid();
//gbe.getBoard();

// (5,6)크기의 보드를 생성하고 초기값을 0으로 설정하고, 보드 안의 모든 값을 초기값인 0으로 저장한다.
gbe.newBoard(5, 6);
gbe.initAllValues(0);

// 그리드를 출력
gbe.printGrid();

// (0,0)에 5라는 값을 저장
gbe.setItem(0, 0, 5);
// (0,0)의 값으로 (0,0)에서 (4,0)까지 가로로 그리는 것을 감지하여 가로선을 그린다. (정확히 복사를 여러번 하는 것임)
gbe.draw(0, 0, 4, 0);
// (0,0)의 값을 기준으로 (0,0) ~ (3,3)까지 대각선으로 그린다.
gbe.draw(0, 0, 3, 3);
// 만약 가로도 세로도 대각선도 아닌 값을 실행하면 오류가 발생하게 만듬.

// 그리드를 출력한다.
gbe.printGrid();

// 모든 값을 1로 저장하고 (확장을 확인하기 위함) 그리드를 (10,10)만큼 확장한다. 그리고 확인을 위해 출력한다.
// 이거 안된다.
gbe.Log('보드 확장 테스트 시작 (5,6) -> (10,10)');
gbe.setAllValues(1);
gbe.changeFrameSize(10, 10, 0, 0);
gbe.printGrid();
gbe.Log('보드 확장 완료');

// 확장 후 축소 테스트
gbe.Log('보드 축소 테스트 시작 (10,10) -> (7,9)');
gbe.setAllValues(1);
gbe.changeFrameSize(7, 9, 0, 0);
gbe.printGrid();
gbe.Log('보드 축소 완료');

// 보드 복합 크기 변경 테스트
gbe.Log('보드 변경 테스트 시작 (7,9) -> (9,7)');
gbe.setAllValues(1);
gbe.changeFrameSize(9, 7, 0, 0);
gbe.printGrid();
gbe.Log('보드 변경 완료');

gbe.Warning('Board Reset Function is valid and successful.');

// 해당 맵이 커지는지 작아지는지 확인하고 결과 값을 반환한다.
gbe.Log(gbe.decisionExpandOrContract(1, 1));
gbe.Log(gbe.decisionExpandOrContract(2, 1));
gbe.Log(gbe.decisionExpandOrContract(1, 2));

// 불러온 보드를 세팅하기 전에 유효한지 검사 (배열 안에 모두 배열만 있어야 유효)
gbe.Log(gbe.setBoard([]));

// 아래는 주석처리됨. 좌표 2개가 가로나 세로, 대각선 안에 들어오는지 테스트함.
gbe.Log(gbe.validHorizontal(2, 0, 0, 0));
gbe.Log(gbe.validVertical(0, 2, 0, 0));
gbe.Log(gbe.validDiagonal(0, 0, 2, 2));

gbe.setAllValues(0);
// 맵에 슬래시를 그려 생성한다. (정확히 슬래시를 끝에서 끝까지 반복하는 일임)
gbe.setSlashMap(1, 5);	// bien!

// 슬래시 맵이 완성되었는지 테스트하기 위해 프린트함.
gbe.printGrid();	// (1,1)에서 전자는 진행방향 타입이고, 후자는 1만큼 증가시킨다는 것이다.

gbe.setAllValues(0);
gbe.setSlashMap(2, 3);
gbe.printGrid();

gbe.setAllValues(0);
gbe.setSlashMap(3, 1);
gbe.printGrid();

gbe.setAllValues(0);
gbe.setSlashMap(4, 2);
gbe.printGrid();	/// 전체 테스트 완료!

// 여기까지 정상적으로 운용됨을 확인하였음.
gbe.Warning('Set Board Slash val is valid and successful.');

/*
// 인덱스 값 바뀜 테스트 - 파라미터가 없거나 파리미터가 있거나
console.log(gbe.getStartIndex());
gbe.setStartIndex();
console.log(gbe.getStartIndex());
gbe.setStartIndex(1);
console.log(gbe.getStartIndex());

function print(i) {
	console.log(i);
}

print();
print(0);
print(1);
print(false);
print(true);
print(null);
print(undefined);
*/

console.dir(gbe.toEndOfLinearSearch(0,0,5));

console.dir(gbe.getRowBoard(0));
console.dir(gbe.getRowBoard(3));

console.dir(gbe.getColumnBoard(0));
console.dir(gbe.getColumnBoard(2));


gbe.Warning('End Testing');


// 맵이 확장될 때, 새로 할당된 구역을 기본값으로 채운다.

// 맵이 축소될 때, 사용되는 메서드는 두가지 방법이 있는데,
// 축소하면서 구역 밖으로 나간 데이터가 삭제되는 방법과,
// 축소되면서 데이터가 밀려나가는 방법이 존재한다.
// 그러나 데이터를 밀어서 이동시킨다는 것은 사실상 문제가 많다.
// 예를 들면, 밖으로 나간 데이터가 4개가 되고 축소된 맵의 칸은 4칸인데,
// 그 4칸에 데이터가 이미 존재한다면, 이를 어떻게 처리해야 할까?
// 그래서 또 다른 해결방안을 제시한다. 밖으로 나간 데이터의 좌표와 함께 데이터 값을 배열로 반환하는 것이다.
// 배열 원소는 {x,y,data}로 구성된다. 이처럼 배열을 반환하게 만들면, 사용자가 이를 받아 사용자가 정의할 수 있게 한다.

// 축소 또는 확대하면서 또 다른 문제가 제기되는데,
// 중심점이 항상 북서쪽에 배치되므로 확대되거나 축소할 때 동, 남 방향으로만 작용한다는 것이다.
// 중심점을 여기로 말고 센터나 사용자 지정으로 할 수 없다는 것이다.

// 보드 세팅 함수 테스트
//var newBoard = gbe.makeGrid(10,10);
//gbe.dir(newBoard);

/*
// 대각선 유효 검사 완료
gbe.setItem(1,1,3);
gbe.printGrid();

gbe.drawLinearDiagonal(1,1,2,5);
gbe.printGrid();
*/

/*
gbe.setSlashMap(1,3);	// NW->SE 방향으로 1씩 증가시켜 슬래시 맵을 만든다
gbe.printGrid();
gbe.setSlashMap(2,1);	// NW->SE 방향으로 1씩 증가시켜 슬래시 맵을 만든다
gbe.printGrid();
gbe.setSlashMap(3,1);	// NW->SE 방향으로 1씩 증가시켜 슬래시 맵을 만든다
gbe.printGrid();
gbe.setSlashMap(4,1);	// NW->SE 방향으로 1씩 증가시켜 슬래시 맵을 만든다
gbe.printGrid();
*/

/* // 테스트 완료
gbe.setStartIndex(true);
gbe.log('Index : '+gbe.getStartIndex());
gbe.setStartIndex(0);
gbe.log('Index : '+gbe.getStartIndex());

gbe.log(gbe.convertIndexValue(0));
gbe.log(gbe.convertIndexValue(1));
gbe.log(gbe.convertIndexValue(3));
gbe.log(gbe.convertIndexValue(-1));
gbe.log(gbe.convertIndexValue(true));
gbe.log(gbe.convertIndexValue(false));


gbe.log(gbe.indexOf(5));
gbe.log(gbe.findIndex(6));
gbe.log(gbe.findAll(79));
gbe.log(gbe.findIndexAll(79));

gbe.log(gbe.validIndex(1,1));
gbe.log(gbe.validIndex(0,0));

//gbe.setStartIndex(1);
gbe.autosetStartIndex();

gbe.log(gbe.validIndex(1,1));
gbe.log(gbe.validIndex(0,0));

gbe.log('validDiagonalType');
//gbe.log(gbe.validDiagonalType(x,y,ax,ay));
gbe.log(gbe.validDiagonalType({min:1,max:3},{min:1,max:3},1,3));
gbe.log(gbe.validDiagonalType({min:1,max:3},{min:1,max:3},1,1));

gbe.log(gbe.filter(function(item) { return item < 8 }));
gbe.log(gbe.find(function(item) { return item < 8 }));
*/

// 위에 있는 주석들은 개발이 완료되면 삭제될 것이다.




// 갑자기 생각나서 말인데
// this.undoStack.isEmpty() 이런거나
// this.undoStack.clear() 이런가 할 수 있게 해보는게 어떤가
/*
var undoStack = function() {
	this.data = [];
	this.push = function() {
		this.data.push();
	}
	this.clear = function() {
		this.data = [];
	}
}
*/
// 이렇게 말이다. 물론 프로토타입 함수 안에 함수에 또 함수이긴 하지만, 가능하다면 할 것이다.
// ㄴ 테스트 결과, 이는 불가능한 것으로 확인되었으며, 가능하려면 함수 내 생성자를 만들어야 한다.
//     결국은 생성자를 만들게 되므로, 기존의 스택이 변경되지도 않는다는 뜻이다.
// 자세한 사항은 test.js의 맨 밑줄에 작성된 코드를 실행해보면 알 것이다.

/*
// 이거슨 테스트용이다. Test Dragon?
var prototype = function() {
	this.google = function() {
		console.log("google");
	}
	
	this.naver = function() {
		this.map = function() {
			console.log("naver map");
			this.roadView = function() {
				console.log("Road View on naver map");
			}
		}
		
		this.cafe = function() {
			console.log("naver cafe");
		}
		
		this.blog = function() {
			console.log("naver blog");
		}
	}
	
	this.active = function() {
		this.google();
		
		var naver = new this.naver();
		naver.map();
		naver.cafe();
		naver.blog();
		
		var map = new naver.map()
		map.roadView();
	}
}

var internet = new prototype();
var naver = new internet.naver();
naver.map();
internet.active();

*/


