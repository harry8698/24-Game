import time
from Game import *


def main():
    t0 = time.time()
    s = Solver(Expression.OPERATORS, 24)
    s.solve([1, 1, 1, 24])
    t1 = time.time() - t0
    print("Time elapsed: ", t1)


if __name__ == '__main__':
    main()
