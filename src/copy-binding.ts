/** Stable field identity for local editing; production rendering omits these attributes. */
const bindings = new WeakMap<object, Map<string, string>>();
export function registerCopyField(object: object, prop: string, key: string) {
  let fields = bindings.get(object);
  if (!fields) { fields = new Map(); bindings.set(object, fields); }
  fields.set(prop, key);
}
export function copyFieldKey(object: object, prop: string): string | undefined {
  return bindings.get(object)?.get(prop);
}
