import * as PropTypes from 'prop-types'
import React from 'react'
import ReactDOM from 'react-dom'
import { polyfill } from 'react-lifecycles-compat'

import { timeoutsShape } from './utils/PropTypes'

export const UNMOUNTED = 'unmounted'
export const EXITED = 'exited'
export const ENTERING = 'entering'
export const ENTERED = 'entered'
export const EXITING = 'exiting'

/**
 * The Transition component lets you describe a transition from one component
 * state to another _over time_ with a simple declarative API. Most commonly
 * it's used to animate the mounting and unmounting of a component, but can also
 * be used to describe in-place transition states as well.
 * transition组件让你能够使用一种简单的声明式api来描述组件从一个状态经过一段时间后转移
 * 为另一个状态. 它常常被用来使得组件的mounting与unmounting过程动画化, 也能被用来描述
 * 到位(in-place)的过渡状态.
 *
 * By default the `Transition` component does not alter the behavior of the
 * component it renders, it only tracks "enter" and "exit" states for the components.
 * It's up to you to give meaning and effect to those states. For example we can
 * add styles to a component when it enters or exits:
 * 默认地transition组件并不会改变组件的渲染行为, 它仅仅跟踪组件的enter以及exit状态. 由
 * 你来决定赋予这些状态什么意义与效果. 例如我们能够在组件enters或者exits时添加样式(styles)
 *
 * ```jsx
 * import Transition from 'react-transition-group/Transition';
 *
 * const duration = 300;
 *
 * const defaultStyle = {
 *   transition: `opacity ${duration}ms ease-in-out`,
 *   opacity: 0,
 * }
 *
 * const transitionStyles = {
 *   entering: { opacity: 0 },
 *   entered:  { opacity: 1 },
 * };
 *
 * const Fade = ({ in: inProp }) => (
 *   <Transition in={inProp} timeout={duration}>
 *     {(state) => (
 *       <div style={{
 *         ...defaultStyle,
 *         ...transitionStyles[state]
 *       }}>
 *         I'm a fade Transition!
 *       </div>
 *     )}
 *   </Transition>
 * );
 * ```
 *
 * As noted the `Transition` component doesn't _do_ anything by itself to its child component.
 * What it does do is track transition states over time so you can update the
 * component (such as by adding styles or classes) when it changes states.
 * 注意transition组件自身并不对它的child component做什么(产生任何影响). transition组
 * 件做的只是跟踪组件经过一段时间的状态, 以便你能在它的状态发生改变时更新组件
 * (比如添加样式或者classes)
 * 
 * There are 4 main states a Transition can be in:
 * 过渡(transition)有如下4种主要的状态
 *  - `'entering'`
 *  - `'entered'`
 *  - `'exiting'`
 *  - `'exited'`
 *
 * Transition state is toggled via the `in` prop. When `true` the component begins the
 * "Enter" stage. During this stage, the component will shift from its current transition state,
 * to `'entering'` for the duration of the transition and then to the `'entered'` stage once
 * it's complete. Let's take the following example:
 * 过渡状态(transition state)会被in属性(`in` prop)切换. 当in为true时组件开始"Enter"
 * 阶段. 在这个阶段, 组件将会从它当前的过渡状态转移到`entering`, 一旦过渡过程结束, 就
 * 会转移到`entered`阶段. 让我们举下面这个例子:
 *
 * ```jsx
 * state = { in: false };
 *
 * toggleEnterState = () => {
 *   this.setState({ in: true });
 * }
 *
 * render() {
 *   return (
 *     <div>
 *       <Transition in={this.state.in} timeout={500} />
 *       <button onClick={this.toggleEnterState}>Click to Enter</button>
 *     </div>
 *   );
 * }
 * ```
 *
 * When the button is clicked the component will shift to the `'entering'` state and
 * stay there for 500ms (the value of `timeout`) before it finally switches to `'entered'`.
 * 当按钮被点击时, 组件将会转移到`entering`状态, 在`entering`状态停留500ms(timeout的值),
 * 之后转移到`entered`状态.
 *
 * When `in` is `false` the same thing happens except the state moves from `'exiting'` to `'exited'`.
 * 当in属性为false时过程也是一样, 只不过是状态由`exiting`转移到`exited`
 *
 * ## Timing
 * ## 定时
 *
 * Timing is often the trickiest part of animation, mistakes can result in slight delays
 * that are hard to pin down. A common example is when you want to add an exit transition,
 * you should set the desired final styles when the state is `'exiting'`. That's when the
 * transition to those styles will start and, if you matched the `timeout` prop with the
 * CSS Transition duration, it will end exactly when the state changes to `'exited'`.
 * 定时是动画的最棘手的部分, 定时的失误将会导致轻微的延迟, 很难被发觉. 一个普遍的例子是
 * 当你想要添加一个exit过渡, 你应该在`exiting`状态设置你想要的最终样式. 这个状态是过渡
 * 到指定styles的开始状态, 如果`timeout`属性与CSS Transition的duration相符合(相等),
 * 过渡状态将会准时地转移到`exited`. 
 *
 * > **Note**: For simpler transitions the `Transition` component might be enough, but
 * > take into account that it's platform-agnostic, while the `CSSTransition` component
 * > [forces reflows](https://github.com/reactjs/react-transition-group/blob/5007303e729a74be66a21c3e2205e4916821524b/src/CSSTransition.js#L208-L215)
 * > in order to make more complex transitions more predictable. For example, even though
 * > classes `example-enter` and `example-enter-active` are applied immediately one after
 * > another, you can still transition from one to the other because of the forced reflow
 * > (read [this issue](https://github.com/reactjs/react-transition-group/issues/159#issuecomment-322761171)
 * > for more info). Take this into account when choosing between `Transition` and
 * > `CSSTransition`.
 * > **提示**: 对于简单的过渡来说, `transition`组件可能已经足够, 但是考虑到跨平台的时
 * > 候, `CSSTransition`组件强制回流(force reflows)(CSSTransition使用scrollTop
 * > 来时浏览器强制回流, 是一种普遍的hack方法)来让更复杂的过渡更加可预测. 例如, 
 * > 尽管classes `example-enter`和`example-enter-acitve`一个接一个地立马被应用, 
 * > 因为强制回流(force reflows)你仍然能够从一个过渡到另一个. 在选择使用`Transition`
 * > 或是`CSSTransition`时要考虑到这一点.
 */
class Transition extends React.Component {
  static contextTypes = {
    transitionGroup: PropTypes.object,
  }
  static childContextTypes = {
    transitionGroup: () => {},
  }

  constructor(props, context) {
    super(props, context)

    let parentGroup = context.transitionGroup
    // In the context of a TransitionGroup all enters are really appears
    // 在TransitionGroup的context中所有的enters都是真正的appears
    // appear, 是否在初次挂载时使用动画
    let appear =
      parentGroup && !parentGroup.isMounting ? props.enter : props.appear

    let initialStatus

    this.appearStatus = null

    // 初始化state
    if (props.in) {
      if (appear) {
        initialStatus = EXITED
        this.appearStatus = ENTERING
      } else {
        initialStatus = ENTERED
      }
    } else {
      if (props.unmountOnExit || props.mountOnEnter) {
        initialStatus = UNMOUNTED
      } else {
        initialStatus = EXITED
      }
    }

    this.state = { status: initialStatus }

    this.nextCallback = null
  }

  getChildContext() {
    return { transitionGroup: null } // allows for nested Transitions
  }

  // 使用props更新state
  static getDerivedStateFromProps({ in: nextIn }, prevState) {

    // 如果in为true且前一个状态为UNMOUNTED, 则将status转移到EXITED
    if (nextIn && prevState.status === UNMOUNTED) {
      return { status: EXITED }
    }
    return null
  }

  // getSnapshotBeforeUpdate(prevProps) {
  //   let nextStatus = null

  //   if (prevProps !== this.props) {
  //     const { status } = this.state

  //     if (this.props.in) {
  //       if (status !== ENTERING && status !== ENTERED) {
  //         nextStatus = ENTERING
  //       }
  //     } else {
  //       if (status === ENTERING || status === ENTERED) {
  //         nextStatus = EXITING
  //       }
  //     }
  //   }

  //   return { nextStatus }
  // }

  // 挂载后更新status
  componentDidMount() {
    this.updateStatus(true, this.appearStatus)
  }

  // 组件状态更新后更新status
  componentDidUpdate(prevProps) {
    let nextStatus = null
    if (prevProps !== this.props) {
      const { status } = this.state

      if (this.props.in) {
        if (status !== ENTERING && status !== ENTERED) {
          nextStatus = ENTERING
        }
      } else {
        if (status === ENTERING || status === ENTERED) {
          nextStatus = EXITING
        }
      }
    }
    this.updateStatus(false, nextStatus)
  }

  componentWillUnmount() {
    this.cancelNextCallback()
  }

  // 得到各个过渡过程的时间
  getTimeouts() {
    const { timeout } = this.props
    let exit, enter, appear

    exit = enter = appear = timeout

    if (timeout != null && typeof timeout !== 'number') {
      exit = timeout.exit
      enter = timeout.enter
      appear = timeout.appear
    }
    return { exit, enter, appear }
  }

  updateStatus(mounting = false, nextStatus) {
    if (nextStatus !== null) {
      // nextStatus will always be ENTERING or EXITING.
      this.cancelNextCallback()
      const node = ReactDOM.findDOMNode(this)

      if (nextStatus === ENTERING) {
        this.performEnter(node, mounting)
      } else {
        this.performExit(node)
      }
    } else if (this.props.unmountOnExit && this.state.status === EXITED) {
      this.setState({ status: UNMOUNTED })
    }
  }

  // 展示enter阶段
  performEnter(node, mounting) {
    const { enter } = this.props

    // 用来表明是否在初次挂载时出现enter阶段
    const appearing = this.context.transitionGroup
      ? this.context.transitionGroup.isMounting
      : mounting

    const timeouts = this.getTimeouts()

    // no enter animation skip right to ENTERED
    // if we are mounting and running this it means appear _must_ be set
    // 没有enter动画时状态直接转移到ENTERED
    //
    if (!mounting && !enter) {
      this.safeSetState({ status: ENTERED }, () => {
        this.props.onEntered(node)
      })
      return
    }

    // 触发onEnter
    this.props.onEnter(node, appearing)

    // 开始enter过程
    this.safeSetState({ status: ENTERING }, () => {
      this.props.onEntering(node, appearing)

      // FIXME: appear timeout?
      // timeouts.enter时间后状态转移为 ENTERED
      this.onTransitionEnd(node, timeouts.enter, () => {
        this.safeSetState({ status: ENTERED }, () => {
          this.props.onEntered(node, appearing)
        })
      })
    })
  }

  // 展示exit阶段
  performExit(node) {
    const { exit } = this.props
    const timeouts = this.getTimeouts()

    // no exit animation skip right to EXITED
    // 没有exit动画时直接转移到EXITED
    if (!exit) {
      this.safeSetState({ status: EXITED }, () => {
        this.props.onExited(node)
      })
      return
    }
    // 触发onExit
    this.props.onExit(node)

    // 开始exit过程
    this.safeSetState({ status: EXITING }, () => {
      this.props.onExiting(node)

      this.onTransitionEnd(node, timeouts.exit, () => {
        this.safeSetState({ status: EXITED }, () => {
          this.props.onExited(node)
        })
      })
    })
  }

  // 取消下一个回调函数
  cancelNextCallback() {
    if (this.nextCallback !== null) {
      this.nextCallback.cancel()
      this.nextCallback = null
    }
  }

  // 安全地setState
  safeSetState(nextState, callback) {
    // This shouldn't be necessary, but there are weird race conditions with
    // setState callbacks and unmounting in testing, so always make sure that
    // we can cancel any pending setState callbacks after we unmount.
    // 这个函数不是必须的, 但是在测试中setState的回调函数和unmounting存在奇怪的竞争现
    // 象, 所以确保我们能够随时取消在unmount后正在等待的setState的回调函数.
    callback = this.setNextCallback(callback)
    this.setState(nextState, callback)
  }

  // 设置下一个回调函数
  setNextCallback(callback) {
    let active = true

    this.nextCallback = event => {
      if (active) {
        active = false
        this.nextCallback = null

        callback(event)
      }
    }

    this.nextCallback.cancel = () => {
      active = false
    }

    return this.nextCallback
  }

  // 经过timeout时间后执行handler
  onTransitionEnd(node, timeout, handler) {
    this.setNextCallback(handler)

    if (node) {
      if (this.props.addEndListener) {
        this.props.addEndListener(node, this.nextCallback) // this.nextCallback通常即为handler
      }
      if (timeout != null) {
        setTimeout(this.nextCallback, timeout)
      }
    } else {
      setTimeout(this.nextCallback, 0)
    }
  }

  render() {
    const status = this.state.status
    if (status === UNMOUNTED) {
      return null
    }

    const { children, ...childProps } = this.props
    // filter props for Transtition
    delete childProps.in
    delete childProps.mountOnEnter
    delete childProps.unmountOnExit
    delete childProps.appear
    delete childProps.enter
    delete childProps.exit
    delete childProps.timeout
    delete childProps.addEndListener
    delete childProps.onEnter
    delete childProps.onEntering
    delete childProps.onEntered
    delete childProps.onExit
    delete childProps.onExiting
    delete childProps.onExited

    if (typeof children === 'function') {

      // 将维护的state赋予child
      return children(status, childProps)
    }

    const child = React.Children.only(children)

    // 将Transition的剩余属性赋予child
    return React.cloneElement(child, childProps)
  }
}

Transition.propTypes = {
  /**
   * A `function` child can be used instead of a React element.
   * This function is called with the current transition status
   * ('entering', 'entered', 'exiting', 'exited', 'unmounted'), which can be used
   * to apply context specific props to a component.
   *
   * ```jsx
   * <Transition timeout={150}>
   *   {(status) => (
   *     <MyComponent className={`fade fade-${status}`} />
   *   )}
   * </Transition>
   * ```
   */
  children: PropTypes.oneOfType([
    PropTypes.func.isRequired,
    PropTypes.element.isRequired,
  ]).isRequired,

  /**
   * Show the component; triggers the enter or exit states
   */
  in: PropTypes.bool,

  /**
   * By default the child component is mounted immediately along with
   * the parent `Transition` component. If you want to "lazy mount" the component on the
   * first `in={true}` you can set `mountOnEnter`. After the first enter transition the component will stay
   * mounted, even on "exited", unless you also specify `unmountOnExit`.
   */
  mountOnEnter: PropTypes.bool,

  /**
   * By default the child component stays mounted after it reaches the `'exited'` state.
   * Set `unmountOnExit` if you'd prefer to unmount the component after it finishes exiting.
   */
  unmountOnExit: PropTypes.bool,

  /**
   * Normally a component is not transitioned if it is shown when the `<Transition>` component mounts.
   * If you want to transition on the first mount set `appear` to `true`, and the
   * component will transition in as soon as the `<Transition>` mounts.
   *
   * > Note: there are no specific "appear" states. `appear` only adds an additional `enter` transition.
   */
  appear: PropTypes.bool,

  /**
   * Enable or disable enter transitions.
   */
  enter: PropTypes.bool,

  /**
   * Enable or disable exit transitions.
   */
  exit: PropTypes.bool,

  /**
   * The duration of the transition, in milliseconds.
   * Required unless `addEndListener` is provided
   *
   * You may specify a single timeout for all transitions like: `timeout={500}`,
   * or individually like:
   *
   * ```jsx
   * timeout={{
   *  enter: 300,
   *  exit: 500,
   * }}
   * ```
   *
   * @type {number | { enter?: number, exit?: number }}
   */
  timeout: (props, ...args) => {
    let pt = timeoutsShape
    if (!props.addEndListener) pt = pt.isRequired
    return pt(props, ...args)
  },

  /**
   * Add a custom transition end trigger. Called with the transitioning
   * DOM node and a `done` callback. Allows for more fine grained transition end
   * logic. **Note:** Timeouts are still used as a fallback if provided.
   *
   * ```jsx
   * addEndListener={(node, done) => {
   *   // use the css transitionend event to mark the finish of a transition
   *   node.addEventListener('transitionend', done, false);
   * }}
   * ```
   */
  addEndListener: PropTypes.func,

  /**
   * Callback fired before the "entering" status is applied. An extra parameter
   * `isAppearing` is supplied to indicate if the enter stage is occurring on the initial mount
   *
   * @type Function(node: HtmlElement, isAppearing: bool) -> void
   */
  onEnter: PropTypes.func,

  /**
   * Callback fired after the "entering" status is applied. An extra parameter
   * `isAppearing` is supplied to indicate if the enter stage is occurring on the initial mount
   *
   * @type Function(node: HtmlElement, isAppearing: bool)
   */
  onEntering: PropTypes.func,

  /**
   * Callback fired after the "entered" status is applied. An extra parameter
   * `isAppearing` is supplied to indicate if the enter stage is occurring on the initial mount
   *
   * @type Function(node: HtmlElement, isAppearing: bool) -> void
   */
  onEntered: PropTypes.func,

  /**
   * Callback fired before the "exiting" status is applied.
   *
   * @type Function(node: HtmlElement) -> void
   */
  onExit: PropTypes.func,

  /**
   * Callback fired after the "exiting" status is applied.
   *
   * @type Function(node: HtmlElement) -> void
   */
  onExiting: PropTypes.func,

  /**
   * Callback fired after the "exited" status is applied.
   *
   * @type Function(node: HtmlElement) -> void
   */
  onExited: PropTypes.func,
}

// Name the function so it is clearer in the documentation
function noop() {}

Transition.defaultProps = {
  in: false,
  mountOnEnter: false,
  unmountOnExit: false,
  appear: false,
  enter: true,
  exit: true,

  onEnter: noop,
  onEntering: noop,
  onEntered: noop,

  onExit: noop,
  onExiting: noop,
  onExited: noop,
}

Transition.UNMOUNTED = 0
Transition.EXITED = 1
Transition.ENTERING = 2
Transition.ENTERED = 3
Transition.EXITING = 4

export default polyfill(Transition)
