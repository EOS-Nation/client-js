export interface OutboundMessage<T> {
  type: OutboundMessageType
  req_id?: string
  listen?: boolean
  fetch?: boolean
  start_block?: number
  with_progress?: boolean
  data: T
}

// **Important** The key must be the same as the API type but in upper snake case for "in" operation to work
export enum OutboundMessageType {
  GET_ACTION_TRACES = "get_action_traces",
  GET_TABLE_ROWS = "get_table_rows",
  GET_TRANSACTION = "get_transaction",
  UNLISTEN = "unlisten"
}

export interface StreamOptions {
  listen?: boolean
  req_id?: string
  start_block?: number
  fetch?: boolean
  with_progress?: boolean
}

export interface GetActionTracesMessageData {
  account: string
  receiver?: string
  action_name?: string
  with_dbops?: boolean
  with_dtrxops?: boolean
  with_ramops?: boolean
  with_inline_traces?: boolean
}

export function getActionTracesMessage(
  data: GetActionTracesMessageData,
  streamOptions: StreamOptions = {}
): OutboundMessage<GetActionTracesMessageData> {
  return createOutboundMessage(
    OutboundMessageType.GET_ACTION_TRACES,
    data,
    { listen: true },
    streamOptions
  )
}

export interface GetTableRowsMessageData {
  code: string
  scope: string
  table: string
  json?: boolean
  lower_bound?: string
  upper_bound?: string
}

export function getTableRowsMessage(
  data: GetTableRowsMessageData,
  streamOptions: StreamOptions = {}
): OutboundMessage<GetTableRowsMessageData> {
  return {
    type: OutboundMessageType.GET_TABLE_ROWS,
    listen: true,
    ...streamOptions,
    data
  }
}

export interface GetTransactionMessageData {
  id: string
}

export function getTransactionMessage(
  data: GetTransactionMessageData,
  streamOptions: StreamOptions = {}
): OutboundMessage<GetTransactionMessageData> {
  return {
    type: OutboundMessageType.GET_TRANSACTION,
    listen: true,
    fetch: true,
    ...streamOptions,
    data
  }
}

export interface UnlistenMessageData {
  req_id: string
}

export function unlistenMessage(data: UnlistenMessageData) {
  return {
    type: OutboundMessageType.UNLISTEN,
    data
  }
}

function createOutboundMessage<T>(
  type: OutboundMessageType,
  data: T,
  defaultStreamOptions: StreamOptions,
  streamOptions: StreamOptions
): OutboundMessage<T> {
  return {
    type,
    req_id: getStreamOption(defaultStreamOptions.req_id, streamOptions.req_id),
    listen: getStreamOption(defaultStreamOptions.listen, streamOptions.listen),
    fetch: getStreamOption(defaultStreamOptions.fetch, streamOptions.fetch),
    start_block: getStreamOption(defaultStreamOptions.start_block, streamOptions.start_block),
    with_progress: getStreamOption(defaultStreamOptions.with_progress, streamOptions.with_progress),
    data
  }
}

function getStreamOption<T>(
  defaultValue: T | undefined,
  actualValue: T | undefined
): T | undefined {
  return actualValue === undefined ? defaultValue : actualValue
}
