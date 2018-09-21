# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/79.jpg)

意思就是从某个字符出发，然后它可以向左向右向上向下移动，走过的路径构成一个字符串，判断是否能走出给定字符串的 word ，还有一个条件就是走过的字符不能够走第二次。

比如 SEE，从第二行最后一列的 S 出发，向下移动，再向左移动，就走出了 SEE。

ABCB，从第一行第一列的 A 出发，向右移动，再向右移动，到达 C 以后，不能向左移动回到 B ，并且也没有其他的路径走出 ABCB 所以返回 false。

这种题，如果用迭代一眼想不到结果，就得考虑递归或者动态规划的方法了。

而递归的话，一定要理清我们的思路，我一般用三步走的思路，可以看下[这里](https://zhuanlan.zhihu.com/p/42664697)

* 第一步，假定我们有这么个函数

  ```java
  boolean isExist(int current_i,int current_j,String word,char[][]board)
  ```

  从第 current_i 行和第 current_j 列的字符开始，是否能找到 word 的路径。

* 第二步，我们要理清楚，怎么从降低规模

  我们只需要知道从第 current_i 行和第 current_j 列的字符开始，看能否找到 word 的第一个字符，假如找到的字符的位置是 new_i，new_j，那么我们只要再知道 isExist ( new_i，new_j，word.substring(1),board) 返回值就可以了，也就是从新的位置开始，能否找到除去 word 的第一个字符的字符串。

  怎么从第 current_i 和第 current_j 开始，找到 word 的第一个字符，我只需要分别判断第 current_i 行和第 current_j 列的字符的上边、下边、左边、右边的字符是否等于 word 的第一个字符就可以了。

* 第三步，递归出口

  如果传进来的 word 长度是 0 了，我们只需要返回 true 就可以了。

递归思路理清了，还有一个问题就是，怎么保证不重复选取字符，我们利用一个和 board 等大的数组 visited，保存每个字符是否被选上就可以了。

```java
static boolean[][] visited;
public boolean exist(char[][] board, String word) {
    visited = new boolean[board.length][board[0].length];//默认初始值是 false
    for (int i = 0; i < board.length; i++)
        for (int j = 0; j < board[i].length; j++) {
            //找到开始的行和列
            if(board[i][j]==word.charAt(0)){ 
                if(isExist(i,j,word.substring(1),board)){
                    return true;
                }
            }
        }
    return false;
}

public boolean isExist(int current_i,int current_j,String word,char[][]board){
    if(word.length()==0){
        return true;
    }
    //假设当前字符被选中
    visited[current_i][current_j]=true;
    
    //判断上边的字符是否越界，是否等于 word 的第一个字符，是否已经用过了
    //bottom，left，right 都同理
    boolean top=current_i-1>=0&&board[current_i-1][current_j]==word.charAt(0)&&!visited[current_i-1][current_j]
        &&isExist(current_i-1,current_j,word.substring(1),board);
    
    boolean bottom=current_i+1<board.length&&board[current_i+1][current_j]==word.charAt(0)&&!visited[current_i+1][current_j]
        &&isExist(current_i+1,current_j,word.substring(1),board);
    
    boolean left=current_j-1>=0&&board[current_i][current_j-1]==word.charAt(0)&&!visited[current_i][current_j-1]
        &&isExist(current_i,current_j-1,word.substring(1),board);
    
    boolean right=current_j+1<board[current_i].length&&board[current_i][current_j+1]==word.charAt(0)&&!visited[current_i][current_j+1]
        &&isExist(current_i,current_j+1,word.substring(1),board);

    if( top||bottom||left||right){
        return true;
    }else{
        //没有选中当前字符，还原为 false
        visited[current_i][current_j]=false;
        return false;
    }
}
```

时间复杂度：递归的，暂时理不清。

空间复杂度：O（m * n），m 是 board 的行数，n 是 board 的列数。

看到了 leetCode 上一个人的[解答](https://leetcode.com/problems/word-search/discuss/27658/Accepted-very-short-Java-solution.-No-additional-space.)，简直神奇！他把空间复杂度优化到了常数空间，怎么做的呢？

就是把选中的字符的值，改成一个不可能和其他字符相等的值，这样在找和 word 的第一个字符相等的字符的时候，就永远不会找到之前选中的字符了。

开始假设字符被选中的时候，我们将其改成 board\[current_i]\[current_j\]='#' 

这样到最后，如果它没被选中就还原，怎么还原？原来的值似乎找不到了，所以我们应该找一种可逆的操作。

我们可以用异或，因为字符值的范围是 0 - 255，二进制的话就是 0000 0000 - 1111 1111，我们把它和 256 做异或，也就是和 1 0000 0000 。这样，如果想还原原来的数字只需要再异或 256 就可以了。

看起来有些复杂，其实我们也可以假设选中的时候，把它加上 256，这样它就不可能和其他字符相等了。如果假设失败了，再减去 256 就还原为原来的数字了。

```java
public boolean exist(char[][] board, String word) {
    visited = new boolean[board.length][board[0].length];//默认初始值是 false
    for (int i = 0; i < board.length; i++)
        for (int j = 0; j < board[i].length; j++) {
            //找到开始的行和列
            if(board[i][j]==word.charAt(0)){ 
                if(isExist(i,j,word.substring(1),board)){
                    return true;
                }
            }
        }
    return false;
}
public boolean isExist(int current_i,int current_j,String word,char[][]board){
    if(word.length()==0){
        return true;
    }
    /*********改变的地方******************/
    //假设当前字符被选中
    board[current_i][current_j]^=256;
    /***********************************/
    boolean top=current_i-1>=0&&board[current_i-1][current_j]==word.charAt(0) 
        &&isExist(current_i-1,current_j,word.substring(1),board);
    boolean bottom=current_i+1<board.length&&board[current_i+1][current_j]==word.charAt(0) 
        &&isExist(current_i+1,current_j,word.substring(1),board);
    boolean left=current_j-1>=0&&board[current_i][current_j-1]==word.charAt(0) 
        &&isExist(current_i,current_j-1,word.substring(1),board);
    boolean right=current_j+1<board[current_i].length&&board[current_i][current_j+1]==word.charAt(0) 
        &&isExist(current_i,current_j+1,word.substring(1),board);

    if( top||bottom||left||right){
        return true;
    }else{
        /*********改变的地方******************/
        //没有选中当前字符，还原
        board[current_i][current_j]^=256;
        /***********************************/
        return false;
    }
}
```

# 总

这种题基本是算法模仿选择的过程就行了，关键就是把问题理清。异或操作优化了空间复杂度，真的佩服！