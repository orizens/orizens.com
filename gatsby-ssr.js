import { THEME } from "./src/components/theme"

exports.onRenderBody = ({ setBodyAttributes }) => {
  setBodyAttributes({
    className: THEME,
  })
}
