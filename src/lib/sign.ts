// 生成 sign
export async function generateSign(): Promise<string> {
  const utcMilliSeconds = new Date().getTime();
  return generateSignWithTimestamp(utcMilliSeconds);
}

// 使用指定时间戳生成 sign（用于测试）
export async function generateSignWithTimestamp(utcMilliSeconds: number): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(Math.floor(utcMilliSeconds * 1.01).toString());
  
  // 使用 Web Crypto API 生成 SHA-256 哈希
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const signature = hashArray
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()
    .slice(0, 32);
  
  return utcMilliSeconds.toString() + signature;
}

// 验证 sign
export async function checkSignValid(
  sign: string,
  fixedSign: string = '',
  signMaxTimeDiff: number = 20000
): Promise<boolean> {
  // 首先检查是否匹配固定的 sign
  if (fixedSign && sign === fixedSign) {
    return true;
  }

  // 检查 sign 的长度 (13位时间戳 + 32位签名)
  if (!sign || sign.length !== 45) {
    return false;
  }

  // 从 sign 中提取时间戳和签名
  const ts = parseInt(sign.slice(0, 13));
  const signature = sign.slice(13);

  // 获取当前UTC时间的毫秒数
  const now = Date.now();

  // 验证时间差
  if (Math.abs(ts - now) > signMaxTimeDiff) {
    console.log(`[X-Sign] Client time ${ts} and server time ${now} diff is too big.`);
    return false;
  }

  // 生成我们的签名
  const encoder = new TextEncoder();
  const data = encoder.encode(Math.floor(ts * 1.01).toString());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const ourSignature = hashArray
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()
    .slice(0, 32);

  // 比较签名
  return signature === ourSignature;
} 