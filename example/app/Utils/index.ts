export type KV = { path: string; value: string };

export function flattenObject(obj: any, prefix: string = ""): KV[] {
  if (obj === null || obj === undefined) {
    return [{ path: prefix || "(root)", value: String(obj) }];
  }
  if (typeof obj !== "object") {
    return [{ path: prefix || "(root)", value: String(obj) }];
  }
  if (Array.isArray(obj)) {
    const rows: KV[] = [];
    obj.forEach((item, idx) => {
      const nextPrefix = prefix ? `${prefix}[${idx}]` : `[${idx}]`;
      rows.push(...flattenObject(item, nextPrefix));
    });
    if (!rows.length) {
      rows.push({ path: prefix || "(root)", value: "[]" });
    }
    return rows;
  }
  const entries = Object.entries(obj);
  if (!entries.length) {
    return [{ path: prefix || "(root)", value: "{}" }];
  }
  let rows: KV[] = [];
  entries.forEach(([k, v]) => {
    const nextPrefix = prefix ? `${prefix}.${k}` : k;
    if (typeof v === "object" && v !== null) {
      rows = rows.concat(flattenObject(v, nextPrefix));
    } else {
      rows.push({ path: nextPrefix, value: String(v) });
    }
  });
  return rows;
}

export function getLogo(service: string) {
  return `https://institution-logos.s3.us-east-1.amazonaws.com/${service}.png`;
}
