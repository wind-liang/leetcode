# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/40.jpg)

和[上一道题](https://leetcode.windliang.cc/leetCode-39-Combination-Sum.html)非常像了，区别在于这里给的数组中有重复的数字，每个数字只能使用一次，然后同样是给出所有和等于 target 的情况。

# 解法一 回溯法

只需要在上题的基础上改一下就行了。直接看代码吧。

```java
public List<List<Integer>> combinationSum2(int[] candidates, int target) {
    List<List<Integer>> ans = new ArrayList<>();
    getAnswer(ans, new ArrayList<>(), candidates, target, 0);
    /*************修改的地方*******************/
    // 如果是 Input: candidates = [2,5,2,1,2], target = 5,
    // 输出会出现 [2 2 1] [2 1 2] 这样的情况，所以要去重
    return removeDuplicate(ans);
     /****************************************/
}

private void getAnswer(List<List<Integer>> ans, ArrayList<Integer> temp, int[] candidates, int target, int start) {
    if (target == 0) {
        ans.add(new ArrayList<Integer>(temp));
    } else if (target < 0) {
        return;
    } else {
        for (int i = start; i < candidates.length; i++) {
            temp.add(candidates[i]);
            /*************修改的地方*******************/
            //i -> i + 1 ，因为每个数字只能用一次，所以下次遍历的时候不从自己开始
            getAnswer(ans, temp, candidates, target - candidates[i], i + 1);
            /****************************************/
            temp.remove(temp.size() - 1);
        }
    }

}

private List<List<Integer>> removeDuplicate(List<List<Integer>> list) {
    Map<String, String> ans = new HashMap<String, String>();
    for (int i = 0; i < list.size(); i++) {
        List<Integer> l = list.get(i);
        Collections.sort(l);
        String key = "";
        for (int j = 0; j < l.size() - 1; j++) {
            key = key + l.get(j) + ",";
        }
        key = key + l.get(l.size() - 1);
        ans.put(key, "");
    }
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

看到[这里](https://leetcode.com/problems/combination-sum-ii/discuss/16878/Combination-Sum-I-II-and-III-Java-solution-(see-the-similarities-yourself))，想法很棒，为了解决重复的情况，我们可以先把数组先排序，这样就好说了。

```java
public List<List<Integer>> combinationSum2(int[] candidates, int target) {
    List<List<Integer>> ans = new ArrayList<>();
    Arrays.sort(candidates); //排序
    getAnswer(ans, new ArrayList<>(), candidates, target, 0); 
    return ans;
}

private void getAnswer(List<List<Integer>> ans, ArrayList<Integer> temp, int[] candidates, int target, int start) {
    if (target == 0) {
        ans.add(new ArrayList<Integer>(temp));
    } else if (target < 0) {
        return;
    } else {
        for (int i = start; i < candidates.length; i++) {
            //跳过重复的数字
            if(i > start && candidates[i] == candidates[i-1]) continue;  
            temp.add(candidates[i]);
            /*************修改的地方*******************/
            //i -> i + 1 ，因为每个数字只能用一次，所以下次遍历的时候不从自己开始
            getAnswer(ans, temp, candidates, target - candidates[i], i + 1);
            /****************************************/
            temp.remove(temp.size() - 1);
        }
    }
}
 
```



# 解法二 动态规划

怎么去更改上题的算法满足本题，暂时没想到，只想到就是再写个函数对答案再过滤一次。先记录给定的 nums 中的每个数字出现的次数，然后判断每个 list 的数字出现的次数是不是满足小于等于给定的 nums 中的每个数字出现的次数，不满足的话就剔除掉。如果大家有直接改之前算法的好办法可以告诉我，谢谢了。

此外，要注意一点就是上题中，给定的 nums 没有重复的，而这题中是有重复的。为了使得和之前一样，所以我们在算法中都得加上

```java
if (i > 0 && nums[i] == nums[i - 1]) {
    continue;
}
```

跳过重复的数字，不然是不能 AC 的，至于原因下边分析下。

```java
public List<List<Integer>> combinationSum2(int[] nums, int target) {
    List<List<List<Integer>>> ans = new ArrayList<>(); //opt 数组
    Arrays.sort(nums);// 将数组有序，这样可以提现结束循环
    for (int sum = 0; sum <= target; sum++) { // 从 0 到 target 求出每一个 opt
        List<List<Integer>> ans_sum = new ArrayList<List<Integer>>();
        for (int i = 0; i < nums.length; i++) { //遍历 nums
            /*******************修改的地方********************/
            if (i > 0 && nums[i] == nums[i - 1]) {
                continue;
            }
            /***********************************************/
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
    return remove(removeDuplicate(ans.get(target)),nums);
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

//过滤不满足答案的情况
private List<List<Integer>> remove(List<List<Integer>> list, int[] nums) {
    HashMap<Integer, Integer> nh = new HashMap<Integer, Integer>();
    List<List<Integer>> ans = new ArrayList<List<Integer>>(list);
    //记录每个数字出现的次数
    for (int n : nums) {
        int s = nh.getOrDefault(n, 0);
        nh.put(n, s + 1);
    }
    for (int i = 0; i < list.size(); i++) {
        List<Integer> l = list.get(i);
        HashMap<Integer, Integer> temp = new HashMap<Integer, Integer>();
        //记录每个 list 中数字出现的次数
        for (int n : l) {
            int s = temp.getOrDefault(n, 0);
            temp.put(n, s + 1);
        }
        for (int n : l) {
            //进行比较
            if (temp.get(n) > nh.get(n)) {
                ans.remove(l);
                break;
            }
        }
    }
    return ans;
}
```

如果不加跳过重复的数字的话，下边的样例不会通过。

![](https://windliang.oss-cn-beijing.aliyuncs.com/40_3.jpg)

这是因为我们求 opt 的时候每个列表的数量在以指数级增加，在上一个 opt 的基础上，每一个列表都增加 5 个 列表。

opt [ 1 ] = [ [ 1 ]，[ 1 ]，[ 1 ]，[ 1 ]，[ 1 ] ] 数量是 5，

opt [ 2 ] =  [ 

​			[ 1，1 ]， [ 1，1 ]，[ 1，1 ]，[ 1，1 ]，[ 1，1 ]，

​			[ 1，1 ]， [ 1，1 ]，[ 1，1 ]，[ 1，1 ]，[ 1，1 ]

​			[ 1，1 ]， [ 1，1 ]，[ 1，1 ]，[ 1，1 ]，[ 1，1 ]，

​			[ 1，1 ]， [ 1，1 ]，[ 1，1 ]，[ 1，1 ]，[ 1，1 ]，

​			[ 1，1 ]， [ 1，1 ]，[ 1，1 ]，[ 1，1 ]，[ 1，1 ]，，

​		   ] 数量是 5 * 5。

opt [ 3 ] 数量是 5 \* 5 \* 5。

到了 opt [ 9 ] 就是 5 的 9 次方，数量是 1953125 内存爆炸了。

另一个算法也可以改一下

```java
public List<List<Integer>> combinationSum2(int[] nums, int target) {
    List<List<List<Integer>>> ans = new ArrayList<>();
    Arrays.sort(nums);
    if (nums[0] > target) {
        return new ArrayList<List<Integer>>();
    }
    for (int i = 0; i <= target; i++) {
        List<List<Integer>> ans_i = new ArrayList<List<Integer>>();
        ans.add(i, ans_i);
    }

    for (int i = 0; i < nums.length; i++) {
        /*******************修改的地方********************/
        if (i > 0 && nums[i] == nums[i - 1]) {
            continue;
        }
        /***********************************************/
        for (int sum = nums[i]; sum <= target; sum++) {
            List<List<Integer>> ans_sum = ans.get(sum);
            List<List<Integer>> ans_sub = ans.get(sum - nums[i]);
            if (sum == nums[i]) {
                ArrayList<Integer> temp = new ArrayList<Integer>();
                temp.add(nums[i]);
                ans_sum.add(temp);

            }
            if (ans_sub.size() > 0) {
                for (int j = 0; j < ans_sub.size(); j++) {
                    ArrayList<Integer> temp = new ArrayList<Integer>(ans_sub.get(j));
                    temp.add(nums[i]);
                    ans_sum.add(temp);
                }
            }
        }
    }
    return remove(ans.get(target), nums);

}

private List<List<Integer>> remove(List<List<Integer>> list, int[] nums) {
    HashMap<Integer, Integer> nh = new HashMap<Integer, Integer>();
    List<List<Integer>> ans = new ArrayList<List<Integer>>(list);
    for (int n : nums) {
        int s = nh.getOrDefault(n, 0);
        nh.put(n, s + 1);
    }
    for (int i = 0; i < list.size(); i++) {
        List<Integer> l = list.get(i);
        HashMap<Integer, Integer> temp = new HashMap<Integer, Integer>();
        for (int n : l) {
            int s = temp.getOrDefault(n, 0);
            temp.put(n, s + 1);
        }
        for (int n : l) {
            if (temp.get(n) > nh.get(n)) {
                ans.remove(l);
                break;
            }
        }
    }
    return ans;
}
```

如果不加跳过重复的数字的话，下边的样例不会通过

![](https://windliang.oss-cn-beijing.aliyuncs.com/40_2.jpg)

会发现出现了很多重复的结果，就是因为没有跳过重复的 1。在求 opt [ 1 ] 的时候就变成了 [ [ 1 ]，[ 1 ] ] 这样子，由于后边求的时候都是直接在原来每一个列表里加数字，所有后边都是加了两次了。

# 总

和上题很像，基本上改一改就好了。排序的来排除重复的情况也很妙。还有就是改算法的时候，要考虑到题的要求的变化之处。