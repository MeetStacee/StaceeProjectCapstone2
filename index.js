import Navigo from "navigo";
import { camelCase } from "lodash";
import { header, nav, main, footer } from "./components";
import * as store from "./store";

const router = new Navigo("/");

function render(state = store.home) {
  document.querySelector("#root").innerHTML = `
      ${header(state)}
      ${nav(store.nav)}
      ${main(state)}
      ${footer(state)}
    `;
    router.updatePageLinks();
}


router.on("/", () => render(store.home)).resolve();

router
.on({
  "/": () => render(),
  // Use object destructuring assignment to store the data and (query)params from the Navigo match parameter
  // (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)
  // This reduces the number of checks that need to be performed
  ":view": (match) => {
    // Change the :view data element to camel case and remove any dashes (support for multi-word views)
    const view = match?.data?.view ? camelCase(match.data.view) : "home";
    // Determine if the view name key exists in the store object
    if (view in store) {
      render(store[view]);
    } else {
      render(store.viewNotFound);
      console.log(`View ${view} not defined`);
    }
  },
})
.resolve();