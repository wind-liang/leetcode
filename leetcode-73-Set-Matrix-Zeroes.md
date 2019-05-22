# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/73.jpg)

给定一个矩阵，然后找到所有含有 0 的地方，把该位置所在行所在列的元素全部变成 0。

# 解法一

暴力解法，用一个等大的空间把给定的矩阵存起来，然后遍历这个矩阵，遇到 0 就把原矩阵的当前行，当前列全部变作 0，然后继续遍历。

```java
public void setZeroes(int[][] matrix) {
    int row = matrix.length;
    int col = matrix[0].length;
    int[][] matrix_copy = new int[row][col];
    //复制矩阵
    for (int i = 0; i < row; i++) {
        for (int j = 0; j < col; j++) {
            matrix_copy[i][j] = matrix[i][j];
        }
    }
    for (int i = 0; i < row; i++) {
        for (int j = 0; j < col; j++) {
            //找到 0 的位置
            if (matrix_copy[i][j] == 0) {
                //将当前行，当前列置为 0 
                setRowZeroes(matrix, i);
                setColZeroes(matrix, j);
            }

        }
    }
}
//第 col 列全部置为 0
private void setColZeroes(int[][] matrix, int col) {
    for (int i = 0; i < matrix.length; i++) {
        matrix[i][col] = 0;
    }
}
//第 rol 行全部置为 0
private void setRowZeroes(int[][] matrix, int row) {
    for (int i = 0; i < matrix[row].length; i++) {
        matrix[row][i] = 0;
    }
}
```

时间复杂度：O ( mn )。

空间复杂度：O（mn）。m 和 n 分别是矩阵的行数和列数。

# 解法二

空间复杂度可以优化一下，我们可以把哪一行有 0 ，哪一列有 0 都记录下来，然后最后统一把这些行，这些列置为 0。

```java
public void setZeroes(int[][] matrix) {
    int row = matrix.length;
    int col = matrix[0].length;
    //用两个 bool 数组标记当前行和当前列是否需要置为 0
    boolean[] row_zero = new boolean[row]; 
    boolean[] col_zero = new boolean[col];
    for (int i = 0; i < row; i++) {
        for (int j = 0; j < col; j++) {
            //找到 0 的位置
            if (matrix[i][j] == 0) {
                row_zero[i] = true;
                col_zero[j] = true;
            }
        }
    }
    //将行标记为 true 的行全部置为 0
    for (int i = 0; i < row; i++) {
        if (row_zero[i]) {
            setRowZeroes(matrix, i);
        }
    }
    //将列标记为 false 的列全部置为 0
    for (int i = 0; i < col; i++) {
        if (col_zero[i]) {
            setColZeroes(matrix, i);
        }
    }
}
//第 col 列全部置为 0
private void setColZeroes(int[][] matrix, int col) {
    for (int i = 0; i < matrix.length; i++) {
        matrix[i][col] = 0;
    }
}
//第 rol 行全部置为 0
private void setRowZeroes(int[][] matrix, int row) {
    for (int i = 0; i < matrix[row].length; i++) {
        matrix[row][i] = 0;
    }
}
```

时间复杂度：O ( mn )。

空间复杂度：O（m + n）。m 和 n 分别是矩阵的行数和列数。

顺便说一下 [leetcode 解法一](<https://leetcode.com/problems/set-matrix-zeroes/solution/>)说的解法，思想是一样的，只不过它没有用 bool 数组去标记，而是用两个 set 去存行和列。

```java
class Solution {
    public void setZeroes(int[][] matrix) {
        int R = matrix.length;
        int C = matrix[0].length;
        Set<Integer> rows = new HashSet<Integer>();
        Set<Integer> cols = new HashSet<Integer>();

        // 将元素为 0 的地方的行和列存起来
        for (int i = 0; i < R; i++) {
            for (int j = 0; j < C; j++) {
                if (matrix[i][j] == 0) {
                    rows.add(i);
                    cols.add(j);
                }
            }
        }

        //将存储的 Set 拿出来，然后将当前行和列相应的元素置零
        for (int i = 0; i < R; i++) {
            for (int j = 0; j < C; j++) {
                if (rows.contains(i) || cols.contains(j)) {
                    matrix[i][j] = 0;
                }
            }
        }
    }
}
```

这里，有一个比自己巧妙的地方时，自己比较直接的用两个函数去将行和列分别置零，但很明显自己的算法会使得一些元素重复置零。而上边提供的算法，每个元素只遍历一次就够了，很棒。

# 解法三

继续优化空间复杂度，接下来用的思想之前也用过，例如[41题解法二](<https://leetcode.windliang.cc/leetCode-41-First-Missing-Positive.html>)和[47题解法二](<https://leetcode.windliang.cc/leetCode-47-Permutations-II.html>)，就是用给定的数组去存我们需要的数据，只要保证原来的数据不丢失就可以。

按 [47题解法二](<https://leetcode.windliang.cc/leetCode-47-Permutations-II.html>) 的思路，就是假设我们对问题足够的了解，假设存在一个数，矩阵中永远不会存在，然后我们就可以把需要变成 0 的位置先变成这个数，也就是先标记一下，最后再统一把这个数变成 0。直接贴下[leetcode解法二](<https://leetcode.com/problems/set-matrix-zeroes/solution/>)的代码。

```java
class Solution {
    public void setZeroes(int[][] matrix) {
        int MODIFIED = -1000000; //假设这个数字不存在于矩阵中
        int R = matrix.length;
        int C = matrix[0].length;

        for (int r = 0; r < R; r++) {
            for (int c = 0; c < C; c++) {
                //找到等于 0 的位置
                if (matrix[r][c] == 0) {
                    // 将需要变成 0 的行和列改为之前定义的数字
                    // 如果是 0 不要管，因为我们要找 0 的位置
                    for (int k = 0; k < C; k++) {
                        if (matrix[r][k] != 0) {
                            matrix[r][k] = MODIFIED;
                        }
                    }
                    for (int k = 0; k < R; k++) {
                        if (matrix[k][c] != 0) {
                            matrix[k][c] = MODIFIED;
                        }
                    }
                }
            }
        }

        for (int r = 0; r < R; r++) {
            for (int c = 0; c < C; c++) {
                // 将是定义的数字的位置变成 0 
                if (matrix[r][c] == MODIFIED) {
                    matrix[r][c] = 0;
                }
            }
        }
    }
}
```

时间复杂度：O ( mn )。

空间复杂度：O（1）。m 和 n 分别是矩阵的行数和列数。

当然，这个解法局限性很强，很依赖于样例的取值，我们继续想其他的方法。

回想一下解法二，我们用了两个 bool 数组去标记当前哪些行和那些列需要置零，我们能不能在矩阵中找点儿空间去存我们的标记呢？

可以的！因为当我们找到第一个 0 的时候，这个 0 所在行和所在列就要全部更新成 0，所以它之前的数据是什么就不重要了，所以我们可以把这一行和这一列当做标记位，0 当做 false，1 当做 true，最后像解法二一样，统一更新就够了。

![](https://windliang.oss-cn-beijing.aliyuncs.com/73_2.jpg)

如上图，找到第一个 0 出现的位置，把橙色当做解法二的列标志位，黄色当做解法二的行标志位。

![](https://windliang.oss-cn-beijing.aliyuncs.com/73_3.jpg)

如上图，我们首先需要初始化为 0，并且遇到之前是 0 的位置我们需要把它置为 1，代表当前行（或者列）最终要值为 0。

![](https://windliang.oss-cn-beijing.aliyuncs.com/73_4.jpg)

如上图，继续遍历找 0 的位置，找到后将对应的位置置为 1 即可。橙色部分的数字为 1 代表当前列要置为 0，黄色部分的数字为 1 代表当前行要置为 0。

看下代码吧。

```java
public void setZeroes(int[][] matrix) {
    int row = matrix.length;
    int col = matrix[0].length;
    int free_row = -1; //记录第一个 0 出现的行
    int free_col = -1; //记录第一个 0 出现的列
    for (int i = 0; i < row; i++) {
        for (int j = 0; j < col; j++) {
            //如果是当前作为标记的列，就跳过
            if (j == free_col) {
                continue;
            }
            if (matrix[i][j] == 0) {
                //判断是否是第一个 0
                if (free_row == -1) {
                    free_row = i;
                    free_col = j;
                    //初始化行标记位为 0，如果之前是 0 就置为 1
                    for (int k = 0; k < matrix.length; k++) {
                        if (matrix[k][free_col] == 0) {
                            matrix[k][free_col] = 1;
                        } else {
                            matrix[k][free_col] = 0;
                        }

                    }
                    //初始化列标记位为 0，如果之前是 0 就置为 1
                    for (int k = 0; k < matrix[free_row].length; k++) {
                        if (matrix[free_row][k] == 0) {
                            matrix[free_row][k] = 1;
                        } else {
                            matrix[free_row][k] = 0;
                        }
                    }
                    break;
                 //找 0 的位置，将相应的标志置 1
                } else {
                    matrix[i][free_col] = 1;
                    matrix[free_row][j] = 1;
                }
            }

        }
    }
    if (free_row != -1) {
        //将标志位为 1 的所有列置为 0
        for (int i = 0; i < col; i++) {
            if (matrix[free_row][i] == 1) {
                setColZeroes(matrix, i);
            }
        }
        //将标志位为 1 的所有行置为 0
        for (int i = 0; i < row; i++) {
            if (matrix[i][free_col] == 1) {
                setRowZeroes(matrix, i);
            }
        }
    }
}

private void setColZeroes(int[][] matrix, int col) {
    for (int i = 0; i < matrix.length; i++) {
        matrix[i][col] = 0;
    }
}

private void setRowZeroes(int[][] matrix, int row) {
    for (int i = 0; i < matrix[row].length; i++) {
        matrix[row][i] = 0;
    }
}
```

时间复杂度：O ( mn )。

空间复杂度：O（1）。

[leetcode解法三](<https://leetcode.com/problems/set-matrix-zeroes/solution/>)和我的思想是一样的，它标记位直接用第一行和第一列，由于第一行和第一列不一定会被置为 0，所以需要用 isCol 变量来标记第一列是否需要置为 0，用 matrix[0\]\[0\] 标记第一行是否需要置为 0。它是将用 0 表示当前行（列）需要置 0，这一点也很巧妙，相比我上边的算法就不需要初始化标记位了。

```java
class Solution {
    public void setZeroes(int[][] matrix) {
        Boolean isCol = false;
        int R = matrix.length;
        int C = matrix[0].length;
        for (int i = 0; i < R; i++) {
            //判断第 1 列是否需要置为 0
            if (matrix[i][0] == 0) {
                isCol = true;
            }
            //找 0 的位置，将相应标记置 0
            for (int j = 1; j < C; j++) {
                if (matrix[i][j] == 0) {
                    matrix[0][j] = 0;
                    matrix[i][0] = 0;
                }
            }
        }
        //根据标志，将元素置 0
        for (int i = 1; i < R; i++) {
            for (int j = 1; j < C; j++) {
                if (matrix[i][0] == 0 || matrix[0][j] == 0) {
                    matrix[i][j] = 0;
                }
            }
        }
		
        //判断第一行是否需要置 0
        if (matrix[0][0] == 0) {
            for (int j = 0; j < C; j++) {
                matrix[0][j] = 0;
            }
        }
		
        //判断第一列是否需要置 0
        if (isCol) {
            for (int i = 0; i < R; i++) {
                matrix[i][0] = 0;
            }
        }
    }
}
```

# 总

这道题如果对空间复杂度没有要求就很简单了，对于空间复杂度的优化，充分利用给定的空间的思想很经典了。