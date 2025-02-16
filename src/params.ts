
export class Params {
  params = new URLSearchParams(window.location.search);

  public isMeow = this.params.get("meow") === '1';
}
