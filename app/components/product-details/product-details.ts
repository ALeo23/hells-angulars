import { ActivatedRoute }           from "@angular/router";
import { Component, Input, OnInit, DoCheck } from "@angular/core";
import { NgbRatingConfig }          from "@ng-bootstrap/ng-bootstrap";
import { stripeConfig }        from "../../stripe/stripe.config";
import { ProductDetailsService }    from "./product-details.service";
import { UIROUTER_DIRECTIVES }      from "ui-router-ng2";

@Component({
  moduleId: module.id,
  providers: [ NgbRatingConfig ],
  selector: "products",
  styleUrls: [ "product-details.css" ],
  templateUrl: "product-details.html",
})

export class ProductDetails implements OnInit, DoCheck {

  @Input() public product: any;

  @Input() public selectedPic: String;

  @Input() fromDate: any;
  @Input() toDate: any;

  private minDate:any = {
    'year': new Date().getFullYear(),
    'month': +new Date().getMonth() + 1,
    'day': +new Date().getDate(),
  };

  private oldFromDate: any = undefined;
  private oldToDate: any = undefined;
  private totalAmount: Number;

  private userId = JSON.parse(localStorage.getItem("profile")).user_id;

  constructor(
    private config: NgbRatingConfig,
    private productDetailsService: ProductDetailsService
  ) {
    config.max = 5;
    config.readonly = true;
  }

  public ngOnInit() {
    this.product = this.product[0];
    this.selectedPic = this.product.url[0];
  }

  public onSelect(n: number) {
    this.selectedPic = this.product.pic[n];
  }

  public openCheckOut() {
    console.log(this.product);
    let handler = (<any> window).StripeCheckout.configure({
      key: stripeConfig.apiKey,
      locale: "auto",
      token: (token: any) => {
        this.productDetailsService.charge(token, {
          amount: this.totalAmount,
          buyer_id: this.userId,
          seller_id: this.product.owner_id,
          status_id: 1,
          product_id: this.product.id,
          bookedfrom: this.convertObjToDate(this.fromDate),
          bookedto: this.convertObjToDate(this.toDate),
        });
      },
    });

    handler.open({
      name: "Gear Box",
      amount: +this.totalAmount * 100,
    });

  }

  public ngDoCheck() {
    if (this.oldFromDate !== this.fromDate && this.oldToDate !== this.toDate) {
      // set OldFromDate and oldToDate to current date
      this.oldFromDate = this.fromDate;
      this.oldToDate = this.toDate;
      // this.convert date objects to date fromat
      let fromDate = this.convertObjToDate(this.fromDate);
      let toDate = this.convertObjToDate(this.toDate);
      // Calculate days between
      let daysBetween = this.getDaysBetween(fromDate, toDate);
      // if days between is more than 1
      if (daysBetween > 0) {
        this.totalAmount = this.product.priceperday * daysBetween;
      } else if (daysBetween === 0) {
        this.totalAmount = this.product.priceperday;
      }
    }
  }

  public convertObjToDate(obj: any) {
    let date = obj.year + "-" + obj.month + "-" + obj.day;
    return new Date(date);
  }

  public getDaysBetween(date1: Date, date2: Date) {
    let oneDay = 1000 * 60 * 60 * 24;

    // this.Convert both dates to milliseconds
    let date1Ms = date1.getTime();
    let date2Ms = date2.getTime();

    // Calculate the difference in milliseconds
    let differenceMs = date2Ms - date1Ms;

    // this.Convert back to days and return
    return Math.round(differenceMs / oneDay);
  }
}
