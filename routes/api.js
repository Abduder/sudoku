'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      //console.log(req.body);
      let puzzle=req.body.puzzle;
      if(solver.validate(puzzle)!="puzzle is valid"){
        res.json(solver.validate(puzzle));
      }else{
        let coordinate = req.body.coordinate;
        let value =req.body.value;
        if(!coordinate || !value){
          res.json({ error: 'Required field(s) missing' })
        }else if(!/^[A-I][1-9]$/.test(coordinate)){
        res.json({ error: 'Invalid coordinate'});
        }else if(!/^[1-9]$/.test(value)){
          res.json({ error: 'Invalid value' });
        }else{
          let col = parseInt(coordinate.charAt(1));
          let rowCode ={A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9}
          let row=rowCode[coordinate.charAt(0)];
          //console.log(row);
          if(solver.checkRowPlacement(puzzle,row,col,value) && solver.checkColPlacement(puzzle,row,col,value) && solver.checkRegionPlacement(puzzle,row,col,value)){
            res.json({valid: true});
          }else{
            let conflict =[];
            if(!solver.checkRowPlacement(puzzle,row,col,value)){
              conflict.push("row");
            }
            if(!solver.checkColPlacement(puzzle,row,col,value)){
              conflict.push("column");
            }
            if(!solver.checkRegionPlacement(puzzle,row,col,value)){
              conflict.push("region");
            }
            res.json({valid:false, conflict:conflict});
          }
        }
      }
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      
      let puzzle=req.body.puzzle;
      if(!puzzle){
        res.json({ error: 'Required field missing' });
      }else if(solver.validate(puzzle)!= "puzzle is valid"){
        res.json(solver.validate(puzzle));
      }else{
        if(solver.isValid(puzzle)&&solver.solve(puzzle)){
          let arr = solver.solve(puzzle).split("");
          for(let i=0;i<81;i++){
            if(puzzle[i]=='.'){
              arr[i]="<span class='green'>"+arr[i]+"</span>";
            }
          }
          res.json({solution: arr})
          //res.json({solution:solver.solve(puzzle)});
        }else{
          res.json({ error: 'Puzzle cannot be solved' });
        }
      }
    });
  app.route('/api/generate')
  .get((req, res)=>{
    let p = [];
    for(let i=0;i<81;i++){
      p.push(".");
    }
    console.log(solver.holes(solver.generate(p)));
    res.json({puzzle:solver.holes(solver.generate(p))})
  })
};
