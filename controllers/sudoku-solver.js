class SudokuSolver {

  validate(puzzleString) {
    
    let puzzle = puzzleString.match(/[^1-9.]/);
    //console.log(puzzle);
    if(puzzle){
      return { error: 'Invalid characters in puzzle' };
    }
    if(puzzleString.length != 81){
      return { error: 'Expected puzzle to be 81 characters long' };
    }
    return "puzzle is valid"
    
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let position = 9*(row-1) +column-1;
    switch(puzzleString.charAt(position)){
      case value:
        return true;
      case ".":
        for(let i=9*(row-1);i<9*(row-1)+9;i++){
          if(puzzleString.charAt(i)==value){
            return false;
          }
        }
        return true;
      default :
        return false;
    } 
  }

  checkColPlacement(puzzleString, row, column, value) {
    let position = 9*(row-1) +column-1;
    switch(puzzleString.charAt(position)){
      case value:
        return true;
      case ".":
        for(let i = column-1;i<81;i+=9){
          if(puzzleString.charAt(i)==value){
            return false;
          }
        }
        return true;
      default:
        return false;
    }

  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let position = 9*(row-1) +column-1;
    switch(puzzleString.charAt(position)){
      case value:
        return true;
      case ".":
        for(let i=(row-1)-((row-1)%3);i<(row-1)-((row-1)%3)+3;i++){
          for(let j=(column-1)-((column-1)%3);j<(column-1)-((column-1)%3)+3;j++){
            if(puzzleString.charAt(9*i+j)==value){
              return false;
            }
          }
        }
        return true;
      default:
        return false;
    }
  }

  isValid(puzzle){
    for(let i = 0; i<81 ; i++){
      if(puzzle.charAt(i)!='.'){
        let row= Math.floor(i/9) +1;
        let col = i%9 +1;
        let testPuzzle= puzzle.substring(0,i)+'.'+puzzle.substring(i+1);
        if(!this.checkRowPlacement(testPuzzle,row,col,puzzle.charAt(i)) || !this.checkColPlacement(testPuzzle,row,col,puzzle.charAt(i))|| !this.checkRegionPlacement(testPuzzle,row,col,puzzle.charAt(i))){
          return false;
        }
      }
    }
    return true;
  }

  solve(puzzleString) {
    
    
    for(let i=0;i<81;i++){
      if(puzzleString.charAt(i)=='.'){
        let row = Math.floor(i/9)+1;
        let col = i%9+1;
        for(let j=1;j<=9;j++){
          if(this.checkRowPlacement(puzzleString,row,col,j)&&this.checkColPlacement(puzzleString,row,col,j)&&this.checkRegionPlacement(puzzleString,row,col,j)){
            puzzleString=puzzleString.substring(0,i)+j+puzzleString.substring(i+1);
            let solution=this.solve(puzzleString)
            if(solution){
              //console.log(puzzleString);
              return solution;
            }else{
              puzzleString=puzzleString.substring(0,i)+'.'+puzzleString.substring(i+1);
            }
          }
        }
        return false;
      }
    }
    return puzzleString;
  }

  generate(puzzle){
    let num= "123456789";
    for(let i=0; i<81;i++){
      if(puzzle[i]=='.'){
        for(let j=0; j<9; j++){
          let rand = num.charAt(Math.floor(Math.random()*num.length));
          puzzle[i]=rand;         if(this.isValid(puzzle.join(""))&&this.solve(puzzle.join(""))!=false){
            let gen=this.generate(puzzle);
            if(gen){
              return gen;
            }else{
              num= num.replace(rand,"");
            }
          }else{
            num = num.replace(rand,"");
          }
        }
        return false;
      }
    }
    return puzzle;
  }
  holes(puzzle){
    for(let i=0;i<45;i++){
      let rand = Math.floor(Math.random()*81);
      while(puzzle[rand]=='.'){
        rand = Math.floor(Math.random()*81);
      }
      puzzle[rand]='.';
      
    }
    return puzzle.join("");
  }
}

module.exports = SudokuSolver;

