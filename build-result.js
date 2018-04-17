class BuildResult {
  constructor(passed, duration) {
    this.created = new Date();
    this.buildPassed = passed;
    this.duration = duration;
  }
}

module.exports = BuildResult;