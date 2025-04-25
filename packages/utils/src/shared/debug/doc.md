## 测量方法执行时间【perfMark】

### 参数

| 参数名     | 含义      | 类型                                                      | 默认值  |
|---------|---------|---------------------------------------------------------|------|
| type    | 测量的方式   | `'performance'` \| `'console'` \| `'callback'`          | -    |
| param   | 测量参数    | 当 type 为 `'callback'` 时为 `Callback`, 否则为 `NameOrGetter` | -    |
| func    | 待测量的方法  | (...args:`P`) => `R`                                    | -    |
| ...args | func的参数 | `P`                                                     | -    |

```typescript
//自定义处理, 接收时长
type Callback = (duration:number) => void;
//记录的名称
type NameOrGetter = string | (() => string);
```

### 返回值

`R`


## 得到一个方法的带时间测量的版本【perfMarkWrapper】

### 参数

| 参数名     | 含义      | 类型                                                      | 默认值  |
|---------|---------|---------------------------------------------------------|------|
| type    | 测量的方式   | `'performance'` \| `'console'` \| `'callback'`          | -    |
| param   | 测量参数    | 当 type 为 `'callback'` 时为 `Callback`, 否则为 `NameOrGetter` | -    |
| func    | 待测量的方法  | (...args:`P`) => `R`                                    | -    |

```typescript
//自定义处理, 接收时长
type Callback = (duration:number) => void;
//记录的名称
type NameOrGetter = string | (() => string);
```

### 返回值

(...args:`P`) => `R`