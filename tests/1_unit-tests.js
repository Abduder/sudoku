const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver;

suite('UnitTests', () => {
  test("valid puzzle",()=>{
    let puzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    assert.equal(solver.validate(puzzle),"puzzle is valid");
  });
  test("invalid characters",()=>{
    let puzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......19e5....4.A7.4.3..6..";
    assert.equal(solver.validate(puzzle).error,"Invalid characters in puzzle");
  });
  test("not 81 characters in length",()=>{
    let puzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6";
    assert.equal(solver.validate(puzzle).error,"Expected puzzle to be 81 characters long");
  });
  test("valid row placement",()=>{
    let puzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
    assert.isTrue(solver.checkRowPlacement(puzzle,1,1,7));
  });
  test("invalid row placement",()=>{
    let puzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    assert.isNotTrue(solver.checkRowPlacement(puzzle,1,1,5));
  });
  test("valid col placement",()=>{
    let puzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
    assert.isTrue(solver.checkColPlacement(puzzle,1,1,7));
  });
  test("invalid col placement",()=>{
    let puzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    assert.isNotTrue(solver.checkColPlacement(puzzle,1,1,5));
  });
  test("valid region placement",()=>{
    let puzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
    assert.isTrue(solver.checkRegionPlacement(puzzle,1,1,7));
  });
  test("invalid region placement",()=>{
    let puzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    assert.isNotTrue(solver.checkRegionPlacement(puzzle,1,1,5));
  });
  test("valid puzzle pass",()=>{
    let puzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    let solution=solver.solve(puzzle)
    assert.isString(solution);
    assert.isTrue(solver.isValid(solution));
  });
  test("invalid puzzle fail",()=>{
    let puzzle = ".99.5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    assert.equal(solver.solve(puzzle),false);
  });
  test("incomplet puzzle",()=>{
    let puzzle = "....23...........................................................................";
    let solution=solver.solve(puzzle);
    assert.isString(solution);
    assert.isTrue(solver.isValid(solution));

  })
  
});
