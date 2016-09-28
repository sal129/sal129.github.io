describe("init", function() {
	it("should be a function", function() {
		assert.isFunction(init);
	});
});

describe("futureState", function() {
	it("should be a function", function() {
		assert.isFunction(futureState);
	});
	it("should have three arguments", function() {
		assert.equal(futureState.length, 3);
	});
	var COPIA = 200;
	var matrix = new Array(COPIA);
	var PROB = 0.45;
	for (var i = 0; i < COPIA; i++) {
		matrix[i] = new Array(COPIA);
	}
	for (var i = 0; i < COPIA; i++) {
		for (var j = 0; j < COPIA; j++) {
			if (Math.random() > PROB) {
				matrix[i][j] = 1;
			}
			else {
				matrix[i][j] = 0;
			}
		}
	}
	context("corner accuracy", function () {
		it("should output the right result(corner)", function() {
			matrix[0][1] = 0;
			matrix[1][0] = 0;
			matrix[1][1] = 0;
			assert.equal(futureState(0, 0, matrix), 0);
		});	
		it("should output the right result(corner)", function() {
			matrix[0][1] = 1;
			matrix[1][0] = 1;
			matrix[1][1] = 0;
			assert.equal(futureState(0, 0, matrix), 1);
		});	
		it("should output the right result(corner)", function() {
			matrix[0][1] = 0;
			matrix[1][0] = 0;
			matrix[1][1] = 1;
			assert.equal(futureState(0, 0, matrix), matrix[0][0]);
		});
	});
	context("edge accuracy", function () {
		it("should output the right result(edge)", function() {
			matrix[0][1] = 0;
			matrix[1][1] = 0;
			matrix[2][1] = 0;
			matrix[0][0] = 1;
			matrix[2][0] = 1;
			assert.equal(futureState(1, 0, matrix), 0);
		});	
		it("should output the right result(edge)", function() {
			matrix[0][1] = 0;
			matrix[1][1] = 0;
			matrix[2][1] = 0;
			matrix[0][0] = 0;
			matrix[2][0] = 1;
			assert.equal(futureState(1, 0, matrix), 1);
		});	
		it("should output the right result(edge)", function() {
			matrix[0][1] = 0;
			matrix[1][1] = 0;
			matrix[2][1] = 1;
			matrix[0][0] = 1;
			matrix[2][0] = 1;
			assert.equal(futureState(1, 0, matrix), matrix[1][0]);
		});
	});
	context("center accuracy", function () {
		matrix[0][0] = 1;
		matrix[0][1] = 1;
		matrix[0][2] = 1;
		matrix[1][0] = 1;
		matrix[1][2] = 1;
		matrix[2][0] = 1;
		matrix[2][1] = 1;
		matrix[2][2] = 1;
		it("should output the right result(edge)", function() {
			matrix[0][0] = 0;
			matrix[1][0] = 0;
			matrix[2][0] = 0;
			assert.equal(futureState(1, 1, matrix), 1);
		});	
		it("should output the right result(edge)", function() {
			matrix[0][0] = 0;
			matrix[1][0] = 1;
			matrix[2][0] = 1;
			assert.equal(futureState(1, 1, matrix), 0);
		});	
		it("should output the right result(edge)", function() {
			matrix[0][0] = 0;
			matrix[1][0] = 0;
			matrix[2][0] = 1;
			assert.equal(futureState(1, 1, matrix), matrix[1][1]);
		});
	});
});

describe("drawFuture", function() {
	it("should be a function", function() {
		assert.isFunction(drawFuture);
	});
});