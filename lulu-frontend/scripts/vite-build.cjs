const childProcess = require('node:child_process')

const createNoOpProcess = () => ({
  kill() {},
  pid: 0,
  stdout: null,
  stderr: null,
})

childProcess.exec = function exec(command, options, callback) {
  const actualCallback = typeof options === 'function' ? options : callback
  if (typeof actualCallback === 'function') {
    process.nextTick(() => actualCallback(null, '', ''))
  }
  return createNoOpProcess()
}

;(async () => {
  const { build } = await import('vite')
  await build({
    configLoader: 'runner',
  })
})().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
