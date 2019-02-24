# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/46.jpg)

描述的很简单，就是给定几个数，然后输出他们所有排列的可能。

# 解法一 插入

这是自己开始想到的一个方法，考虑的思路是，先考虑小问题怎么解决，然后再利用小问题去解决大问题。没错，就是递归的思路。比如说，

如果只有 1 个数字 [ 1 ]，那么很简单，直接返回 [ [ 1 ] ] 就 OK 了。

如果加了 1 个数字 2， [ 1 2 ] 该怎么办呢？我们只需要在上边的情况里，在 1 的空隙，也就是左边右边插入 2 就够了。变成 [ [ **2** 1 ], [ 1 **2** ] ]。

如果再加 1 个数字 3，[ 1 2 3 ] 该怎么办呢？同样的，我们只需要在上边的所有情况里的空隙里插入数字 3 就行啦。例如 [ 2 1 ] 在左边，中间，右边插入 3 ，变成 **3** 2 1，2 **3** 1，2 1 **3**。同理，1 2 在左边，中间，右边插入 3，变成 **3** 1 2，1 **3** 2，1 2 **3**，所以最后的结果就是 [ [ 3 2 1]，[ 2 3 1]，[ 2 1 3 ],  [ 3 1 2 ]，[ 1 3 2 ]，[ 1 2 3 ] ]。

如果再加数字也是同样的道理，只需要在之前的情况里，数字的空隙插入新的数字就够了。

思路有了，直接看代码吧。

```java
public List<List<Integer>> permute(int[] nums) {
    return permute_end(nums,nums.length-1);
}
// end 表示当前新增的数字的位置
private List<List<Integer>> permute_end(int[] nums, int end) {
    // 只有一个数字的时候
    if(end == 0){
        List<List<Integer>> all = new ArrayList<>();
        List<Integer> temp = new ArrayList<>();
        temp.add(nums[0]);
        all.add(temp);
        return all;
    }
    //得到上次所有的结果
    List<List<Integer>> all_end = permute_end(nums,end-1);
    int current_size = all_end.size();
    //遍历每一种情况
    for (int j = 0; j < current_size; j++) { 
        //在数字的缝隙插入新的数字
        for (int k = 0; k <= end; k++) {
            List<Integer> temp = new ArrayList<>(all_end.get(j));
            temp.add(k, nums[end]);
            //添加到结果中
            all_end.add(temp);
        };

    }
    //由于 all_end 此时既保存了之前的结果，和添加完的结果，所以把之前的结果要删除
    for (int j = 0; j < current_size; j++) {
        all_end.remove(0);
    }
    return all_end;
}
```

既然有递归的过程，我们也可以直接改成迭代的，可以把递归开始不停压栈的过程省略了。

```java
public List<List<Integer>> permute(int[] nums) {
    List<List<Integer>> all = new ArrayList<>();
    all.add(new ArrayList<>());
    //在上边的基础上只加上最外层的 for 循环就够了，代表每次新添加的数字
    for (int i = 0; i < nums.length; i++) {
        int current_size = all.size();
        for (int j = 0; j < current_size; j++) {
            for (int k = 0; k <= i; k++) {
                List<Integer> temp = new ArrayList<>(all.get(j));
                temp.add(k, nums[i]);
                all.add(temp);
            }
        }
        for (int j = 0; j < current_size; j++) {
            all.remove(0);
        }
    }
    return all;
}
```

时间复杂度，如果只分析代码的话挺复杂的。如果从最后的结果来说，应该是 n! 个结果，所以时间复杂度应该是 O（n！)。

空间复杂度：O（1）。

# 解法二 回溯

这个开始没想到，参考[这里](https://leetcode.com/problems/permutations/discuss/18239/A-general-approach-to-backtracking-questions-in-Java-(Subsets-Permutations-Combination-Sum-Palindrome-Partioning))。

其实也算是蛮典型的回溯，利用递归每次向 temp 里添加一个数字，数字添加够以后再回来进行回溯，再向后添加新的解。

可以理解成一层一层的添加，每一层都是一个 for 循环。

![](https://windliang.oss-cn-beijing.aliyuncs.com/46_2.jpg)

每调用一层就进入一个 for 循环，相当于列出了所有解，然后挑选了我们需要的。其实本质上就是深度优先遍历 DFS。

```java
public List<List<Integer>> permute(int[] nums) {
   List<List<Integer>> list = new ArrayList<>(); 
   backtrack(list, new ArrayList<>(), nums);
   return list;
}

private void backtrack(List<List<Integer>> list, List<Integer> tempList, int [] nums){
   if(tempList.size() == nums.length){
      list.add(new ArrayList<>(tempList));
   } else{
      for(int i = 0; i < nums.length; i++){ 
         if(tempList.contains(nums[i])) continue; // 已经存在的元素，跳过
         tempList.add(nums[i]); //将当前元素加入
         backtrack(list, tempList, nums); //向后继续添加
         tempList.remove(tempList.size() - 1); //将 tempList 刚添加的元素，去掉，尝试新的元素
      }
   }
} 
```

时间复杂度：

空间复杂度：

# 解法三 交换

参考[这里](https://leetcode.com/problems/permutations/discuss/18247/My-elegant-recursive-C++-solution-with-inline-explanation?orderBy=most_votes)。

这个想法就很 cool 了，之前第一个解法的递归，有点儿动态规划的意思，把 1 个数字的解，2  个数字的解，3 个数字的解，一环套一环的求了出来。

假设有一个函数，可以实现题目的要求，即产生 nums 的所有的组合，并且加入到 all 数组中。不过它多了一个参数，begin，即只指定从 nums [ begin ] 开始的数字，前边的数字固定不变。

```java
upset(int[] nums, int begin, List<List<Integer>> all)
```

如果有这样的函数，那么一切就都简单了。

如果 begin 等于 nums 的长度，那么就表示 begin 前的数字都不变，也就是全部数字不变，我们只需要把它加到 all 中就行了。

```java
if (begin == nums.length) {
    ArrayList<Integer> temp = new ArrayList<Integer>(); 
    for (int i = 0; i < nums.length; i++) {
        temp.add(nums[i]);
    }
    all.add(new ArrayList<Integer>(temp));
    return;
}
```

如果是其它的情况，我们其实只需要用一个 for 循环，把每一个数字都放到 begin 一次，然后再变化后边的数字就够了，也就是调用 upset 函数，从 begin + 1 开始的所有组合。

```java
for (int i = begin; i < nums.length; i++) {
    swap(nums, i, begin);
    upset(nums, begin + 1, all);
    swap(nums, i, begin);
}
```

总体就是这样了。

```java
public List<List<Integer>> permute(int[] nums) {
    List<List<Integer>> all = new ArrayList<>();
    //从下标 0 开始的所有组合
    upset(nums, 0, all);
    return all;
}

private void upset(int[] nums, int begin, List<List<Integer>> all) {
    if (begin == nums.length) {
        ArrayList<Integer> temp = new ArrayList<Integer>(); 
        for (int i = 0; i < nums.length; i++) {
            temp.add(nums[i]);
        }
        all.add(new ArrayList<Integer>(temp));
        return;
    }
    for (int i = begin; i < nums.length; i++) {
        swap(nums, i, begin);
        upset(nums, begin + 1, all);
        swap(nums, i, begin);
    }

}

private void swap(int[] nums, int i, int begin) {
    int temp = nums[i];
    nums[i] = nums[begin];
    nums[begin] = temp;
}
```

时间复杂度：

空间复杂度：

# 总

这道题很经典了，用动态规划，回溯，递归各实现了一遍，当然解法一强行递归了一下，和解法三相比真是相形见绌，解法三才是原汁原味的递归，简洁优雅。