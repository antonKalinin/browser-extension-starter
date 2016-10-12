module.exports = {
    "extends": "airbnb",
    "plugins": [
        "react",
        "jsx-a11y",
        "import"
    ],
    "rules": {
        "indent": [2, 4],
        "no-console": 0,
        "comma-dangle": [2, "never"],
        "react/jsx-indent": [2, 4],
        "react/jsx-indent-props": [2, 4],
        "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
        "jsx-quotes": [2, "prefer-single"]
    },
    "root": true
};