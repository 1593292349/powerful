## 解码器, 已区分平台【decoder】

### 类型

`TextDecoder`


## 执行shell命令【command】

### 参数

| 参数名     | 含义 | 类型                                                 | 默认值  |
|---------|----|----------------------------------------------------|------|
| cmd     | 命令 | string                                             | -    |
| option  | 选项 | Omit<ExecOptions, 'encoding'> \| undefined \| null | -    |

### 返回值

```typescript
type Return = {
	promise:Promise<string>;
	childProcess:ChildProcess;
};
```