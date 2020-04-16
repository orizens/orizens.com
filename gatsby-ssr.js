const { THEME } = require("./src/components/theme")

exports.onRenderBody = ({ setBodyAttributes }) => {
  setBodyAttributes({
    className: THEME,
  })
}
