Waxman's Gym Ratio Calculator
=============================

Over years of training athletes, we at [Waxman's Gym](http://www.waxmansgym.com) have found that lift ratios can serve as powerful tools for evaluating balance and guiding lifter development. By uncovering a lifter's biggest imbalances, one can better prioritize problems and more effectively direct programming/training.

This calculator is web application built in [React](https://facebook.github.io/react/) that takes as input various exercises and produces advice on how one can improve their Snatch and Clean & Jerk.

## Development

- Install all dependencies with `npm install`.
- Start the development server by running `npm run start-all`. This will run both the React build toolchain as well as the custom-boostrap less toolchain in parallel.
- Compile an optimized build with `npm run build`, and then upload the entire build directory to your web host.

- The main app is in App.js, but most of the fun happens in the `AccessoryResults` class in `components.js`.
- The style definition is in the `custom-bootstrap` subclass, with all relevant overrides in `index.less`.