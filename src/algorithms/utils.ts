/**
 * Waits for the test function to return a truthy value
 * example usage:
 *    wait for an element to exist, then save it to a variable
 *        let el = await waitFor(() => document.querySelector('#el_id')))
 *    timeout_ms and frequency are optional parameters
 */
export async function waitFor<T>(
  test: () => Promise<T>,
  timeout_ms = 20 * 1000,
  timeBetweenChecks = 200
) {
  const logPassed = () => console.log("Passed: ", test);
  const logTimedOut = () =>
    console.log("%c" + "Timeout : " + test, "color:#cc2900");
  let last = Date.now();
  const logWaiting = () => {
    if (Date.now() - last > 1000) {
      last = Date.now();
      console.log("%c" + "waiting for: " + test, "color:#809fff");
    }
  };

  const endTime = Date.now() + timeout_ms;

  let result = await test();
  while (!result) {
    if (Date.now() > endTime) {
      logTimedOut();
      return null;
    }
    logWaiting();
    await sleep(timeBetweenChecks);
    result = await test();
  }
  logPassed();
  return result;
}

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export interface Node {
  id: number;
}

export interface Link {
  source: number | Node;
  target: number | Node;
}

export const getId = (node: number | Node) => {
  if (typeof node === "number") return node;
  return node.id;
};

export const edgeIdFromSourceAndTarget = (
  source: number,
  target: number
): string => source + ":" + target;
