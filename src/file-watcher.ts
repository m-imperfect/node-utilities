import EventEmitter from 'events'
import {
  existsSync, stat, readFile,
  FSWatcher, WatchOptions, watch
} from 'fs'

type FileReadOptions = { encoding: BufferEncoding, flag?: string | undefined } | BufferEncoding

class FileWatcher extends EventEmitter {
  path: string
  watchOptions: WatchOptions
  readOptions: FileReadOptions
  watcher?: FSWatcher
  lastModify?: number

  update() {
    readFile(this.path, this.readOptions, (err, content) => {
      if (!err) {
        this.emit('update', content)
      } else {
        this.emit('error', err)
      }
    })
  }
  
  watch() {
    if (existsSync(this.path)) {
      stat(this.path, (err, pathStat) => {
        if (err) return this.emit('error', err)
        if (pathStat.isFile()) {
          this.update()
          try {
            this.watcher = watch(this.path, this.watchOptions, () => {
              if (existsSync(this.path)) {
                stat(this.path, (err, pathStat) => {
                  if (err) return this.emit('error', err)
                  let lastModify = pathStat.mtime.getTime()
                  if (this.lastModify != lastModify) {
                    this.lastModify = lastModify
                    this.update()
                  }
                })
              } else {
                this.watcher?.close()
                this.emit('warning', 'LOST_TRACK')
              }
            })
            this.emit('ready')
          } catch (err) {
            this.watcher?.close()
            this.emit('error', err)
          }
        } else {
          this.emit('warning', 'NOT_FILE')
        }
      })
    } else {
      this.emit('warning', 'NOT_FOUND')
    }
  }

  constructor(path: string, watchOptions?: WatchOptions, readOptions?: FileReadOptions) {
    super()
    this.path = path
    this.watchOptions = watchOptions ?? {}
    this.readOptions = readOptions ?? 'utf-8'
  }
}

export = FileWatcher
