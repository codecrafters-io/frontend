export default class CurrentMirageUser {
  static currentUserId = null;

  static onTestStart() {
    this.currentUserId = null;
  }
}
