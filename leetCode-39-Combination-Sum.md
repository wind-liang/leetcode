# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/39.jpg)

给几个数字，一个目标值，输出所有和等于目标值的组合。

# 解法一 回溯法

参考[这里](https://leetcode.com/problems/combination-sum/discuss/16502/A-general-approach-to-backtracking-questions-in-Java-(Subsets-Permutations-Combination-Sum-Palindrome-Partitioning)) ，就是先向前列举所有情况，得到一个解或者走不通的时候就回溯。和[37](https://leetcode.windliang.cc/leetCode-37-Sudoku-Solver.html)题有异曲同工之处，也算是回溯法很典型的应用，直接看代码吧。

```java
public List<List<Integer>> combinationSum(int[] nums, int target) {
    List<List<Integer>> list = new ArrayList<>();
    backtrack(list, new ArrayList<>(), nums, target, 0);
    return list;
}

private void backtrack(List<List<Integer>> list, List<Integer> tempList, int [] nums, int remain, int start){
    if(remain < 0) return;
    else if(remain == 0) list.add(new ArrayList<>(tempList));
    else{ 
        for(int i = start; i < nums.length; i++){
            tempList.add(nums[i]);
            backtrack(list, tempList, nums, remain - nums[i], i); 
            //找到了一个解或者 remain < 0 了，将当前数字移除，然后继续尝试
            tempList.remove(tempList.size() - 1);
        }
    }
}
```

时间复杂度：

空间复杂度：

# 解法二 动态规划

参考[这里](https://leetcode.com/problems/combination-sum/discuss/16656/Dynamic-Programming-Solution?orderBy=most_votes)。动态规划的关键就是找到递进关系，看到了下边的评论想通的。

![](https://windliang.oss-cn-beijing.aliyuncs.com/39_1.jpg)

我们用一个 opt 的 list，然后依次求出 opt [ 0 ]，opt [ 1 ] ... opt [ target ]。

opt[0]，表示和为 0 的所有情况的组合。

opt[1]，表示和为 1 的所有情况的组合。

opt[2]，表示和为 2 的所有情况的组合。

...

opt[target]，表示和为 target 的所有情况的组合，也就是题目所要求的。

递进关系就是，sum 代表要求的和，如果想求 opt [ sum ] ，就遍历给定的数组 nums，然后分两种情况。

* 如果 sum 刚好等于 nums [ i ]，那么就直接把 nums [ i ] 加到 list 里，算作一种情况。

  例如 nums = [ 2, 3, 6, 7 ] , target = 7。

  当求 sum = 3 的时候，也就是求 opt [ 3 ] 的时候，此时当遍历到 nums [ 1 ]，此时 nums [ 1 ] == sum == 3，所以此时 opt [ 3 ] = [ [ 3 ] ]。

* 如果 sum 大于 nums [ i ]，那么我们就把 opt [ sum - nums [ i ] ] 的所有情况都加上 nums [ i ] 然后作为 opt [ sum ] 。

  例如 nums = [ 1, 2, 3, 6, 7 ] , target = 7。

  当 sum 等于 5 的时候，也就是求 opt [ 5 ] 的时候，此时当遍历到 nums [ 1 ]，此时 nums [ 1 ] = 2 < sum。然后，就看 opt [ sum - nums [ i ] ] = opt [ 5 - 2 ] = opt [ 3 ]，而 opt [ 3 ] 在之前已经求好了，opt [ 3 ] = [ [ 1, 2 ], [ 3 ] ]，然后把 opt [ 3 ] 中的每一种情况都加上 nums [ 1 ] ，也就是 2，就变成了 [ [ 1,  2,  2 ], [ 3, 2 ] ]，这个就是遍历到 nums [ 1 ] 时候的 opt [ 5 ]了。

上边的想法看起来没什么问题，但跑了下遇到一个问题。

比如求 nums = [ 2, 3, 6, 7 ] , target = 7 的时候。

求 opt [ 5 ]，然后遍历到 nums [ 0 ] = 2 的时候，就把 opt [ 3 ] = [ [ 3 ] ] 的所有情况加上 2，也就是[ 3 2 ] 加到 opt [ 5 ] 上。接着遍历到 nums [ 2 ] = 3 的时候，就把 opt [ 2 ] = [ [ 2 ] ] 的所有情况加上 3，然后 [ 2 3 ] 这种情况加到 opt [ 5 ] 上，此时 opt [ 5 ] = [ [ 3 2]，[ 2 3 ] ]。这样出现了重复的情况，需要解决一下。

这样就相当于二维数组去重，也就是  [ [ 3 2 ]，[ 2 3 ] , [ 1 ] ] 这样的列表去重变成  [ [ 2 3 ] , [ 1 ] ] 。最普通的想法就是两个 for 循环然后一个一个比对，把重复的去掉。但这样实在是太麻烦了，因为比对的时候又要比对列表是否相等，比对列表是否相等又比较麻烦。

[这里](https://bbs.csdn.net/topics/360189572)看到一个方法，就是把每个 list 转成 string，然后利用 HashMap 的 key 是唯一的，把每个 list 当做 key 加入到 HashMap 中，这样就实现了去重，然后再把 string 还原为 list。

```java
private List<List<Integer>> removeDuplicate(List<List<Integer>> list) {
    Map<String, String> ans = new HashMap<String, String>();
    for (int i = 0; i < list.size(); i++) {
        List<Integer> l = list.get(i);
        Collections.sort(l);
        String key = "";
        //[ 2 3 4] 转为 "2,3,4"
        for (int j = 0; j < l.size() - 1; j++) {
            key = key + l.get(j) + ",";
        }
        key = key + l.get(l.size() - 1);
        ans.put(key, "");
    }
    //根据逗号还原 List
    List<List<Integer>> ans_list = new ArrayList<List<Integer>>();
    for (String k : ans.keySet()) {
        String[] l = k.split(",");
        List<Integer> temp = new ArrayList<Integer>();
        for (int i = 0; i < l.length; i++) {
            int c = Integer.parseInt(l[i]);
            temp.add(c);
        }
        ans_list.add(temp);
    }
    return ans_list;
}
```

然后结合去重的方法，我们的问题就解决了。

```java
public List<List<Integer>> combinationSum(int[] nums, int target) {
    List<List<List<Integer>>> ans = new ArrayList<>(); //opt 数组
    Arrays.sort(nums);// 将数组有序，这样可以提现结束循环
    for (int sum = 0; sum <= target; sum++) { // 从 0 到 target 求出每一个 opt
        List<List<Integer>> ans_sum = new ArrayList<List<Integer>>();
        for (int i = 0; i < nums.length; i++) { //遍历 nums
            if (nums[i] == sum) { 
                List<Integer> temp = new ArrayList<Integer>();
                temp.add(nums[i]);
                ans_sum.add(temp);
            } else if (nums[i] < sum) {
                List<List<Integer>> ans_sub = ans.get(sum - nums[i]);
                //每一个加上 nums[i]
                for (int j = 0; j < ans_sub.size(); j++) {
                    List<Integer> temp = new ArrayList<Integer>(ans_sub.get(j));
                    temp.add(nums[i]);
                    ans_sum.add(temp);
                }
            } else {
                break;
            }
        }
        ans.add(sum, ans_sum);
    }
    return removeDuplicate(ans.get(target));
} 

private List<List<Integer>> removeDuplicate(List<List<Integer>> list) {
    Map<String, String> ans = new HashMap<String, String>();
    for (int i = 0; i < list.size(); i++) {
        List<Integer> l = list.get(i);
        Collections.sort(l);
        String key = "";
        //[ 2 3 4 ] 转为 "2,3,4"
        for (int j = 0; j < l.size() - 1; j++) {
            key = key + l.get(j) + ",";
        }
        key = key + l.get(l.size() - 1);
        ans.put(key, "");
    }
    //根据逗号还原 List
    List<List<Integer>> ans_list = new ArrayList<List<Integer>>();
    for (String k : ans.keySet()) {
        String[] l = k.split(",");
        List<Integer> temp = new ArrayList<Integer>();
        for (int i = 0; i < l.length; i++) {
            int c = Integer.parseInt(l[i]);
            temp.add(c);
        }
        ans_list.add(temp);
    }
    return ans_list;
}

```

时间复杂度：

空间复杂度：

还有另一种思路可以解决重复的问题。

之前对于 nums = [ 2, 3, 6, 7 ] , target = 7 ，我们用了两层 for 循环，分别对 opt 和 nums 进行遍历。

我们先求 opt [ 0 ]，通过遍历 nums [ 0 ]， nums [ 1 ]， nums [ 2 ]， nums [ 3 ]

然后再求 opt [ 1 ]，通过遍历 nums [ 0 ]， nums [ 1 ]， nums [ 2 ]， nums [ 3 ]

然后再求 opt [ 2 ]，通过遍历 nums [ 0 ]， nums [ 1 ]， nums [ 2 ]， nums [ 3 ]

...

最后再求 opt [ 7 ]，通过遍历 nums [ 0 ]， nums [ 1 ]， nums [ 2 ]， nums [ 3 ]。

求 opt [ 5 ] 的时候，出现了 [ 2 3 ]，[ 3 2 ] 这样重复的情况。

我们可以把两个 for 循环的遍历颠倒一下，外层遍历 nums，内层遍历 opt。

考虑 nums [ 0 ]，求出 opt [ 0 ]，求出 opt [ 1 ]，求出 opt [ 2 ]，求出 opt [ 3 ] ... 求出 opt [ 7 ]。

考虑 nums [ 1 ]，求出 opt [ 0 ]，求出 opt [ 1 ]，求出 opt [ 2 ]，求出 opt [ 3 ] ... 求出 opt [ 7 ]。

考虑 nums [ 2 ]，求出 opt [ 0 ]，求出 opt [ 1 ]，求出 opt [ 2 ]，求出 opt [ 3 ] ... 求出 opt [ 7 ]。

考虑 nums [ 3 ]，求出 opt [ 0 ]，求出 opt [ 1 ]，求出 opt [ 2 ]，求出 opt [ 3 ] ... 求出 opt [ 7 ]。

这样的话，每次循环会更新一次  opt [ 7 ]，最后次更新的 opt [ 7 ] 就是我们想要的了。

这样之前的问题，求 opt [ 5 ] 的时候，出现了 [ 2 3 ]，[ 3 2 ] 这样重复的情况就不会出现了，因为当考虑 nums [ 2 ] 的时候，opt [ 3 ] 里边还没有加入 [ 3 ] 。

思路就是上边说的了，但是写代码的时候遇到不少坑，大家也可以先尝试写一下。

```java
public List<List<Integer>> combinationSum(int[] nums, int target) {
    List<List<List<Integer>>> ans = new ArrayList<>();
    Arrays.sort(nums);
    if (nums[0] > target) {
        return new ArrayList<List<Integer>>();
    }
    // 先初始化 ans[0] 到 ans[target]，因为每次循环是更新 ans,会用到 ans.get() 函数，如果不初始化会报错
    for (int i = 0; i <= target; i++) {
        List<List<Integer>> ans_i = new ArrayList<List<Integer>>();
        ans.add(i, ans_i);
    }

    for (int i = 0; i < nums.length; i++) {
        for (int sum = nums[i]; sum <= target; sum++) {
            List<List<Integer>> ans_sum = ans.get(sum);
            List<List<Integer>> ans_sub = ans.get(sum - nums[i]);
            //刚开始 ans_sub 的大小是 0，所以单独考虑一下这种情况
            if (sum == nums[i]) {
                ArrayList<Integer> temp = new ArrayList<Integer>();
                temp.add(nums[i]);
                ans_sum.add(temp);

            }
            //如果 ans.get(sum - nums[i])大小不等于 0，就可以按之前的想法更新了。
            //每个 ans_sub[j] 都加上 nums[i]
            if (ans_sub.size() > 0) {
                for (int j = 0; j < ans_sub.size(); j++) {
                    ArrayList<Integer> temp = new ArrayList<Integer>(ans_sub.get(j));
                    temp.add(nums[i]);
                    ans_sum.add(temp);
                }
            }
        }
    }
    return ans.get(target);
}
```



# 总

对回溯法又有了更深的了解，一般的架构就是一个大的 for 循环，然后先 add，接着利用递归进行向前遍历，然后再 remove ，继续循环。而解法二的动态规划就是一定要找到递进的规则，开始的时候就想偏了，导致迟迟想不出来。