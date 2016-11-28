/* tslint:disable:max-line-length, no-var-keyword, no-var-requires, no-duplicate-variable */

import { Directive, OnInit, AfterViewInit, Input, Output, EventEmitter, ElementRef } from "@angular/core";
import { ControlValueAccessor } from "@angular/forms";
import { DaterangepickerConfig } from "./config.service";

declare var $: any;
var $ = require("jquery");
import "bootstrap-daterangepicker";
import * as moment from "moment";

@Directive({
    // moduleId: module.id,
    selector: "[daterangepicker]",
    // styleUrls: ["./daterangepicker.css"],
 })

export class DaterangePickerComponent implements AfterViewInit {

    @Input() options: any = {};
    @Output() selected = new EventEmitter();

    constructor(private input: ElementRef, private config: DaterangepickerConfig) { }

    ngAfterViewInit() {
        // $("head").append("<style>"+require("./daterangepicker.css")+"</style>");
        // $("head").append("<style> rel="stylesheet"
        // href="./app/components/product-detail/daterangepicker/daterangepicker.css" type="text/css" </style>");

        let targetOptions: any = Object.assign({}, this.config.settings, this.options);

        $(this.input.nativeElement).daterangepicker(targetOptions, this.callback.bind(this));
    }

    private callback(start?: any, end?: any): void {
        let obj = {
            start: start,
            end: end,
        };

        this.selected.emit(obj);
    }
}
