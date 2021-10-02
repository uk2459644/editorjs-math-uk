/**
 * Mathk block for the Editor.js.
 *
 * @author Upendra Kumar
 * @license MIT
 */

/**
 * Build styles
 */
 require('./index.css').toString();

 /**
  * Import Tool's icon
  */
 import ToolboxIcon from '../assets/icon.svg';
 const katex=require('katex');
// const ToolboxIcon =require('../assets/icon.svg');
 
 /**
  * @class Mathk
  * @classdesc Mathk Tool for Editor.js
  * @property {MathkData} data - Mathk Tool`s input and output data
  * @property {object} api - Editor.js API instance
  *
  * @typedef {object} MathkData
  * @description Mathk Tool`s input and output data
  * @property {string} type - Mathk type
  * @property {string} message - Mathk message
  *
  * @typedef {object} MathkConfig
  * @description Mathk Tool`s initial configuration
  * @property {string} defaultType - default Mathk type
  * @property {string} messagePlaceholder - placeholder to show in Mathk`s message input
  */
 export default class Mathk {
   /**
    * Get Toolbox settings
    *
    * @public
    * @returns {string}
    */
   static get toolbox() {
     return {
       icon:ToolboxIcon,
       title: 'Mathk',
     };
   }
 
   /**
    * Allow to press Enter inside the Mathk block
    * @public
    * @returns {boolean}
    */
   static get enableLineBreaks() {
     return true;
   }
 
   /**
    * Default Mathk type
    *
    * @public
    * @returns {string}
    */
   static get DEFAULT_TYPE() {
     return 'info';
   }
 
   /**
    * Default placeholder for Mathk message
    *
    * @public
    * @returns {string}
    */
   static get DEFAULT_MESSAGE_PLACEHOLDER() {
     return 'Type here...';
   }
 
   /**
    * Supported Mathk types
    *
    * @public
    * @returns {array}
    */
   static get Mathk_TYPES() {
     return [
       'primary',
       'secondary',
       'info',
       'success',
       'warning',
       'danger',
       'light',
       'dark',
     ];
   }
 
   /**
    * Mathk Tool`s styles
    *
    * @returns {Object}
    */
   get CSS() {
     return {
       settingsButton: this.api.styles.settingsButton,
       settingsButtonActive: this.api.styles.settingsButtonActive,
       wrapper: 'cdx-alert',
       wrapperForType: (type) => `cdx-alert-${type}`,
       message: 'cdx-alert__message',
     };
   }
 
   /**
    * Render plugin`s main Element and fill it with saved data
    *
    * @param {MathkData} data — previously saved data
    * @param {MathkConfig} config — user config for Tool
    * @param {Object} api - Editor.js API
    * @param {boolean} readOnly - read only mode flag
    */
   constructor({ data, config, api, readOnly }) {
     this.api = api;
 
     this.defaultType = config.defaultType || Mathk.DEFAULT_TYPE;
     this.messagePlaceholder =
       config.messagePlaceholder || Mathk.DEFAULT_MESSAGE_PLACEHOLDER;
 
     this.data = {
       type: Mathk.Mathk_TYPES.includes(data.type)
         ? data.type
         : this.defaultType,
       message: data.message || '',
     };
 
     this.container = undefined;
     this.messageEl = undefined;
     this.katex =katex;
     
     this.readOnly = readOnly;
   }
   
   /**
    * Returns true to notify the core that read-only mode is supported
    *
    * @return {boolean}
    */
   static get isReadOnlySupported() {
     return true;
   }
 
   /**
    * Create Mathk Tool container
    *
    * @returns {Element}
    */
   render() {
     const containerClasses = [
       this.CSS.wrapper,
       this.CSS.wrapperForType(this.data.type),
     ];
 
     this.container = this._make('div', containerClasses);
 
     this.messageEl= this._make('div', [this.CSS.message], {
       contentEditable: !this.readOnly,
       innerHTML: this.data.message||'',
     });
 
    this.messageEl.dataset.placeholder = this.messagePlaceholder;

    if(this.readOnly == true || this.data.message !=''){
      this._createMathk(this.data.message);
      this.container.appendChild(this.messageEl);
      return this.container;
    }

    this.messageEl.addEventListener('paste',(event)=>{
      this._createMathk(event.clipboardData.getData('text'));
    });


    //  katex.render(this.data.message,messageEl,{
    //      throwOnError:false
    //  });
 
     this.container.appendChild(this.messageEl);
 
     return this.container;
   }
 
   /**
    * Create Block's settings block
    *
    * @returns {HTMLElement}
    */
   renderSettings() {
     const settingsContainer = this._make('div');
 
     Mathk.Mathk_TYPES.forEach((type) => {
       const settingsButton = this._make(
         'div',
         [
           this.CSS.settingsButton,
           this.CSS.wrapper,
           this.CSS.wrapperForType(type),
         ],
         {
           innerHTML: 'A',
         }
       );
 
       if (this.data.type === type) {
         // Highlight current type button
         settingsButton.classList.add(this.CSS.settingsButtonActive);
       }
 
       // Set up click handler
       settingsButton.addEventListener('click', () => {
         this._changeMathkType(type);
 
         // Un-highlight previous type button
         settingsContainer
           .querySelectorAll(`.${this.CSS.settingsButton}`)
           .forEach((button) =>
             button.classList.remove(this.CSS.settingsButtonActive)
           );
 
         // and highlight the clicked type button
         settingsButton.classList.add(this.CSS.settingsButtonActive);
       });
 
       settingsContainer.appendChild(settingsButton);
     });
 
     return settingsContainer;
   }
 
   /**
    * Helper for changing style of Mathk block with the selected Mathk type
    *
    * @param {string} newType - new Mathk type to be applied to the block
    * @private
    */
   _changeMathkType(newType) {
     // Save new type
     this.data.type = newType;
 
     Mathk.Mathk_TYPES.forEach((type) => {
       const MathkClass = this.CSS.wrapperForType(type);
 
       // Remove the old Mathk type class
       this.container.classList.remove(MathkClass);
 
       if (newType === type) {
         // Add an Mathk class for the selected Mathk type
         this.container.classList.add(MathkClass);
       }
     });
   }
 
   /**
    * Extract Mathk data from Mathk Tool element
    *
    * @param {HTMLDivElement} MathkElement - element to save
    * @returns {MathkData}
    */
   save(MathkElement) {
     const messageEl = MathkElement.querySelector(`.${this.CSS.message}`);
 
     return { ...this.data, 
      // message: this.data.message
     };
   }
 
   /**
    * Helper for making Elements with attributes
    *
    * @param  {string} tagName           - new Element tag name
    * @param  {array|string} classNames  - list or name of CSS classname(s)
    * @param  {Object} attributes        - any attributes
    * @returns {Element}
    * @private
    */
   _make(tagName, classNames = null, attributes = {}) {
     let el = document.createElement(tagName);
 
     if (Array.isArray(classNames)) {
       el.classList.add(...classNames);
     } else if (classNames) {
       el.classList.add(classNames);
     }
 
     for (let attrName in attributes) {
       el[attrName] = attributes[attrName];
     }
 
     return el;
   }

   _createMathk(Mathk){
      //  const MathkEl=document.createElement('p');
      this.messageEl.innerHTML='';
      this.data.message = Mathk;

      this.katex.render(Mathk,this.messageEl, {
        throwOnError: false
    });
    // this.container.appendChild(MathkEl);
   }
 
   /**
    * Fill Mathk's message with the pasted content
    *
    * @param {PasteEvent} event - event with pasted content
    */
   onPaste(event) {
     const { data } = event.detail;
    
 
     this.data = {
       type: this.defaultType,
       message: data || '',
     };

     this._createMathk(data);
    
   }
 
   /**
    * Allow Mathk to be converted to/from other blocks
    */
   static get conversionConfig() {
     return {
       // export Mathk's message for other blocks
       export: (data) => data.message,
       // fill Mathk's message from other block's export string
       import: (string) => {
         return {
           message: string,
           type: this.DEFAULT_TYPE,
         };
       },
     };
   }
 
   /**
    * Sanitizer config for Mathk Tool saved data
    * @returns {Object}
    */
   static get sanitize() {
     return {
       type: false,
       message: true,
     };
   }
 }
 