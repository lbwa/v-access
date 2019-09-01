import { VueConstructor } from 'vue'

export default function Error(Vue: VueConstructor) {
  return Vue.extend({
    name: 'VAccessUnauthorized',

    functional: true,

    props: {
      errorCode: {
        type: Number,
        required: true
      },
      errorMessage: {
        type: String,
        required: true
      }
    },

    render(h, { props }) {
      return h(
        'div',
        {
          style: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'middle',
            alignItems: 'center'
          }
        },
        [h('h3', {}, `${props.errorCode}`), h('p', {}, props.errorMessage)]
      )
    }
  })
}
