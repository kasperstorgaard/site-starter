import { css } from 'lit';

// lit css representation of keyframes from `./animations.scss`.
// import in web component styles that use animations.
// needed bc. Safari does not seem capable of using keyframes from outside shadow dom.
export default css`
  @keyframes show {
    0% { display: none !important; }
    1% { display: block !important; }
  }
  @keyframes hide {
    0% { display: block !important; }
    99% { display: block !important; }
    100% { display: none !important; }
  }
  @keyframes fade-in {
    to { opacity: 1 }
  }
  @keyframes fade-out {
    to { opacity: 0 }
  }
  @keyframes scale-up {
    to { transform: scale(1.25) }
  }
  @keyframes scale-down {
    to { transform: scale(.75) }
  }
  @keyframes slide-out-up {
    to { transform: translateY(-100%) }
  }
  @keyframes slide-out-down {
    to { transform: translateY(100%) }
  }
  @keyframes slide-out-right {
    to { transform: translateX(100%) }
  }
  @keyframes slide-out-left {
    to { transform: translateX(-100%) }
  }
  @keyframes slide-in-up {
    from { transform: translateY(100%) }
  }
  @keyframes slide-in-down {
    from { transform: translateY(-100%) }
  }
  @keyframes slide-in-right {
    from { transform: translateX(-100%) }
  }
  @keyframes slide-in-left {
    from { transform: translateX(100%) }
    /*
      Safari seems to have a bug with janky animations if "to" is left out here,
      specifically for "sidebar".
      weird, since slide-in-right works just fine....
    */
    to { transform: translateX(0) }
  }
  @keyframes shake-x {
    0%, 100% { transform: translateX(0%) }
    20% { transform: translateX(-5%) }
    40% { transform: translateX(5%) }
    60% { transform: translateX(-5%) }
    80% { transform: translateX(5%) }
  }
  @keyframes shake-y {
    0%, 100% { transform: translateY(0%) }
    20% { transform: translateY(-5%) }
    40% { transform: translateY(5%) }
    60% { transform: translateY(-5%) }
    80% { transform: translateY(5%) }
  }
  @keyframes spin {
    to { transform: rotate(1turn) }
  }
  @keyframes ping {
    90%, 100% {
      transform: scale(2);
      opacity: 0;
    }
  }
  @keyframes blink {
    0%, 100% {
      opacity: 1
    }
    50% {
      opacity: .5
    }
  }
  @keyframes float {
    50% { transform: translateY(-25%) }
  }
  @keyframes bounce {
    25% { transform: translateY(-20%) }
    40% { transform: translateY(-3%) }
    0%, 60%, 100% { transform: translateY(0) }
  }
  @keyframes pulse {
    50% { transform: scale(.9,.9) }
  }
`;
