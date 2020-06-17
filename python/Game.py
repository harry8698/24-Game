class Expression(object):
    TIMES, DIVIDES, PLUS, MINUS = '×', '÷', '+', '-'
    OPERATORS = [TIMES, DIVIDES, PLUS, MINUS]

    def __init__(self, v, left=None, op=None, right=None):
        self.left, self.operator, self.right = left, op, right
        self.is_number = False
        if all(ele is None for ele in (left, op, right)):
            self.value = v
            self.is_number = True

    def is_number(self):
        return self.is_number

    def get_value(self):
        if self.is_number:
            return self.value
        if self.operator == self.TIMES:
            return self.left.get_value() * self.right.get_value()
        if self.operator == self.DIVIDES:
            return self.left.get_value() / self.right.get_value()
        if self.operator == self.PLUS:
            return self.left.get_value() + self.right.get_value()
        if self.operator == self.MINUS:
            return self.left.get_value() - self.right.get_value()

    def get_operator(self):
        if self.is_number:
            raise Exception('no operators in this expression')
        else:
            return self.operator

    def times(self, other):
        return Expression(0, self, self.TIMES, other)

    def divides(self, other):
        return Expression(0, self, self.DIVIDES, other)

    def plus(self, other):
        return Expression(0, self, self.PLUS, other)

    def minus(self, other):
        return Expression(0, self, self.MINUS, other)

    def __to_string(self):
        if self.is_number:
            return str(self.value)
        else:
            left = self.left.__to_string()
            right = self.right.__to_string()
            if self.operator == self.TIMES or self.operator == self.DIVIDES:
                if self.left.operator == self.PLUS or self.left.operator == self.MINUS:
                    left = '(' + left + ')'
                if self.right.operator == self.PLUS or self.right.operator == self.MINUS:
                    right = '(' + right + ')'
            if self.operator == self.DIVIDES:
                if self.right.operator == self.TIMES or self.right.operator == self.DIVIDES:
                    right = '(' + right + ')'
            if self.operator == self.MINUS:
                if self.right.operator == self.PLUS or self.right.operator == self.MINUS:
                    right = '(' + right + ')'
            return left + self.operator + right

    def __str__(self):
        return self.__to_string()


class Solver(object):
    def __init__(self, operators, target):
        self.operators, self.target = operators, target
        self.answers = set()

    def __solve_helper(self, numbers):
        if numbers is None or len(numbers) == 0:
            return
        if len(numbers) == 1 and abs(numbers[0].get_value() - self.target) < 1e-9:
            self.answers.add(str(numbers[0]))
            return

        for i in range(len(numbers)):
            for j in range(i + 1, len(numbers)):
                x, y = numbers[i], numbers[j]
                new_numbers = [n for n in numbers if n != numbers[i] and n != numbers[j]]
                if Expression.PLUS in self.operators:
                    self.__solve_helper(new_numbers + [x.plus(y)])
                if Expression.MINUS in self.operators:
                    self.__solve_helper(new_numbers + [x.minus(y)])
                    if x.get_value() != y.get_value():
                        self.__solve_helper(new_numbers + [y.minus(x)])
                if Expression.TIMES in self.operators:
                    self.__solve_helper(new_numbers + [x.times(y)])
                if Expression.DIVIDES in self.operators:
                    try:
                        self.__solve_helper(new_numbers + [x.divides(y)])
                    except ZeroDivisionError:
                        pass
                    if x.get_value() != y.get_value():
                        try:
                            self.__solve_helper(new_numbers + [y.divides(x)])
                        except ZeroDivisionError:
                            pass

    def solve(self, numbers):
        expressions = [Expression(x) for x in numbers]
        self.__solve_helper(expressions)
        if len(self.answers) == 0:
            print('No solutions')
        else:
            print('There ' + ('are ' if len(self.answers) > 1 else 'is ') +
                  str(len(self.answers)) + ' answer' + ('s' if len(self.answers) > 1 else ''))
            for i in self.answers:
                print(i)
        return True
