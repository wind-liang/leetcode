# 题目描述（困难难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/37.png)

给定一个数独棋盘，输出它的一个解。

# 解法一 回溯法

从上到下，从左到右遍历每个空位置。在第一个位置，随便填一个可以填的数字，再在第二个位置填一个可以填的数字，一直执行下去直到最后一个位置。期间如果出现没有数字可以填的话，就回退到上一个位置，换一下数字，再向后进行下去。

```java
public void solveSudoku(char[][] board) {
    solver(board);
}
private boolean solver(char[][] board) {
    for (int i = 0; i < 9; i++) {
        for (int j = 0; j < 9; j++) {
            if (board[i][j] == '.') {
                char count = '1';
                while (count <= '9') {
                    if (isValid(i, j, board, count)) {
                        board[i][j] = count;
                        if (solver(board)) {
                            return true;
                        } else {
                            //下一个位置没有数字，就还原，然后当前位置尝试新的数
                            board[i][j] = '.';
                        }
                    }
                    count++;
                }
                return false;
            }
        }
    }
    return true;
}

private boolean isValid(int row, int col, char[][] board, char c) {
    for (int i = 0; i < 9; i++) {
        if (board[row][i] == c) {
            return false;
        }
    }

    for (int i = 0; i < 9; i++) {
        if (board[i][col] == c) {
            return false;
        }
    }

    int start_row = row / 3 * 3;
    int start_col = col / 3 * 3;
    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 3; j++) {
            if (board[start_row + i][start_col + j] == c) {
                return false;
            }
        }

    }
    return true;
}
```

时间复杂度：

空间复杂度：O（1）。

# 总

回溯法一个很典型的应用了。