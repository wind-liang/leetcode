# 题目描述（困难难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/51.jpg)

经典的 N 皇后问题。意思就是摆皇后的位置，每行每列以及对角线只能出现 1 个皇后。输出所有的情况。

# 解法一 回溯法

比较经典的回溯问题了，我们需要做的就是先在第一行放一个皇后，然后进入回溯，放下一行皇后的位置，一直走下去，如果已经放的皇后的数目等于 n 了，就加到最后的结果中。然后再回到上一行，变化皇后的位置，然后去找其他的解。

期间如果遇到当前行所有的位置都不能放皇后了，就再回到上一行，然后变化皇后的位置。再返回到下一行。

说起来可能还费力些，直接看代码吧。

```java
public List<List<String>> solveNQueens(int n) {
    List<List<String>> ans = new ArrayList<>();
    backtrack(new ArrayList<Integer>(), ans, n);
    return ans;
}

private void backtrack(List<Integer> currentQueen, List<List<String>> ans, int n) {
    // 当前皇后的个数是否等于 n 了，等于的话就加到结果中
    if (currentQueen.size() == n) {
        List<String> temp = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            char[] t = new char[n];
            Arrays.fill(t, '.');
            t[currentQueen.get(i)] = 'Q';
            temp.add(new String(t));
        }
        ans.add(temp);
        return;
    }
    //尝试每一列
    for (int col = 0; col < n; col++) {
        //当前列是否冲突
        if (!currentQueen.contains(col)) {
            //判断对角线是否冲突
            if (isDiagonalAttack(currentQueen, col)) {
                continue;
            }
            //将当前列的皇后加入
            currentQueen.add(col);
            //去考虑下一行的情况
            backtrack(currentQueen, ans, n);
            //将当前列的皇后移除，去判断下一列
            //进入这一步就是两种情况，下边的行走不通了回到这里或者就是已经拿到了一个解回到这里
            currentQueen.remove(currentQueen.size() - 1);
        }

    }

}

private boolean isDiagonalAttack(List<Integer> currentQueen, int i) {
    // TODO Auto-generated method stub
    int current_row = currentQueen.size();
    int current_col = i;
    //判断每一行的皇后的情况
    for (int row = 0; row < currentQueen.size(); row++) {
        //左上角的对角线和右上角的对角线，差要么相等，要么互为相反数，直接写成了绝对值
        if (Math.abs(current_row - row) == Math.abs(current_col - currentQueen.get(row))) {
            return true;
        }
    }
    return false;
}
```

时间复杂度：

空间复杂度：

上边我们只判断了列冲突和对角线冲突，至于行冲突，由于我们采取一行一行加皇后，所以一行只会有一个皇后，不会产生冲突。

# 总

最早接触的一类问题了，学回溯法的话，一般就会以这个为例，所以思路上不会遇到什么困难。