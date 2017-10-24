
let styles

if (process.env.NODE_ENV !== 'production') {
  styles = [
    'border-left: 5px solid #D82D20',
    'border-right: 5px solid #fff',
  ].join(';')
}


const log = (...args) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('%c', styles, ...args) // eslint-disable-line
  }
}

export default log
