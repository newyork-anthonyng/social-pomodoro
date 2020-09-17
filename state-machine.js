const INITIAL_TIME = 25 * 60;

const EVENTS = {
  PLAY: 'play',
  PAUSE: 'pause',
  RESET: 'reset',
  TICK: 'tick'
};

function createTick(time) {
  return {
    type: EVENTS.TICK,
    data: {
      time
    }
  };
}

function createPlay(time) {
  return {
    type: EVENTS.PLAY,
    data: {
      time
    }
  };
}

function createPause(time) {
  return {
    type: EVENTS.PAUSE,
    data: {
      time
    }
  };
}

function createReset(time) {
  return {
    type: EVENTS.RESET,
    data: {
      time
    }
  };
}

const stateMachine = {
  context: {
    time: INITIAL_TIME,
    timer: null
  },
  subscribers: new Map(),
  state: 'PAUSED',
  PLAY: {
    on: {
      PAUSE: { target: 'PAUSED',
        fn: () => {
          clearInterval(stateMachine.context.timer);
          stateMachine.context.timer = null;

          stateMachine.subscribers.forEach(sub => {
            sub(createPause(stateMachine.context.time));
          });
        }
      },
      RESET: {
        target: 'PAUSED',
        fn: () => {
          clearInterval(stateMachine.context.timer);
          stateMachine.context.timer = null;
          stateMachine.context.time = INITIAL_TIME;

          stateMachine.subscribers.forEach(sub => {
            sub(createReset(stateMachine.context.time));
          });
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

            stateMachine.subscribers.forEach(sub => {
              sub(createTick(stateMachine.context.time));
            });

            if (stateMachine.context.time === 0) {
              stateMachine.send('PAUSE');
            }
          }, 1000);

          stateMachine.subscribers.forEach(sub => {
            sub(createPlay(stateMachine.context.time));
          });
        }
      },
      RESET: {
        target: 'PAUSED',
        fn: () => {
          clearInterval(stateMachine.context.timer);
          stateMachine.context.timer = null;
          stateMachine.context.time = INITIAL_TIME;

          stateMachine.subscribers.forEach(sub => {
            sub(createReset(stateMachine.context.time));
          });
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
  },
  subscribe: (subscriber) => {
    stateMachine.subscribers.set(subscriber, subscriber);
  },
  unsubscribe: (subscriber) => {
    stateMachine.subscribers.delete(subscriber);
  }
};

module.exports = stateMachine;
