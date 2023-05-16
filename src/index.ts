export * as args from './args'

export * as log from './log'

import saveErrorModule from './save-error'
export let saveError = saveErrorModule

export * as string from './string'

export * as random from './random'

export * as validation from './validation'

import FileWatcherModule from './file-watcher'
export let FileWatcher = FileWatcherModule
