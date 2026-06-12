import { a7 as useRouter, V as reactExports, H as isRedirect, T as TSS_SERVER_FUNCTION, x as getServerFnById, i as createServerFn, K as jsxRuntimeExports } from "./server-Dg-eis91.js";
import { S as Subscribable, q as pendingThenable, u as resolveQueryBoolean, x as shallowEqualObjects, v as resolveStaleTime, o as noop, i as environmentManager, n as isValidTimeout, z as timeUntilStale, B as timeoutManager, k as focusManager, j as fetchState, t as replaceData, p as notifyManager, y as shouldThrowError, E as useQueryClient, h as createLucideIcon, R as Route, H as Header, c as Link, F as Footer, C as CITY_COORDS, L as LANDMARKS, m as isFavorite, b as Heart, s as removeFavorite, g as addFavorite } from "./router-BFR-v_9l.js";
import { o as objectType, n as numberType, s as stringType } from "./types-BoWyrJuk.js";
import { A as ArrowLeft } from "./arrow-left-C8nokORl.js";
import { T as Ticket, C as Clock } from "./ticket-CqujGuI3.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
function useServerFn(serverFn) {
  const router = useRouter();
  return reactExports.useCallback(async (...args) => {
    try {
      const res = await serverFn(...args);
      if (isRedirect(res)) throw res;
      return res;
    } catch (err) {
      if (isRedirect(err)) {
        err.options._fromLocation = router.stores.location.get();
        return router.navigate(router.resolveRedirect(err).options);
      }
      throw err;
    }
  }, [router, serverFn]);
}
var QueryObserver = class extends Subscribable {
  constructor(client, options) {
    super();
    this.options = options;
    this.#client = client;
    this.#selectError = null;
    this.#currentThenable = pendingThenable();
    this.bindMethods();
    this.setOptions(options);
  }
  #client;
  #currentQuery = void 0;
  #currentQueryInitialState = void 0;
  #currentResult = void 0;
  #currentResultState;
  #currentResultOptions;
  #currentThenable;
  #selectError;
  #selectFn;
  #selectResult;
  // This property keeps track of the last query with defined data.
  // It will be used to pass the previous data and query to the placeholder function between renders.
  #lastQueryWithDefinedData;
  #staleTimeoutId;
  #refetchIntervalId;
  #currentRefetchInterval;
  #trackedProps = /* @__PURE__ */ new Set();
  bindMethods() {
    this.refetch = this.refetch.bind(this);
  }
  onSubscribe() {
    if (this.listeners.size === 1) {
      this.#currentQuery.addObserver(this);
      if (shouldFetchOnMount(this.#currentQuery, this.options)) {
        this.#executeFetch();
      } else {
        this.updateResult();
      }
      this.#updateTimers();
    }
  }
  onUnsubscribe() {
    if (!this.hasListeners()) {
      this.destroy();
    }
  }
  shouldFetchOnReconnect() {
    return shouldFetchOn(
      this.#currentQuery,
      this.options,
      this.options.refetchOnReconnect
    );
  }
  shouldFetchOnWindowFocus() {
    return shouldFetchOn(
      this.#currentQuery,
      this.options,
      this.options.refetchOnWindowFocus
    );
  }
  destroy() {
    this.listeners = /* @__PURE__ */ new Set();
    this.#clearStaleTimeout();
    this.#clearRefetchInterval();
    this.#currentQuery.removeObserver(this);
  }
  setOptions(options) {
    const prevOptions = this.options;
    const prevQuery = this.#currentQuery;
    this.options = this.#client.defaultQueryOptions(options);
    if (this.options.enabled !== void 0 && typeof this.options.enabled !== "boolean" && typeof this.options.enabled !== "function" && typeof resolveQueryBoolean(this.options.enabled, this.#currentQuery) !== "boolean") {
      throw new Error(
        "Expected enabled to be a boolean or a callback that returns a boolean"
      );
    }
    this.#updateQuery();
    this.#currentQuery.setOptions(this.options);
    if (prevOptions._defaulted && !shallowEqualObjects(this.options, prevOptions)) {
      this.#client.getQueryCache().notify({
        type: "observerOptionsUpdated",
        query: this.#currentQuery,
        observer: this
      });
    }
    const mounted = this.hasListeners();
    if (mounted && shouldFetchOptionally(
      this.#currentQuery,
      prevQuery,
      this.options,
      prevOptions
    )) {
      this.#executeFetch();
    }
    this.updateResult();
    if (mounted && (this.#currentQuery !== prevQuery || resolveQueryBoolean(this.options.enabled, this.#currentQuery) !== resolveQueryBoolean(prevOptions.enabled, this.#currentQuery) || resolveStaleTime(this.options.staleTime, this.#currentQuery) !== resolveStaleTime(prevOptions.staleTime, this.#currentQuery))) {
      this.#updateStaleTimeout();
    }
    const nextRefetchInterval = this.#computeRefetchInterval();
    if (mounted && (this.#currentQuery !== prevQuery || resolveQueryBoolean(this.options.enabled, this.#currentQuery) !== resolveQueryBoolean(prevOptions.enabled, this.#currentQuery) || nextRefetchInterval !== this.#currentRefetchInterval)) {
      this.#updateRefetchInterval(nextRefetchInterval);
    }
  }
  getOptimisticResult(options) {
    const query = this.#client.getQueryCache().build(this.#client, options);
    const result = this.createResult(query, options);
    if (shouldAssignObserverCurrentProperties(this, result)) {
      this.#currentResult = result;
      this.#currentResultOptions = this.options;
      this.#currentResultState = this.#currentQuery.state;
    }
    return result;
  }
  getCurrentResult() {
    return this.#currentResult;
  }
  trackResult(result, onPropTracked) {
    return new Proxy(result, {
      get: (target, key) => {
        this.trackProp(key);
        onPropTracked?.(key);
        if (key === "promise") {
          this.trackProp("data");
          if (!this.options.experimental_prefetchInRender && this.#currentThenable.status === "pending") {
            this.#currentThenable.reject(
              new Error(
                "experimental_prefetchInRender feature flag is not enabled"
              )
            );
          }
        }
        return Reflect.get(target, key);
      }
    });
  }
  trackProp(key) {
    this.#trackedProps.add(key);
  }
  getCurrentQuery() {
    return this.#currentQuery;
  }
  refetch({ ...options } = {}) {
    return this.fetch({
      ...options
    });
  }
  fetchOptimistic(options) {
    const defaultedOptions = this.#client.defaultQueryOptions(options);
    const query = this.#client.getQueryCache().build(this.#client, defaultedOptions);
    return query.fetch().then(() => this.createResult(query, defaultedOptions));
  }
  fetch(fetchOptions) {
    return this.#executeFetch({
      ...fetchOptions,
      cancelRefetch: fetchOptions.cancelRefetch ?? true
    }).then(() => {
      this.updateResult();
      return this.#currentResult;
    });
  }
  #executeFetch(fetchOptions) {
    this.#updateQuery();
    let promise = this.#currentQuery.fetch(
      this.options,
      fetchOptions
    );
    if (!fetchOptions?.throwOnError) {
      promise = promise.catch(noop);
    }
    return promise;
  }
  #updateStaleTimeout() {
    this.#clearStaleTimeout();
    const staleTime = resolveStaleTime(
      this.options.staleTime,
      this.#currentQuery
    );
    if (environmentManager.isServer() || this.#currentResult.isStale || !isValidTimeout(staleTime)) {
      return;
    }
    const time = timeUntilStale(this.#currentResult.dataUpdatedAt, staleTime);
    const timeout = time + 1;
    this.#staleTimeoutId = timeoutManager.setTimeout(() => {
      if (!this.#currentResult.isStale) {
        this.updateResult();
      }
    }, timeout);
  }
  #computeRefetchInterval() {
    return (typeof this.options.refetchInterval === "function" ? this.options.refetchInterval(this.#currentQuery) : this.options.refetchInterval) ?? false;
  }
  #updateRefetchInterval(nextInterval) {
    this.#clearRefetchInterval();
    this.#currentRefetchInterval = nextInterval;
    if (environmentManager.isServer() || resolveQueryBoolean(this.options.enabled, this.#currentQuery) === false || !isValidTimeout(this.#currentRefetchInterval) || this.#currentRefetchInterval === 0) {
      return;
    }
    this.#refetchIntervalId = timeoutManager.setInterval(() => {
      if (this.options.refetchIntervalInBackground || focusManager.isFocused()) {
        this.#executeFetch();
      }
    }, this.#currentRefetchInterval);
  }
  #updateTimers() {
    this.#updateStaleTimeout();
    this.#updateRefetchInterval(this.#computeRefetchInterval());
  }
  #clearStaleTimeout() {
    if (this.#staleTimeoutId !== void 0) {
      timeoutManager.clearTimeout(this.#staleTimeoutId);
      this.#staleTimeoutId = void 0;
    }
  }
  #clearRefetchInterval() {
    if (this.#refetchIntervalId !== void 0) {
      timeoutManager.clearInterval(this.#refetchIntervalId);
      this.#refetchIntervalId = void 0;
    }
  }
  createResult(query, options) {
    const prevQuery = this.#currentQuery;
    const prevOptions = this.options;
    const prevResult = this.#currentResult;
    const prevResultState = this.#currentResultState;
    const prevResultOptions = this.#currentResultOptions;
    const queryChange = query !== prevQuery;
    const queryInitialState = queryChange ? query.state : this.#currentQueryInitialState;
    const { state } = query;
    let newState = { ...state };
    let isPlaceholderData = false;
    let data;
    if (options._optimisticResults) {
      const mounted = this.hasListeners();
      const fetchOnMount = !mounted && shouldFetchOnMount(query, options);
      const fetchOptionally = mounted && shouldFetchOptionally(query, prevQuery, options, prevOptions);
      if (fetchOnMount || fetchOptionally) {
        newState = {
          ...newState,
          ...fetchState(state.data, query.options)
        };
      }
      if (options._optimisticResults === "isRestoring") {
        newState.fetchStatus = "idle";
      }
    }
    let { error, errorUpdatedAt, status } = newState;
    data = newState.data;
    let skipSelect = false;
    if (options.placeholderData !== void 0 && data === void 0 && status === "pending") {
      let placeholderData;
      if (prevResult?.isPlaceholderData && options.placeholderData === prevResultOptions?.placeholderData) {
        placeholderData = prevResult.data;
        skipSelect = true;
      } else {
        placeholderData = typeof options.placeholderData === "function" ? options.placeholderData(
          this.#lastQueryWithDefinedData?.state.data,
          this.#lastQueryWithDefinedData
        ) : options.placeholderData;
      }
      if (placeholderData !== void 0) {
        status = "success";
        data = replaceData(
          prevResult?.data,
          placeholderData,
          options
        );
        isPlaceholderData = true;
      }
    }
    if (options.select && data !== void 0 && !skipSelect) {
      if (prevResult && data === prevResultState?.data && options.select === this.#selectFn) {
        data = this.#selectResult;
      } else {
        try {
          this.#selectFn = options.select;
          data = options.select(data);
          data = replaceData(prevResult?.data, data, options);
          this.#selectResult = data;
          this.#selectError = null;
        } catch (selectError) {
          this.#selectError = selectError;
        }
      }
    }
    if (this.#selectError) {
      error = this.#selectError;
      data = this.#selectResult;
      errorUpdatedAt = Date.now();
      status = "error";
    }
    const isFetching = newState.fetchStatus === "fetching";
    const isPending = status === "pending";
    const isError = status === "error";
    const isLoading = isPending && isFetching;
    const hasData = data !== void 0;
    const result = {
      status,
      fetchStatus: newState.fetchStatus,
      isPending,
      isSuccess: status === "success",
      isError,
      isInitialLoading: isLoading,
      isLoading,
      data,
      dataUpdatedAt: newState.dataUpdatedAt,
      error,
      errorUpdatedAt,
      failureCount: newState.fetchFailureCount,
      failureReason: newState.fetchFailureReason,
      errorUpdateCount: newState.errorUpdateCount,
      isFetched: query.isFetched(),
      isFetchedAfterMount: newState.dataUpdateCount > queryInitialState.dataUpdateCount || newState.errorUpdateCount > queryInitialState.errorUpdateCount,
      isFetching,
      isRefetching: isFetching && !isPending,
      isLoadingError: isError && !hasData,
      isPaused: newState.fetchStatus === "paused",
      isPlaceholderData,
      isRefetchError: isError && hasData,
      isStale: isStale(query, options),
      refetch: this.refetch,
      promise: this.#currentThenable,
      isEnabled: resolveQueryBoolean(options.enabled, query) !== false
    };
    const nextResult = result;
    if (this.options.experimental_prefetchInRender) {
      const hasResultData = nextResult.data !== void 0;
      const isErrorWithoutData = nextResult.status === "error" && !hasResultData;
      const finalizeThenableIfPossible = (thenable) => {
        if (isErrorWithoutData) {
          thenable.reject(nextResult.error);
        } else if (hasResultData) {
          thenable.resolve(nextResult.data);
        }
      };
      const recreateThenable = () => {
        const pending = this.#currentThenable = nextResult.promise = pendingThenable();
        finalizeThenableIfPossible(pending);
      };
      const prevThenable = this.#currentThenable;
      switch (prevThenable.status) {
        case "pending":
          if (query.queryHash === prevQuery.queryHash) {
            finalizeThenableIfPossible(prevThenable);
          }
          break;
        case "fulfilled":
          if (isErrorWithoutData || nextResult.data !== prevThenable.value) {
            recreateThenable();
          }
          break;
        case "rejected":
          if (!isErrorWithoutData || nextResult.error !== prevThenable.reason) {
            recreateThenable();
          }
          break;
      }
    }
    return nextResult;
  }
  updateResult() {
    const prevResult = this.#currentResult;
    const nextResult = this.createResult(this.#currentQuery, this.options);
    this.#currentResultState = this.#currentQuery.state;
    this.#currentResultOptions = this.options;
    if (this.#currentResultState.data !== void 0) {
      this.#lastQueryWithDefinedData = this.#currentQuery;
    }
    if (shallowEqualObjects(nextResult, prevResult)) {
      return;
    }
    this.#currentResult = nextResult;
    const shouldNotifyListeners = () => {
      if (!prevResult) {
        return true;
      }
      const { notifyOnChangeProps } = this.options;
      const notifyOnChangePropsValue = typeof notifyOnChangeProps === "function" ? notifyOnChangeProps() : notifyOnChangeProps;
      if (notifyOnChangePropsValue === "all" || !notifyOnChangePropsValue && !this.#trackedProps.size) {
        return true;
      }
      const includedProps = new Set(
        notifyOnChangePropsValue ?? this.#trackedProps
      );
      if (this.options.throwOnError) {
        includedProps.add("error");
      }
      return Object.keys(this.#currentResult).some((key) => {
        const typedKey = key;
        const changed = this.#currentResult[typedKey] !== prevResult[typedKey];
        return changed && includedProps.has(typedKey);
      });
    };
    this.#notify({ listeners: shouldNotifyListeners() });
  }
  #updateQuery() {
    const query = this.#client.getQueryCache().build(this.#client, this.options);
    if (query === this.#currentQuery) {
      return;
    }
    const prevQuery = this.#currentQuery;
    this.#currentQuery = query;
    this.#currentQueryInitialState = query.state;
    if (this.hasListeners()) {
      prevQuery?.removeObserver(this);
      query.addObserver(this);
    }
  }
  onQueryUpdate() {
    this.updateResult();
    if (this.hasListeners()) {
      this.#updateTimers();
    }
  }
  #notify(notifyOptions) {
    notifyManager.batch(() => {
      if (notifyOptions.listeners) {
        this.listeners.forEach((listener) => {
          listener(this.#currentResult);
        });
      }
      this.#client.getQueryCache().notify({
        query: this.#currentQuery,
        type: "observerResultsUpdated"
      });
    });
  }
};
function shouldLoadOnMount(query, options) {
  return resolveQueryBoolean(options.enabled, query) !== false && query.state.data === void 0 && !(query.state.status === "error" && resolveQueryBoolean(options.retryOnMount, query) === false);
}
function shouldFetchOnMount(query, options) {
  return shouldLoadOnMount(query, options) || query.state.data !== void 0 && shouldFetchOn(query, options, options.refetchOnMount);
}
function shouldFetchOn(query, options, field) {
  if (resolveQueryBoolean(options.enabled, query) !== false && resolveStaleTime(options.staleTime, query) !== "static") {
    const value = typeof field === "function" ? field(query) : field;
    return value === "always" || value !== false && isStale(query, options);
  }
  return false;
}
function shouldFetchOptionally(query, prevQuery, options, prevOptions) {
  return (query !== prevQuery || resolveQueryBoolean(prevOptions.enabled, query) === false) && (!options.suspense || query.state.status !== "error") && isStale(query, options);
}
function isStale(query, options) {
  return resolveQueryBoolean(options.enabled, query) !== false && query.isStaleByTime(resolveStaleTime(options.staleTime, query));
}
function shouldAssignObserverCurrentProperties(observer, optimisticResult) {
  if (!shallowEqualObjects(observer.getCurrentResult(), optimisticResult)) {
    return true;
  }
  return false;
}
var IsRestoringContext = reactExports.createContext(false);
var useIsRestoring = () => reactExports.useContext(IsRestoringContext);
IsRestoringContext.Provider;
function createValue() {
  let isReset = false;
  return {
    clearReset: () => {
      isReset = false;
    },
    reset: () => {
      isReset = true;
    },
    isReset: () => {
      return isReset;
    }
  };
}
var QueryErrorResetBoundaryContext = reactExports.createContext(createValue());
var useQueryErrorResetBoundary = () => reactExports.useContext(QueryErrorResetBoundaryContext);
var ensurePreventErrorBoundaryRetry = (options, errorResetBoundary, query) => {
  const throwOnError = query?.state.error && typeof options.throwOnError === "function" ? shouldThrowError(options.throwOnError, [query.state.error, query]) : options.throwOnError;
  if (options.suspense || options.experimental_prefetchInRender || throwOnError) {
    if (!errorResetBoundary.isReset()) {
      options.retryOnMount = false;
    }
  }
};
var useClearResetErrorBoundary = (errorResetBoundary) => {
  reactExports.useEffect(() => {
    errorResetBoundary.clearReset();
  }, [errorResetBoundary]);
};
var getHasError = ({
  result,
  errorResetBoundary,
  throwOnError,
  query,
  suspense
}) => {
  return result.isError && !errorResetBoundary.isReset() && !result.isFetching && query && (suspense && result.data === void 0 || shouldThrowError(throwOnError, [result.error, query]));
};
var ensureSuspenseTimers = (defaultedOptions) => {
  if (defaultedOptions.suspense) {
    const MIN_SUSPENSE_TIME_MS = 1e3;
    const clamp = (value) => value === "static" ? value : Math.max(value ?? MIN_SUSPENSE_TIME_MS, MIN_SUSPENSE_TIME_MS);
    const originalStaleTime = defaultedOptions.staleTime;
    defaultedOptions.staleTime = typeof originalStaleTime === "function" ? (...args) => clamp(originalStaleTime(...args)) : clamp(originalStaleTime);
    if (typeof defaultedOptions.gcTime === "number") {
      defaultedOptions.gcTime = Math.max(
        defaultedOptions.gcTime,
        MIN_SUSPENSE_TIME_MS
      );
    }
  }
};
var willFetch = (result, isRestoring) => result.isLoading && result.isFetching && !isRestoring;
var shouldSuspend = (defaultedOptions, result) => defaultedOptions?.suspense && result.isPending;
var fetchOptimistic = (defaultedOptions, observer, errorResetBoundary) => observer.fetchOptimistic(defaultedOptions).catch(() => {
  errorResetBoundary.clearReset();
});
function useBaseQuery(options, Observer, queryClient) {
  const isRestoring = useIsRestoring();
  const errorResetBoundary = useQueryErrorResetBoundary();
  const client = useQueryClient();
  const defaultedOptions = client.defaultQueryOptions(options);
  client.getDefaultOptions().queries?._experimental_beforeQuery?.(
    defaultedOptions
  );
  const query = client.getQueryCache().get(defaultedOptions.queryHash);
  defaultedOptions._optimisticResults = isRestoring ? "isRestoring" : "optimistic";
  ensureSuspenseTimers(defaultedOptions);
  ensurePreventErrorBoundaryRetry(defaultedOptions, errorResetBoundary, query);
  useClearResetErrorBoundary(errorResetBoundary);
  const isNewCacheEntry = !client.getQueryCache().get(defaultedOptions.queryHash);
  const [observer] = reactExports.useState(
    () => new Observer(
      client,
      defaultedOptions
    )
  );
  const result = observer.getOptimisticResult(defaultedOptions);
  const shouldSubscribe = !isRestoring && options.subscribed !== false;
  reactExports.useSyncExternalStore(
    reactExports.useCallback(
      (onStoreChange) => {
        const unsubscribe = shouldSubscribe ? observer.subscribe(notifyManager.batchCalls(onStoreChange)) : noop;
        observer.updateResult();
        return unsubscribe;
      },
      [observer, shouldSubscribe]
    ),
    () => observer.getCurrentResult(),
    () => observer.getCurrentResult()
  );
  reactExports.useEffect(() => {
    observer.setOptions(defaultedOptions);
  }, [defaultedOptions, observer]);
  if (shouldSuspend(defaultedOptions, result)) {
    throw fetchOptimistic(defaultedOptions, observer, errorResetBoundary);
  }
  if (getHasError({
    result,
    errorResetBoundary,
    throwOnError: defaultedOptions.throwOnError,
    query,
    suspense: defaultedOptions.suspense
  })) {
    throw result.error;
  }
  client.getDefaultOptions().queries?._experimental_afterQuery?.(
    defaultedOptions,
    result
  );
  if (defaultedOptions.experimental_prefetchInRender && !environmentManager.isServer() && willFetch(result, isRestoring)) {
    const promise = isNewCacheEntry ? (
      // Fetch immediately on render in order to ensure `.promise` is resolved even if the component is unmounted
      fetchOptimistic(defaultedOptions, observer, errorResetBoundary)
    ) : (
      // subscribe to the "cache promise" so that we can finalize the currentThenable once data comes in
      query?.promise
    );
    promise?.catch(noop).finally(() => {
      observer.updateResult();
    });
  }
  return !defaultedOptions.notifyOnChangeProps ? observer.trackResult(result) : result;
}
function useQuery(options, queryClient) {
  return useBaseQuery(options, QueryObserver);
}
const __iconNode$b = [
  ["path", { d: "M8 6v6", key: "18i7km" }],
  ["path", { d: "M15 6v6", key: "1sg6z9" }],
  ["path", { d: "M2 12h19.6", key: "de5uta" }],
  [
    "path",
    {
      d: "M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3",
      key: "1wwztk"
    }
  ],
  ["circle", { cx: "7", cy: "18", r: "2", key: "19iecd" }],
  ["path", { d: "M9 18h5", key: "lrx6i" }],
  ["circle", { cx: "16", cy: "18", r: "2", key: "1v4tcr" }]
];
const Bus = createLucideIcon("bus", __iconNode$b);
const __iconNode$a = [
  ["path", { d: "M10 2h4", key: "n1abiw" }],
  [
    "path",
    { d: "m21 8-2 2-1.5-3.7A2 2 0 0 0 15.646 5H8.4a2 2 0 0 0-1.903 1.257L5 10 3 8", key: "1imjwt" }
  ],
  ["path", { d: "M7 14h.01", key: "1qa3f1" }],
  ["path", { d: "M17 14h.01", key: "7oqj8z" }],
  ["rect", { width: "18", height: "8", x: "3", y: "10", rx: "2", key: "a7itu8" }],
  ["path", { d: "M5 18v2", key: "ppbyun" }],
  ["path", { d: "M19 18v2", key: "gy7782" }]
];
const CarTaxiFront = createLucideIcon("car-taxi-front", __iconNode$a);
const __iconNode$9 = [
  [
    "path",
    {
      d: "M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2",
      key: "5owen"
    }
  ],
  ["circle", { cx: "7", cy: "17", r: "2", key: "u2ysq9" }],
  ["path", { d: "M9 17h6", key: "r8uit2" }],
  ["circle", { cx: "17", cy: "17", r: "2", key: "axvx0g" }]
];
const Car = createLucideIcon("car", __iconNode$9);
const __iconNode$8 = [
  ["path", { d: "M4 10h12", key: "1y6xl8" }],
  ["path", { d: "M4 14h9", key: "1loblj" }],
  [
    "path",
    {
      d: "M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 7.8 8 2 0 3.8-.8 5.2-2",
      key: "1j6lzo"
    }
  ]
];
const Euro = createLucideIcon("euro", __iconNode$8);
const __iconNode$7 = [
  [
    "path",
    { d: "M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 4 0v-6.998a2 2 0 0 0-.59-1.42L18 5", key: "1wtuz0" }
  ],
  ["path", { d: "M14 21V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v16", key: "e09ifn" }],
  ["path", { d: "M2 21h13", key: "1x0fut" }],
  ["path", { d: "M3 9h11", key: "1p7c0w" }]
];
const Fuel = createLucideIcon("fuel", __iconNode$7);
const __iconNode$6 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 16v-4", key: "1dtifu" }],
  ["path", { d: "M12 8h.01", key: "e9boi3" }]
];
const Info = createLucideIcon("info", __iconNode$6);
const __iconNode$5 = [
  [
    "path",
    {
      d: "M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z",
      key: "169xi5"
    }
  ],
  ["path", { d: "M15 5.764v15", key: "1pn4in" }],
  ["path", { d: "M9 3.236v15", key: "1uimfh" }]
];
const Map = createLucideIcon("map", __iconNode$5);
const __iconNode$4 = [
  [
    "path",
    {
      d: "M11 17h3v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3a3.16 3.16 0 0 0 2-2h1a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-1a5 5 0 0 0-2-4V3a4 4 0 0 0-3.2 1.6l-.3.4H11a6 6 0 0 0-6 6v1a5 5 0 0 0 2 4v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1z",
      key: "1piglc"
    }
  ],
  ["path", { d: "M16 10h.01", key: "1m94wz" }],
  ["path", { d: "M2 8v1a2 2 0 0 0 2 2h1", key: "1env43" }]
];
const PiggyBank = createLucideIcon("piggy-bank", __iconNode$4);
const __iconNode$3 = [
  [
    "path",
    {
      d: "M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",
      key: "1s2grr"
    }
  ],
  ["path", { d: "M20 2v4", key: "1rf3ol" }],
  ["path", { d: "M22 4h-4", key: "gwowj6" }],
  ["circle", { cx: "4", cy: "20", r: "2", key: "6kqj1y" }]
];
const Sparkles = createLucideIcon("sparkles", __iconNode$3);
const __iconNode$2 = [
  ["rect", { width: "16", height: "16", x: "4", y: "3", rx: "2", key: "1wxw4b" }],
  ["path", { d: "M4 11h16", key: "mpoxn0" }],
  ["path", { d: "M12 3v8", key: "1h2ygw" }],
  ["path", { d: "m8 19-2 3", key: "13i0xs" }],
  ["path", { d: "m18 22-2-3", key: "1p0ohu" }],
  ["path", { d: "M8 15h.01", key: "a7atzg" }],
  ["path", { d: "M16 15h.01", key: "rnfrdf" }]
];
const TramFront = createLucideIcon("tram-front", __iconNode$2);
const __iconNode$1 = [
  [
    "path",
    {
      d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
      key: "wmoenq"
    }
  ],
  ["path", { d: "M12 9v4", key: "juzpu7" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
];
const TriangleAlert = createLucideIcon("triangle-alert", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
      key: "1xq2db"
    }
  ]
];
const Zap = createLucideIcon("zap", __iconNode);
const R = 6371;
function haversineKm(a, b) {
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLng = (b.lng - a.lng) * Math.PI / 180;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}
function roadKm(a, b) {
  return Math.round(haversineKm(a, b) * 1.25);
}
function decodePolyline(str) {
  let index = 0, lat = 0, lng = 0;
  const out = [];
  while (index < str.length) {
    let b, shift = 0, result = 0;
    do {
      b = str.charCodeAt(index++) - 63;
      result |= (b & 31) << shift;
      shift += 5;
    } while (b >= 32);
    const dlat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += dlat;
    shift = 0;
    result = 0;
    do {
      b = str.charCodeAt(index++) - 63;
      result |= (b & 31) << shift;
      shift += 5;
    } while (b >= 32);
    const dlng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += dlng;
    out.push([lat * 1e-5, lng * 1e-5]);
  }
  return out;
}
function distanceToPathKm(p, path) {
  if (path.length === 0) return Infinity;
  if (path.length === 1) return haversineKm(p, path[0]);
  let min = Infinity;
  for (let i = 0; i < path.length - 1; i++) {
    const d = distanceToSegmentKm(p, path[i], path[i + 1]);
    if (d < min) min = d;
  }
  return min;
}
function toXY(p, ref) {
  const x = (p.lng - ref.lng) * Math.PI / 180 * R * Math.cos(ref.lat * Math.PI / 180);
  const y = (p.lat - ref.lat) * Math.PI / 180 * R;
  return { x, y };
}
function distanceToSegmentKm(p, a, b) {
  const ref = a;
  const A = { x: 0, y: 0 };
  const B = toXY(b, ref);
  const P = toXY(p, ref);
  const ABx = B.x - A.x, ABy = B.y - A.y;
  const APx = P.x - A.x, APy = P.y - A.y;
  const ab2 = ABx * ABx + ABy * ABy;
  const t = ab2 === 0 ? 0 : Math.max(0, Math.min(1, (APx * ABx + APy * ABy) / ab2));
  const cx = A.x + t * ABx, cy = A.y + t * ABy;
  const dx = P.x - cx, dy = P.y - cy;
  return Math.sqrt(dx * dx + dy * dy);
}
var createSsrRpc = (functionId) => {
  const url = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    return (await getServerFnById(functionId))(...args);
  };
  return Object.assign(fn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const Input$1 = objectType({
  from: objectType({
    lat: numberType(),
    lng: numberType()
  }),
  to: objectType({
    lat: numberType(),
    lng: numberType()
  })
});
const getDirections = createServerFn({
  method: "POST"
}).inputValidator((input) => Input$1.parse(input)).handler(createSsrRpc("3591a48adbedeb2e372e722c18c01a688c5d5e6ff055973c69e511d347b04fd3"));
const Input = objectType({
  from: stringType().min(1).max(80),
  to: stringType().min(1).max(80),
  date: stringType().regex(/^\d{4}-\d{2}-\d{2}$/).optional()
});
const getBdzSchedule = createServerFn({
  method: "POST"
}).inputValidator((input) => Input.parse(input)).handler(createSsrRpc("28e7c8b0f2727de9cffe105454951f9ac3681aa2861880040e8358d917710611"));
function RouteMap({
  from,
  to,
  fromName,
  toName
}) {
  const [mounted, setMounted] = reactExports.useState(false);
  const [Comp, setComp] = reactExports.useState(null);
  const [isDark, setIsDark] = reactExports.useState(false);
  const [routePath, setRoutePath] = reactExports.useState([]);
  reactExports.useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  reactExports.useEffect(() => {
    const url = `https://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`;
    fetch(url).then((r) => r.json()).then((data) => {
      if (data.routes?.[0]?.geometry?.coordinates) {
        const coords = data.routes[0].geometry.coordinates.map(
          ([lng, lat]) => [lat, lng]
        );
        setRoutePath(coords);
      }
    }).catch(() => {
      setRoutePath([[from.lat, from.lng], [to.lat, to.lng]]);
    });
  }, [from.lat, from.lng, to.lat, to.lng]);
  reactExports.useEffect(() => {
    setMounted(true);
    Promise.all([
      import("./index-C0jEGPEs.js"),
      import("./leaflet-src-C_KDAvwz.js").then((n) => n.l),
      // @ts-ignore
      Promise.resolve({            })
    ]).then(([RL, L]) => {
      const icon = L.divIcon({
        className: "",
        html: `<div style="background:var(--primary);width:18px;height:18px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9]
      });
      const iconTo = L.divIcon({
        className: "",
        html: `<div style="background:var(--secondary);width:18px;height:18px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9]
      });
      setComp({ RL, icon, iconTo });
    });
  }, []);
  reactExports.useEffect(() => {
    if (!mounted) return;
    const applyFilter = () => {
      const pane = document.querySelector(".leaflet-tile-pane");
      if (pane) {
        pane.style.filter = isDark ? "invert(1) hue-rotate(180deg) brightness(0.85) contrast(0.9)" : "";
      }
    };
    applyFilter();
    const timer = setTimeout(applyFilter, 500);
    return () => clearTimeout(timer);
  }, [isDark, mounted, Comp]);
  if (!mounted || !Comp) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-[420px] w-full items-center justify-center rounded-2xl bg-muted text-sm text-muted-foreground", children: "Loading map…" });
  }
  const { MapContainer, TileLayer, Marker, Polyline, Tooltip } = Comp.RL;
  const positions = routePath.length > 1 ? routePath : [[from.lat, from.lng], [to.lat, to.lng]];
  const startPos = [from.lat, from.lng];
  const endPos = [to.lat, to.lng];
  const center = [
    (from.lat + to.lat) / 2,
    (from.lng + to.lng) / 2
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[420px] w-full overflow-hidden rounded-2xl border border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    MapContainer,
    {
      center,
      zoom: 7,
      style: { height: "100%", width: "100%" },
      scrollWheelZoom: false,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          TileLayer,
          {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Polyline,
          {
            positions,
            pathOptions: {
              color: "#e05a2b",
              weight: 4,
              opacity: 0.9
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Marker, { position: startPos, icon: Comp.icon, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { permanent: true, direction: "top", offset: [0, -10], children: fromName }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Marker, { position: endPos, icon: Comp.iconTo, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { permanent: true, direction: "top", offset: [0, -10], children: toName }) })
      ]
    }
  ) });
}
const MAX_LANDMARK_KM = 30;
function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = h * 31 + s.charCodeAt(i) | 0;
  return Math.abs(h);
}
function lookupCoords(name) {
  return CITY_COORDS[name.trim().toLowerCase()] ?? null;
}
function generateRoutes(seed, km, realDriveMin, trainMin) {
  const fastestTotalMin = realDriveMin ?? Math.max(45, Math.round(km / 95 * 60));
  const cheapestTotalMin = Math.round(km / 70 * 60) + 60;
  const convTotalMin = trainMin ?? Math.round(km / 80 * 60) + 20;
  const fuel = Math.round(km * 0.085 * 10) / 10;
  const tolls = km > 200 ? Math.round(km * 0.012 * 10) / 10 : 0;
  const fastestCost = Math.round((fuel + tolls) * 10) / 10;
  const ticket = Math.round((km * 0.045 + 4) * 10) / 10;
  const transfer = Math.round(seed % 3 * 1.5 * 10) / 10;
  const taxiToTerminal = 4 + seed % 4;
  const cheapestCost = Math.round((ticket + transfer + taxiToTerminal) * 10) / 10;
  const trainTicket = Math.round((km * 0.06 + 5) * 10) / 10;
  const taxiToStation = 5 + seed % 5;
  const convCost = Math.round((trainTicket + taxiToStation) * 10) / 10;
  return [{
    category: "fastest",
    mode: "car",
    hours: Math.floor(fastestTotalMin / 60),
    minutes: fastestTotalMin % 60,
    cost: fastestCost,
    note: "Direct highway route via private car",
    breakdown: [{
      label: "Fuel (~7L/100km)",
      amount: fuel,
      icon: Fuel
    }, {
      label: "Tolls & vignette",
      amount: tolls,
      icon: Ticket
    }, {
      label: "Taxi",
      amount: 0,
      icon: CarTaxiFront
    }]
  }, {
    category: "cheapest",
    mode: "bus",
    hours: Math.floor(cheapestTotalMin / 60),
    minutes: cheapestTotalMin % 60,
    cost: cheapestCost,
    note: "Intercity bus, may include a transfer",
    breakdown: [{
      label: "Bus ticket",
      amount: ticket,
      icon: Ticket
    }, {
      label: "Transfer fee",
      amount: transfer,
      icon: Bus
    }, {
      label: "Taxi to terminal",
      amount: taxiToTerminal,
      icon: CarTaxiFront
    }]
  }, {
    category: "convenient",
    mode: "train",
    hours: Math.floor(convTotalMin / 60),
    minutes: convTotalMin % 60,
    cost: convCost,
    note: "Direct train, comfortable seating",
    breakdown: [{
      label: "Train ticket",
      amount: trainTicket,
      icon: Ticket
    }, {
      label: "Fuel",
      amount: 0,
      icon: Fuel
    }, {
      label: "Taxi to station",
      amount: taxiToStation,
      icon: CarTaxiFront
    }]
  }];
}
function generateAlerts(seed) {
  const pool = [{
    level: "delay",
    title: "Train BV 8612 delayed 25 min",
    body: "BDŽ reports a signaling issue near Mezdra. Connections may be affected."
  }, {
    level: "warning",
    title: "Heavy traffic on A1 near Trakia",
    body: "Average speeds dropping to 35 km/h between Plovdiv and Stara Zagora."
  }, {
    level: "info",
    title: "Bus terminal change",
    body: "Departures temporarily moved to Serdika Center bay 4."
  }, {
    level: "warning",
    title: "Vignette checkpoint active",
    body: "Road police are inspecting vignettes on the Hemus highway."
  }, {
    level: "delay",
    title: "Rain expected in the Balkan range",
    body: "Plan extra time on mountain passes after 6pm."
  }, {
    level: "info",
    title: "Discounted weekend train fares",
    body: "BDŽ offers 30% off return tickets through Sunday."
  }];
  return [0, 1, 2].map((i) => pool[(seed + i * 7) % pool.length]);
}
function landmarksAlongRoute(from, to, path) {
  return LANDMARKS.map((l) => {
    const p = {
      lat: l.lat,
      lng: l.lng
    };
    const detourKm = path && path.length > 1 ? distanceToPathKm(p, path) : distanceToSegmentKm(p, from, to);
    return {
      ...l,
      detourKm
    };
  }).filter((l) => l.detourKm <= MAX_LANDMARK_KM).sort((a, b) => a.detourKm - b.detourKm);
}
const MODE_ICON = {
  bus: Bus,
  train: TramFront,
  car: Car
};
const MODE_LABEL = {
  bus: "Bus",
  train: "Train",
  car: "Car"
};
const CAT_META = {
  fastest: {
    label: "Fastest",
    tagline: "Save hours",
    icon: Zap,
    accent: "from-primary to-accent"
  },
  cheapest: {
    label: "Cheapest",
    tagline: "Stretch your budget",
    icon: PiggyBank,
    accent: "from-secondary to-primary"
  },
  convenient: {
    label: "Most Convenient",
    tagline: "Smoothest ride",
    icon: Sparkles,
    accent: "from-accent to-secondary"
  }
};
function ResultsPage() {
  const {
    from,
    to
  } = Route.useSearch();
  const base = reactExports.useMemo(() => {
    const fromCoords = lookupCoords(from);
    const toCoords = lookupCoords(to);
    if (!fromCoords || !toCoords) return null;
    const seed = hashStr(from.toLowerCase() + "→" + to.toLowerCase());
    return {
      fromCoords,
      toCoords,
      seed
    };
  }, [from, to]);
  const fetchDirections = useServerFn(getDirections);
  const directionsQuery = useQuery({
    queryKey: ["directions", from, to],
    enabled: !!base,
    queryFn: () => fetchDirections({
      data: {
        from: base.fromCoords,
        to: base.toCoords
      }
    }),
    staleTime: 1e3 * 60 * 60
  });
  const fetchBdz = useServerFn(getBdzSchedule);
  const bdzQuery = useQuery({
    queryKey: ["bdz", from, to],
    enabled: !!from && !!to,
    queryFn: () => fetchBdz({
      data: {
        from,
        to
      }
    }),
    staleTime: 1e3 * 60 * 10
  });
  const trip = reactExports.useMemo(() => {
    if (!base) return null;
    const dir = directionsQuery.data;
    const decoded = dir ? decodePolyline(dir.polyline).map(([lat, lng]) => ({
      lat,
      lng
    })) : void 0;
    const km = dir ? Math.round(dir.distanceKm) : roadKm(base.fromCoords, base.toCoords);
    const realDriveMin = dir?.durationMin;
    const nextTrain = bdzQuery.data?.departures.find((d) => {
      return true;
    });
    const trainMin = nextTrain?.totalMinutes;
    return {
      ...base,
      km,
      pathLatLng: decoded ? decoded.map((c) => [c.lat, c.lng]) : void 0,
      pathCoords: decoded,
      routes: generateRoutes(base.seed, km, realDriveMin, trainMin),
      alerts: generateAlerts(base.seed),
      landmarks: landmarksAlongRoute(base.fromCoords, base.toCoords, decoded)
    };
  }, [base, directionsQuery.data, bdzQuery.data]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "font-unified min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-6xl px-6 pt-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
      " New search"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mx-auto max-w-6xl px-6 py-10", children: !from || !to ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, {}) : !trip ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-border bg-card p-8 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-foreground", children: [
        "We don't have coordinates for ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: from }),
        " or ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: to }),
        " yet."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Try a major Bulgarian city from the home page." })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-14", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline justify-between gap-4 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-3xl font-bold text-foreground sm:text-5xl flex items-center gap-3", children: [
          from,
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "→" }),
          " ",
          to,
          /* @__PURE__ */ jsxRuntimeExports.jsx(FavoriteRouteButton, { from, to })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: directionsQuery.isLoading ? "Loading live route from Google…" : directionsQuery.isError ? `~${trip.km} km · live route unavailable, showing estimates` : `${trip.km} km · live Google route · estimates in EUR` })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-5 md:grid-cols-3", children: trip.routes.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(RouteCard, { route: r }, r.category)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 lg:grid-cols-[1.6fr_1fr]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { icon: Map, title: "Route on the map", subtitle: "OpenStreetMap overview of your trip" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(RouteMap, { from: trip.fromCoords, to: trip.toCoords, fromName: from, toName: to, path: trip.pathLatLng })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { icon: TriangleAlert, title: "Live alerts", subtitle: "Schedule changes & traffic now" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: trip.alerts.map((a, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(AlertCard, { alert: a }, i)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { icon: Sparkles, title: "Worth a stop along the way", subtitle: `Landmarks within ${MAX_LANDMARK_KM} km of your route` }),
        trip.landmarks.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center text-sm text-muted-foreground", children: [
          "No notable landmarks within ",
          MAX_LANDMARK_KM,
          " km of this route."
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: trip.landmarks.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx(LandmarkCard, { landmark: l }, l.name)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(BdzScheduleSection, { isLoading: bdzQuery.isLoading, isError: bdzQuery.isError, data: bdzQuery.data })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
function EmptyState() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-border bg-card p-10 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold text-foreground", children: "Pick a start and destination" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Head back to the home page and choose your cities." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "mt-6 inline-flex items-center gap-2 rounded-2xl px-5 py-3 font-semibold text-primary-foreground", style: {
      background: "var(--gradient-hero)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
      " Back to search"
    ] })
  ] });
}
function RouteCard({
  route
}) {
  const meta = CAT_META[route.category];
  const ModeIcon = MODE_ICON[route.mode];
  const CatIcon = meta.icon;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card p-6 transition-all hover:-translate-y-1", style: {
    boxShadow: "var(--shadow-card)"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${meta.accent}` }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CatIcon, { className: "h-3.5 w-3.5" }),
          meta.tagline
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-1 text-2xl font-bold text-foreground", children: meta.label })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-11 w-11 items-center justify-center rounded-2xl bg-muted text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ModeIcon, { className: "h-5 w-5" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex items-end justify-between border-t border-border pt-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4" }), label: "Time", value: `${route.hours}h ${route.minutes.toString().padStart(2, "0")}m` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Euro, { className: "h-4 w-4" }), label: "Total", value: `€${route.cost.toFixed(2)}`, align: "right" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-5 text-sm text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: MODE_LABEL[route.mode] }),
      " · ",
      route.note
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 rounded-2xl bg-muted/60 p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground", children: "Cost breakdown" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-3 space-y-2", children: route.breakdown.filter((b) => b.amount > 0).map((b) => {
        const Icon = b.icon;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center justify-between text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 text-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3.5 w-3.5 text-muted-foreground" }),
            b.label
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-foreground tabular-nums", children: [
            "€",
            b.amount.toFixed(2)
          ] })
        ] }, b.label);
      }) })
    ] })
  ] });
}
function Stat({
  icon,
  label,
  value,
  align = "left"
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: align === "right" ? "text-right" : "", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground", children: [
      align === "left" && icon,
      label,
      align === "right" && icon
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 font-display text-2xl font-bold text-foreground", children: value })
  ] });
}
function SectionHeader({
  icon: Icon,
  title,
  subtitle
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 flex items-end justify-between gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-display text-2xl font-bold text-foreground flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5 text-primary" }),
      title
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: subtitle })
  ] }) });
}
function AlertCard({
  alert
}) {
  const config = {
    delay: {
      Icon: Clock,
      dot: "bg-primary",
      label: "Delay"
    },
    warning: {
      Icon: TriangleAlert,
      dot: "bg-accent",
      label: "Warning"
    },
    info: {
      Icon: Info,
      dot: "bg-secondary",
      label: "Info"
    }
  }[alert.level];
  const {
    Icon
  } = config;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("article", { className: "rounded-2xl border border-border bg-card p-4", style: {
    boxShadow: "var(--shadow-card)"
  }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4 text-foreground" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `h-1.5 w-1.5 rounded-full ${config.dot}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground", children: [
          config.label,
          " · live"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "mt-1 font-semibold text-foreground", children: alert.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: alert.body })
    ] })
  ] }) });
}
function FavoriteRouteButton({
  from,
  to
}) {
  const [faved, setFaved] = reactExports.useState(() => isFavorite({
    type: "route",
    from,
    to
  }));
  const toggle = (e) => {
    e.preventDefault();
    if (faved) removeFavorite({
      type: "route",
      from,
      to
    });
    else addFavorite({
      type: "route",
      from,
      to
    });
    setFaved(!faved);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: toggle, className: `flex h-8 w-8 items-center justify-center rounded-full border transition-colors ${faved ? "bg-primary border-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:text-primary"}`, title: "Добави към любими", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "h-4 w-4", fill: faved ? "currentColor" : "none" }) });
}
function useLandmarkPhoto(slug) {
  return `/landmarks/${slug}.jpg`;
}
function LandmarkCard({
  landmark
}) {
  const photo = useLandmarkPhoto(landmark.slug);
  const [faved, setFaved] = reactExports.useState(() => isFavorite({
    type: "landmark",
    slug: landmark.slug,
    name: landmark.name,
    city: landmark.city
  }));
  const toggleFav = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (faved) removeFavorite({
      type: "landmark",
      slug: landmark.slug,
      name: landmark.name,
      city: landmark.city
    });
    else addFavorite({
      type: "landmark",
      slug: landmark.slug,
      name: landmark.name,
      city: landmark.city
    });
    setFaved(!faved);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/landmark/$slug", params: {
    slug: landmark.slug
  }, className: "group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary", style: {
    boxShadow: "var(--shadow-card)"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-40 w-full overflow-hidden bg-muted", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: photo, alt: landmark.name, className: "h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-2 right-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm", children: landmark.detourKm < 1 ? "on route" : `${landmark.detourKm.toFixed(0)} km off` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: toggleFav, className: `absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full transition-colors backdrop-blur-sm ${faved ? "bg-primary text-primary-foreground" : "bg-black/40 text-white hover:bg-primary hover:text-primary-foreground"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "h-3.5 w-3.5", fill: faved ? "currentColor" : "none" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 flex-col p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground", children: landmark.city }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "mt-0.5 font-display text-base font-bold text-foreground transition-colors group-hover:text-primary", children: landmark.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground line-clamp-2", children: landmark.description }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-3 text-xs font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100", children: "View details →" })
    ] })
  ] });
}
function BdzScheduleSection({
  isLoading,
  isError,
  data
}) {
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { icon: TramFront, title: "Train schedule (БДЖ)", subtitle: "Live departures from Bulgarian Railways" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center text-sm text-muted-foreground", children: "Loading live BDŽ schedule…" })
    ] });
  }
  if (!data || isError) return null;
  if (!data.supported) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { icon: TramFront, title: "Train schedule (БДЖ)", subtitle: "Live departures from Bulgarian Railways" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center text-sm text-muted-foreground", children: "No BDŽ station mapped for this route yet." })
    ] });
  }
  if (data.error) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { icon: TramFront, title: "Train schedule (БДЖ)", subtitle: "Live departures from Bulgarian Railways" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-dashed border-border bg-card/50 p-6 text-center text-sm text-muted-foreground", children: [
        "Couldn't reach БДЖ: ",
        data.error
      ] })
    ] });
  }
  if (data.departures.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { icon: TramFront, title: "Train schedule (БДЖ)", subtitle: `No direct departures found for ${data.date ?? "today"}` }) });
  }
  const next = data.departures.slice(0, 6);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { icon: TramFront, title: "Train schedule (БДЖ)", subtitle: `Live from Bulgarian Railways · ${data.fromName} → ${data.toName} · ${data.date}` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-hidden rounded-2xl border border-border bg-card", style: {
      boxShadow: "var(--shadow-card)"
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-border", children: next.map((d, i) => {
      d.distanceKm > 0 ? `${(d.distanceKm * 0.065).toFixed(2)} лв` : "~8.00 лв";
      d.hasFirstClass ? d.distanceKm > 0 ? `${(d.distanceKm * 0.09).toFixed(2)} лв` : "~11.00 лв" : null;
      const bdzUrl = `https://shop.bdz.bg/bg/tickets/one-way`;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "grid items-center gap-4 px-6 py-4", style: {
        gridTemplateColumns: "1fr auto auto"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display text-lg font-bold text-foreground tabular-nums", children: [
            d.departTime,
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground mx-1", children: "→" }),
            " ",
            d.arriveTime
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-0.5 text-xs text-muted-foreground", children: [
            d.trainName,
            " · ",
            d.transfers > 0 ? `${d.transfers} transfer${d.transfers > 1 ? "s" : ""}` : "direct"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3.5 w-3.5 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tabular-nums", children: d.totalTime })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: bdzUrl, target: "_blank", rel: "noopener noreferrer", className: "flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90 whitespace-nowrap", style: {
          background: "var(--gradient-hero)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Ticket, { className: "h-3.5 w-3.5" }),
          " Купи билет"
        ] })
      ] }, `${d.trainName}-${d.departTime}-${i}`);
    }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-xs text-muted-foreground", children: "Цените са приблизителни · За точна цена и резервация посетете shop.bdz.bg" })
  ] });
}
export {
  ResultsPage as component
};
