# 题目描述（简单难度）

299、Bulls and Cows

You are playing the following [Bulls and Cows](https://en.wikipedia.org/wiki/Bulls_and_Cows) game with your friend: You write down a number and ask your friend to guess what the number is. Each time your friend makes a guess, you provide a hint that indicates how many digits in said guess match your secret number exactly in both digit and position (called "bulls") and how many digits match the secret number but locate in the wrong position (called "cows"). Your friend will use successive guesses and hints to eventually derive the secret number.

Write a function to return a hint according to the secret number and friend's guess, use `A` to indicate the bulls and `B` to indicate the cows. 

Please note that both secret number and friend's guess may contain duplicate digits.

**Example 1:**

```
Input: secret = "1807", guess = "7810"

Output: "1A3B"

Explanation: 1 bull and 3 cows. The bull is 8, the cows are 0, 1 and 7.
```

**Example 2:**

```
Input: secret = "1123", guess = "0111"

Output: "1A1B"

Explanation: The 1st 1 in friend's guess is a bull, the 2nd or 3rd 1 is a cow.
```

**Note:** You may assume that the secret number and your friend's guess only contain digits, and their lengths are always equal.

说简单点就是统计两个字符串中数字和位置都对应相等的个数以及数字相等但位置不一样的个数。

# 解法一

只要理解了题意的话，这道题还是比较容易写的。分两步。

首先统计数字和位置都对应相等的个数，只要依次遍历两个数组看是否对应相等即可。

```java
int A = 0;
for (int i = 0; i < guess.length(); i++) {
    if (secret.charAt(i) == guess.charAt(i)) {
        A++;
    }
}
```

然后我们可以通过两个 `HashMap` 统计相等的数字有多少个。我们只需要分别记录 `secret` 和 `guess` 中每个数字的个数，然后取两者较小的就是相等数字的个数了。

比如 `secret` 中有 `3` 个 `2`，`guess` 中有`4` 个 `2`，那么两者相等的数字就至少有 `3` 个。

```java
HashMap<Character, Integer> mapS = new HashMap<>();
HashMap<Character, Integer> mapG = new HashMap<>();
//统计每个数字的个数
for (int i = 0; i < secret.length(); i++) {
    mapS.put(secret.charAt(i), mapS.getOrDefault(secret.charAt(i), 0) + 1);
    mapG.put(guess.charAt(i), mapG.getOrDefault(guess.charAt(i), 0) + 1);
}
int B = 0;
//两者取较小
for (Character key : mapG.keySet()) {
    int n1 = mapG.getOrDefault(key, 0);
    int n2 = mapS.getOrDefault(key, 0);
    B = B + Math.min(n1, n2);
}
```

题目中让我们求的是数字相等但位置不同的，上边的 `B` 把位置相同的也包括了，所以最终的结果应该是 `B - A`。

上边的两块代码结合起来即可。

```java
public String getHint(String secret, String guess) {
    int A = 0;
    for (int i = 0; i < guess.length(); i++) {
        if (secret.charAt(i) == guess.charAt(i)) {
            A++;
        }
    }
    HashMap<Character, Integer> mapS = new HashMap<>();
    HashMap<Character, Integer> mapG = new HashMap<>();
    for (int i = 0; i < secret.length(); i++) {
        mapS.put(secret.charAt(i), mapS.getOrDefault(secret.charAt(i), 0) + 1);
        mapG.put(guess.charAt(i), mapG.getOrDefault(guess.charAt(i), 0) + 1);
    }
    int B = 0;
    for (Character key : mapG.keySet()) {
        int n1 = mapG.getOrDefault(key, 0);
        int n2 = mapS.getOrDefault(key, 0);
        B = B + Math.min(n1, n2);
    }
    return A + "A" + (B - A) + "B";
}
```

分享 [这里](https://leetcode.com/problems/bulls-and-cows/discuss/74629/My-3ms-Java-solution-may-help-u) 的代码，我们还可以做两点优化。

第一点，因为 `map` 中的 `key` 只有 `0` 到 `9`，所以我们可以用数组取代 `map` 。

第二点，我们可以把第二步用 `map` 统计个数的代码放到第一个 `for` 循环中，当位置不相等的时候再统计个数，这样最后就不用 `B - A`了。

```java
public String getHint(String secret, String guess) {
    int A = 0;
    int[] mapS = new int[10];
    int[] mapG = new int[10];
    for (int i = 0; i < guess.length(); i++) {
        if (secret.charAt(i) == guess.charAt(i)) {
            A++;
        } else {
            mapS[secret.charAt(i) - '0']++;
            mapG[guess.charAt(i) - '0']++;
        }
    }
    int B = 0;
    for (int i = 0; i < 10; i++) {
        B += Math.min(mapS[i], mapG[i]);
    }
    return A + "A" + B + "B";
}
```

# 解法二

解法一最后的代码依旧有两个 `for` 循环，分享 [这里](https://leetcode.com/problems/bulls-and-cows/discuss/74621/One-pass-Java-solution) 只有一个循环的代码。

比较巧妙，相对于解法一难理解些，可以结合下边的注释理解一下。

```java
public String getHint(String secret, String guess) {
    int bulls = 0;
    int cows = 0;
    int[] numbers = new int[10];
    for (int i = 0; i<secret.length(); i++) {
        int s = secret.charAt(i) - '0';
        int g = guess.charAt(i)) - '0';
        if (s == g) bulls++;
        else {
            //当前数小于 0, 说明之前在 guess 中出现过, 和 secret 当前的数匹配
            if (numbers[s] < 0) cows++;
            //当前数大于 0, 说明之前在 secret 中出现过, 和 guess 当前的数匹配
            if (numbers[g] > 0) cows++;
            //secret 中的数, 计数加 1
            numbers[s] ++;
            //guess 中的数, 计数减 1
            numbers[g] --;
        }
    }
    return bulls + "A" + cows + "B";
}
```

理解不了的话，可以举个例子。

```java
"231" 和 "321"

secret 2  3  1
guess  3  2  1
       ^
       i

当前遍历到第 1 个数, s = 2, g = 3
numbers[s]++, 也就是 numbers[2] = 1
numbers[g]--, 也就是 numbers[3] = -1    
    
secret 2  3  2
guess  3  2  1
          ^
          i

numbers[2] = 1, numbers[3] = -1
    
当前遍历到第 2 个数, s = 3, g = 2
此时 numbers[s], 也就是 numbers[3] < 0, cows++
此时 numbers[g], 也就是 numbers[2] > 0, cows++
cows = 2

继续执行
numbers[s]++, 也就是 numbers[3] + 1 = -1 + 1 = 0
numbers[g]--, 也就是 numbers[2] - 1 = 1 - 1 = 0

secret 2  3  2
guess  3  2  1
             ^
             i
numbers[2] = 0, numbers[3] = 0    
当前遍历到第 3 个数, s = 2, g = 1    
此时 s 虽然又遇到了 2, 但是 number[2] = 0 了, 无法再匹配, 所以 cows 不会加 1 了 

最终 cows 就是 2 了
```



# 总

算比较简单的一道题，主要是理解题意。解法二的话，遇到 `s` 加 `1`，遇到 `g` 减 `1`，真的很妙。