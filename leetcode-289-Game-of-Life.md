# 题目描述（中等难度）

289、Game of Life

According to the [Wikipedia's article](https://en.wikipedia.org/wiki/Conway's_Game_of_Life): "The **Game of Life**, also known simply as **Life**, is a cellular automaton devised by the British mathematician John Horton Conway in 1970."

Given a *board* with *m* by *n* cells, each cell has an initial state *live* (1) or *dead* (0). Each cell interacts with its [eight neighbors](https://en.wikipedia.org/wiki/Moore_neighborhood) (horizontal, vertical, diagonal) using the following four rules (taken from the above Wikipedia article):

1. Any live cell with fewer than two live neighbors dies, as if caused by under-population.
2. Any live cell with two or three live neighbors lives on to the next generation.
3. Any live cell with more than three live neighbors dies, as if by over-population..
4. Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.

Write a function to compute the next state (after one update) of the board given its current state. The next state is created by applying the above rules simultaneously to every cell in the current state, where births and deaths occur simultaneously.

**Example:**

```
Input: 
[
  [0,1,0],
  [0,0,1],
  [1,1,1],
  [0,0,0]
]
Output: 
[
  [0,0,0],
  [1,0,1],
  [0,1,1],
  [0,1,0]
]
```

**Follow up**:

1. Could you solve it in-place? Remember that the board needs to be updated at the same time: You cannot update some cells first and then use their updated values to update other cells.
2. In this question, we represent the board using a 2D array. In principle, the board is infinite, which would cause problems when the active area encroaches the border of the array. How would you address these problems?

给一个二维矩阵，其中 `1` 代表活细胞，`0` 代表死细胞，然后去遵循下边的规则来更新。

* 如果活细胞周围八个位置的活细胞数少于两个，则该位置活细胞死亡；
* 如果活细胞周围八个位置有两个或三个活细胞，则该位置活细胞仍然存活；
* 如果活细胞周围八个位置有超过三个活细胞，则该位置活细胞死亡；
* 如果死细胞周围正好有三个活细胞，则该位置死细胞复活；

更新的时候是整体更新，下一状态只取决于当前状态，和它将要变成什么无关。

# 解法一

最直接的想法，就是再用一个等大的矩阵，然后一个一个判断原矩阵每个元素的下一状态，然后存到新矩阵，最后用新矩阵覆盖原矩阵即可。

上边的想法虽然可行，但需要额外空间，我们考虑不需要额外空间的想法。

用一个常用的方法，我们可以将需要改变的数字先转成另一个数字，最后再将其还原。

具体的讲，如果某个数字需要由 `0` 变成 `1`，我们先把它变成 `-1`。

如果某个数字需要由 `1` 变成 `0`，我们先把它变成 `-2`。

这样做的话，在记录周围八个位置有多少 `1` 的时候，除了 `1` 以外，还要记录 `-2` 的个数。

最后再将所有的 `-1` 变成 `1`，`-2` 变成 `0` 即可。

看下代码。

```java
public void gameOfLife(int[][] board) {
    int rows = board.length;
    if (rows == 0) {
        return;
    }
    int cols = board[0].length;
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            //周围八个位置有多少个 1
            int count = getOnes(r, c, rows, cols, board);
			
            //当前是 0,  周围有 3 个 1, 说明 0 需要变成 1, 记成 -1
            if (board[r][c] == 0) {
                if (count == 3) {
                    board[r][c] = -1;
                }
            }
            //当前是 1
            if (board[r][c] == 1) {
                //当前 1 需要变成 0, 记成 -2
                if (count < 2 || count > 3) {
                    board[r][c] = -2;
                }
            }

        }
    }

    //将所有数字还原
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            if (board[r][c] == -1) {
                board[r][c] = 1;
            }
            if (board[r][c] == -2) {
                board[r][c] = 0;
            }
        }
    }

}
//需要统计周围八个位置 1 和 -2 的个数
private int getOnes(int r, int c, int rows, int cols, int[][] board) {
    int count = 0;
    // 上
    if (r - 1 >= 0 && (board[r - 1][c] == 1 || board[r - 1][c] == -2)) {
        count++;
    }
    // 下
    if (r + 1 < rows && (board[r + 1][c] == 1 || board[r + 1][c] == -2)) {
        count++;
    }
    // 左
    if (c - 1 >= 0 && (board[r][c - 1] == 1 || board[r][c - 1] == -2)) {
        count++;
    }
    // 右
    if (c + 1 < cols && (board[r][c + 1] == 1 || board[r][c + 1] == -2)) {
        count++;
    }
    // 左上
    if (c - 1 >= 0 && r - 1 >= 0 && (board[r - 1][c - 1] == 1 || board[r - 1][c - 1] == -2)) {
        count++;
    }
    // 左下
    if (c - 1 >= 0 && r + 1 < rows && (board[r + 1][c - 1] == 1 || board[r + 1][c - 1] == -2)) {
        count++;
    }
    // 右上
    if (c + 1 < cols && r - 1 >= 0 && (board[r - 1][c + 1] == 1 || board[r - 1][c + 1] == -2)) {
        count++;
    }
    // 右下
    if (c + 1 < cols && r + 1 < rows && (board[r + 1][c + 1] == 1 || board[r + 1][c + 1] == -2)) {
        count++;
    }
    return count;
}
```

上边就是我直接想到的了，下边分享一下别人的技巧，使得上边的代码简洁些，但时间复杂度不会变化。

# 一些优化

主要是两方面，一方面是考虑在记录 `1` 变成 `0` 和 `0` 变成 `1` 时候要变成的数字，另一方面就是统计周围八个位置 `1` 的个数时候的写法。

分享 [@StefanPochmann](https://leetcode.com/problems/game-of-life/discuss/73230/C%2B%2B-O(1)-space-O(mn)-time) 的做法。

想法很简单，因为之前记录细胞生命是否活着的时候用的是 `0` 和 `1`，相当于只用了 `1` 个比特位来记录。把它们扩展一位，看成 `00` 和 `01`。

我们可以用新扩展的第二位来表示下次的状态，因为开始的时候倒数第二位默认是 `0`，所以在计算过程中我们只关心下一状态是 `1` 的时候，将自己本身的数（`0` 或者 `1` ）通过和 `2` 进行异或即可。如果下一次状态是 `0` 就不需要管了。

这样做的好处就是在还原的时候，我们可以将其右移一位即可。

通过判断当前位置邻居中 `1` 的个数，然后通过下边的方式来更新。

```java
//count 代表当前位置邻居中 1 的个数
//count == 3 的时候下一状态是 1, 或者 count == 2, 并且当前是 1 的时候下一状态是 1
if(count == 3 || (board[r][c] == 1) && count == 2){
    board[r][c] |= 2; //2 的二进制是 10，相当于将第二位 置为 1
}


//和下边的是等价的
if(count == 3 || count + board[r][c] == 3){
    board[r][c] |= 2; //2 的二进制是 10，相当于将第二位 置为 1
}
```

还有就是在统计周围八个位置 `1` 的个数时候，可以通过下边的方式，确定开始遍历的行和列，然后开始遍历。

```java
private int getOnes(int r, int c, int rows, int cols, int[][] board) {
    int count = 0;
    for (int i = Math.max(r - 1, 0); i <= Math.min(r + 1, rows - 1); i++) {
        for (int j = Math.max(c - 1, 0); j <= Math.min(c + 1, cols - 1); j++) {
            count += board[i][j] & 1;
        }
    }
    //如果原来是 1,需要减去
    count -= board[i][j] & 1;
    return count;
}
```

然后把代码综合起来。

```java
public void gameOfLife(int[][] board) {
    int rows = board.length;
    if (rows == 0) {
        return;
    }
    int cols = board[0].length;
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            //周围八个位置有多少个 1
            int count = getOnes(r, c, rows, cols, board);

            //count == 3 的时候下一状态是 1, 或者 count == 2, 并且当前是 1 的时候下一状态是 1
            if(count == 3 || (board[r][c] == 1) && count == 2){
                board[r][c] |= 2; //2 的二进制是 10，相当于将第二位 置为 1
            }

        }
    }

    //将所有数字还原
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) { 
            //右移一位还原
            board[r][c] >>= 1;  
        }
    }

}
//需要统计周围八个位置 1 的个数
private int getOnes(int r, int c, int rows, int cols, int[][] board) {
    int count = 0;
    for (int i = Math.max(r - 1, 0); i <= Math.min(r + 1, rows - 1); i++) {
        for (int j = Math.max(c - 1, 0); j <= Math.min(c + 1, cols - 1); j++) {
            count += board[i][j] & 1;
        }
    }
    //如果原来是 1, 需要减去 1
    count -= board[r][c] & 1;
    return count;
}
```

当然如果对二进制操作不熟，也可以使用 [这里](https://leetcode.com/problems/game-of-life/discuss/73223/Easiest-JAVA-solution-with-explanation) 的代码。

把上边代码的这一部分。

```java
//count == 3 的时候下一状态是 1, 或者 count == 2, 并且当前是 1 的时候下一状态是 1
if(count == 3 || (board[r][c] == 1) && count == 2){
    board[r][c] |= 2; //2 的二进制是 10，相当于将第二位 置为 1
}
```

按照文章开头的算法，更具体的分类。

```java
if (board[r][c] == 1 && (count == 2 || count == 3) {  
    board[r][c] = 3; // Make the 2nd bit 1: 01 ---> 11
}
if (board[r][c] == 0 && count == 3) {
    board[r][c] = 2; // Make the 2nd bit 1: 00 ---> 10
}
```

还有 [这里](https://leetcode.com/problems/game-of-life/discuss/73366/Clean-O(1)-space-O(mn)-time-Java-Solution) 的一种想法。

如果是 `0` 变成 `1`，将赋值为 `3`。如果是 `1` 变成 `0` 就赋值成 `2` 。

这样做的好处就是，在还原的时候通过对 `2` 求余即可。

```java
 board[i][j] %=2;
```

最后还有一种求周围八个位置 `1`的个数的思路。

参考 [这里](https://leetcode.com/problems/game-of-life/discuss/73252/C%2B%2B-AC-Code-O(1)-space-O(mn)-time)。我们可以先初始化一个数值对，然后通过和当前位置相加来得到相应的值。主要修改了 `getOnes` 函数。

```java
public void gameOfLife(int[][] board) {
    int rows = board.length;
    if (rows == 0) {
        return;
    }
    int cols = board[0].length;
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            //周围八个位置有多少个 1
            int count = getOnes(r, c, rows, cols, board);

            //当前是 0,  周围有 3 个 1, 说明 0 需要变成 1, 记成 3
            if (board[r][c] == 0) {
                if (count == 3) {
                    board[r][c] = 3;
                }
            }
            //当前是 1
            if (board[r][c] == 1) {
                //当前 1 需要变成 0, 记成 2
                if (count < 2 || count > 3) {
                    board[r][c] = 2;
                }
            }

        }
    }

    //将所有数字还原
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) { 
            board[r][c] %= 2;  
        }
    }

}

//作为类的静态成员变量，仅初始化一次
static int  d[][] = {% raw %}{{% endraw %}{1,-1},{1,0},{1,1},{0,-1},{0,1},{-1,-1},{-1,0},{-1,1}};
//需要统计周围八个位置 1 和 2 的个数
private int getOnes(int r, int c, int rows, int cols, int[][] board) {
    int count = 0; 
    for(int k = 0; k < 8; k++){
        int x = d[k][0] + r;
        int y = d[k][1] + c;
        if(x < 0 || x >= rows || y < 0 || y >= cols) {
            continue;
        }
        if(board[x][y] == 1 || board[x][y] == 2) {
            count++;
        }
    }
    return count;
}
```

# 解法二

[这里](https://leetcode.com/problems/game-of-life/discuss/73335/C%2B%2B-O(mn)-time-O(1)-space-sol) 看到一个完全不同的思路，分享一下。

```java
Y Y Y 
Y @ X
X X X
```

对于这道题，如果按照从上到下，从左到右的顺序遍历。那么当我们考虑 `@` 位置的时候，`Y` 位置已经全部更新了，但我们需要 `Y` 位置之前的信息，怎么办呢？

因为 `@` 有八个邻居，是一个一般化的位置，所以我们讨论遍历到 `@` 的时候该怎么处理。

在更新 `@` 的时候，考虑它还没有进行更新的邻居，也就是 `X` 的位置。如果 `@` 位置是 `1`，那么就将所有 `X` 位置的值加上 `2`（也可以是其它值，但 `2` 是个不错的选择）。如果 `X` 位置原来的值是 `1` ，那么就将 `@` 的位置加上 `2` 。

这样的话，如果 `@` 原本是 `1`，它周围有 `2` 个或者 `3` 个 `1`，那么它就会被加成 `5` 或者 `7` 。如果原本是 `0` ，它周围有 `3` 个 `1`，那么就会被加成 `6`。也就是当 `@` 变成`5, 6, 7` 的时候，它的下一次状态是 `1`，否则话的就是 `0`。此时我们可以直接将 `@` 更新成 `0` 或者 `1`，因为如果 `@` 是 `1` 的话，已经将和它是邻居的所有位置进行了加 `2` 。

还需要解决一个问题，遍历 `@` 的时候，它可能已经被之前的邻居 `Y` 加了若干个 `2` 。那么此时怎么判断 `@` 原来的位置是 `1` 还是 `0` 呢？很简单，如果原来是 `1` ，因为每次加的是 `2`，所以它一定是个奇数。反之，它就是偶数。

再结合代码看一下。

```java
public void gameOfLife(int[][] board) {
    int rows = board.length;
    if (rows == 0) {
        return;
    }
    int cols = board[0].length;
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            // 右
            check(r, c, r, c + 1, rows, cols, board);
            // 右下
            check(r, c, r + 1, c + 1, rows, cols, board);
            // 下
            check(r, c, r + 1, c, rows, cols, board);
            // 左下
            check(r, c, r + 1, c - 1, rows, cols, board);
            //5, 6, 7 代表下一状态是 1
            if (board[r][c] >= 5 && board[r][c] <= 7) {
                board[r][c] = 1;
            } else {
                board[r][c] = 0;
            }

        }
    }
}

private void check(int rCur, int cCur, int rNext, int cNext, int rows, int cols, int[][] board) {
    if (rNext < 0 || cNext < 0 || rNext >= rows || cNext >= cols) {
        return;
    }
    //如果是奇数说明之前是 1, 更新它之后的邻居
    if (board[rCur][cCur] % 2 == 1) {
        board[rNext][cNext] += 2;
    }
    //如果是奇数说明之前是 1, 更新当前的位置值
    if (board[rNext][cNext] % 2 == 1) {
        board[rCur][cCur] += 2;
    }
}
```

# 扩展

题目中 `Follow up` 第二点指出，如果给定的 `board` 是无限的，我们该怎么处理呢？这是一个开放性的问题，讨论的点会有很多，每个人的想法可能都不一样，下边结合 [官方](https://leetcode.com/problems/game-of-life/solution/) 的讲解说一下。

首先在程序中，无限 `board` 肯定是不存在的，它只不过是一个很大很大的矩阵，大到无法直接将矩阵读到内存中。

第一个能想到的解决方案就是我们不需要直接将整个矩阵读到内存中，而是每次读出矩阵的三行，每次处理中间那行，然后把结果写入到文件。

第二个的话，如果是一个很大很大的矩阵，很有可能矩阵是一个稀疏矩阵，而我们只关心每个位置的八个邻居中 `1` 的个数，所以我们可以在内存中仅仅保存 `1` 的坐标。

如果题目给定的我们就是所有 `1` 的坐标，那么可以有下边的算法。

用一个 `HashMap` 去统计每个位置它的邻居的 `1` 的个数。只需要遍历所有 `1` 的坐标，然后将它八个邻居相应的 `HashMap` 的值进行加 `1`。

参考 [ruben3](https://leetcode.com/ruben3) 的 java 代码。

```java
//live 保存了所有是 1 的坐标, Coord 是坐标类
private Set<Coord> gameOfLife(Set<Coord> live) {
    Map<Coord,Integer> neighbours = new HashMap<>();
    for (Coord cell : live) {
        for (int i = cell.i-1; i<cell.i+2; i++) {
            for (int j = cell.j-1; j<cell.j+2; j++) {
                if (i==cell.i && j==cell.j) continue;
                Coord c = new Coord(i,j);
                //将它的邻居进行加 1
                if (neighbours.containsKey(c)) {
                    neighbours.put(c, neighbours.get(c) + 1);
                } else {
                    neighbours.put(c, 1);
                }
            }
        }
    }
    Set<Coord> newLive = new HashSet<>();//下一个状态的所有 1 的坐标
    for (Map.Entry<Coord,Integer> cell : neighbours.entrySet())  {
        //当前位置周围有 3 个活细胞，或者有两个活细胞, 并且当前位置是一个活细胞
        if (cell.getValue() == 3 || cell.getValue() == 2 && live.contains(cell.getKey())) {
            newLive.add(cell.getKey());
        }
    }
    return newLive;
}

//相当于一个坐标类
private static class Coord {
    int i;
    int j;
    private Coord(int i, int j) {
        this.i = i;
        this.j = j;
    }
    public boolean equals(Object o) {
        return o instanceof Coord && ((Coord)o).i == i && ((Coord)o).j == j;
    }
    public int hashCode() {
        int hashCode = 1;
        hashCode = 31 * hashCode + i;
        hashCode = 31 * hashCode + j;
        return hashCode;
    }
}

//为了验证这个算法, 我们手动去求了 1 的所有坐标，并且调用上边的函数来验证我们的算法
public void gameOfLife(int[][] board) {
    Set<Coord> live = new HashSet<>();
    int m = board.length;
    int n = board[0].length;
    for (int i = 0; i<m; i++) {
        for (int j = 0; j<n; j++) {
            if (board[i][j] == 1) {
                live.add(new Coord(i,j));
            }
        }
    };
    live = gameOfLife(live);
    for (int i = 0; i<m; i++) {
        for (int j = 0; j<n; j++) {
            board[i][j] = live.contains(new Coord(i,j))?1:0;
        }
    };

}
```

上边的代码是基于假设题目给了我们所有 `1` 的坐标，但有可能题目仅仅给了我们一个矩阵 `txt` 文件，然后让我们自己去统计 `1` 的坐标。此时的话由于矩阵太大，我们就只能三行三行的分析了。

下边分享 [beagle](https://leetcode.com/beagle) 的 python 代码，主要流程是从文件中去读取矩阵，每次读三行，然后统计这三行的 `1` 的所有坐标，然后再用上边的算法，最后将每行更新的结果打印出来。

但我觉得下边的代码细节上还有逻辑应该是有问题的，但整体思想可以供参考。

```python
#Game of Life
from copy import deepcopy

#求出下一状态 1 的所有坐标, live 保存了所有 1 的坐标
def findLives(live):
    count = collections.Counter()
    #记录每个位置它的邻居中 1 的个数
    for i, j in live:
        for x in range(i-1, i+2):
            for y in range(j-1, j+2):
                if x == i and y == j: 
                    continue
                count[x, y] += 1
    result = {}
    for i, j in count:
        if count[i, j] == 3:
            result.add((i, j))
        elif count[i, j] == 2 and (i, j) in live:
            result.add((i, j))
    return result

#处理读出的三行或者两行(边界的情况)
def updateBoard(board):
    #统计 1 的所有坐标
    live = {(i, j) for i, row in enumerate(board) for j, v in enumerate(row) if v == 1}
    
    #得到下一状态的 1 的所有坐标
    live = findLives(live)
    for r, row in enumerate(board):
        for c, v in enumerate(row):
            board[r][c] = int((r, c) in live)
    for row in board:
        print(" ".join(row))

#假设矩阵在 input.txt 
with open("input.txt") as f1:
    prev = f1.readline()
    pointer = f1.readline()
    cur = next_ = None
    while pointer:
        if not cur:
            cur = pointer
            pointer = f1.readline()
            continue
        
        if next_ == None:
            next_ = pointer
            pointer = f1.readline()
        if prev == None:
            tmpBoard = [ cur, next_]
            nextStateBoard = updateBoard(tmpBoard)
        else:
            tmpBoard = [deepcopy(prev), cur, next_]
            nextStateBoard =  updateBoard(tmpBoard)
            
        prev = cur
        cur = next_
        next_ = None
```

# 总

看起来比较简单的一道题，但讨论了很多东西。

解法一的话只要想到先把值隐藏起来，然后还原，就比较好写了。然后再进一步，考虑要隐藏值的特点，可以简化代码。还有就是需要遍历周围坐标的时候，可以通过一系列的数值对来计算坐标，比单纯的一句句 `if` 会优雅很多。

解法二的角度很好，既然之前的值对后边的有影响，那么可以先去影响后边的值，然后再放心的更新自己的值。

最后的扩展，也是比较常见的处理较大矩阵时候的思路。主要就是两个，一个是通过稀疏矩阵，只保存关键坐标。另一个就是一部分一部分的处理矩阵。