class TextMessage extends HTMLElement {
  constructor() {
    super();
    console.log('const');
    const shadow = this.attachShadow({ mode: 'open' });

    // Create a standard img element and set it's attributes.
    this.name = document.createElement('div');
    this.lower = document.createElement('div');
    this.text = document.createElement('div');

    this.name.className = 'name';
    this.lower.className = 'lower';
    this.text.className = 'text';

    shadow.appendChild(this.name);
    shadow.appendChild(this.lower);
    shadow.appendChild(this.text);
  }

  connectedCallback() {
    console.log('Connected');
  }

  disconnectedCallback() {
    console.log('Disconnected');
  }

  // Monitor the 'name' attribute for changes.
  static get observedAttributes() { return ['name', 'message']; }

  // Respond to attribute changes.
  attributeChangedCallback(attr, oldValue, newValue) {
    if (attr === 'name') {
      this.name.textContent = newValue;
      console.log('Name');
    } else if (attr === 'message') {
      this.text.textContent = newValue;
    }
  }

}
customElements.define('text-message', TextMessage);
