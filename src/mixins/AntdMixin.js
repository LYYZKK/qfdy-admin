export default {
  methods: {
    filterSelectOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) > -1
    },
    filterTransferOption(inputValue, option) {
      return option.title.indexOf(inputValue) > -1
    }
  }
}
