# 题目描述（简单难度）

290、Word Pattern

Given a `pattern` and a string `str`, find if `str` follows the same pattern.

Here **follow** means a full match, such that there is a bijection between a letter in `pattern` and a **non-empty** word in `str`.

**Example 1:**

```
Input: pattern = "abba", str = "dog cat cat dog"
Output: true
```

**Example 2:**

```
Input:pattern = "abba", str = "dog cat cat fish"
Output: false
```

**Example 3:**

```
Input: pattern = "aaaa", str = "dog cat cat dog"
Output: false
```

**Example 4:**

```
Input: pattern = "abba", str = "dog dog dog dog"
Output: false
```

**Notes:**
You may assume `pattern` contains only lowercase letters, and `str` contains lowercase letters that may be separated by a single space.

判断字符串是否符合某个模式，类比于汉字，`abb` 型，就是喜洋洋，胖乎乎，每个汉字对应题目中的每个单词。

可以先做一下 [205 题](https://leetcode.wang/leetcode-205-Isomorphic-Strings.html)，基本上和这个题一模一样了，下边的思路也都是基于 [205 题](https://leetcode.wang/leetcode-205-Isomorphic-Strings.html) 去写了。

# 解法一

最简单的思路，利用 `HashMap` ，`pattern` 的每个字母作为 `key` ，`str` 的每个单词作为 ` value` 。第一次遇到的 `key` 就加入到 `HashMap` 中，第二次遇到同一个 `key`，那就判断它的`value` 和当前单词是否一致。举个例子。

```java
pattern = "abba", str = "dog cat cat dog"

 a   b   b   a
dog cat cat dog
 ^
 i
 第一次遇到 a, 加入到 HashMap
 HashMap = {a:dog}

 a   b   b   a
dog cat cat dog
     ^
     i
 第一次遇到 b, 加入到 HashMap
 HashMap = {a: dog, b: cat}

 a   b   b   a
dog cat cat dog
         ^
         i
 HashMap = {a: dog, b: cat}
 第二次遇到 b, 判断 HashMap 中 b 的 value 和当前的单词是否符合
 符合的话继续判断, 不符合就返回 false
 
 a   b   b   a
dog cat cat dog
             ^
             i
 HashMap = {a: dog, b: cat}
 第二次遇到 a, 判断 HashMap 中 a 的 value 和当前的单词是否符合
 符合的话继续判断, 不符合就返回 false    
     
遍历结束，返回 true     
```

可以看一下相应的代码。

```java
public boolean wordPattern(String pattern, String str) {
    HashMap<Character, String> map = new HashMap<>();
    String[] array = str.split(" ");
    if (pattern.length() != array.length) {
        return false;
    }
    for (int i = 0; i < pattern.length(); i++) {
        char key = pattern.charAt(i);
        //当前 key 是否存在
        if (map.containsKey(key)) {
            if (!map.get(key).equals(array[i])) {
                return false;
            }
        } else {
            map.put(key, array[i]);
        }
    }
    return true;
}
```

但上边的代码还是有问题的，我们只是完成了 `pattern` 到 `str` 的映射，如果对于下边的例子是有问题的。

```java
pattern = "abba"
str = "dog dog dog dog"
```

最直接的方法，在添加新的 `key` 的时候判断一下相应的 `value` 是否已经用过了。

```java
public boolean wordPattern(String pattern, String str) {
    HashMap<Character,String> map = new HashMap<>();
    String[] array = str.split(" ");
    if(pattern.length() != array.length){
        return false;
    }
    for(int i = 0; i < pattern.length();i++){
        char key = pattern.charAt(i);
        if(map.containsKey(key)){
            if(!map.get(key).equals(array[i])){
                return false;
            }
        }else{
            //判断 value 中是否存在
            if(map.containsValue(array[i])){
                return false;
            }
            map.put(key, array[i]);
        }
    }
    return true;
}
```

虽然可以 AC 了，但还有一个问题，`containsValue` 的话，需要遍历一遍 `value` ，会导致时间复杂度增加。最直接的解决方法，我们可以把 `HashMap` 中的 `value` 存到 `HashSet` 中。

```java
public boolean wordPattern(String pattern, String str) {
    HashMap<Character, String> map = new HashMap<>();
    HashSet<String> set = new HashSet<>();
    String[] array = str.split(" ");
    if (pattern.length() != array.length) {
        return false;
    }
    for (int i = 0; i < pattern.length(); i++) {
        char key = pattern.charAt(i);
        if (map.containsKey(key)) {
            if (!map.get(key).equals(array[i])) {
                return false;
            }
        } else {
            // 判断 value 中是否存在
            if (set.contains(array[i])) {
                return false;
            }
            map.put(key, array[i]);
            set.add(array[i]);
        }
    }
    return true;
}
```

当然还有另外一种思路，我们只判断了 `pattern` 到 `str` 的映射，我们只需要再判断一次 `str` 到 `pattern` 的映射就可以了，这样就保证了一一对应。

两次判断映射的逻辑是一样的，所以我们可以抽象出一个函数，但由于 `pattern` 只能看成 `char` 数组，这样的话会使得两次的 `HashMap`   不一样，一次是 `HashMap<Character, String>` ，一次是 `HashMap<String, Character>`。所以我们提前将 `pattern` 转成 `String` 数组。

```java
public boolean wordPattern(String pattern, String str) {
    String[] array1 = str.split(" ");
    if (array1.length != pattern.length()) {
        return false;
    }
    String[] array2 = pattern.split("");
    //两个方向的映射
    return wordPatternHelper(array1, array2) && wordPatternHelper(array2, array1);
}

//array1 到 array2 的映射
private boolean wordPatternHelper(String[] array1, String[] array2) {
    HashMap<String, String> map = new HashMap<>(); 
    for (int i = 0; i < array1.length; i++) {
        String key = array1[i];
        if (map.containsKey(key)) {
            if (!map.get(key).equals(array2[i])) {
                return false;
            }
        } else {
            map.put(key, array2[i]);
        }
    }
    return true;
}
```

# 解法二

 [205 题](https://leetcode.wang/leetcode-205-Isomorphic-Strings.html) 还介绍了另一种思路。

解法一中，我们通过对两个方向分别考虑来解决的。

这里的话，我们找一个第三方来解决。即，按照单词出现的顺序，把两个字符串都映射到另一个集合中。

第一次出现的单词（字母）映射到 `1` ，第二次出现的单词（字母）映射到 `2`... 依次类推，这样就会得到一个新的字符串了。两个字符串都通过这样方法去映射，然后判断新得到的字符串是否相等 。 

举个现实生活中的例子，一个人说中文，一个人说法语，怎么判断他们说的是一个意思呢？把中文翻译成英语，把法语也翻译成英语，然后看最后的英语是否相同即可。举个例子。

```java
pattern = "abba", str = "dog cat cat dog"

对于 abba
a -> 1
b -> 2
最终的得到的字符串就是 1221
    
对于 dog cat cat dog
dog -> 1
cat -> 2
最终的得到的字符串就是 1221    
    
最终两个字符串都映射到了 1221, 所以 str 符合 pattern    
```

代码的话，我们同样封装一个函数，返回映射后的结果。

```java
public boolean wordPattern(String pattern, String str) {
    String[] array = str.split(" ");
    if(array.length!=pattern.length()){
        return false;
    }
    //判断映射后的结果是否相等
    return wordPatternHelper(pattern.split("")).equals(wordPatternHelper(array));
}

private String wordPatternHelper(String[] array) {
    HashMap<String, Integer> map = new HashMap<>();
    int count = 1;
    //保存映射后的结果
    StringBuilder sb = new StringBuilder();
    for (int i = 0; i < array.length; i++) {
        //是否已经映射过
        if (map.containsKey(array[i])) {
            sb.append(map.get(array[i]));
        } else {
            sb.append(count);
            map.put(array[i], count);
            count++;
        }
    }
    return sb.toString();
}
```

为了方便，我们也可以将当前单词（字母）直接映射为当前单词（字母）的下标，省去 `count` 变量。

```java
public boolean wordPattern(String pattern, String str) {
    String[] array = str.split(" ");
    if(array.length!=pattern.length()){
        return false;
    }
    //判断映射后的结果是否相等
    return wordPatternHelper(pattern.split("")).equals(wordPatternHelper(array));
}

private String wordPatternHelper(String[] array) {
    HashMap<String, Integer> map = new HashMap<>(); 
    //保存映射后的结果
    StringBuilder sb = new StringBuilder();
    for (int i = 0; i < array.length; i++) {
        //是否已经映射过
        if (map.containsKey(array[i])) {
            sb.append(map.get(array[i]));
        } else {
            sb.append(i);
            map.put(array[i], i); 
        }
    }
    return sb.toString();
}
```

上边我们是调用了两次函数，将字符串整体转换后来判断。我们其实可以一个单词（字母）一个单词（字母）的判断。第一次遇到的单词（字母）就给它一个 `value` ，也就是把下标给它。如果第二次遇到，就判断它们的 `value` 是否一致。

怎么判断是否是第一次遇到，我们可以通过判断 `key` 是否存在，但这样判断起来会比较麻烦。为了统一，我们可以给还不存在的 `key` 一个默认的 `value`，这样代码写起来比较统一。

```java
public boolean wordPattern(String pattern, String str) {
    String[] array1 = str.split(" ");
    if (array1.length != pattern.length()) {
        return false;
    }
    char[] array2 = pattern.toCharArray();
    HashMap<String, Integer> map1 = new HashMap<>();
    HashMap<Character, Integer> map2 = new HashMap<>();
    for (int i = 0; i < array1.length; i++) {
        String c1 = array1[i];
        char c2 = array2[i];
        // 当前的映射值是否相同
        int a = map1.getOrDefault(c1, -1);
        int b = map2.getOrDefault(c2, -1);
        if (a != b) {
            return false;
        } else { 
            map1.put(c1, i);
            map2.put(c2, i); 
        }
    }
    return true;
}
```

同样的思路，然后看一下 [StefanPochmann](https://leetcode.com/stefanpochmann) 大神的 [代码](https://leetcode.com/problems/word-pattern/discuss/73402/8-lines-simple-Java)。

```java
public boolean wordPattern(String pattern, String str) {
    String[] words = str.split(" ");
    if (words.length != pattern.length())
        return false;
    Map index = new HashMap();
    for (Integer i = 0; i < words.length; ++i)
        if (index.put(pattern.charAt(i), i) != index.put(words[i], i))
            return false;
    return true;
}
```

他利用了 `put` 的返回值，如果 `put` 的 `key` 不存在，那么就插入成功，返回 `null`。

如果 `put` 的 `key` 已经存在了，返回 `key` 是之前对应的 `value`。

所以第一次遇到的单词（字母）两者都会返回 `null`，不会进入 `return false`。

第二次遇到的单词（字母）就判断之前插入的 `value` 是否相等。也有可能其中一个之前还没插入值，那就是 `null` ，另一个之前已经插入了，会得到一个 `value`，两者一定不相等，就会返回 `false`。

还有一点需要注意，`for` 循环中我们使用的是 `Integer i`，而不是 `int i`。是因为 `map` 中的 `value` 只能是 `Integer` 。

如果我们用 `int i` 的话，`java` 会自动装箱，转成 `Integer`。这样就会带来一个问题，`put` 返回的是一个 `Integer` ，判断对象相等的话，相当于判断的是引用的地址，那么即使 `Integer` 包含的值相等，那么它俩也不会相等。我们可以改成  `int i`  后试一试。

```java
public boolean wordPattern(String pattern, String str) {
    String[] words = str.split(" ");
    if (words.length != pattern.length())
        return false;
    Map index = new HashMap();
    for (int i = 0; i < words.length; ++i)
        if (index.put(pattern.charAt(i), i) != index.put(words[i], i))
            return false;
    return true;
}
```

改成 `int i` 以后，就不能 `AC` 了。但你会发现当 `pattern` 的长度比较小时，代码是没有问题的，这又是为什么呢？

是因为当数字在 `[-128,127]` 的范围内时，对于同一个值，`Integer` 对象是共享的，举个例子。

```java
Integer a = 66;
Integer b = 66;
System.out.println(a == b); // ?

Integer c = 166;
Integer d = 166;
System.out.println(c == d); // ?
```

大家觉得上边会返回什么？

是的，是 `true` 和 `false`。当不在 `[-128,127]` 的范围内时，即使 `Integer` 包含的值相等，但由于是对象之间比较，依旧会返回 `false`。

回到之前的问题，如果你非常想用 `int` ，比较两个值的时候，你可以拆箱去比较。但返回的有可能是 `null`，所以需要多加几个判断条件。

```java
public boolean wordPattern(String pattern, String str) {
    String[] words = str.split(" ");
    if (words.length != pattern.length())
        return false;
    Map index = new HashMap();
    for (int i = 0; i < words.length; ++i) {
        Object a = index.put(pattern.charAt(i), i);
        Object b = index.put(words[i], i);
        if (a == null && b == null)
            continue;
        if (a == null || b == null)
            return false;
        if ((int) a != (int) b) {
            return false;
        }
    }
    return true;
}
```

也可以通过 `Object.equals` 来判断两个 `Integer` 是否相等。

```java
public boolean wordPattern(String pattern, String str) {
    String[] words = str.split(" ");
    if (words.length != pattern.length())
        return false;
    Map index = new HashMap();
    for (int i=0; i<words.length; ++i)
        if (!Objects.equals(index.put(pattern.charAt(i), i),
                            index.put(words[i], i)))
            return false;
    return true;
}
```

# 总

其实和  [205 题](https://leetcode.wang/leetcode-205-Isomorphic-Strings.html) 用到的方法是一模一样的。此外，就是对 `java` 的装箱拆箱有了更多的了解。