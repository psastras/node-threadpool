export enum Actions {
  RUN = "__run__",
  ERROR = "__error__",
  RESULT = "__result__"
}

export namespace ThreadWorker {
  export interface IAction {
    action: string;
  }

  export interface IRunAction extends IAction {
    action: Actions.RUN;
    payload: any;
  }

  export interface IErrorAction extends IAction {
    action: Actions.ERROR;
    payload: any;
  }

  export interface IResultAction extends IAction {
    action: Actions.RESULT;
    payload: any;
  }
}

const code = `
const { parentPort } = require('worker_threads');
const { serialize, deserialize } = require('surrial');
parentPort.on('message', ({ action, payload: { port, runnable, data, rawData } }) => {
  if (action === "${Actions.RUN}") {
    try {
      const hydratedData = data && (data instanceof SharedArrayBuffer ? data : Object.assign(deserialize(data), rawData));
      deserialize(runnable)(hydratedData).then((result) => {
        port.postMessage({ action: "${
          Actions.RESULT
        }", payload: { result: serialize(result) } });
      })
    } catch (e) {
      port.postMessage({ action: "${
        Actions.ERROR
      }", payload: { result: serialize(e), msg: e.message, error: true } });
    }
  }
});
`;

export const ThreadWorker = {
  code,
  createRunAction: (payload: any): ThreadWorker.IRunAction => ({
    action: Actions.RUN,
    payload
  })
};
