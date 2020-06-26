
/*
난 이것을 이렇게 바꾸고 싶다.
board와 기록스택, 프레임 사이즈 등의 데이터를 Grid라는 클래스로 하고,
이 Grid 클래스를 생성자로 쓰게 되면 이 데이터 형식이 사용 되는 것이고,
이로써 함수들은 Grid와는 독립적으로 사용할 수 있게 될지도 모른다.
*/


"use strict";	// 엄격모드임

// 여기서는 임시로 프로토타입을 만들어서 나중에 클래스로 구현할 것이다.
var GridBoardEngine = function() {
	// Board Data
	this.board = undefined;
	
	// 처음 인덱스 번호를 0으로 할지 1(true)로 할지 설정. (초기값은 0, false부터 시작한다)
	this.index = false;
	
	// 초기값을 설정하여 이동 등 문제로 인해 아이템이 비워질 때 채우는 용도로 사용됨. (초기값 0)
	this.init = 0;
	
	// 보드의 가로 칸과 세로 칸의 길이를 저장 : 이를 프레임 사이즈라 한다.
	this.frameX = 0;
	this.frameY = 0;
	
	// 이 스택패스가 true면, 스택 저장을 실행하지 않고, false면 스택 저장을 실행한다.
	// 즉 이 시스템은 패스가 발생하면 이를 true로 설정하고, 종료되면 반드시 false로 지정해야 한다.
	// true면 패스 시스템이 발동되고, 그 동안에 실행하면서 변동된 값이 저장되지 않는다.
	
	// Stack : undoStack, redoStack
	this.undoStack = [];	// 되돌리기
	this.redoStack = [];	// 다시실행
	
	// 스택 패스 상태를 저장 (true면 스택 패스 모드 상태임, export할 때 이 모드가 false여야 한다.)
	this.stackPass = false;
	
	// Grid : grid[{ key: value },{...},{...},]
	this.grid = [];
	
	// grid key list : 'a1', 'a5', 'a6', ... (그리드 키의 배열은 숫자로 저장된다.)
	this.gridKey = [];
	
	
	////// Grid Administrate Functions.
	
	// 그리드는 셀 합병과 분할, 분리 등을 관여하는 것으로, 키와 값에 의해 저장된다.
	// 그리드 합병의 원리는 예를 들어 (0,3)과 (0,4)에 같은 값을 가진 키 값이 있다면,
	// 이 두개의 아이템이 하나의 아이템으로 합병되었다고 간주하여 처리된다.
	// 셀 합병은 2칸 이상으로 가능하며, 사각형 그리드에 들어간다면 합병이 가능하다.
	// 합병된 아이템의 값을 저장하고 불러오는 방법은 저장된 키 값을 찾아 해당 값을 불러오거나 변경하는 방법이다.
	// 단 셀 합병시 많은 제약이 따르는데, 대표적으로 선 긋기와 슬래시 맵을 만드는 메서드를 실행할 수 없다.
	
	// 셀 합병 시 양쪽 값이 모두 동일해야 비교적 안정적으로 합병 성공할 수 있다.
	// 그러나 양쪽 값이 다른 경우, 다음과 같은 처리 방법이 있다. 번호는 파라미터의 옵션이 된다.
	// 1. 모든 값을 합치고 나눈 평균값	(3 + 5 = > 4, 2 + 8 = 5)
	// 2. 문자의 경우 문자를 하나의 값으로 합침	(2 + 4 => 24, A + 3 => A3)
	// 3. 숫자의 경우 합산한 값	(3 + 5 => 8, 2 + 8 => 10) (값이 무효라면, 이 값을 반환한다)
	
	/// 셀 합병 및 분할을 관여하는 함수들
	
	// 셀 합병 실행
	this.cellMarger = function(item,opt) {		// 좌표({ax,ay,bx,by})와 옵션
		var keyName;
		var margedItemValue = this.cellMargerAdjustValue(item,opt);
		
		this.setItem(item.ax, item.ay, keyName);
		this.drawRect(item.ax, item.ay, item.bx, item.by);
		
		this.margedItemValue(margedItemValue);
	}
	
	// 셀 합병에 있어서 A와 B, 그리고 그 이상의 아이템을 어떻게 합병할 것인지 옵션에 따라 값을 반환한다.
	this.cellMargerAdjustValue = function(item, opt) {
		var itemArr = this.getArrRectA2B(item.ax, item.ay, item.bx, item.by);
		var adjustedValue;
		
		for (var i = 0; i < itemArr.length; i++) adjustedValue += itemArr[i];
		
		if (opt == 1) adjustedValue /= itemArr.length;
		
		return adjustedValue;
	}
	
	// A부터 B까지 안의 네모 안에 있는 값을 배열로 반환
	this.getArrRectA2B = function(ax,ay,bx,by) {
		var arr = [];
		
		return arr;
	}
	
	// 셀 합병으로 새로운 키가 추가됨
	this.margedItemValue = function(val) {
		var keyName = this.gridKeyGeneration();
		this.pushMargedItem(keyName, val);
	}
	
	this.pushMargedItem = function(key, val) {
		this.grid.push({ key: '', value: val });
	}
	
	// 셀 합병이 취소되거나 분할됨
	this.dividedItemValue = function(key) {
		var keyName = ((key.substr(0,1) == 'a') ? key : 'a' + key);
		
		// 분할될 키 값이 일치하는 것을 찾아 없앤다.
		this.removeGridKey(keyName);
	}
	
	// 그리드 키 값에 없는 가능한 키 값을 찾는다.

	// 여기서 발생하는 문제에 대처하는 방법을 나열해본다.
	/*
	먼저 키 값에 다음과 같은 배열이 있다.
	[1,2,3]

	그러나 a2라는 키 값이 분할(분리)되면서 2가 제거된다.
	[1,3]

	그리고 다시 새로운 키 값이 추가된다.
	여기서 1을 먼저 탐색하고 있음을 확인하면 키 값을 증가시킨다.
	증가하면 2가 된다. 2를 탐색한다. 그리고 걀과로 2가 없음을 확인한다.

	2가 추가된다.
	[1,3,2]

	그 다음에 새로운 키가 추가되면 모두 탐색하여 없는 수가 4임을 확인하고, 추가한다.
	[1,3,2,4]
	*/
	
	// 키 값을 생성해주는 함수
	this.gridKeyGeneration = function() {
		var keyNumber = 1;
		
		if (!this.gridIsEmpty()) {
			// for문에서 key 값에 중복되지 않는 최솟값을 구할려고 했으나 복잡해서 그냥 최댓값으로 구한다.
			for (var i = 0; i < this.gridKey.length; i++) {
				if (this.gridKey[i] >= keyNumber) keyNumber = this.gridKey[i] + 1;
			}
		}
		
		var keyName = 'a' + keyNumber;
		this.gridKey.push(keyNumber);
		
		return keyName;
	}
	
	// 분할됨으로 사라지게 될 그리드의 키를 제거.
	this.removeGridKey = function(key) {
		for (var i = 0; i < this.gridKey.length; i++) {
			if (this.gridKey[i] == key) this.gridKey.splice(i,1);
		}
	}
	
	// 그리드가 비었는지 확인. (그리드가 비었어요? 네! 비었어요 true, 아니요 안비었는데요? false)
	this.gridIsEmpty = function() {
		return this.grid.length == 0;
	}
	
	
	
	
	
	///// GridBoardEngine Common(?) Functions.
	
	// GridBoardEngine Version
	this.version = function() { return "1.5.2"; }
	
	
	// 처음 시작할 때 호출하는 함수. 시작 인덱스, 초기값, 프레임 사이즈 제한하는 크기 등을 한꺼번에 설정함. (사용안해도 됨)
	// this.newClass({x:~,y:~,init:~,index:~});
	this.newClass = function(e) {
		// 저건 나중에 만들도록 하죠.
		// 이 기능에 대한 설명:
		// 아래에 있는 모든 newBoard, setGrid, setFS, setAllVal, initAllVal 등을 한꺼번에 입력하여 처리하는 함수임.
		if (e.index) this.setStartIndex(e.index);
		if (e.fx && e.fy) this.newBoard(e.fx, e.fy);
		if (e.init) this.initAllValues(e.init);
	};
	
	// 보드를 생성한다. 그리드 프레임셋을 이용해 새로운 보드를 저장.
	this.newBoard = function(x,y) {
		this.setFrameSize(x,y);
		this.setGrid();
	};
	
	// 보드가 교체(새로운 보드로 덮어쓰기)될 때, 파라미터를 통해 새로운 보드를 저장하고, 성공시 true를 반환.
	this.setBoard = function(newBoard) {
		var valid = this.validBoard(newBoard);
		if (valid) this.board = newBoard;
		return valid;
	};
	
	// 보드 유효 확인
	this.validBoard = function(board) {
		var valid = false;
		if (Array.isArray(board)) {
			if (board.length === 0) return valid;	// check board array is empty element
			
//			for (const row of board) {
			for (var i = 0; i < board.length; i++) {	// brackets에서 중단되는 일이 있어 임시로 구문을 수정
				var row = board[i];
				if (!Array.isArray(row)) return valid;
			}
			valid = true;
		}
		return valid;
	};
	
	// 새로운 보드안에 그리드라는 프레임을 만든다.
	this.setGrid = function() {
		this.board = this.makeGrid(this.frameX,this.frameY);
	};
	
	// 설정한 프레임 사이즈의 크기를 저장한다.
	this.setFrameSize = function(fx,fy) {
		this.frameX = fx, this.frameY = fy;
	};
	
	// 그리드 안에 있는 모든 아이템의 데이터 값을 지정한 하나의 값으로 저장.
	this.setAllValues = function(val) {
		this.storeGridAllOneVal(this.board,val);
	};
	
	// 받은 그리드 내에서 하나의 데이터 값으로 채운다.
	this.storeGridAllOneVal = function(grid,val) {	// parameter is same board.
		for (var y = 0; y < grid.length; y++) {
			for (var x = 0; x < grid[y].length; x++) grid[y][x] = val;
		}
		return grid;
	};
	
	// 초기값을 설정하고, 그리드의 모든 아이템 값을 초기화. 만약 아이템 값이 비워지면 자동으로 초기값을 불러와 저장.
	this.initAllValues = function(val) {
		this.setinit(val);
		this.setAllValues(val);
	};
	
	// 해당 보드 전체를 반환.
	this.getBoard = function() {
		return this.board;
	};
	
	// 그리드를 만든다. 새로운 그리드를 세팅하거나 사이즈를 다시 세팅할 때만 사용한다.
	this.makeGrid = function(fx,fy) {	// (fx,fy) 만큼의 아이템 그리드를 생성.
		var newBoard = new Array(fy);	// new Board
		for (var i = 0; i < fy; i++) newBoard[i] = new Array(fx);	// for of나 for in은 새로 생성한다.
		return newBoard;
	};
	
	// (절대값 기준) 몇번째 ROW를 배열로 반환한다.
	this.getRowBoard = function(r) {
		return this.getBoard()[r];
	};
	
	// (절대값 기준) 몇번째 COULUMN을 배열로 반환한다.
	this.getColumnBoard = function(c) {
		var list = [];
		for (var y = 0; y < this.getBoard().length; y++) list.push(this.getIndexItem(c,y));
		return list;
	}
	
	
	
	
	
	
	
	/// 필요한 시스템 함수들의 확장판::
	
	// 이 시스템의 모든 데이터를 추출하고 불러낼 수 있는 함수를 만들고자 한다.
	// 이를 위해서는 정의된 데이터 형식을 만들어내야 할 것인데, 어떻게 처리를 할 것인가를 두고 논의가 필요로 한다.
	// 일단 데이터를 형식적으로 추출을 하고, 나중에 암호화 기법 등을 사용하여 인코딩할 것이다.
	
	// NOTE: [엑스포트, 임포트]될 데이터는 기록스택, 보드 내 그리드 셋 데이터, 보드 내 모든 아이템 값을 모두 합한 것.
	
	// CHANGES: 이 시스템의 모든 데이터를 추출 -> JSON형태의 파일로 다운로드
	// TODO: 여기에 기록을 포함시킬 것인가 말것인가, 그리드는 원형으로 하느냐 그대로 가느냐 그런 것을 결정한다.
	
	// JSON 형태의 표준 (예시)
	this.portDataSet = function() {
		// It type is JSON for Import and Export.
		var data = {
			"name": "GridBoardEngine",		// 그냥 이름 (심심해서 넣어봄)
			"version": "1.5.2",		// 버전
			"index": false,		// 시작 인덱스
			"init": 0,		// 초기값
			"frameSize": {	// 프레임 사이즈
				"x": 4,
				"y": 4
			},
			"board": [	// 이 방법은 x가 어디고 y가 어디인지 헷갈리는 문제가 있다. 그래서 newBoard에 참조
				[1, 2, 3, 4],
				[5, 6, 7, 8],
				[9, 10, 11, 12],
				[13, 14, 15, 16]	// JSON 배열이 순서대로 저장되고 나오는지 확인이 안됨
			],
			"newBoard": [	// 이게 더 편해 보이는데 용량이 좀 나갈 수 있다는 문제가 있다.
				{
					"index": {"x": 0, "y": 0},
					"data": {
						"data": 1,	// data - check type under data.
						"type": 1	// int=1, string=3, null=0, undefined=4, object=5, margeItem=2
					}
				},
				{
					"index": {"x": 1, "y": 0},
					"data": {
						"data": 2,
						"type": 1
					}
				},
				{
					"index": {"x": 2, "y": 0},
					"data": {
						"data": 3,
						"type": 1
					}
				},
				{
					"index": {"x": 3, "y": 0},
					"data": {
						"data": 4,
						"type": 1
					}
				},
				{
					"index": {"x": 0, "y": 1},
					"data": {
						"data": 5,
						"type": 1
					}
				},
				{
					"index": {"x": 1, "y": 1},
					"data": {
						"data": 6,
						"type": 1
					}
				},
				{
					"index": {"x": 2, "y": 1},
					"data": {
						"data": 7,
						"type": 1
					}
				},
				{
					"index": {"x": 3, "y": 1},
					"data": {
						"data": 8,
						"type": 1
					}
				},
				{
					"index": {"x": 0, "y": 2},
					"data": {
						"data": 9,
						"type": 1
					}
				},
				{
					"index": {"x": 1, "y": 2},
					"data": {
						"data": 10,
						"type": 1
					}
				},
				{
					"index": {"x": 2, "y": 2},
					"data": {
						"data": 11,
						"type": 1
					}
				},
				{
					"index": {"x": 3, "y": 2},
					"data": {
						"data": 12,
						"type": 1
					}
				},
				{
					"index": {"x": 0, "y": 3},
					"data": {
						"data": 13,
						"type": 1
					}
				},
				{
					"index": {"x": 1, "y": 3},
					"data": {
						"data": 14,
						"type": 1
					}
				},
				{
					"index": {"x": 2, "y": 3},
					"data": {
						"data": 15,
						"type": 1
					}
				},
				{
					"index": {"x": 3, "y": 3},
					"data": {
						"data": 16,
						"type": 1
					}
				},
			],
			"history": {	// 스택패스는 아직도 해결 못함. 그러므로 스택패스가 정립되고, 완성되면 여기에 추가하는걸로.
				"undo": [
					{
						"id": 1,	// id을 사용하는 이유는 JSON 배열이 순서를 보장하지 않기 때문임.
						"index": {	// id 값을 통해 순서대로 배열을 저장할 수 있음을 보장할 수 있다.
							"x": 2,
							"y": 3
						},
						"data": {
							"before": 1,
							"after": 15
						}
					},
					{
						"id": 2,
						"index": {
							"x": 1,
							"y": 0
						},
						"data": {
							"before": 0,
							"after": 2
						}
					}
				],
				"redo": [
					{
						"id": 3,
						"index": {
							"x": 3,
							"y": 3
						},
						"data": {
							"before": 16,
							"after": 12
						}
					}
				]
			},
			"gridSet": {
				"k1": {		// 이 방법을 통해 보드 내 셀에 저장된 값인 키 값을 찾아 하나의 값으로 간주한다.
					"data": 1,
					"type": 1
				},
				"k2": {
					"data": "a3",
					"type": 3
				}
			},
			"item": "item",
			"grid": "grid"
		};
		return data;
	};
	
	// JSON 형태의 모든 기록을 반출한다.
	this.exportData = function() {
		// 데이터 형식을 불러온다.
		var dataSet = this.portDataSet();
		
		// 그리드 보드 엔진 내 사용되는 기본 값이나 중요한 값을 불러와 저장한다.
		var init = this.getInit();
		dataSet.init = init;
		
		// 기록 스택을 불러와 데이터 형식에 맞게 저장한다. (패스 데이터도 포함)
		var undo = this.ejectUndoStack();
		dataSet.history.undo = undo;
		
		var redo = this.ejectRedoStack();
		dataSet.history.redo = redo;
		
		// 프레임 사이즈를 불러와 데이터 형식에 맞게 저장한다.
		var fs = this.getFrameSize();
		dataSet.frameSize.x = fs.x;
		dataSet.frameSize.y = fs.y;
		
		// GridSet 저장
		
		return dataSet;
	};
	
	// TODO: 외부에 있는 데이터를 불러와 시스템을 구성한다. 불러내는
	
	// JSON 형태의 코드를 불러와 로딩한다.
	this.importData = function(data) {
		
		// 앞에서 인코딩된 코드를 디코딩하여 어떤 절차를 거친 다음, 해독한다.
		
		var dataSet = data;
		
		// 프린팅
		this.Table(dataSet);
		
		// 그리고 추출한 데이터를 기반으로 보드 크기를 확인하여 세팅하고,
		
		// 보드를 세팅하면, 그리드 구성을 파악하고,
		
		// 아이템의 모든 데이터들을 순서대로 셀칸 안에 삽입한다.
		
		// 그 다음, 기록스택을 불러와 데이터를 로드한다.
		this.loadUndoStack(data.history.undo);
		this.loadRedoStack(data.history.redo);
		
		// 이 모든 절차를 완료하고 시스템을 실행하는데에 성공하면 true를 반환한다.
		
		return true;
	};
	
	//// Port Data Set [import, export] data set micro functions
	
	/// stack Import (Load, set)
	
	this.loadUndoStack = function(undoData) {
		var undoArr = [];
		
		for (var i = 0; i < undoData.length; i++) {
			var id = undoData[i].id;
			var ix = undoData[i].index.x;
			var iy = undoData[i].index.y;
			var beforeData = undoData[i].data.before;
			var AfterData = undoData[i].data.after;
			
			undoArr.push(undoData[i]);	// 아직 undo와 redo의 기록 스택 형식을 정의 안했음.
		}
		
		this.undoSave(undoArr);
	};
	
	this.saveUndoStack = function(undoArr) {
		this.undoStack = undoArr;
	}
	
	
	this.loadRedoStack = function(redoData) {
		
	};
	
	this.saveRedoStack = function(redoArr) {
		this.redoStack = redoArr;
	}
	
	/// stack Export (Eject, get)
	
	this.ejectUndoStack = function() {
		return this.undoStack;
	};
	
	this.ejectRedoStack = function() {
		return this.redoStack;
	};
	
	
	/// board&grid Load and Eject
	
	this.boardLoad = function(board) {
		this.board = board;
	};
	
	this.boardEject = function() {
		return { grid: grid, board: board };
	};
	
	this.gridLoad = function(grid) {
		this.grid = grid;
	};
	
	this.gridEject = function() {
		return { grid: grid };
	}
	
	// 
	
	
	
	// Return to Data Type Number for PortDataset
	this.portDataTypeSet = function(data) {
		var type = (typeof data);	// int=1, string=3, null=0, undefined=4, object=5, margeItem=2
		if (type == "number") return 1;
		else if (type == "string") return 3;	// 2는 margedItem의 값이라 margedItem을 넣으면 문자열을 반환
		else if (type == "undefined") return 4;
		else if (type == "object") return 5;	// null을 object로 인식하기도 함
		else if (type == "boolean") return 6;
		else if (type == "function") return 7;
		else if (type == "bigint") return 8;
		else if (type == "symbol") return 9;
		else return 0;	// 이건 명시적 오류거나, 이하 버전에서 symbol을 이렇게 인식할수도 있다.
	}
	
	
	
	
	
	/// FIXME: 보드 확장 및 축소, 크기 변경하는 라이브러리 (일부는 작은 단위로 해체를 필요로 함)
	
	// CHANGES: 프레임 사이즈를 변경하는 함수. (x,y)로 변경하고 보드를 리셋 (결과값은 맵 또는 처리결과값)
	this.changeFrameSize = function(x,y,valid,process) {
		// x와 y는 변경될 사이즈 값이고, valid
		// (맵을 반환하는 조건이면)맵을 반환하고, 저장하거나(맵을 저장하는 조건이면) 맵을 새로 덮어쓰기 하면 결과 값을 반환
		
		var result = null;
		
		// 처음에 맵을 저장해두는 임시변수임, 조건을 체크하고나서 이 맵을 result로 반환하기도 함.
//		var map = null;
		
		// 현재 프레임 사이즈를 가져옴 (나중에 before Size가 됨)
		var before = this.getFrameSize();
		
		// 그리고 판단함수는 이 기준에 맞게 {x,y} 오브젝트로 반환할 것이다.
		var check = this.itFrameSizeCheck(before.x,before.y,x,y);
		
		// 분기점만 여기서 지정하면 될 것이다.
		// 0: 변동없음, 1: 전체확대, 2: 전체축소, 3: 확대축소, 4: 에러발생
		if (check == 1) result = this.expand({x: x, y: y, valid: valid});
		else if (check == 2) result = this.contract({x: x, y: y, process: process});
		else if (check == 3) result = this.resizeFrame({x: x, y: y, valid: valid, process: process});
		else {				// 이건 무조건 0 아니면  4인데, 이거나 저거나 둘다 에러행
			if (check == 0) this.Log("변동이 없습니다!");
			else this.MethodError('changeFrameSize', "It's invalid value - frameSize or parameter.");
			result = false;
		}
		
		return result;
	};
	
	// CHANGES: 확장하는 함수 (확장되면서 발생하는 빈 값을 초기값으로 채운다)
	this.expand = function(args) {	// x, y, valid
		var result = false;	// 맵이나 결과값을 반환한다.
		var newGrid = this.makeGrid(args.x,args.y);	// 새로운 보드를 만듬
		var newBoard = this.storeGridAllOneVal(newGrid,this.getInit());	// 새로운 보드에 하나의 초기값으로 설정
		
		// 여기에는 기존의 맵을 불러와서 새로운 맵 안에 저장한다.
		
		// 확장된 맵은 반드시 기존 맵보다 더 클 것이므로 그 좌표만 파악하여 복제한다.
		for (var y = 0; y < this.board.length; y++) {
			for (var x = 0; x < this.board[y].length; x++) newBoard[y][x] = this.getIndexItem(x,y);
		}
		
		this.setFrameSize(args.x, args.y);
		
		if (args.valid == 1) result = newBoard();
		else if (this.setBoard(newBoard)) result = true;
		
		return result;
	};
	
	// CHANGES: 맵의 크기를 축소하는 함수. (맵을 축소하면서 발생하는 아웃사이더 데이터를 처리하기도 함)
	this.contract = function(args) {	// x, y, progress
		var result = false;
		var newGrid = this.makeGrid(args.x,args.y);	// 새로운 보드를 만듬
		var newBoard = this.storeGridAllOneVal(newGrid,this.getInit());	// 새로운 보드에 하나의 초기값으로 설정
		
		// 여기서 작아진 새로운 보드 내 값을 기존 보드에서 가져와 저장한다.
		for (var y = 0; y < newBoard.length; y++) {
			for (var x = 0; x < newBoard[y].length; x++) newBoard[y][x] = this.getIndexItem(x,y);
		}
		
		this.setFrameSize(args.x, args.y);
		
		if (args.progress == 1) result = newBoard;
		else {
			if (this.setBoard(newBoard)) result = true;
		}
		
		return result;
	};
	
	// 확장과 축소가 동시에 사용하여 사이즈의 임의적 변경을 처리하는 함수 - 예시: (7,9) -> (9,7) / (6,3) -> (3,6)
	this.resizeFrame = function(args) {	// args = {x, y, valid, process}
		var result;	// 이거는 저장되는 값이 맵일수도 boolean 값일수도 있다.
		var before = this.getFrameSize();
		var newBoard;
		
//		var beforeBoard = this.getBoard();	// 이거는 나중에 보드를 원래대로 복구할 때 사용
		
		// args(x, y, valid, progress)를 사용하지 않는다. 변형된 값을 사용해야 한다.
		
		if ((args.x > before.x) && (args.y < before.y)) {	// x 기준으로 먼저 확장하고 y 기준으로 축소
			
			if (this.expand({x: args.x, y: before.y, valid: 0})){	// 일단 이놈은 현 보드에 덮어쓰기를 실행한다.
				// 커지는 쪽의 값만을 기준으로 잡는다.

				newBoard = this.contract({x: args.x, y: args.y, progress: 1});
				// 그리고 현 보드를 기준으로 실행할 것이다.
			}
			// 
		}
		else if ((args.x < before.x) && (args.y > before.y)) {	// y 먼저 확장, 후 x 축소
			if (this.expand({x: before.x, y: args.y, valid: 0})){	// 현재 보드에서 덮어쓰기를 강행한다.

				newBoard = this.contract({x: args.x, y: args.y, progress: 1});
				// 그리고 덮어쓰게 된 보드를 기준으로 축소를 실행하고 현재 보드를 반환받음.
			}
		}
		
		this.setFrameSize(args.x, args.y);
		
		// 만약, 반환받는 값을 덮어쓰기 성공여부로 받는다면 newBoard가 board에 덮어쓰기 하지 않게 하고,
		// 맵을 통째로 반환받는 것으로 한다면 board에 덮어쓰지 않고 newBoard를 반환한다.
		if (args.valid==1 || args.process==1) {	// FIXME 얘를 좀만 다듬어야 됨
			result = newBoard;
		}
		else {
			if (this.setBoard(newBoard)) {
				result = true;
			}
		}
		// 여기서 result를 확인해야 한다. args.valid와 args.progress 값을 체크하며
		// return값이 map이 되는지, boolean이 되는지 체크해야 한다.
		// 일단 args를 그대로 사용하지 않고, valid와 progress를 무조건 맵을 받는 값으로 호출한다.
		
		// 확장하고 나면 축소를 해야 하는데, 현 보드가 변경되지 않았기 때문에 축소가 발생하지 않는다.
		// 그래서 일단은 보드를 변경하고 나중에 result가 완료되면, beforeBoard에 저장한 값으로 덮어쓰기 한다.
		
		return result;	// 결과값은 true나 false일수도 있고, 맵일 수도 있다. 이걸 변경해야 한다.
	};
	
	// 현재 보드의 프레임 사이즈를 반환하는 함수. (인덱스가 아닌 크기임)
	this.getFrameSize = function() {
		return this.getIndex(this.frameX, this.frameY);
	};
	
	// before(x,y)와 after(x,y)를 비교하여 확대 또는 축소를 결정
	// 0: 변동없음, 1: 전체확대, 2: 전체축소, 3: 확대축소, 4: 에러발생
	this.itFrameSizeCheck = function(bx,by,ax,ay) {
		var check = this.decisionByFrameSize(this.getIndex(bx,by), this.getIndex(ax,ay));
		
		if (check.x == 0 && check.y == 0) return 0;
		else if (check.x >= 0 && check.y >= 0) return 1;
		else if (check.x <= 0 && check.y <= 0) return 2;
		else if ((check.x > 0 && check.y < 0) || (check.x < 0 && check.y > 0)) return 3;
		else return 4;
	};
	
	// 각자 (x,y)가 각각 커지는지 작아지는지 동일크기인지 반환
	this.decisionByFrameSize = function(bs,ns) {
		return this.getIndex(
			this.decisionExpandOrContract(bs.x,ns.x),
			this.decisionExpandOrContract(bs.y,ns.y)
		);
	};
	
	// bv와 av를 비교해 커지면 1, 작아지면 -1, 동일하면 0을 반환 (before value: bv, after value: av)
	this.decisionExpandOrContract = function(bv,av) {
		return (bv == av) ? 0 : ((bv < av) ? 1 : -1);
	};
	
	/*
	// 그리드를 리셋하는 일을 한다. 즉, 그리드를 재(설정)배치한다는 것이다. 완료하면 true를 반환.
	this.resetGrid = function(x,y) {	// parameter is afterSize
		
		var beforeBoard = this.getBoard();
		var newBoard = this.makeGrid(x,y);
		
		var beforeSize = this.getFrameSize();	// ???
		
		
	};
	// 왠지 안 쓸거같기도 하고 필요 없어 보인다.
	*/
	
	
	
	
	
	
	/// TODO:기록 스택 - 이 함수들은 실행되면 보드에 영향을 줄 수 있으며, 보드가 이전 또는 다음으로 변경될 수 있다.
	
	// 기록 저장
	this.save = function() {
		this.undoStack.push();
		if (!this.redoIsEmpty()) this.redoClear();
	}
	
	// undo 실행
	this.undo = function() {
		var data = this.undoPop();
		this.redoPush(data);
	}
	
	// redo 실행
	this.redo = function() {
		var data = this.redoPop();
		this.undoPush(data);
	}
	
	// CHANGES: 스택 패스 실행
	this.pass = function() {
		this.stackPass = true;
	}
	
	// CHANGES: 스택 패스 종료
	this.unPass = function() {
		this.stackPass = false;
	}
	
	// CHANGES: 패스 데이터 분석
	this.loadPass = function() {
		
	}
	
	
	
	
	
	// CHANGES: 스택전용 데이터 형식으로 변환하는 함수
	this.convertStackData = function(x,y,beforeData, afterData) {
		if (beforeData == afterData) return {type: 0};
		else return { x: x, y: y, bd: beforeData, ad: afterData, type: 1 };
	}
	
	// CHANGES: 스택 패스 상태일 때 쓰는 데이터 형식으로 변환하는 함수
	this.convertStackPass = function(pd) {
		var dataPass = {
			type: null, x: null, y: null, bd: null, ad: null,
			bb: null, ab: null, ba: null, aa: null
		};
		
		// type에서 Pass의 형태에 따라 저장하는 값이 달라진다.
		// 3: "선형 그리기", 4: "사각형 그리기", 5: "", 6: "",
		// 7: "보드 전체가 바뀜", 8: "", 9: ""
		if (pd.type > 2 && pd.type < 10) dataPass.type = pd.type;
		else return false;
		
		// 형태에 따라 타입 뿐만 아니라 -d에 저장되거나 -b, -a에 저장될 수도 있다.
		
	}
	
	
	
	
	//// 기록 스택을 정상적으로 작동할 수 있도록 하는 마이크로 함수들
	
	/// undoStack과 관련있는 함수들
	// push
	this.undoPush = function(data) { this.undoStack.push(data); }
	// pop
	this.undoPop = function() { return this.undoStack.pop(); }
	// peek
	this.undoPeek = function() { return this.undoStack[this.undoStack.length-1]; }
	// isEmpty (if undoStack have a data, return false, and havn't a data, return true)
	this.undoIsEmpty = function() { return this.undoStack.length == 0; }
	// clear
	this.undoClear = function() { this.undoStack = []; }
	// length
	this.undoLength = function() { return this.undoStack.length; }
	
	/// redoStack과 관련있는 함수들
	// push
	this.redoPush = function(data) { this.redoStack.push(data); }
	// pop
	this.redoPop = function() { return this.redoStack.pop(); }
	// peek
	this.redoPeek = function() { return this.redoStack[this.redoStack.length-1]; }
	// isEmpty (if undoStack have a data, return false, and havn't a data, return true)
	this.redoIsEmpty = function() { return this.redoStack.length == 0; }
	// clear
	this.redoClear = function() { this.redoStack = []; }
	// length
	this.redoLength = function() { return this.redoStack.length; }
	
	/// stack List (원래 쓰면 안되는거임)
	// return to undoStack and redoStack List
	this.undoList = function() { return this.undoStack.toString(); }
	this.redoList = function() { return this.redoStack.toString(); }
	// printTable undoStack and redoStack List
	this.undoTable = function() { this.Table(this.undoStack); }
	this.redoTable = function() { this.Table(this.redoStack); }
	
	
	
	
	//// 탐색함수들
	
	// 여기에 있는 아래의 함수들은 모두 for에서 y 안에 x 방식으로 탐색한다는 것이다.
	// 여기서 조건이란 판별함수를 파라미터에 대입되어 계산한다는 것이다.
	// 조건의 형식은 다음과 같다. i => i < 0
	
	// TODO : 아래의 복잡한 것을 간결하게 만들고 기능을 완성시킬 것,
	// 또한 게임을 위해 제대로 작동하기 위한 함수를 개발할 것
	// 이 함수에서 고차함수 기능이 절대적으로 필요한 부분이 있으므로, 이를 배워올 것!
	
	// 분석 결과, 고차함수를 활용하여 만든 탐색함수를 통해
	// 다른 함수(예를 들어 indexOf, findIndex, findAll, findIndexAll 등의 함수)를
	// 탐색 함수 하나로 모든 것을 구현할 수 있다. 
	// indexOf같으면 함수 내에 작성하여 처음 발견되는 일치하는 값의 인덱스를 반환하고 종료시키면 되는 것이다!
	
	// TODO: 반복되는 부수적인 요소를 줄이기 위한 함수 작성하기
	this.boardEach = function(func) {
		for (var y of this.board) {
			for (var x of this.board[y]) {
				func();
				var dx = x, dy = y;
			}
		}
	}
	
	// TODO: 이 값을 찾아 맨 처음의 값의 인덱스를 반환 (없으면 undefine)
	this.indexOf = function(val) {
		var arr = new Array();
		
		for (var y of this.board) {
			for (var x of this.board[y]) {
				if (this.getIndexItem(x,y) == val) arr.push(this.getIndexItem(x,y));
			}
		}
		
		return arr;
	};
	
	// TODO: 이 값을 찾아 맨 처음의 인덱스를 반환. (없으면 undefine)
	this.findIndex = function(val) {
		for (var y of this.board) {
			for (var x of this.board[y]) {
				if (this.getIndexItem(x,y) == val) return this.setIndex(x,y);
			}
		}
		return undefined;
	};
	
	// TODO: 주어진 값을 모두 찾아 배열로 반환. (없으면 undefine)
	this.findAll = function(val) {
		var arr = new Array();
		
		for (var y of this.board) {
			for (var x of this.board[y]) {
				if (this.getIndexItem(x,y) == val) arr.push(this.getIndexItem(x,y));
			}
		}
		if (arr.length == 0) return undefined;
		
		return arr;
	};
	
	// TODO: 주어진 값을 모두 찾아 인덱스 배열로 반환. (없으면 undefine)
	this.findIndexAll = function(val) {
		var arr = new Array();
		
		for (var y of this.board) {
			for (var x of this.board[y]) {
				if (this.getIndexItem(x,y) == val) arr.push(this.setIndex(x,y));
			}
		}
		if (arr.length == 0) return undefined;
		
		return arr;
	};
	
	// TODO: 주어진 조건을 만족하는 값의 첫번째 요소의 값을 반환. (없으면 undefine)
	this.find = function(opt) {
		for (var y of this.board) {
			for (var x of this.board[y]) {
				if (opt(this.getIndexItem(x,y))) return this.getIndexItem(x,y);
			}
		}
		return undefined;
	};
	
	// 함수형 자바스크립트 프로그래밍을 참고했으며, 보드 내 각각의 아이템들이 오브젝트일때,
	// 이 오브젝트 내 키 값의 조건을 필터링하여 배열로 반환.
	// 주어진 조건을 만족하는 값을 가진 모든 값을 배열로 반환.
	// TODO: 조건함수를 파라미터로 받아 조건함수가 발동되기까지 훑어보는 함수
	this.filter = function(opt) {
		var arr = [];
		for (var y of this.board) {
			for (var x of this.board[y]) {
				if (opt(this.getIndexItem(x,y))) arr.push(this.getIndexItem(x,y));
			}
		}
		return arr;
	};
	/* NOTE: // filter 함수의 올바른 사용방법: (보드 내에 있는 조건을 만족하는 모든 값을 가져오는 방법)
	var temp_users = [];
	for (var i = 0, len = users.length; i < len; i++) {
		if (users[i].age < 30) temp_users.push(users[i]);
	}
	console.log(temp_users.length); // 4
	
	// 위의 코드를 아래처럼 해야 작동가능하다.
	
	var users_under_30 = filter(function(user) { return user.age < 30 });
	console.log(users_under_30.length);
	*/
	
	/// 인덱스가 밖으로 나가는지 검사해야 됨
	
	
	
	
	
	// 시작좌표에 따라 해당 좌표를 계산하여 해당 위치에 있는 아이템의 값을 반환하는 함수.
	this.getItem = function(x,y) {	// 해당 좌표값의 값을 반환.
		if (!this.validIndex(x,y)) 
			this.MethodError('getItem','Invalid - The index of Item Can\'t set outside.');
		else return this.getIndexItem(this.convertIndex(x), this.convertIndex(y));
	};
	
	// 시작좌표에 따라 해당 좌표의 아이템에 값을 덮어쓰기 하거나 저장하는 함수.
	this.setItem = function(x,y,val) {
		if (!this.validIndex(x,y)) this.MethodError('setItem','invalid - The index of Item Can\'t set outside.');
		else this.setIndexItem(this.convertIndex(x), this.convertIndex(y), val);
	};
	
	// (x,y)의 값을 {x,y} 형태로 반환하는 함수.
	this.getIndex = function(x,y) {	return {x: parseInt(x), y: parseInt(y)}; };
	
	// (x,y)의 값을 절대좌표값으로 변환하는 함수. (0을 기준으로 위치를 계산하여 {x,y}로 반환)
	this.setIndex = function(ix,iy) { return this.getIndex(this.convertIndex(ix),this.convertIndex(iy)); };
	
	// 시작 인덱스 값에 따라 시작 인덱스가 1로 시작하면 0을 반환하고, 0으로 시작하면 그대로 반환함.
	this.convertIndex = function(index) { return ((this.index) ? --index : index); };
	
	// 절대좌표 기준 해당 좌표의 값을 반환하는 함수.
	this.getIndexItem = function(x,y) { return this.board[y][x]; };
	
	// 절대좌표 기준 해당 좌표에 값을 저장하는 함수.
	this.setIndexItem = function(x,y,val) { this.board[y][x] = val; };
	
	// 해당 좌표에 저장된 값이 초기값인지 확인하는 함수. (아이템 값이 초기값이면 비었다고 간주)
	this.isEmptyItem = function(x,y) { return this.getItem(x,y) == this.getInit(); };
	
	// 해당 절대좌표에 저장된 값이 초기값인지 확인하는 함수. (아이템 값이 초기값이면 비었다고 간주)
	this.isEmptyIndexItem = function(x,y) { return this.getIndexItem(x,y) == this.getInit(); };
	
	// A(x,y)의 값을 B(x,y)로 이동. (Ctrl+X -> Ctrl+V)
	this.move = function(ax,ay,bx,by) {
		this.setItem(bx, by, this.getItem(ax,ay));
		this.setItem(ax, ay, this.getInit());	// 해당 아이템은 이동되었으므로 그 값을 초기값으로 저장.
	};
	
	// A(x,y)의 값을 B(x,y)로 복사. (Ctrl+C -> Ctrl+V)
	this.copy = function(ax,ay,bx,by) { this.setItem(bx, by, this.getItem(ax,ay)); };
	
	// A부터 B까지 (가로,세로,대각)선 안에 들어오면 선을 그리는 함수. (선형 유효하지 않으면 에러 출력)
	this.draw = function(ax,ay,bx,by) {
		var type = this.derivationLineType(ax,ay,bx,by);
		
		if (this.validIndex(ax,ay) && this.validIndex(bx,by)) {
			if (type == 1) return this.drawLinearHorizon(ax,bx,ay);
			else if (type == 2) return this.drawLinearVertical(ay,by,ax);
			else if (type == 3) return this.drawLinearDiagonal(ax,ay,bx,by);
			this.MethodError('draw','It\'s not matched Linear Type');
		}
		else this.MethodError('draw','The index of Item Cannot draw outside.');
	};
	
	// 가로선(수평선)을 그리는 함수.
	this.drawLinearHorizon = function(ax,bx,aby) {
		if (this.validHorizontal(ax,aby,bx,aby)) {
			var x = this.setMinAndMax(ax,bx);
			for (var fx = x.min; fx <= x.max; fx++) this.copy(x.min,aby,fx,aby);
		}
		else this.MethodError('drawLinearHorizon','invalid Horizon Linear');
	};
	
	// 세로선(수직선)을 그리는 함수.
	this.drawLinearVertical = function(ay,by,abx) {
		if (this.validVertical(abx,ay,abx,by)) {
			var y = this.setMinAndMax(ay,by);
			for (var fy = y.min; fy <= y.max; fy++) this.copy(abx,y.min,abx,fy);
		}
		else this.MethodError('drawLinearVertical','invalid Vertical Linear');
	};
	
	// 대각선을 그리는 함수. (대각선 타입에 따라 나누어 실행한다)
	this.drawLinearDiagonal = function(ax,ay,bx,by) {
		if (this.validDiagonal(ax,ay,bx,by)) {
			var x = this.setMinAndMax(ax,bx);
			var y = this.setMinAndMax(ay,by);

			if (this.validIndex(ax,ay) && this.validIndex(bx,by)) {
				if (this.validDiagonalType(x,y,ax,ay)) this.drawLinearDiagonalDown(x,y,ax,ay);
				else this.drawLinearDiagonalUp(x,y,ax,ay);
			}
			else this.MethodError('drawLinearDiagonal','invalid index');
		}
		else this.MethodError('drawLinearDiagonal','invalid Diagonal Linear');
	};
	
	// A부터 NW->SE 방향으로 대각선을 그리는 함수.
	this.drawLinearDiagonalDown = function(x,y,ax,ay) {	// draw -> \
		for (var i = 0; i <= x.max - x.min; i++) this.copy(ax,ay,(x.min+i),(y.max-i));
	};
	
	// A부터 SW->NE 방향으로 대각선을 그리는 함수.
	this.drawLinearDiagonalUp = function(x,y,ax,ay) {	// draw -> /
		for (var i = 0; i <= x.max - x.min; i++) this.copy(ax,ay,(x.min+i),(y.min+i));
	};
	
	// 대각선 유효성을 검사하는 함수.
	this.validDiagonalType = function(x,y,ax,ay) {
		return ((x.min == ax)||(y.min == ay))&&!((x.min == ax)&&(y.min == ay));
	};
	
	// A부터 B까지 사각형으로 A의 값으로 채우는 함수.
	this.drawRect = function(ax,ay,bx,by) {
		var x = this.setMinAndMax(ax,bx), y = this.setMinAndMax(ay,by);
		for (var fx = x.min; fx <= x.max; fx++) {
			for (var fy = y.min; fy <= y.max; fy++) this.copy(ax,ay,fx,fy);
		}
	};
	
	// a와 b의 값을 비교하여 max와 min을 나누어 반환하는 함수.
	this.setMinAndMax = function(a,b) {
		var min = a, max = b;
		if (a > b) {
			var tmp = min;
			min = max;
			max = tmp;
		}
		return {min: min, max: max};
	};
	
	
	// A(x,y)를 (가로,세로,대각)선형으로 방향(dir)으로 몇 칸만큼(block) 이동시키는 함수.
	
	// 몇 칸만큼이란, OXOOOO를 오른쪽으로 2칸 이동 시 -> OOOXOO가 되는 것이다.
	this.moveLinear = function(dir,interval,ax,ay) {
		var dc = interval;
		if ((typeof dir) == "string") dir = this.typeDirection(dir);	// 문자열이면 숫자로 변환.
		
		if (dir == 1) this.moveVertical(ax,ay,ax,ax-dc);
		else if (dir == 2) this.moveHorizontal(ax,ay,ax-dc,ay);
		else if (dir == 3) this.moveVertical(ax,ay,ax,ay+dc);
		else if (dir == 4) this.moveHorizontal(ax,ay,ax+dc,ay);
		else if (dir == 5) this.moveDiagonal(ax,ay,ax-dc,ay-dc);
		else if (dir == 6) this.moveDiagonal(ax,ay,ax+dc,ay-dc);
		else if (dir == 7) this.moveDiagonal(ax,ay,ax+dc,ay+dc);
		else if (dir == 8) this.moveDiagonal(ax,ay,ax-dc,ay+dc);
		else {
			this.MethodError('moveLinear','invaild dir');
			return false;
		}
		return true;	// default가 작동되지 않는 한, true를 반환
	};
	
	// 가로방향으로 이동하는 함수.
	this.moveHorizontal = function(ax,ay,bx,by) {
		if (this.validHorizontal(ax,ay,bx,by)) this.move(ax,ay,bx,by);
	};
	
	// 세로방향으로 이동하는 함수.
	this.moveVertical = function(ax,ay,bx,by) {
		if (this.validVertical(ax,ay,bx,by)) this.move(ax,ay,bx,by);
	};
	
	// 대각선방향으로 이동하는 함수.
	this.moveDiagonal = function(ax,ay,bx,by) {
		if (this.validVertical) this.move(ax,ay,bx,by);
	};
	
	// A부터 B까지 (가로,세로,대각)선 중 맞는 선을 반환하는 함수. (가로: 1, 세로: 2, 대각선: 3, 해당없음: 0)
	this.derivationLineType = function(ax,ay,bx,by) {
		if (this.validHorizontal(ax,ay,bx,by)) return 1;
		if (this.validVertical(ax,ay,bx,by)) return 2;
		if (this.validDiagonal(ax,ay,bx,by)) return 3;
		return 0;
	};
	
	// A부터 B까지가 가로(수평)선인지 검사하는 함수.
	this.validHorizontal = function(ax,ay,bx,by) {
		var pX = Math.abs(ax - bx);	// 가로는 양수가 되고
		var pY = Math.abs(ay - by);	// 세로는 0이여야 함
		return (pY == 0) && (pX > 0);
	};
	
	// A부터 B까지가 세로(수직)선인지 검사하는 함수.
	this.validVertical = function(ax,ay,bx,by) {
		var pX = Math.abs(ax - bx);	// 가로는 0이고
		var pY = Math.abs(ay - by);	// 세로는 양수여야 함
		return (pX == 0) && (pY > 0);
	};
	
	// A부터 B까지가 대각선인지 검사하는 함수.
	this.validDiagonal = function(ax,ay,bx,by) {
		var pX = Math.abs(ax - bx);
		var pY = Math.abs(ay - by);
		return ((pX == pY) && ((pX > 0) && (pY > 0)));
	};
	
	
	
	
	
	// 타입과 증감량에 따라 보드에 슬래시 맵을 생성하는 함수.
	this.setSlashMap = this.setSolidusMap = function(type,add) {
		if (type == 1) return this.setSlashMapNWtoSE(add);
		else if (type == 2) return this.setSlashMapSEtoNW(add);
		else if (type == 3) return this.setSlashMapNEtoSW(add);
		else if (type == 4) return this.setSlashMapSWtoNE(add);	// 새로운 맵을 만들어 덮어쓰기 성공여부를 반환.
		else this.MethodError('setSlashMap', 'There is not such type');
		return null;
	};
	
	// NW -> SE 방향으로 슬래시 맵을 생성.
	this.setSlashMapNWtoSE = function(add) {	// ++
		var newBoard = this.getBoard();
		var i = add;
		for (var y = 0; y < newBoard.length; y++) {
			var j = i;
			for (var x = 0; x < newBoard[y].length; x++) {
				// 여기에 보드 증산으로 값을 배치한다.
				newBoard[y][x] = j;
				j += add;
			}
			i += add;
		}
		return this.setBoard(newBoard);
	};
	
	// SE -> NW 방향으로 슬래시 맵을 생성.
	this.setSlashMapSEtoNW = function(add) {	// --
		var newBoard = this.getBoard();
		var i = add;
		for (var y = newBoard.length-1; y >= 0; y--) {
			var j = i;
			for (var x = newBoard[y].length-1; x >= 0; x--) {
				newBoard[y][x] = j;
				j += add;
			}
			i += add;
		}
		return this.setBoard(newBoard);
	};
	
	// NE -> SW 방향으로 슬래시 맵을 생성.
	this.setSlashMapNEtoSW = function(add) {	// -+
		var newBoard = this.getBoard();
		var i = add;
		for (var y = newBoard.length-1; y >= 0; y--) {
			var j = i;
			for (var x = 0; x < newBoard[y].length; x++) {
				newBoard[y][x] = j;
				j += add;
			}
			i += add;
		}
		return this.setBoard(newBoard);
	};
	
	// SW -> NE 방향으로 슬래시 맵을 생성.
	this.setSlashMapSWtoNE = function(add) {	// +-
		var newBoard = this.getBoard();
		var i = add;
		for (var y = 0; y < newBoard.length; y++) {
			var j = i;
			for (var x = newBoard[y].length-1; x >= 0; x--) {
				newBoard[y][x] = j;
				j += add;
			}
			i += add;
		}
		return this.setBoard(newBoard);
	};
	
	
	// 현재위치(fx,fy)에서 dir 방향으로 탐색하여 끝에 도달하면 해당 좌표를 반환.
	this.toEndOfLinearSearch = function(fx,fy,dir) { // 시작점의 현재 위치(x,y)와 방향
		var dirPos = this.setDirPos((typeof dir == "string") ? this.typeDirection(dir) : dir);
		
		var dx = dirPos.dx;
		var dy = dirPos.dy;	// 증감량 값, 그리고 각자 값을 저장
		if ((fx == dx) || (fy == dy)) return false;
		
		// 무한루프에 빠지지 않기 위한 장치.
		var frameSize = this.getFrameSize();
		var max = ((frameSize.x > frameSize.y) ? frameSize.x : frameSize.y);
		var l = 0;
		
		while (l < max) {
			// 먼저 현재위치에 값이 존재하면 x, y를 각각 dx, dy와 더하고, 존재하지 않으면 더하지 않고 break를 발동한다.
			if ((!this.validIndex(fx+dx, fy+dy)) || (!this.validItem(fx+dx, fy+dy))) break;
			
			// break가 발동되지 않는 한, 증감량을 더한다. 즉, 좌표의 아이템이 정상이면 계속 증가시키는 것.
			fx += dx;
			fx += dy;
			l++;
		}
		
		return {x: fx, y: fx};
	};
	
	// 방향에 대한 값을 반환
	// 방향 [1:N, 2:W, 3:S, 4:E, 5:NW, 6:NE, 7:SE, 8:SW]
	this.setDirPos = function(dir) {
		if ((dir < 1) || (dir > 8)) this.MethodError('setDirPos','Is not invalid dir value');
		else return {dx: this.setDirPosX(dir), dy: this.setDirPosY(dir)};
	};
	
	this.setDirPosX = function(dir) {
		if (dir == 2 || dir == 6 || dir == 7) return 1;
		else if (dir == 4 || dir == 5 || dir == 8) return -1;
		return 0;
	}
	
	this.setDirPosY = function(dir) {
		if (dir == 3 || dir == 7 || dir == 8) return 1;
		else if (dir == 1 || dir == 5 || dir == 6) return -1;
		return 0;
	}
	
	// 방향을 표시한 문자를 숫자로 반환 : 방향 [1:N, 2:W, 3:S, 4:E, 5:NW, 6:NE, 7:SE, 8:SW]
	this.typeDirection = function(dir) {
		if (dir == "N") return 1;
		else if (dir == "E") return 2;
		else if (dir == "S") return 3;
		else if (dir == "W") return 4;
		else if (dir == "NW") return 5;
		else if (dir == "NE") return 6;
		else if (dir == "SE") return 7;
		else if (dir == "SW") return 8;
		else return 0;
	};
	
	
	
	
	
	
	
	
	
	/// NOTE: 아주 중요한 핵심인데, 간단한 함수이면서도 중요한 라이브러리 모음
	
	// 아이템 유효 검사. undefined가 아닌 한 true를 반환. undefined -> false.
	this.validItem = function(ix,iy) { return !((typeof this.getItem(ix,iy)) == "undefined"); };
	
	// 시작 인덱스와 프레임 크기를 확인하고 인덱스 유효여부를 반환. 만약 밖으로 나간다->false. (밖으로 나가는지 검사)
	this.validIndex = function(ix,iy) {
		var startIndex = this.getStartIndex();
		var endIndex = this.getFrameSize();
		var x = ix - startIndex, y = iy - startIndex;	// 파라미터의 좌표값이 시작인덱스에 따라 변환하여 계산
		
		if (((0 > x) || (0 > y)) || ((endIndex.x-1 < x) || (endIndex.y-1 < y))) return false;
		else return true;
	};
	
	// 인덱스가 true나 1 이상이면 true, false나 0이면 false 반환.
	this.convertIndexValue = function(index) {
		return (((parseInt(index) == 0) || index == false) ? false : true);
	};
	
	// 저장된 시작 인덱스 값을 확인하고 반환.
	this.getStartIndex = function() { return (this.index ? 1 : 0); };
	
	// 시작 인덱스를 지정 (없으면 자동으로 바뀜)
	this.setStartIndex = function(index) {
		this.index = ((index === undefined) ? !this.index : this.convertIndexValue(index));
	};
	
	// 초기값을 저장하는 함수.
	this.setinit = function(val) { this.init = val; };
	
	// 초기값을 반환하는 함수.
	this.getInit = function() { return this.init; };
	
	// NotNull (null이 아니라면 true를 반환)
	this.NotNull = function(val) { return (val !== null); };
	
	// NotUndefine
	this.NotUndefined = function(val) { return (val !== null); };
	
	// 홀수 또는 짝수
	this.isOdd = function(val) { return val%2!=0; };
	this.isEven = function(val) { return val%2==0; };
	
	/// console의 종합세트임. (에러 감지오류를 해결하기 위함)
	this.Log = function(str) { console.log(str); };
	
	this.Table = function(data) { console.table(data); };
	
	this.Direction = function(data) { console.dir(data); };
	
	this.Warning = function(str) { console.warn(str); };
	
	this.Error = function(str) { console.error(str); };
	
	this.MethodError = function(method,script) { this.Error(method+"() method: "+script); };
	
	this.printGrid = function() { this.Table(this.getBoard()); };
	
	
	// 위의 모든 에러콘솔을 하나로 관리하기 위한 시스템 - 코드를 정리한 테이블을 따로 만들어 놓을 예정임. 이에 준수해 함수를 만들것
	this.errorCode = function(num) {	// int형 타입이지만, 
		if (num == 1) return "A";
		else if (num == 2) return "B";
		else if (num == 3) return "C";
		else if (num == 4) return "D";
		else if (num == 5) return "E";
		else return "F";
	};
	
};

// TEST ZONE
var GBE = new GridBoardEngine();
GBE.version();
