const INITIAL_TIME = 42;
const stateMachine = {
  context: {
    time: INITIAL_TIME,
    timer: null
  },
  state: 'PAUSED',
  PLAY: {
    on: {
      PAUSE: {
        target: 'PAUSED',
        fn: () => {
          clearInterval(stateMachine.context.timer);
          stateMachine.context.timer = null;
        }
      },
      RESET: {
        target: 'PAUSED',
        fn: () => {
          clearInterval(stateMachine.context.timer);
          stateMachine.context.timer = null;
          stateMachine.context.time = INITIAL_TIME;
        }
      }
    }
  },
  PAUSED: {
    on: {
      PLAY: {
        target: 'PLAY',
        fn: () => {
          stateMachine.context.timer = setInterval(() => {
            console.log(stateMachine.context.time--);
          }, 1000);
        }
      },
      RESET: {
        target: 'PAUSED',
        fn: () => {
          clearInterval(stateMachine.context.timer);
          stateMachine.context.timer = null;
          stateMachine.context.time = INITIAL_TIME;
        }
      }
    }
  },
  send: (eventName) => {
    const previousState = stateMachine.state;
    const eventObject = stateMachine[previousState] && stateMachine[previousState].on[eventName];
    const isEventValid = !!eventObject;

    if (isEventValid) {
      stateMachine.state = eventObject.target;
      eventObject.fn && eventObject.fn();
    }
  }
};

module.exports = stateMachine;
