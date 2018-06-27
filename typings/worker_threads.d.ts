/**
 * @module WorkerThreads
 */
declare module "worker_threads" {
  /**
   * Instances of the worker.MessageChannel class represent an asynchronous, two-way communications channel. The MessageChannel has no methods of its own. new MessageChannel() yields an object with port1 and port2 properties, which refer to linked MessagePort instances.
   */
  export class MessageChannel {
    port1: MessagePort;
    port2: MessagePort;
  }

  /**
   * Types of events sent to a MessagePort
   */
  export enum MessagePortEvent {
    // The 'close' event is emitted once either side of the channel has been disconnected.
    Close = "close",
    // The 'message' event is emitted for any incoming message, containing the cloned input of port.postMessage().
    // Listeners on this event will receive a clone of the value parameter as passed to postMessage() and no further arguments.
    // value <any> The transmitted value
    Message = "message"
  }

  /**
   * Instances of the worker.MessagePort class represent one end of an asynchronous, two-way communications channel. It can be used to transfer structured data, memory regions and other MessagePorts between different Workers.
   *
   * With the exception of MessagePorts being EventEmitters rather than EventTargets, this implementation matches browser MessagePorts.
   */
  export class MessagePort {
    static listenerCount(emitter: MessagePort, event: string | symbol): number;
    static defaultMaxListeners: number;

    addListener(
      event: string | symbol,
      listener: (...args: any[]) => void
    ): this;
    on(event: string | symbol, listener: (...args: any[]) => void): this;
    once(event: string | symbol, listener: (...args: any[]) => void): this;
    prependListener(
      event: string | symbol,
      listener: (...args: any[]) => void
    ): this;
    prependOnceListener(
      event: string | symbol,
      listener: (...args: any[]) => void
    ): this;
    removeListener(
      event: string | symbol,
      listener: (...args: any[]) => void
    ): this;
    off(event: string | symbol, listener: (...args: any[]) => void): this;
    removeAllListeners(event?: string | symbol): this;
    setMaxListeners(n: number): this;
    getMaxListeners(): number;
    listeners(event: string | symbol): Function[];
    rawListeners(event: string | symbol): Function[];
    emit(event: string | symbol, ...args: any[]): boolean;
    eventNames(): Array<string | symbol>;
    listenerCount(type: string | symbol): number;

    /**
     * Disables further sending of messages on either side of the connection. This method can be called once you know that no further communication will happen over this MessagePort.
     */
    close: () => void;
    /**
     * Sends a JavaScript value to the receiving side of this channel. value will be transferred in a way which is compatible with the HTML structured clone algorithm. In particular, it may contain circular references and objects like typed arrays that the JSON API is not able to stringify.
     *
     * transferList may be a list of ArrayBuffer and MessagePort objects. After transferring, they will not be usable on the sending side of the channel anymore (even if they are not contained in value). Unlike with child processes, transferring handles such as network sockets is currently not supported.
     *
     * If value contains SharedArrayBuffer instances, those will be accessible from either thread. They cannot be listed in transferList.
     *
     * value may still contain ArrayBuffer instances that are not in transferList; in that case, the underlying memory is copied rather than moved.
     *
     * Because the object cloning uses the structured clone algorithm, non-enumerable properties, property accessors, and object prototypes are not preserved. In particular, Buffer objects will be read as plain Uint8Arrays on the receiving side.
     *
     * The message object will be cloned immediately, and can be modified after posting without having side effects.
     *
     * For more information on the serialization and deserialization mechanisms behind this API, see the serialization API of the v8 module.
     */
    postMessage: (value: any, transferList?: object[]) => void;
    /**
     * Opposite of unref(). Calling ref() on a previously unref()ed port will not let the program exit if it's the only active handle left (the default behavior). If the port is ref()ed, calling ref() again will have no effect.
     *
     * If listeners are attached or removed using .on('message'), the port will be ref()ed and unref()ed automatically depending on whether listeners for the event exist.
     */
    ref: () => void;
    /**
     * Starts receiving messages on this MessagePort. When using this port as an event emitter, this will be called automatically once 'message' listeners are attached.
     */
    start: () => void;
    /**
     * Calling unref() on a port will allow the thread to exit if this is the only active handle in the event system. If the port is already unref()ed calling unref() again will have no effect.
     *
     * If listeners are attached or removed using .on('message'), the port will be ref()ed and unref()ed automatically depending on whether listeners for the event exist.
     */
    unref: () => void;
  }

  /**
   * If this thread was spawned as a Worker, this will be a MessagePort allowing communication with the parent thread. Messages sent using parentPort.postMessage() will be available in the parent thread using worker.on('message'), and messages sent from the parent thread using worker.postMessage() will be available in this thread using parentPort.on('message').
   */
  export const parentPort: null | MessagePort;

  /**
   * Is true if this code is not running inside of a Worker thread.
   */
  export const isMainThread: boolean;

  /**
   * An arbitrary JavaScript value that contains a clone of the data passed to this thread’s Worker constructor.
   */
  export const workerData: object;

  /**
   * An integer identifier for the current thread. On the corresponding worker object (if there is any), it is available as worker.threadId.
   */
  export const threadId: number;

  /**
   * Optional properties passed in to the Worker constructor.
   */
  export interface WorkerOptions {
    // If true, interpret the first argument to the constructor as a script that is executed once the worker is online.
    eval?: boolean;
    // Any JavaScript value that will be cloned and made available as require('worker_threads').workerData. The cloning will occur as described in the HTML structured clone algorithm, and an error will be thrown if the object cannot be cloned (e.g. because it contains functions).
    workerData?: any;
    // If this is set to true, then worker.stdin will provide a writable stream whose contents will appear as process.stdin inside the Worker. By default, no data is provided.
    stdin?: boolean;
    // If this is set to true, then worker.stdout will not automatically be piped through to process.stdout in the parent.
    stdout?: boolean;
    // If this is set to true, then worker.stderr will not automatically be piped through to process.stderr in the parent.
    stderr?: boolean;
  }

  /**
   * The Worker class represents an independent JavaScript execution thread. Most Node.js APIs are available inside of it.
   */
  export class Worker {
    /**
     * Create a new worker
     * @param filename The absolute path to the Worker’s main script. If options.eval is true, this is a string containing JavaScript code rather than a path.
     * @param options
     */
    constructor(filename: string, options?: WorkerOptions);
    /**
     * If stdin: true was passed to the Worker constructor, this is a writable stream. The data written to this stream will be made available in the worker thread as process.stdin.
     */
    stdin: NodeJS.ReadableStream;
    /**
     * This is a readable stream which contains data written to process.stderr inside the worker thread. If stderr: true was not passed to the Worker constructor, then data will be piped to the parent thread's process.stderr stream.
     */
    stderr: NodeJS.ReadableStream;
    /**
     * This is a readable stream which contains data written to process.stdout inside the worker thread. If stdout: true was not passed to the Worker constructor, then data will be piped to the parent thread's process.stdout stream.
     */
    stdout: NodeJS.WritableStream;
    /**
     * An integer identifier for the referenced thread. Inside the worker thread, it is available as require('worker_threads').threadId.
     */
    threadId: number;
    /**
     * Stop all JavaScript execution in the worker thread as soon as possible. callback is an optional function that is invoked once this operation is known to have completed.
     *
     * Warning: Currently, not all code in the internals of Node.js is prepared to expect termination at arbitrary points in time and may crash if it encounters that condition. Consequently, you should currently only call .terminate() if it is known that the Worker thread is not accessing Node.js core modules other than what is exposed in the worker module.
     */
    terminate: (cb: Function) => void;
    /**
     * Opposite of unref(), calling ref() on a previously unref()ed worker will not let the program exit if it's the only active handle left (the default behavior). If the worker is ref()ed, calling ref() again will have no effect.
     */
    ref: () => void;
    /**
     * Calling unref() on a worker will allow the thread to exit if this is the only active handle in the event system. If the worker is already unref()ed calling unref() again will have no effect.
     */
    unref: () => void;
    /**
     * Send a message to the worker that will be received via require('worker_threads').on('workerMessage').
     *
     * Value will be transferred in a way which is compatible with the HTML structured clone algorithm. In particular, it may contain circular references and objects like typed arrays that the JSON API is not able to stringify.
     *
     * transferList may be a list of ArrayBuffer and MessagePort objects. After transferring, they will not be usable on the sending side of the channel anymore (even if they are not contained in value). Unlike with child processes, transferring handles such as network sockets is currently not supported.
     *
     * If value contains SharedArrayBuffer instances, those will be accessible from either thread. They cannot be listed in transferList.
     *
     * value may still contain ArrayBuffer instances that are not in transferList; in that case, the underlying memory is copied rather than moved.
     *
     * Because the object cloning uses the structured clone algorithm, non-enumerable properties, property accessors, and object prototypes are not preserved. In particular, Buffer objects will be read as plain Uint8Arrays on the receiving side.
     *
     * The message object will be cloned immediately, and can be modified after posting without having side effects.
     *
     * For more information on the serialization and deserialization mechanisms behind this API, see the serialization API of the v8 module.
     */
    postMessage: (value: any, transferList?: object[]) => void;
  }
}
