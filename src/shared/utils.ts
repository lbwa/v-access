const noop: Function = () => {}

export let log = noop

if (!(process.env.NODE_ENV === 'production')) {
  log =
    process.env.NODE_ENV === 'test'
      ? noop
      : (...msg: string[]) => {
          /* eslint-disable-next-line */
          console.log(`[V-Access]: `, ...msg)
        }
}
