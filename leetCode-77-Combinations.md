# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/77.jpg)

给定 n ，k ，表示从 { 1, 2, 3 ... n } 中选 k 个数，输出所有可能，并且选出数字从小到大排列，每个数字只能用一次。

# 解法一 回溯法

这种选数字很经典的回溯法问题了，先选一个数字，然后进入递归继续选，满足条件后加到结果中，然后回溯到上一步，继续递归。直接看代码吧，很好理解。

```java
public List<List<Integer>> combine(int n, int k) {
    List<List<Integer>> ans = new ArrayList<>();
    getAns(1,n, k, new ArrayList<Integer>(), ans);
    return ans;
}

private void getAns(int start, int n, int k, ArrayList<Integer> temp,List<List<Integer>> ans) {
    //如果 temp 里的数字够了 k 个，就把它加入到结果中
    if(temp.size() == k){
        ans.add(new ArrayList<Integer>(temp));
        return;
    }
    //从 start 到 n
    for (int i = start; i <= n; i++) {
        //将当前数字加入 temp
        temp.add(i);
        //进入递归
        getAns(i+1, n, k, temp, ans);
        //将当前数字删除，进入下次 for 循环
        temp.remove(temp.size() - 1);
    }
}
```

一个 for 循环，添加，递归，删除，很经典的回溯框架了。在[这里](<https://leetcode.com/problems/combinations/discuss/27002/Backtracking-Solution-Java>)发现了一个优化方法。for 循环里 i 从 start 到 n，其实没必要到 n。比如，n = 5，k = 4，temp.size( ) == 1，此时代表我们还需要（4 - 1 = 3）个数字，如果 i = 4 的话，以后最多把 4 和 5 加入到 temp 中，而此时 temp.size() 才等于 1 + 2 = 3，不够 4 个，所以 i 没必要等于 4，i 循环到 3 就足够了。

所以 for 循环的结束条件可以改成， i <= n - ( k - temp.size ( ) ) + 1，k - temp.size ( )  代表我们还需要的数字个数。因为我们最后取到了 n，所以还要加 1。

```java
public List<List<Integer>> combine(int n, int k) {
    List<List<Integer>> ans = new ArrayList<>();
    getAns(1,n, k, new ArrayList<Integer>(), ans);
    return ans;
}

private void getAns(int start, int n, int k, ArrayList<Integer> temp, List<List<Integer>> ans) { 
    if(temp.size() == k){
        ans.add(new ArrayList<Integer>(temp));
        return;
    }
    for (int i = start; i <= n - (k -temp.size()) + 1; i++) {
        temp.add(i);
        getAns(i+1, n, k, temp, ans);
        temp.remove(temp.size() - 1);
    }
}
```

虽然只改了一句代码，速度却快了很多。

# 解法二 迭代

参考[这里](<https://leetcode.com/problems/combinations/discuss/26992/Short-Iterative-C%2B%2B-Answer-8ms>)，完全按照解法一回溯的思想改成迭代。我们思考一下，回溯其实有三个过程。

* for 循环结束，也就是 i == n + 1，然后回到上一层的 for 循环
* temp.size() == k，也就是所需要的数字够了，然后把它加入到结果中。
* 每个 for 循环里边，进入递归，添加下一个数字

```java
public List<List<Integer>> combine(int n, int k) {
    List<List<Integer>> ans = new ArrayList<>();
    List<Integer> temp = new ArrayList<>();
    for(int i = 0;i<k;i++){
        temp.add(0);
    }
    int i = 0;
    while (i >= 0) {
        temp.set(i, temp.get(i)+ 1); //当前数字加 1
        //当前数字大于 n，对应回溯法的 i == n + 1，然后回到上一层
        if (temp.get(i) > n) {
            i--;
        // 当前数字个数够了
        } else if (i == k - 1) { 
            ans.add(new ArrayList<>(temp));
        //进入更新下一个数字
        }else {
            i++;
            //把下一个数字置为上一个数字，类似于回溯法中的 start
            temp.set(i, temp.get(i-1));
        }
    }
    return ans;
}
```

# 解法三 迭代法2

解法二的迭代法是基于回溯的思想，还有一种思想，参考[这里](<https://leetcode.com/problems/combinations/discuss/27032/Iterative-Java-solution>)。类似于[46题](<https://leetcode.windliang.cc/leetCode-46-Permutations.html>)的解法一，找 k 个数，我们可以先找出 1 个的所有结果，然后在 1 个的所有结果再添加 1 个数，变成 2 个，然后依次迭代，直到有 k 个数。

比如 n = 5， k = 3

![](https://windliang.oss-cn-beijing.aliyuncs.com/77_2.jpg)

第 1 次循环，我们找出所有 1 个数的可能 [ 1 ]，[ 2 ]，[ 3 ]。4 和 5 不可能，解法一分析过了，因为总共需要 3 个数，4，5 全加上才 2 个数。

第 2 次循环，在每个 list 添加 1 个数， [ 1 ] 扩展为 [ 1 , 2 ]，[ 1 , 3 ]，[ 1 , 4 ]。[ 1 , 5 ] 不可能，因为 5 后边没有数字了。 [ 2 ] 扩展为 [ 2 , 3 ]，[ 2 , 4 ]。[ 3 ] 扩展为 [ 3 , 4 ]；

第 3 次循环，在每个 list 添加 1 个数， [ 1，2 ]  扩展为[ 1，2，3]， [ 1，2，4]， [ 1，2，5]；[ 1，3 ]  扩展为 [ 1，3，4]， [ 1，3，5]；[ 1，4 ]  扩展为  [ 1，4，5]；[ 2，3 ]  扩展为 [ 2，3，4]， [ 2，3，5]；[ 2，4 ]  扩展为  [ 2，4，5]；[ 3，4 ]  扩展为  [ 3，4，5]；

最后结果就是，\[[ 1，2，3]， [ 1，2，4]， [ 1，2，5]，[ 1，3，4]， [ 1，3，5]， [ 1，4，5]， [ 2，3，4]， [ 2，3，5]，[ 2，4，5]， [ 3，4，5]\]。

上边分析很明显了，三个循环，第一层循环是 1 到 k ，代表当前有多少个数。第二层循环就是遍历之前的所有结果。第三次循环就是将当前结果扩展为多个。

```java
public List<List<Integer>> combine(int n, int k) {
    if (n == 0 || k == 0 || k > n) return Collections.emptyList();
    List<List<Integer>> res = new ArrayList<List<Integer>>();
    //个数为 1 的所有可能
    for (int i = 1; i <= n + 1 - k; i++) res.add(Arrays.asList(i));
    //第一层循环，从 2 到 k
    for (int i = 2; i <= k; i++) {
        List<List<Integer>> tmp = new ArrayList<List<Integer>>();
        //第二层循环，遍历之前所有的结果
        for (List<Integer> list : res) {
            //第三次循环，对每个结果进行扩展
            //从最后一个元素加 1 开始，然后不是到 n ，而是和解法一的优化一样
            //(k - (i - 1） 代表当前已经有的个数，最后再加 1 是因为取了 n
            for (int m = list.get(list.size() - 1) + 1; m <= n - (k - (i - 1)) + 1; m++) {
                List<Integer> newList = new ArrayList<Integer>(list);
                newList.add(m);
                tmp.add(newList);
            }
        }
        res = tmp;
    }
    return res;
}
```

# 解法四 递归

参考[这里](<https://leetcode.com/problems/combinations/discuss/27019/A-short-recursive-Java-solution-based-on-C(nk)C(n-1k-1)%2BC(n-1k)>)。基于这个公式 C ( n, k ) = C ( n - 1, k - 1) + C ( n - 1, k )  所用的思想，这个思想之前刷题也用过，但忘记是哪道了。

从 n 个数字选 k 个，我们把所有结果分为两种，包含第 n 个数和不包含第 n 个数。这样的话，就可以把问题转换成

* 从 n - 1 里边选 k - 1 个，然后每个结果加上 n 
* 从 n - 1 个里边直接选 k 个。

把上边两个的结果合起来就可以了。


```java
public List<List<Integer>> combine(int n, int k) {
    if (k == n || k == 0) {
        List<Integer> row = new LinkedList<>();
        for (int i = 1; i <= k; ++i) {
            row.add(i);
        }
        return new LinkedList<>(Arrays.asList(row));
    }
    // n - 1 里边选 k - 1 个
    List<List<Integer>> result = combine(n - 1, k - 1);
    //每个结果加上 n
    result.forEach(e -> e.add(n));
    //把 n - 1 个选 k 个的结果也加入
    result.addAll(combine(n - 1, k));
    return result;
}
```

# 解法五 动态规划

参考[这里](<https://leetcode.com/problems/combinations/discuss/27090/DP-for-the-problem>)，既然有了解法四的递归，那么一定可以有动态规划。递归就是压栈压栈压栈，然后到了递归出口，开始出栈出栈出栈。而动态规划一个好处就是省略了出栈的过程，我们直接从递归出口网上走。

```java
public List<List<Integer>> combine(int n, int k) { 
    List<List<Integer>>[][] dp = new List[n + 1][k + 1];
    //更新 k = 0 的所有情况
    for (int i = 0; i <= n; i++) {
        dp[i][0] = new ArrayList<>();
        dp[i][0].add(new ArrayList<Integer>());
    }
    // i 从 1 到 n
    for (int i = 1; i <= n; i++) {
        // j 从 1 到 i 或者 k
        for (int j = 1; j <= i && j <= k; j++) { 
            dp[i][j] = new ArrayList<>();
            //判断是否可以从 i - 1 里边选 j 个
            if (i > j){
                dp[i][j].addAll(dp[i - 1][j]);
            } 
            //把 i - 1 里边选 j - 1 个的每个结果加上 i
            for (List<Integer> list: dp[i - 1][j - 1]) {
                List<Integer> tmpList = new ArrayList<>(list);
                tmpList.add(i);
                dp[i][j].add(tmpList);
            } 
        }
    }
    return dp[n][k];
}
```

这里遇到个神奇的问题，提一下，开始的的时候，最里边的 for 循环是这样写的

```java
for (List<Integer> list: dp[i - 1][j - 1]) {
    List<Integer> tmpList = new LinkedList<>(list);
    tmpList.add(i);
    dp[i][j].add(tmpList);
} 
```

就是 List 用的 Linked，而不是 Array，看起来没什么大问题，在 leetcode 上竟然报了超时。看了下 java 的源码。

```java
//ArrayList
public boolean add(E e) {
    ensureCapacityInternal(size + 1);  // Increments modCount!!
    elementData[size++] = e;
    return true;
}
//LinkedList
public boolean add(E e) {
    linkLast(e);
    return true;
}
void linkLast(E e) {
    final Node<E> l = last;
    final Node<E> newNode = new Node<>(l, e, null);
    last = newNode;
    if (l == null)
        first = newNode;
    else
        l.next = newNode;
    size++;
    modCount++;
}
```

猜测原因可能是因为 linked 每次 add 的时候，都需要 new 一个节点对象，而我们进行了很多次 add，所以这里造成了时间的耗费，导致了超时。所以刷题的时候还是优先用 ArrayList 吧。

接下来就是动态规划的常规操作了，空间复杂度的优化，我们注意到更新 dp [ i \] \[ \* \] 的时候，只用到dp [ i - 1 \] \[  \* \] 的情况，所以我们可以只用一个一维数组就够了。和[72题](<https://leetcode.windliang.cc/leetCode-72-Edit-Distance.html>)解法二，以及[5题](<https://leetcode.windliang.cc/leetCode-5-Longest-Palindromic-Substring.html>)，[10题](<https://leetcode.windliang.cc/leetCode-10-Regular-Expression-Matching.html>)，[53题](<https://leetcode.windliang.cc/leetCode-53-Maximum-Subarray.html)等等优化思路一样，这里不详细说了。

```java
public List<List<Integer>> combine(int n, int k) {
    List<List<Integer>>[] dp = new ArrayList[k + 1]; 
    // i 从 1 到 n
    dp[0] = new ArrayList<>();
    dp[0].add(new ArrayList<Integer>());
    for (int i = 1; i <= n; i++) {
        // j 从 1 到 i 或者 k
        List<List<Integer>> temp = new ArrayList<>(dp[0]);
        for (int j = 1; j <= i && j <= k; j++) {
            List<List<Integer>> last = temp;
            if(dp[j]!=null){ 
                temp = new ArrayList<>(dp[j]);
            } 
            // 判断是否可以从 i - 1 里边选 j 个
            if (i <= j) {
                dp[j] = new ArrayList<>();
            }
            // 把 i - 1 里边选 j - 1 个的每个结果加上 i
            for (List<Integer> list : last) {
                List<Integer> tmpList = new ArrayList<>(list);
                tmpList.add(i);
                dp[j].add(tmpList);
            }
        }
    }
    return dp[k];
}
```

# 总

开始的时候直接用了动态规划，然后翻了一些 Discuss 感觉发现了新世界，把目前为止常用的思路都用到了，回溯，递归，迭代，动态规划，这道题也太经典了！值得细细回味。