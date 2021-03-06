import { IInteraction } from "./IInteraction";
import { IPageData } from "./IPageData";
import { IInput } from "./IInput";
import { TextInput } from "./TextInput";
import { IValidationResult } from "./IValidationResult";
import { ControlTypes } from "./ControlTypes";
import { Http } from "./Http";
import { Button } from "./Button";

export class SelfAsserted implements IInteraction {
    pageData: IPageData
    controls: Array<IInput>
    sectionData: any
    // For each control to render
    template: string

    constructor(pageData: IPageData) {
        this.pageData = pageData;
        // The controls can be rendered based on the order number
        this.template = "<div>{{#controls}}{{control}}{{/controls}}</div>";
        this.controls = []
    }

    continue(): void {
        if (this.validate()) {
            globalThis.page.nextPage(3);
            // Http.sendDataAsync("https://api.com/submit", this.sectionData).then(function(){
            //     globalThis.page.nextPage(2);
            // })
        }
    }

    goback(): void {}

    validate(): boolean {
        console.log("validating...");
        let results: Array<IValidationResult> = [];
        for (let control of this.controls) {
            let result = control.validateInput();
            results.push(result);
        }
        
        if (results.find(x => x.result === false)){
            this.showError(results);
            return false;
        }

        this.hideError();

        return true;
    }

    showError(results: Array<IValidationResult>): void {
        // We'll append these error messages top of the form.
        // Using element id we would allow user to navigate through the invalid controls.
        for (let result of results) {
            console.log(result.errorMessage); 
        }
    }
    
    hideError(): void { console.log("show error"); }
    
    // genenerate the section html element without handlebars help.
    generateIEFComponent(): HTMLElement {

        var element = document.createElement("div");
        element.setAttribute("id", "selfasserted");

        // Hook up controls
        for (let sa_field of this.pageData.attributeFields) {
            switch(sa_field.controlType){
                case ControlTypes.Text:
                    let control = new TextInput(sa_field);
                    element.appendChild(control.element);
                    this.controls.push(control);
                case ControlTypes.Password:
                case ControlTypes.CheckButtonMultiSelect:
                case ControlTypes.RadioButtonSignleSelect:
            }
        }

        // Append continue and back button
        if (this.pageData.settings.showContinueButton) {
            let btn = new Button(this, this.pageData.content.continue);
            element.appendChild(btn.element);
        }

        return element;
    }
}