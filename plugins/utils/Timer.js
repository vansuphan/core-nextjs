

const Timer = {
  wait: async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default Timer