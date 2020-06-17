let TIMES = '×';
let DIVIDES = '÷';
let PLUS = '+';
let MINUS = '-';
let operators = [TIMES, DIVIDES, PLUS, MINUS];
let target = 24;
let answers = new Set();

class Expression {
  constructor(value, left, op, right) {
    if(left === undefined && op === undefined && right === undefined) {
      this.isNumber = true;
      this.value = value;
      this.left = null;
      this.right = null;
      this.operator = null;
    }
    else {
      this.isNumber = false;
      this.value = null;
      this.left = left;
      this.right = right;
      this.operator = op;
    }
  }

  isNumber() {
    return this.isNumber;
  }

  getValue() {
    if (this.isNumber) {
      return this.value;
    } else {
      if (this.operator == TIMES) {
        return this.left.getValue() * this.right.getValue();
      }
      if (this.operator == DIVIDES) {
        return this.left.getValue() / this.right.getValue();
      }
      if (this.operator == PLUS) {
        return this.left.getValue() + this.right.getValue();
      }
      if (this.operator == MINUS) {
        return this.left.getValue() - this.right.getValue();
      }
    }
  }

  getOperator() {
    return this.operator;
  }


  times(other) {
    return new Expression(0, this, TIMES, other);
  }

  divides(other) {
    return new Expression(0, this, DIVIDES, other);
  }

  plus(other) {
    return new Expression(0, this, PLUS, other);
  }

  minus(other) {
    return new Expression(0, this, MINUS, other);
  }

  toString() {
    if (this.isNumber) {
      return this.value.toString();
    } else {
      let left = this.left.toString();
      let right = this.right.toString();

      if (this.operator == TIMES || this.operator == DIVIDES) {
        if (this.left.operator == PLUS || this.left.operator == MINUS) {
          left = '(' + left + ')';
        }
        if (this.right.operator == PLUS || this.right.operator == MINUS) {
          right = '(' + right + ')';
        }
      }
      if (this.operator == DIVIDES) {
        if (this.right.operator == TIMES || this.right.operator == DIVIDES) {
          right = '(' + right + ')';
        }
      }
      if (this.operator == MINUS) {
        if (this.right.operator == PLUS || this.right.operator == MINUS) {
          right = '(' + right + ')';
        }
      }
      return left + this.operator + right;
    }
  }
}

function arrayCopy(x) {
  let y = Array();
  for (let item of x) {
    y.push(item);
  }
  return y;
}

function solve(numList) {
  if (numList == null || numList.length == 0) {
    return;
  }
  if (numList.length == 1 &&
      Math.abs(numList[0].getValue() - target) < Number.EPSILON) {
    answers.add(numList[0].toString());
    return;
  }

  for (let i = 0; i < numList.length; i++) {
    for (let j = i + 1; j < numList.length; j++) {
      let x = numList[i];
      let y = numList[j];
      let remainList = new Array();
      for (let k = 0; k < numList.length; k++) {
        if (k != i && k != j) {
          remainList.push(numList[k]);
        }
      }

      if (operators.includes(PLUS)) {
        newNumList = arrayCopy(remainList);
        newNumList.push(x.plus(y));
        solve(newNumList);
      }
      if (operators.includes(MINUS)) {
        newNumList = arrayCopy(remainList);
        newNumList.push(x.minus(y));
        solve(newNumList);
        if (x.getValue() != y.getValue()) {
          newNumList = arrayCopy(remainList);
          newNumList.push(y.minus(x));
          solve(newNumList);
        }
      }
      if (operators.includes(TIMES)) {
        newNumList = arrayCopy(remainList);
        newNumList.push(x.times(y));
        solve(newNumList);
      }
      if (operators.includes(DIVIDES)) {
        if (y.getValue() != 0) {
          newNumList = arrayCopy(remainList);
          newNumList.push(x.divides(y));
          solve(newNumList);
        }
        if (x.getValue() != 0 && x.getValue() != y.getValue()) {
          newNumList = arrayCopy(remainList);
          newNumList.push(y.divides(x));
          solve(newNumList);
        }
      }
    }
  }
}

function run(numbers) {
  let numList = Array();
  for (let n of numbers) {
    numList.push(new Expression(n));
  }
  solve(numList);
}

run([1,1,1,24]);

let result = '';
for (let x of answers) {
  result += '<section>' + x + '</section>';
}
document.getElementById('count').innerHTML = '<p>There are ' +
                                              answers.size + ' answers</p>';
document.getElementById('answers').innerHTML = result;
