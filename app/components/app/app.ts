import { AddModalService }     from "../add_modal/addModal.service";
import { AppService }          from "./app.service";
import { Auth }                from "../../auth/auth.service";
import { MapsAPILoader }       from "angular2-google-maps/core";
import { ProductsService }     from "../products/products.service";
import { UIROUTER_DIRECTIVES } from "ui-router-ng2";
import { NgbModal,
  ModalDismissReasons,
  NgbModalRef }                from "@ng-bootstrap/ng-bootstrap";
import { Component, OnInit,
  ViewChild, ElementRef }      from "@angular/core";
import { FormGroup,
  FormControl }                from "@angular/forms";

@Component({
  moduleId: module.id,
  providers: [ Auth ],
  selector: "my-app",
  styleUrls: [ "app.css" ],
  templateUrl: "app.html",
})

export class App {

  title: "Gear Box";
  public closeResult: string;
  public modal: NgbModalRef;
  public content: any;
  public form: FormGroup;
  public searchControl: FormControl;
  public lat: any = 37.7749295;    // set default lat for San Francisco
  public lng: any = -122.4194155;  // set default lng for San Francisco
  public cityState: string = "finding your city...";

  @ViewChild("search")
  public searchElementRef: ElementRef;

  constructor(
    private auth: Auth,
    private appService: AppService,
    private productsService: ProductsService,
    private addModalService: AddModalService,
    private modalService: NgbModal,
    private mapsAPILoader: MapsAPILoader,
   ) { }

  public onSearch(form: any) {
    this.productsService.keyword = form.value.keyword;
    this.productsService.lat = this.lat;
    this.productsService.lng = this.lng;
  };

  ngOnInit(): void {
    // checks for user based on profile from Auth0 in localstorage
    this.auth.findOrCreateUser(localStorage.getItem("profile"));

    this.searchControl = new FormControl();

    this.setCurrentPosition();

    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["(cities)"],
      });
      autocomplete.addListener("place_changed", () => {
        // get the place result
        let place: google.maps.places.PlaceResult = autocomplete.getPlace();
        // set latitude and longitude
        this.lat = place.geometry.location.lat().toFixed(7);
        this.lng = place.geometry.location.lng().toFixed(7);
      });
    });
  }

  public open(content: any) {
    if (this.auth.authenticated()) {
      this.addModalService.open(content);
    } else {
      this.auth.login();
    }
  }

  public close() {
    this.addModalService.close();
  }

  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.cityState = "";
        // The rest of the code in this block translates lat/lng to city, state
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.lat},${this.lng}&sensor=true`;
        this.appService.getCityState(url)
          .then(response => {
            response.results.forEach(item => {
              item.types.forEach(type => {
                if (type === "locality") {
                  item.address_components.forEach(component => {
                    if (component.types[0] === "locality") {
                      this.cityState += component.long_name;
                    }
                    if (component.types[0] === "administrative_area_level_1") {
                      this.cityState += ", " + component.short_name;
                    }
                  });
                }
              });
            });
          });
      }, (error) => {
        this.cityState = "San Francisco, CA";
      });
      // if (!this.userCityFound) {
      //   this.cityState = "San Francisco, CA";
      // }
    }
  }
}
