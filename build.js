const fs = require("fs");
const _ = require("lodash");

const str = fs.readFileSync(__dirname + "/index.html").toString();

const compiled = _.template(str, {
  imports: {
    i18n: () => {
      console.log(123);
      return "123";
    },
  },
});

const res = compiled();

console.log(res);
debugger;
