# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/36.png)

一个 9 * 9 的数独的棋盘。判断已经写入数字的棋盘是不是合法。需要满足下边三点，

* 每一行的数字不能重复

* 每一列的数字不能重复
* 9 个 3 * 3 的小棋盘中的数字也不能重复。

只能是 1 - 9 中的数字，不需要考虑数独最后能不能填满。

# 解法一 暴力解法

需要满足三条，那就一条一条判断。

```java
public boolean isValidSudoku(char[][] board) {
    //判断每一行
    for (int i = 0; i < 9; i++) {
        if (!isValidRows(board[i])) {
            return false;
        }
    }
    //判断每一列
    for (int i = 0; i < 9; i++) {
        if (!isValidCols(i, board)) {
            return false;
        }
    }
	//判断每个小棋盘
    for (int i = 0; i < 9; i = i + 3) {
        for (int j = 0; j < 9; j = j + 3) {
            if (!isValidSmall(i, j, board)) {
                return false;
            }
        }

    }
    return true;
}

public boolean isValidRows(char[] board) {
    HashMap<Character, Integer> hashMap = new HashMap<>();
    for (char c : board) {
        if (c != '.') {
            if (hashMap.getOrDefault(c, 0) != 0) {
                return false;
            } else {
                hashMap.put(c, 1);
            }
        }
    }
    return true;
}

public boolean isValidCols(int col, char[][] board) {
    HashMap<Character, Integer> hashMap = new HashMap<>();
    for (int i = 0; i < 9; i++) {
        char c = board[i][col];
        if (c != '.') {
            if (hashMap.getOrDefault(c, 0) != 0) {
                return false;
            } else {
                hashMap.put(c, 1);
            }
        }
    }
    return true;
}

public boolean isValidSmall(int row, int col, char[][] board) {
    HashMap<Character, Integer> hashMap = new HashMap<>();
    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 3; j++) {
            char c = board[row + i][col + j];
            if (c != '.') {
                if (hashMap.getOrDefault(c, 0) != 0) {
                    return false;
                } else {
                    hashMap.put(c, 1);
                }
            }
        }
    }
    return true;
}
```

时间复杂度：整个棋盘访问了三次，如果棋盘大小是 n，那么就是 3n。也就是 O（n）。

空间复杂度：O（1）。

# 解法二

参考[这里](https://leetcode.com/problems/valid-sudoku/discuss/15472/Short%2BSimple-Java-using-Strings)，上边的算法遍历了三遍，我们能不能只遍历一遍。

我们可以这样想一下，如果有一副纸牌，怎么看它有没有重复的？

第一种我们可以像之前一样，第一遍先看红桃，再看黑桃，再看方片，再看梅花，这样就看了四遍。我们其实可以每拿到一张牌，就把它放在一个位置，我们把一类放在同一位置。红桃放在一起，黑桃放在一起……放的过程中如果有重复的就可以结束了。

在这里的话，我们就可以把第一行的放在一起，第二行的放在一起……第一列的放在一起，第二列的放在一起……第一个小棋盘的放在一起，第二个小棋盘的放在一起……

我们用 HashSet 实现放在一起的作用，但是这样的话总共就是 9 行，9 列，9 个小棋盘，27 个 HashSet 了。我们其实可以在放的时候标志一下，例如

* 如果第 4 行有一个数字 8，我们就 (8)4，把 "(8)4"放进去。
* 如果第 5 行有一个数字 6，我们就 5(6)，把 "5(6)"放进去。
* 小棋盘看成一个整体，总共是 9 个，3 行 3 列，如果第 2 行第 1 列的小棋盘里有个数字 3，我们就把 "2(3)1" 放进去。

这样 1 个 HashSet 就够了。

```java
public boolean isValidSudoku(char[][] board) {
    Set seen = new HashSet();
    for (int i=0; i<9; ++i) {
        for (int j=0; j<9; ++j) {
            if (board[i][j] != '.') {
                String b = "(" + board[i][j] + ")";
                if (!seen.add(b + i) || !seen.add(j + b) || !seen.add(i/3 + b + j/3))
                    return false;
            }
        }
    }
    return true;
}
```

时间复杂度：如果棋盘大小总共是 n，那么只遍历了一次，就是 O（n）。

空间复杂度：如果棋盘大小总共是 n，最坏的情况就是每个地方都有数字，就需要存三次，O（n）。

其实，想到了标识，其实我们可以标识的更彻底些，直接写出来。

```java
public boolean isValidSudoku(char[][] board) {
    Set seen = new HashSet();
    for (int i=0; i<9; ++i) {
        for (int j=0; j<9; ++j) {
            char number = board[i][j];
            if (number != '.')
                if (!seen.add(number + " in row " + i) ||
                    !seen.add(number + " in column " + j) ||
                    !seen.add(number + " in block " + i/3 + "-" + j/3))
                    return false;
        }
    }
    return true;
}
```

# 总

第二种解法的作者太太聪明了！自己规定格式这种思想，很棒。