export function mockFn<I extends any[], O>(
  fn: (...input: I) => O = (...i: any) => void 0 as any
) {
  const _fn = Object.assign(
    function (...i: I) {
      try {
        // @ts-ignore
        var o = fn.apply(this, i);
      } catch (error) {
        // @ts-ignore
        _fn.calls.push({ i, o: error });

        throw error;
      }

      _fn.calls.push({ i, o });

      return o;
    },
    {
      calls: new Array<{ i: I; o: O }>(),
      inputs(): Array<I[number]> {
        return _fn.calls.map(({ i }) => i[0]);
      },
      lastInput(): I[number] {
        const { length } = _fn.calls;
        if (length === 0) throw new TypeError(`Array is empty`);
        return _fn.calls[length - 1]!.i[0];
      },
      clear() {
        _fn.calls = new Array<{ i: I; o: O }>()
      }
    }
  );

  return _fn;
}
